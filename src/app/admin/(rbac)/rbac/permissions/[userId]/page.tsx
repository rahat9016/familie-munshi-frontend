"use client";

import { use } from "react";
import PermissionForm from "@/src/components/admin/RBAC/Permissions/Form/PermissionForm";

export default function EditPermissionPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  return <PermissionForm userId={userId} />;
}
