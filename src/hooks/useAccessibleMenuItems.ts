"use client";

import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { filterMenuByAccess, getMenuItems } from "@/src/utils/getMenuItems";
import { useMemo } from "react";

/**
 * Admin menu built purely from GET /permissions/me — an entry is shown only
 * when the user holds one of its permission names. Nothing is shown for
 * gated entries until permissions have loaded.
 */
export function useAccessibleMenuItems() {
  useRbacPermissions();
  const rbac = useAppSelector(selectRbac);

  return useMemo(() => {
    const granted = new Set(rbac.loaded ? rbac.permissionNames : []);
    return filterMenuByAccess(getMenuItems(), granted);
  }, [rbac.loaded, rbac.permissionNames]);
}
