"use client";

import { ReactNode } from "react";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  selectIsSuperAdmin,
  selectCan,
} from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useRbacPermissions } from "@/src/hooks/useRbacPermissions";
import { ShieldAlert, Loader2 } from "lucide-react";

interface RbacRouteGuardProps {
  /** When true, only super admin may view the page. */
  superAdminOnly?: boolean;
  /** Otherwise allow super admin OR a user with `read` on this resource. */
  resource?: string;
  children: ReactNode;
}

/**
 * Loads the RBAC permission map (once), then gates the page by either
 * super-admin status or a resource permission.
 */
export default function RbacRouteGuard({
  superAdminOnly = false,
  resource,
  children,
}: RbacRouteGuardProps) {
  const { isLoading, loaded } = useRbacPermissions();
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const canRead = useAppSelector(
    resource ? selectCan(resource, "read") : () => false,
  );

  if (isLoading && !loaded) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-sm">Loading permissions…</span>
      </div>
    );
  }

  const allowed = isSuperAdmin || (!superAdminOnly && !!resource && canRead);

  if (!allowed) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6 text-red-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Access Denied</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-sm">
          {superAdminOnly
            ? "This page is restricted to the super admin."
            : `You need access to the "${resource}" module.`}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
