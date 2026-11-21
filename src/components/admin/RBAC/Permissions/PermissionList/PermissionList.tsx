"use client";

import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { RbacUser } from "@/src/types/rbac/rbac";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mockBranchesList } from "@/src/components/admin/Branches/data/mockBranchData";
import { mockRbacUsersList } from "../../Users/data/mockRbacUserData";
import PermissionsTable from "../PermissionsTable";
import PermissionViewModal from "../PermissionViewModal";
import { GetPermissionColumns } from "../TableColumns/PermissionColumns";

// Scope filter value: "" = all, "platform" = no branch, otherwise a branchId.
function matchesScope(user: RbacUser, scope: string) {
  if (scope === "platform") return !user.branchId;
  if (scope) return user.branchId === scope;
  return true;
}

export default function PermissionList() {
  const router = useRouter();
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const [viewUser, setViewUser] = useState<RbacUser | null>(null);
  const [scope, setScope] = useState("");

  const { search, handleSearchChange } = useSearchDebounce(300);

  const term = search.toLowerCase().trim();
  // Super admins have implicit full access — not part of per-user mapping.
  const rows = mockRbacUsersList.filter((user) => {
    if (user.role?.isSuperAdmin) return false;
    const matchesSearch =
      !term ||
      [user.firstName, user.lastName, user.email].some((field) =>
        field?.toLowerCase().includes(term)
      );
    return matchesSearch && matchesScope(user, scope);
  });

  const columns = GetPermissionColumns(
    (item) => setViewUser(item),
    (item) => router.push(`/admin/rbac/permissions/${item.id}`)
  );

  return (
    <div className="space-y-3">
      {isSuperAdmin && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Scope:</span>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All users</option>
            <option value="platform">Platform (no branch)</option>
            {mockBranchesList.map((b) => (
              <option key={b.id} value={b.id}>
                Branch · {b.code ?? b.id.slice(0, 6)}
              </option>
            ))}
          </select>
        </div>
      )}
      <PermissionsTable
        columns={columns}
        data={rows}
        totalItems={rows.length}
        currentPage={1}
        itemsPerPage={rows.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Permission"
        setIsModalOpen={() => router.push("/admin/rbac/permissions/create")}
      />
      <PermissionViewModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  );
}
