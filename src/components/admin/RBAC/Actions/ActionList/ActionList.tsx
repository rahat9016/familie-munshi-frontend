"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useState } from "react";
import { toast } from "react-toastify";
import ActionsTable from "../ActionsTable";
import { mockActionsList } from "../data/mockActionData";
import CreateUpdateAction from "../Form/CreateUpdateAction";
import { ActionFormValues } from "../Schema/actionSchema";
import { GetActionColumns } from "../TableColumns/ActionColumns";
import { IActionItem } from "../types";

export default function ActionList() {
  const [actions, setActions] = useState<IActionItem[]>(mockActionsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IActionItem | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);

  const handleEdit = (item: IActionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: ActionFormValues) => {
    if (selectedItem) {
      // Key is immutable on update, matching the API contract.
      setActions((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, label: values.label } : item
        )
      );
      toast.success(`Action "${values.label}" updated`);
    } else {
      setActions((prev) => [
        ...prev,
        {
          id: `ACT-${Date.now()}`,
          key: values.key.toUpperCase(),
          label: values.label,
          isBuiltIn: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`Action "${values.label}" created`);
    }
    handleModalClose();
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setActions((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const term = search.toLowerCase().trim();
  const filteredActions = actions.filter(
    (item) =>
      !term ||
      item.key.toLowerCase().includes(term) ||
      item.label.toLowerCase().includes(term)
  );

  const columns = GetActionColumns(handleEdit, (id) => setDeleteId(id));

  return (
    <div>
      <ActionsTable
        columns={columns}
        data={filteredActions}
        totalItems={filteredActions.length}
        currentPage={1}
        itemsPerPage={filteredActions.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Action"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateAction
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Action"
        description="Roles using this action will lose it. Built-in actions cannot be deleted."
      />
    </div>
  );
}
