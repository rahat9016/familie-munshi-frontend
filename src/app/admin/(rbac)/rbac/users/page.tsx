"use client";

import UserList from "@/src/components/admin/RBAC/Users/UserList/UserList";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacUsersPage() {
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.USER}>
      <UserList />
    </RbacRouteGuard>
  );
}
