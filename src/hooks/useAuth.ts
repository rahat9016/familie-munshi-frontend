import { useMutation, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { isAdminPanelScope } from "../constants/auth/permissions";
import { authKey, refreshTokenKey } from "../constants/auth/storageKey";
import {
  clearRbacPermissions,
  setRbacPermissions,
} from "../lib/redux/features/rbac/rbacSlice";
import { useAppDispatch } from "../lib/redux/hooks";
import { authService } from "../services/auth";
import {
  fetchMyPermissions,
  RBAC_QUERY_KEY,
  toRbacState,
} from "../services/rbac.service";
import { IGenericErrorResponse } from "../types/common/common";

export interface AuthResponse {
  id: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  /** PLATFORM | BRANCH | ... — null when permissions could not be loaded. */
  scope: string | null;
  /** true when scope is PLATFORM or BRANCH → admin panel. */
  isAdminPanelUser: boolean;
}

export const useAuth = (
  onSuccess?: (data: AuthResponse, result: LoginResult) => void
) => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation<
    AuthResponse,
    IGenericErrorResponse,
    { email: string; password: string }
  >({
    mutationFn: authService.login,
    onSuccess: async (data) => {
      // Access token is short-lived (15m) and refreshed via the axios
      // interceptor; refresh token lives 7 days.
      Cookies.set(authKey, data.accessToken, { expires: 1 });
      Cookies.set(refreshTokenKey, data.refreshToken, { expires: 7 });
      window.dispatchEvent(new Event("auth-token-updated"));

      // Drop any permissions cached from a previous session.
      dispatch(clearRbacPermissions());
      queryClient.removeQueries({ queryKey: RBAC_QUERY_KEY });

      // Load this user's scope + permissions to decide where to go.
      let scope: string | null = null;
      try {
        const me = await queryClient.fetchQuery({
          queryKey: RBAC_QUERY_KEY,
          queryFn: fetchMyPermissions,
          staleTime: 5 * 60 * 1000,
        });
        dispatch(setRbacPermissions(toRbacState(me)));
        scope = me.scope ?? null;
      } catch (error) {
        console.error("Failed to load permissions", error);
      }

      toast.success("Login successful");
      onSuccess?.(data, { scope, isAdminPanelUser: isAdminPanelScope(scope) });
    },
    onError: (error) => {
      toast.error(error?.message || "Login failed");
    },
  });
};
