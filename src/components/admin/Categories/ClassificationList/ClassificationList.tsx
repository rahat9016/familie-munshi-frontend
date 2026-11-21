"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { PERMISSION } from "@/src/constants/auth/permissions";
import { usePagination } from "@/src/hooks/usePagination";
import {
  useDeleteProductClassification,
  useInvalidateProductClassifications,
  useProductClassifications,
} from "@/src/hooks/useProductClassifications";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { IGenericErrorResponse } from "@/src/types/common/common";
import {
  IProductClassification,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
  ProductClassificationLevel,
} from "@/src/types/ecommerce/productClassification";
import { ChangeEvent, useMemo, useState } from "react";
import { toast } from "react-toastify";
import CategoriesTable from "../CategoriesTable";
import { getClassificationColumns } from "./ClassificationColumns";
import ClassificationFormModal from "./ClassificationFormModal";
import ClassificationViewModal from "./ClassificationViewModal";

interface ClassificationListProps {
  level: ProductClassificationLevel;
}

export default function ClassificationList({ level }: ClassificationListProps) {
  const levelLabel = PRODUCT_CLASSIFICATION_LEVEL_LABEL[level];

  // Form modal: open + optional row (row = edit, none = create).
  const [formState, setFormState] = useState<{
    open: boolean;
    item?: IProductClassification;
  }>({ open: false });
  const [viewItem, setViewItem] = useState<IProductClassification>();
  const [deleteItem, setDeleteItem] = useState<IProductClassification>();

  const canCreate = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_CREATE)
  );
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_UPDATE)
  );
  const canDelete = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_DELETE)
  );

  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(300);

  const { items, totalRecords, isLoading, isFetching } =
    useProductClassifications({
      level,
      search: debouncedSearch,
      page: currentPage,
      size: itemsPerPage,
    });

  const { mutateAsync: deleteClassification } =
    useDeleteProductClassification();
  const invalidateAll = useInvalidateProductClassifications();

  const columns = useMemo(
    () =>
      getClassificationColumns(level, {
        onView: setViewItem,
        onEdit: canUpdate
          ? (item) => setFormState({ open: true, item })
          : undefined,
        onDelete: canDelete ? setDeleteItem : undefined,
      }),
    [level, canUpdate, canDelete]
  );

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setCurrentPage(1);
  };

  const handleConfirmDelete = async () => {
    const target = deleteItem;
    setDeleteItem(undefined);
    if (!target) return;

    try {
      const res = await deleteClassification(target.id);
      toast.success(res?.message || `${levelLabel} deleted successfully`);
    } catch (err) {
      const { statusCode, message } = (err ?? {}) as IGenericErrorResponse;
      if (statusCode === 409) {
        toast.error(
          `${
            message ||
            "Cannot delete product classification because it has active child classifications."
          } Delete its child classifications first.`
        );
      } else if (statusCode === 404) {
        toast.error(message || "Classification not found or already deleted");
        invalidateAll();
      } else if (statusCode !== 401 && statusCode !== 403) {
        // 401/403 are handled by the axios interceptor.
        toast.error(message || "Failed to delete classification");
      }
    }
  };

  return (
    <>
      <CategoriesTable
        columns={columns}
        data={items}
        isLoading={isLoading || isFetching}
        totalItems={totalRecords}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setCurrentPage={setCurrentPage}
        setItemsPerPage={setItemsPerPage}
        search={search}
        showSearch
        handleSearchChange={onSearchChange}
        showCreateButton={canCreate}
        createTitle="Create"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      {(canCreate || canUpdate) && (
        <ClassificationFormModal
          level={level}
          isOpen={formState.open}
          item={formState.item}
          onClose={() => setFormState({ open: false })}
        />
      )}

      <ClassificationViewModal
        item={viewItem}
        onClose={() => setViewItem(undefined)}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(undefined)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${levelLabel}?`}
        description={`Are you sure you want to delete "${
          deleteItem?.name ?? ""
        }"? It will be deactivated. Items that still have active children cannot be deleted.`}
      />
    </>
  );
}
