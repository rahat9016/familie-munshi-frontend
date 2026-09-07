"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useState } from "react";
import { toast } from "react-toastify";
import BrandsTable from "../BrandsTable";
import { mockBrandsList } from "../data/mockBrandData";
import CreateUpdateBrand from "../Form/CreateUpdateBrand";
import { BrandFormValues } from "../Schema/brandSchema";
import { GetBrandColumns } from "../TableColumns/BrandColumns";
import { IBrand } from "../types";

const resolveIcon = (icon: BrandFormValues["icon"], fallback?: string) => {
  if (icon instanceof File) return URL.createObjectURL(icon);
  if (typeof icon === "string" && icon.trim()) return icon;
  return fallback;
};

export default function BrandList() {
  const [brands, setBrands] = useState<IBrand[]>(mockBrandsList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IBrand | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { search, handleSearchChange } = useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const handleEdit = (item: IBrand) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setBrands((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: BrandFormValues) => {
    if (selectedItem) {
      setBrands((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: values.name,
                description: values.description,
                status: values.isActive ? "ACTIVE" : "INACTIVE",
                icon: resolveIcon(values.icon, item.icon),
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );
      toast.success(`Brand "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setBrands((prev) => [
        ...prev,
        {
          id,
          name: values.name,
          description: values.description,
          status: values.isActive ? "ACTIVE" : "INACTIVE",
          icon: resolveIcon(values.icon),
          createdAt: new Date().toISOString(),
        },
      ]);
      toast.success(`Brand "${values.name}" created`);
    }
    handleModalClose();
  };

  const filteredBrands = brands.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  const columns = GetBrandColumns(handleEdit, handleDelete);

  return (
    <div>
      <BrandsTable
        columns={columns}
        data={filteredBrands}
        totalItems={filteredBrands.length}
        currentPage={1}
        itemsPerPage={filteredBrands.length || 10}
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
      <CreateUpdateBrand
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Brand"
        description="Are you sure you want to delete this brand? This action cannot be undone."
      />
    </div>
  );
}
