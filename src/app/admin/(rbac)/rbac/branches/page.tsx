"use client";

import BranchList from "@/src/components/admin/RBAC/Branches/BranchList/BranchList";
import { PERMISSION_MODULE } from "@/src/constants/auth/permissions";
import RbacRouteGuard from "@/src/components/admin/RBAC/shared/RbacRouteGuard";

export default function RbacBranchesPage() {
  return (
    <RbacRouteGuard resource={PERMISSION_MODULE.BRANCH}>
      <BranchList />
    </RbacRouteGuard>
  );
}
