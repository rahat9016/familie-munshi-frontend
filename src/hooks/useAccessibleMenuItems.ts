"use client";

import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { filterMenuByAccess, getMenuItems } from "@/src/utils/getMenuItems";
import { useMemo } from "react";

/**
 * Admin menu filtered by the user's /permissions/me result.
 * An item gated by a module is shown when the user has `<MODULE>_READ`
 * (super admin sees everything). Gated items stay hidden until loaded.
 */
export function useAccessibleMenuItems() {
  useRbacPermissions();
  const rbac = useAppSelector(selectRbac);

  return useMemo(() => {
    const can = (module: string) => {
      if (!rbac.loaded) return false;
      if (rbac.user.isSuperAdmin) return true;
      return rbac.permissions[module.toUpperCase()]?.READ === true;
    };
    return filterMenuByAccess(getMenuItems(), can, rbac.user.isSuperAdmin);
  }, [rbac]);
}
