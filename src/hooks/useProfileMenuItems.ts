"use client";

import { selectCanAccessAdminPanel } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { ProfileMenuItem, userMenuItems } from "@/src/utils/profileMenuItems";
import { useMemo } from "react";
import { useAccessibleMenuItems } from "./useAccessibleMenuItems";

/**
 * Account dropdown entries.
 * - PLATFORM / BRANCH scope → admin menu only (same permission-filtered
 *   entries as the admin header/sidebar; groups link to their first child).
 * - everyone else → customer account menu.
 */
export function useProfileMenuItems(): {
  items: ProfileMenuItem[];
  isAdminPanelUser: boolean;
} {
  const isAdminPanelUser = useAppSelector(selectCanAccessAdminPanel);
  const adminMenu = useAccessibleMenuItems();

  const items = useMemo<ProfileMenuItem[]>(() => {
    if (!isAdminPanelUser) return userMenuItems;

    return adminMenu.flatMap((item) => {
      const href = item.href ?? item.children?.[0]?.href;
      if (!href) return [];
      return [
        {
          label: item.href === "/admin" ? "Admin Dashboard" : item.label,
          href,
          icon: item.icon,
        },
      ];
    });
  }, [isAdminPanelUser, adminMenu]);

  return { items, isAdminPanelUser };
}
