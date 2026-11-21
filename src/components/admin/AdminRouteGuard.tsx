"use client";

import { selectRbac } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  getRequiredPermissions,
  hasAnyPermission,
} from "@/src/utils/getMenuItems";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useMemo } from "react";

/**
 * Per-route permission check for /admin/*. Rules come from the admin menu
 * config (`getMenuItems`), so a page is reachable by URL exactly when it
 * would be visible in the menu. Unconfigured routes are denied by default.
 * Assumes AdminAccessGuard already ensured permissions are loaded.
 */
export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const permissionNames = useAppSelector(selectRbac).permissionNames;

  const allowed = useMemo(() => {
    const required = getRequiredPermissions(pathname);
    if (required === null) return false;
    return hasAnyPermission(required, new Set(permissionNames));
  }, [pathname, permissionNames]);

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/admin"
          className="mt-4 text-sm font-medium text-primary hover:underline"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
