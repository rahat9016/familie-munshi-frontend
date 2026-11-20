"use client";

import { use } from "react";
import PermissionForm from "@/src/components/admin/RBAC/Permissions/Form/PermissionForm";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function EditPermissionPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.PERMISSION}>
      <PermissionForm userId={userId} />
    </RbacRouteGuard>
  );
}
