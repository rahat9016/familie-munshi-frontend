"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import BranchesTable from "../BranchesTable";
import { mockBranchesList } from "../data/mockBranchData";
import CreateUpdateBranch from "../Form/CreateUpdateBranch";
import { BranchFormValues } from "../Schema/branchSchema";
import { GetBranchColumns } from "../TableColumns/BranchColumns";
import { RbacBranch } from "../types";

export default function BranchList() {
  const [branches, setBranches] = useState<RbacBranch[]>(mockBranchesList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<RbacBranch | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleEdit = (item: RbacBranch) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (item: RbacBranch) => {
    setBranches((prev) =>
      prev.map((branch) =>
        branch.id === item.id
          ? {
              ...branch,
              status: branch.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : branch
      )
    );
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setBranches((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: BranchFormValues) => {
    const fields = {
      name: values.name,
      code: values.code,
      contact: values.contact,
      country: values.country,
      city: values.city,
      area: values.area,
      address: values.address,
      status: (values.isActive ? "ACTIVE" : "INACTIVE") as RbacBranch["status"],
    };

    if (selectedItem) {
      setBranches((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...fields } : item
        )
      );
      toast.success(`Branch "${values.name}" updated`);
    } else {
      setBranches((prev) => [
        ...prev,
        {
          id: `BRN-${Date.now()}`,
          ...fields,
          _count: { users: 0 },
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`Branch "${values.name}" created`);
    }
    handleModalClose();
  };

  const filteredBranches = branches.filter((item) => {
    const term = search.toLowerCase().trim();
    const matchesSearch =
      !term ||
      [item.name, item.code, item.city, item.country, item.area].some((field) =>
        field?.toLowerCase().includes(term)
      );
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetBranchColumns(
    handleEdit,
    (id) => setDeleteId(id),
    handleToggleStatus
  );

  return (
    <div>
      <BranchesTable
        columns={columns}
        data={filteredBranches}
        totalItems={filteredBranches.length}
        currentPage={1}
        itemsPerPage={filteredBranches.length || 10}
        setCurrentPage={() => {}}
        setItemsPerPage={() => {}}
        search={search}
        showSearch
        handleSearchChange={handleSearchChange}
        showCreateButton
        createTitle="Create Branch"
        setIsModalOpen={() => {
          setSelectedItem(undefined);
          setIsModalOpen(true);
        }}
      />
      <CreateUpdateBranch
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Branch"
        description="This permanently removes the branch. Users keep their account but lose the branch link."
      />
    </div>
  );
}
