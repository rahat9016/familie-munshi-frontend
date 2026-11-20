"use client";
import Cookies from "js-cookie";

import { useEffect, useState } from "react";
import { authKey } from "../constants/auth/storageKey";
import { isAdminPanelScope } from "../constants/auth/permissions";
import { useGet } from "../hooks/useGet";
import {
  setLoading,
  setUserInformation,
} from "../lib/redux/features/auth/authSlice";
import { setPermissionsFromRole } from "../lib/redux/features/permission/permissionSlice";
import { selectRbacUser } from "../lib/redux/features/rbac/rbacSelectors";
import { useAppDispatch, useAppSelector } from "../lib/redux/hooks";

/** GET /users/me response `data`. */
interface IMyProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
}

export const UserFetcher = () => {
  const dispatch = useAppDispatch();
  const rbacUser = useAppSelector(selectRbacUser);
  const [accessToken, setAccessToken] = useState(
    () => Cookies.get(authKey) || ""
  );

  useEffect(() => {
    const syncAccessToken = () => {
      setAccessToken(Cookies.get(authKey) || "");
    };

    window.addEventListener("auth-token-updated", syncAccessToken);
    window.addEventListener("focus", syncAccessToken);
    document.addEventListener("visibilitychange", syncAccessToken);

    return () => {
      window.removeEventListener("auth-token-updated", syncAccessToken);
      window.removeEventListener("focus", syncAccessToken);
      document.removeEventListener("visibilitychange", syncAccessToken);
    };
  }, []);

  const isLoggedIn = !!accessToken;

  const { data, isSuccess, isError, isFetching } = useGet<IMyProfile>(
    "/users/me",
    ["users-me"],
    undefined,
    {
      enabled: isLoggedIn,
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    dispatch(setLoading(isLoggedIn && isFetching));
  }, [isLoggedIn, isFetching, dispatch]);

  // Profile has no role field: role comes from GET /permissions/me (rbac
  // slice) when loaded; any other logged-in user is a storefront USER.
  const isAdminPanelUser = isAdminPanelScope(rbacUser.scope);
  const roleName = rbacUser.roleName ?? "USER";

  useEffect(() => {
    if (isSuccess && data?.data) {
      const profile = data.data;
      dispatch(
        setUserInformation({
          id: profile.id,
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          status: profile.active ? "ACTIVE" : "INACTIVE",
          role: roleName,
        })
      );
      dispatch(setPermissionsFromRole(isAdminPanelUser ? "ADMIN" : "USER"));
      dispatch(setLoading(false));
    }
  }, [isSuccess, data, roleName, isAdminPanelUser, dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(setUserInformation({}));
      dispatch(setPermissionsFromRole(null));
      dispatch(setLoading(false));
      return;
    }

    if (isError) {
      dispatch(setLoading(false));
    }
  }, [isLoggedIn, isError, dispatch]);

  return null;
};
