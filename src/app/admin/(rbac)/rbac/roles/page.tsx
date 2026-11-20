"use client";

import RoleList from "@/src/components/admin/RBAC/Roles/RoleList/RoleList";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacRolesPage() {
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.ROLE}>
      <RoleList />
    </RbacRouteGuard>
  );
}
