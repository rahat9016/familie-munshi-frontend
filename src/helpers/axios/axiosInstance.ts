import { getBaseUrl } from "@/src/config/envConfig";
import { authKey } from "@/src/constants/auth/storageKey";
import { getNewAccessToken, logout } from "@/src/services/auth.service";
import { getCookies } from "@/src/utils/local-storage";
import axios from "axios";
import Cookies from "js-cookie";
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

// Request interceptor
instance.interceptors.request.use(
  function (config) {
    // Handle local Next.js API routes — bypass external baseURL
    if (config.url?.startsWith("/api/")) {
      const origin =
        typeof window !== "undefined"
          ? window.location.origin
          : "http://localhost:3000";
      config.url = `${origin}${config.url}`;
      config.baseURL = "";
    }

    // <========
    // If the request is a POST request and the data is not FormData,
    // set Content-Type to application/json
    // ========>
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      // Let the browser set the correct multipart boundary
      config.headers["Content-Type"] = "multipart/form-data";
    }

    // Skip adding Authorization header for public auth endpoints
    if (!isAuthEndpoint(config.url)) {
      const accessToken = getCookies(authKey);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Single in-flight refresh shared by all requests that hit 401 together.
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

    // 401 on a protected endpoint → refresh access token once, then retry.
    if (
      status === 401 &&
      originalRequest &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      if (!originalRequest._retry) {
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

      // Still 401 after a fresh token → session is invalid.
      logout();
      return Promise.reject(toErrorObj(error));
    }

    // Handle 403
    if (status === 403) {
      toast.error("You do not have permission to access this resource");
      return Promise.reject(toErrorObj(error));
    }

    return Promise.reject(toErrorObj(error));
  }
);
export { instance as axiosInstance };
