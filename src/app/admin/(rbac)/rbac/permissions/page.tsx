"use client";

import PermissionList from "@/src/components/admin/RBAC/Permissions/PermissionList/PermissionList";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacPermissionsPage() {
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.PERMISSION}>
      <PermissionList />
    </RbacRouteGuard>
  );
}
