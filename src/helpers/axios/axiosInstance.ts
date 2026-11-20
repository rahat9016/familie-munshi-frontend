import { getBaseUrl } from "@/src/config/envConfig";
import { authKey, refreshTokenKey } from "@/src/constants/auth/storageKey";
import { getNewAccessToken, logout } from "@/src/services/auth.service";
import { getCookies } from "@/src/utils/local-storage";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
});
instance.defaults.headers.post["Content-Type"] = "application/json";
instance.defaults.timeout = 60000;

const AUTH_ENDPOINTS = ["/auth/login", "/auth/signup", "/auth/refresh-token"];
const isAuthEndpoint = (url?: string) =>
  !!url && AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint));

/** Refresh this many seconds before `exp` to absorb clock skew / latency. */
const EXPIRY_SKEW_SECONDS = 30;

/** true when the JWT is missing, malformed, or expires within the skew. */
function isTokenExpired(token?: string | null): boolean {
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp?: number }>(token);
    if (!exp) return false; // no expiry claim → treat as valid
    return exp - EXPIRY_SKEW_SECONDS <= Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

// Single in-flight refresh shared by every request that needs one, so a
// burst of parallel calls triggers exactly one POST /auth/refresh-token.
let refreshPromise: Promise<string> | null = null;

function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = getNewAccessToken()
      .then((body) => {
        const newAccessToken: string | undefined = body?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token in response");
        Cookies.set(authKey, newAccessToken, { expires: 1 });
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-token-updated"));
        }
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Valid access token for the next request:
 *  - current token still valid        → use it
 *  - expired/missing + refresh token  → refresh first, then use the new one
 *  - no refresh token (guest)         → undefined (send without auth)
 * Throws when the refresh itself fails (session is over).
 */
async function getValidAccessToken(): Promise<string | undefined> {
  const accessToken = getCookies(authKey);
  if (accessToken && !isTokenExpired(accessToken)) return accessToken;
  if (!Cookies.get(refreshTokenKey)) return undefined;
  return refreshAccessToken();
}

// Request interceptor
instance.interceptors.request.use(
  async function (config) {
    // Handle local Next.js API routes — bypass external baseURL
    if (config.url?.startsWith("/api/")) {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      config.url = `${origin}${config.url}`;
      config.baseURL = "";
    }

    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let the browser set the correct multipart boundary
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Public auth endpoints never carry a bearer token
    if (isAuthEndpoint(config.url)) return config;

    // Check token validity BEFORE sending; refresh first if expired.
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch {
      logout();
      return Promise.reject({
        statusCode: 401,
        message: "Session expired. Please login again.",
      });
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

const toErrorObj = (error: {
  response?: {
    data?: { statusCode?: number; message?: string; errors?: unknown };
    status?: number;
  };
}) => ({
  statusCode:
    error?.response?.data?.statusCode || error?.response?.status || 500,
  message: error?.response?.data?.message || "Something went wrong",
  errorMessages: error?.response?.data?.message,
  errors: error?.response?.data?.errors,
});

instance.interceptors.response.use(
  // ✅ Unwrap the `{ success, message, data, meta }` envelope
  //@ts-expect-error: response type is not always consistent
  function (response) {
    return {
      data: response?.data?.data,
      meta: response?.data?.meta,
      message: response?.data?.message,
    };
  },

  // ❌ Handle errors
  async function (error) {
    const originalRequest = error.config;
    const status = error?.response?.status;

    // Fallback: token was revoked/rejected server-side despite a valid `exp`
    // → force one refresh and retry. Guests (no refresh token) just get the
    // error, no redirect.
    const hasSession = !!Cookies.get(refreshTokenKey);
    if (
      status === 401 &&
      hasSession &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch {
        logout();
        return Promise.reject({
          statusCode: 401,
          message: "Session expired. Please login again.",
        });
      }
    }
    // A 401 after a successful refresh is NOT treated as logout: the backend
    // also answers 401 for unknown routes, so just surface the error.

    // Handle 403
    if (status === 403) {
      toast.error("You do not have permission to access this resource");
      return Promise.reject(toErrorObj(error));
    }

    return Promise.reject(toErrorObj(error));
  }
);
export { instance as axiosInstance };
