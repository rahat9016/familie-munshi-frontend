import axios from "axios";
import Cookies from "js-cookie";
import { removeAuthCookies } from "../../actions/cookiesAction";
import { getBaseUrl } from "../../config/envConfig";
import { authKey, refreshTokenKey } from "../../constants/auth/storageKey";

const LOGOUT_TIMEOUT_MS = 5000;

const postLogout = (accessToken?: string, refreshToken?: string) =>
  axios.post(
    `${getBaseUrl()}/auth/logout`,
    refreshToken ? { refreshToken } : {},
    {
      timeout: LOGOUT_TIMEOUT_MS,
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    }
  );

/**
 * POST /auth/logout — revoke access + refresh token server-side. Plain axios
 * (not axiosInstance) so a failure can never re-enter logout via the
 * interceptors. Best-effort: errors never block the local logout.
 */
async function revokeSession() {
  const accessToken = Cookies.get(authKey);
  const refreshToken = Cookies.get(refreshTokenKey);
  if (!accessToken && !refreshToken) return;

  try {
    await postLogout(accessToken, refreshToken);
  } catch (error) {
    // Access token expired → refresh once so the revoke is authorised.
    if (!refreshToken || !axios.isAxiosError(error)) return;
    if (error.response?.status !== 401) return;
    try {
      const body = await getNewAccessToken();
      const freshToken: string | undefined = body?.data?.accessToken;
      if (freshToken) await postLogout(freshToken, refreshToken);
    } catch {
      // Refresh token already invalid — nothing left to revoke.
    }
  }
}

let logoutPromise: Promise<void> | null = null;

/**
 * End the session. `revoke: false` skips the API call — used when the
 * session is already dead (refresh failed), so there is nothing to revoke.
 * Concurrent calls (e.g. a burst of failing requests) share one logout.
 */
export function logout({ revoke = true }: { revoke?: boolean } = {}) {
  if (!logoutPromise) {
    logoutPromise = (async () => {
      if (revoke) await revokeSession();
      await clearSession();
    })();
  }
  return logoutPromise;
}

async function clearSession() {
  // Clear client-readable cookies immediately
  Cookies.remove(authKey);
  Cookies.remove(refreshTokenKey);

  // Remove all auth cookies (httpOnly + regular) via server action
  await removeAuthCookies();

  // Remove user-specific information from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    // Hard navigation also resets redux + react-query state
    window.location.href = "/auth/login";
  }
}

/**
 * POST /auth/refresh-token with the refresh cookie. Uses plain axios (not
 * axiosInstance) so it never re-enters the auth interceptors.
 */
export const getNewAccessToken = async () => {
  const refreshToken = Cookies.get(refreshTokenKey);
  if (!refreshToken) {
    throw new Error("Refresh token expired");
  }

  const response = await axios.post(
    `${getBaseUrl()}/auth/refresh-token`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
};
