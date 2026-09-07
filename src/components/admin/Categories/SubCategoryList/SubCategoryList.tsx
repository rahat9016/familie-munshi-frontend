"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { mockSubCategoriesList } from "../data/mockCategoryHierarchy";
import CreateUpdateSubCategory, {
  SubCategorySubmitValues,
} from "../Form/CreateUpdateSubCategory";
import { GetSubCategoryColumns } from "../TableColumns/SubCategoryColumns";
import { ISubCategory } from "../types";

export default function SubCategoryList() {
  const [subCategories, setSubCategories] = useState<ISubCategory[]>(
    mockSubCategoriesList
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ISubCategory | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    setCurrentPage,
    itemsPerPage,
    currentPage,
    totalItems,
    setTotalItems,
    setItemsPerPage,
  } = usePagination();
  const { search, handleSearchChange, debouncedSearch } =
    useSearchDebounce(300);
  const { sortBy } = useAppSelector((state) => state.filter);

  const filteredSubCategories = subCategories.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalItems(filteredSubCategories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSubCategories.length]);

  const effectivePerPage =
    itemsPerPage === -1 ? filteredSubCategories.length || 1 : itemsPerPage;
  const pageStart = (currentPage - 1) * effectivePerPage;
  const paginatedSubCategories =
    itemsPerPage === -1
      ? filteredSubCategories
      : filteredSubCategories.slice(pageStart, pageStart + effectivePerPage);

  const handleEdit = (item: ISubCategory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setSubCategories((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: SubCategorySubmitValues) => {
    if (selectedItem) {
      setSubCategories((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Sub Category "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setSubCategories((prev) => [
        ...prev,
        { id, createdAt: new Date().toISOString(), ...values },
      ]);
      toast.success(`Sub Category "${values.name}" created`);
    }
    handleModalClose();
  };

  const columns = GetSubCategoryColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={paginatedSubCategories}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
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
      <CreateUpdateSubCategory
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Sub Category"
        description="Are you sure you want to delete this sub category? This action cannot be undone."
      />
    </div>
  );
}
