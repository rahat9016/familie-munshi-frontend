"use client";

import { authKey } from "@/src/constants/auth/storageKey";
import { setRbacPermissions } from "@/src/lib/redux/features/rbac/rbacSlice";
import {
  selectRbacLoaded,
  selectRbacUser,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  MyPermissionsResponse,
  PERMISSIONS_ME_ENDPOINT,
  RBAC_QUERY_KEY,
  toRbacState,
} from "@/src/utils/rbac";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useGet } from "./useGet";

/**
 * Loads GET /permissions/me once (cached by react-query) and hydrates the
 * redux `rbac` slice. Components read permissions via selectors
 * (selectCan / selectHasPermission) without re-fetching.
 */
export function useRbacPermissions() {
  const dispatch = useAppDispatch();
  const loaded = useAppSelector(selectRbacLoaded);
  const user = useAppSelector(selectRbacUser);
  const hasToken = typeof window !== "undefined" && !!Cookies.get(authKey);

  const { data, isLoading, isError } = useGet<MyPermissionsResponse>(
    PERMISSIONS_ME_ENDPOINT,
    RBAC_QUERY_KEY,
    undefined,
    { enabled: hasToken, staleTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (data?.data) dispatch(setRbacPermissions(toRbacState(data.data)));
  }, [data, dispatch]);

  return {
    // Redux-backed only: `data` arrives one render before the slice is
    // hydrated, and reading scope in that gap looks like "no access".
    loaded,
    user,
    hasToken,
    isLoading: hasToken && isLoading,
    isError,
  };
}
