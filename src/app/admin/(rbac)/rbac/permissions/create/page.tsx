"use client";

import PermissionForm from "@/src/components/admin/RBAC/Permissions/Form/PermissionForm";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function CreatePermissionPage() {
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.PERMISSION}>
      <PermissionForm />
    </RbacRouteGuard>
  );
}
