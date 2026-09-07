"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { mockCategoriesList } from "../data/mockCategoryHierarchy";
import CreateUpdateCategory, {
  CategorySubmitValues,
} from "../Form/CreateUpdateCategory";
import { GetCategoryColumns } from "../TableColumns/CategoryColumns";
import { ICategory } from "../types";

export default function CategoryList() {
  const [categories, setCategories] = useState<ICategory[]>(mockCategoriesList);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ICategory | undefined>();
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

  const filteredCategories = categories.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalItems(filteredCategories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCategories.length]);

  const effectivePerPage =
    itemsPerPage === -1 ? filteredCategories.length || 1 : itemsPerPage;
  const pageStart = (currentPage - 1) * effectivePerPage;
  const paginatedCategories =
    itemsPerPage === -1
      ? filteredCategories
      : filteredCategories.slice(pageStart, pageStart + effectivePerPage);

  const handleEdit = (item: ICategory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setCategories((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: CategorySubmitValues) => {
    if (selectedItem) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Category "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setCategories((prev) => [
        ...prev,
        { id, createdAt: new Date().toISOString(), ...values },
      ]);
      toast.success(`Category "${values.name}" created`);
    }
    handleModalClose();
  };

  const columns = GetCategoryColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={paginatedCategories}
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
      <CreateUpdateCategory
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
      />
    </div>
  );
}
