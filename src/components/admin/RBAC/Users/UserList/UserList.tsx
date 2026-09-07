"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import { mockBranchesList } from "../../Branches/data/mockBranchData";
import { mockRolesList } from "../../Roles/data/mockRoleData";
import { mockRbacUsersList } from "../data/mockRbacUserData";
import CreateUpdateUser from "../Form/CreateUpdateUser";
import { UserFormValues } from "../Schema/userSchema";
import { GetUserColumns } from "../TableColumns/UserColumns";
import { RbacUser } from "../types";
import UsersTable from "../UsersTable";

// Scope filter value: "" = all, "platform" = no branch, otherwise a branchId.
function matchesScope(user: RbacUser, scope: string) {
  if (scope === "platform") return !user.branchId;
  if (scope) return user.branchId === scope;
  return true;
}

export default function UserList() {
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);

  const [users, setUsers] = useState<RbacUser[]>(mockRbacUsersList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacUser | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [scope, setScope] = useState("");

  const { search, handleSearchChange } = useSearchDebounce(300);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: UserFormValues) => {
    const role = mockRolesList.find((r) => r.id === values.roleId);
    const branch = mockBranchesList.find((b) => b.id === values.branchId);
    const fields = {
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      gender: values.gender,
      dateOfBirth: values.dateOfBirth,
      role: role
        ? { id: role.id, name: role.name, isSuperAdmin: role.isSuperAdmin }
        : null,
      branchId: branch?.id ?? null,
      branch: branch ? { id: branch.id, code: branch.code } : null,
    };

    if (selectedItem) {
      setUsers((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...fields } : item
        )
      );
      toast.success(`User "${values.firstName} ${values.lastName}" updated`);
    } else {
      setUsers((prev) => [
        ...prev,
        {
          id: `RU-${Date.now()}`,
          ...fields,
          email: values.email,
          status: "ACTIVE",
          permissions: [],
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`User "${values.firstName} ${values.lastName}" created`);
    }
    handleModalClose();
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setUsers((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const term = search.toLowerCase().trim();
  const filteredUsers = users.filter((item) => {
    const matchesSearch =
      !term ||
      [item.firstName, item.lastName, item.email, item.phone].some((field) =>
        field?.toLowerCase().includes(term)
      );
    return matchesSearch && matchesScope(item, scope);
  });

  const columns = GetUserColumns(
    (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id)
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
      <UsersTable
        columns={columns}
        data={filteredUsers}
        totalItems={filteredUsers.length}
        currentPage={1}
        itemsPerPage={filteredUsers.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create User"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateUser
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
        isSuperAdmin={isSuperAdmin}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        description="This permanently removes the user account."
      />
    </div>
  );
}
