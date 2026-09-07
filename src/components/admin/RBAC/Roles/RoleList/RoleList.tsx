"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useState } from "react";
import { toast } from "react-toastify";
import { mockRolesList } from "../data/mockRoleData";
import CreateUpdateRole from "../Form/CreateUpdateRole";
import RolesTable from "../RolesTable";
import { RoleFormValues } from "../Schema/roleSchema";
import { GetRoleColumns } from "../TableColumns/RoleColumns";
import { RbacRoleItem } from "../types";

export default function RoleList() {
  const [roles, setRoles] = useState<RbacRoleItem[]>(mockRolesList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacRoleItem | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: RoleFormValues) => {
    const name = values.name.toUpperCase();
    if (selectedItem) {
      setRoles((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, name } : item
        )
      );
      toast.success(`Role "${name}" updated`);
    } else {
      setRoles((prev) => [
        ...prev,
        {
          id: `ROLE-${Date.now()}`,
          name,
          isSuperAdmin: false,
          isBuiltIn: false,
          _count: { users: 0 },
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`Role "${name}" created`);
    }
    handleModalClose();
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setRoles((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const term = search.toLowerCase().trim();
  const filteredRoles = roles.filter(
    (item) => !term || item.name.toLowerCase().includes(term)
  );

  const columns = GetRoleColumns(
    (item) => {
      setSelectedItem(item);
      setIsModalOpen(true);
    },
    (id) => setDeleteId(id)
  );

  return (
    <div>
      <RolesTable
        columns={columns}
        data={filteredRoles}
        totalItems={filteredRoles.length}
        currentPage={1}
        itemsPerPage={filteredRoles.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Role"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateRole
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        description="Users with this role keep their account but lose the role label."
      />
    </div>
  );
}
