"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { IGroup, mockGroupsList } from "../data/mockGroupData";
import CreateUpdateGroup from "../Form/CreateUpdateGroup";
import { GroupFormValues } from "../Schema/groupSchema";
import { GetGroupColumns } from "../TableColumns/GroupColumns";

export default function GroupList() {
  const [groups, setGroups] = useState<IGroup[]>(mockGroupsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IGroup | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleEdit = (item: IGroup) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setGroups((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: GroupFormValues) => {
    if (selectedItem) {
      setGroups((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Group "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setGroups((prev) => [
        ...prev,
        {
          id,
          name: values.name,
          description: values.description,
          status: values.isActive ? "ACTIVE" : "INACTIVE",
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`Group "${values.name}" created`);
    }
    handleModalClose();
  };

  const filteredGroups = groups.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetGroupColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={filteredGroups}
        totalItems={filteredGroups.length}
        currentPage={1}
        itemsPerPage={filteredGroups.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateGroup
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Group"
        description="Are you sure you want to delete this group? This action cannot be undone."
      />
    </div>
  );
}
