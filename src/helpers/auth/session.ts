import axios from "axios";
import Cookies from "js-cookie";
import { removeAuthCookies } from "../../actions/cookiesAction";
import { getBaseUrl } from "../../config/envConfig";
import { authKey, refreshTokenKey } from "../../constants/auth/storageKey";

export async function logout() {
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
