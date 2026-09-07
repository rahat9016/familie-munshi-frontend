"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { usePagination } from "@/src/hooks/usePagination";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { mockParentCategoriesList } from "../data/mockCategoryHierarchy";
import CreateUpdateParentCategory, {
  ParentCategorySubmitValues,
} from "../Form/CreateUpdateParentCategory";
import { GetParentCategoryColumns } from "../TableColumns/ParentCategoryColumns";
import { IParentCategory } from "../types";

export default function ParentCategoryList() {
  const [parentCategories, setParentCategories] = useState<IParentCategory[]>(
    mockParentCategoriesList
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    IParentCategory | undefined
  >();
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

  const filteredParentCategories = parentCategories.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase().trim());
    const matchesStatus = !sortBy || item.status === sortBy;
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalItems(filteredParentCategories.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredParentCategories.length]);

  const effectivePerPage =
    itemsPerPage === -1 ? filteredParentCategories.length || 1 : itemsPerPage;
  const pageStart = (currentPage - 1) * effectivePerPage;
  const paginatedParentCategories =
    itemsPerPage === -1
      ? filteredParentCategories
      : filteredParentCategories.slice(pageStart, pageStart + effectivePerPage);

  const handleEdit = (item: IParentCategory) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      setParentCategories((prev) => prev.filter((item) => item.id !== deleteId));
      setDeleteId(null);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(undefined);
  };

  const handleSubmit = (values: ParentCategorySubmitValues) => {
    if (selectedItem) {
      setParentCategories((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...values } : item
        )
      );
      toast.success(`Parent Category "${values.name}" updated`);
    } else {
      const id = values.name.toLowerCase().trim().replace(/\s+/g, "-");
      setParentCategories((prev) => [
        ...prev,
        { id, createdAt: new Date().toISOString(), ...values },
      ]);
      toast.success(`Parent Category "${values.name}" created`);
    }
    handleModalClose();
  };

  const columns = GetParentCategoryColumns(handleEdit, handleDelete);

  return (
    <div>
      <CategoriesTable
        columns={columns}
        data={paginatedParentCategories}
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
      <CreateUpdateParentCategory
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        initialValues={selectedItem}
      />
      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Parent Category"
        description="Are you sure you want to delete this parent category? This action cannot be undone."
      />
    </div>
  );
}
