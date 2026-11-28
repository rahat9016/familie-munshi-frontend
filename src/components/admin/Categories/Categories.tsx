"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { PERMISSION } from "@/src/constants/auth/permissions";
import { useAutoPosition } from "@/src/hooks/useAutoPosition";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { IGenericErrorResponse } from "@/src/types/common/common";
import {
  IProductClassification,
  IProductClassificationMeta,
  getParentLevelLabel,
  PRODUCT_CLASSIFICATION_ALLOWED_PARENT_LEVELS,
  PRODUCT_CLASSIFICATION_LEVEL_LABEL,
} from "@/src/types/productClassification";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, Resolver, useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { getApiErrorMessage, getApiFieldErrors } from "@/src/utils/apiError";
import CategoriesTable from "./CategoriesTable";
import CategoryFormModal from "./CategoryFormModal";
import CategoryViewModal from "./CategoryViewModal";
import { CategoryFormType, getCategorySchema } from "./Schema";
import { GetCategoryColumns } from "./TableColumns/CategoryColumns";
import { CategoriesProps, CategoryFormState } from "./types";
import {
  byLevelEndpoint,
  byLevelQueryKey,
  CATEGORIES_ENDPOINT,
  CATEGORIES_QUERY_KEY,
  categoryEndpoint,
  getNextPosition,
  MULTIPART_CONFIG,
  toCategoryFormData,
  toCreatePayload,
  toFormValues,
  toParentOptionLabel,
  toUpdatePayload,
} from "./utils/categoryFormData";

const statusOf = (err: unknown) =>
  (err as IGenericErrorResponse | undefined)?.statusCode;

/** Form fields the backend may report in a 400 VALIDATION_FAILED. */
const FORM_FIELDS = new Set<keyof CategoryFormType>([
  "name",
  "description",
  "parentId",
  "icon",
  "iconFile",
  "position",
  "isActive",
]);

export default function CategoriesPage({ level }: CategoriesProps) {
  const levelLabel = PRODUCT_CLASSIFICATION_LEVEL_LABEL[level];
  const parentLevels = PRODUCT_CLASSIFICATION_ALLOWED_PARENT_LEVELS[level];
  const parentLabel = getParentLevelLabel(level);
  const requiresParent = parentLevels.length > 0;
  const parentLevel = parentLevels[0] ?? null;

  const [formState, setFormState] = useState<CategoryFormState>({
    open: false,
  });
  const [viewItem, setViewItem] = useState<IProductClassification>();
  const [deleteItem, setDeleteItem] = useState<IProductClassification>();
  const editItem = formState.item;
  const isEditMode = !!editItem;

  const canCreate = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_CREATE)
  );
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_UPDATE)
  );
  const canDelete = useAppSelector(
    selectHasPermission(PERMISSION.PRODUCT_CLASSIFICATION_DELETE)
  );

  const queryClient = useQueryClient();
  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });

  // ── Form ──────────────────────────────────────────────────────────────
  const schema = useMemo(
    () => getCategorySchema(requiresParent),
    [requiresParent]
  );
  const methods = useForm<CategoryFormType>({
    resolver: yupResolver(schema) as Resolver<CategoryFormType>,
    defaultValues: toFormValues(),
  });

  const closeForm = () => setFormState({ open: false });

  // GET /product-classifications/by-level/{PARENT_LEVEL} — while modal open
  const {
    data: parentsRes,
    isLoading: isParentsLoading,
    refetch: refetchParents,
  } = useGet<IProductClassification[]>(
    byLevelEndpoint(parentLevel),
    byLevelQueryKey(parentLevel),
    undefined,
    { enabled: formState.open && requiresParent }
  );

  const parentOptions = useMemo(() => {
    const parents = Array.isArray(parentsRes?.data) ? parentsRes.data : [];
    const options = parents
      .filter((p) => p.id !== editItem?.id)
      .map((p) => ({ label: toParentOptionLabel(p), value: p.id }));
    // Keep the current parent selectable even if by-level no longer lists it.
    if (
      editItem?.parentId &&
      editItem.parentName &&
      !options.some((o) => o.value === editItem.parentId)
    ) {
      options.unshift({ label: editItem.parentName, value: editItem.parentId });
    }
    return options;
  }, [parentsRes, editItem]);

  // GET /product-classifications/by-level/{LEVEL} — siblings for next position (create only)
  const { data: siblingsRes, isLoading: isSiblingsLoading } = useGet<
    IProductClassification[]
  >(byLevelEndpoint(level), byLevelQueryKey(level), undefined, {
    enabled: formState.open && !isEditMode,
  });

  const selectedParentId = useWatch({
    control: methods.control,
    name: "parentId",
  });

  const suggestedPosition = useMemo(() => {
    if (isEditMode || isSiblingsLoading) return undefined;
    const siblings = Array.isArray(siblingsRes?.data) ? siblingsRes.data : [];
    return getNextPosition(
      siblings,
      requiresParent ? selectedParentId : undefined
    );
  }, [
    isEditMode,
    isSiblingsLoading,
    siblingsRes,
    requiresParent,
    selectedParentId,
  ]);

  // POST /product-classifications
  const {
    mutateAsync: createCategory,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = usePost<IProductClassification>(CATEGORIES_ENDPOINT, undefined, [
    [CATEGORIES_QUERY_KEY],
  ]);

  // PATCH /product-classifications/{id} (changed fields only)
  const {
    mutateAsync: updateCategory,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = usePatch<IProductClassification>(undefined, [[CATEGORIES_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues(editItem));
      resetCreate();
      resetUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open, editItem?.id]);

  // Create: auto-increment position (follows parent changes) until edited.
  useAutoPosition(methods, "position", {
    active: formState.open,
    suggested: suggestedPosition,
  });

  /** Put backend field errors (400) under the matching inputs. */
  const showFieldErrors = (err: unknown) =>
    getApiFieldErrors(err).forEach(({ field, message }) => {
      const name = field as keyof CategoryFormType;
      if (FORM_FIELDS.has(name)) methods.setError(name, { message });
    });

  const onSubmit = (data: CategoryFormType) => {
    if (!editItem) {
      createCategory({
        data: toCategoryFormData(toCreatePayload(data, level, requiresParent)),
        config: MULTIPART_CONFIG,
      })
        .then(() => {
          toast.success(`${levelLabel} created successfully`);
          methods.reset();
          closeForm();
        })
        .catch((err) => {
          // usePost does not toast — surface the backend message here.
          toast.error(
            getApiErrorMessage(
              err,
              `Failed to create ${levelLabel.toLowerCase()}`
            )
          );
          showFieldErrors(err);
          // 404 → selected parent removed / inactive; reload options.
          if (statusOf(err) === 404) {
            methods.setValue("parentId", "");
            refetchParents();
          }
        });
      return;
    }

    const payload = toUpdatePayload(editItem, data, requiresParent);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      closeForm();
      return;
    }

    updateCategory({
      url: categoryEndpoint(editItem.id),
      data: toCategoryFormData(payload),
      config: MULTIPART_CONFIG,
    })
      .then(() => {
        toast.success(`${levelLabel} updated successfully`);
        methods.reset();
        closeForm();
      })
      .catch((err) => {
        // usePatch already toasts; mark the offending fields.
        showFieldErrors(err);
        // 404 → row or parent gone; 400/409 also shown in form.
        if (statusOf(err) === 404) {
          if (payload.parentId)
            methods.setValue("parentId", editItem.parentId ?? "");
          invalidateAll();
        }
      });
  };

  // ── List ──────────────────────────────────────────────────────────────
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(300);

  // GET /product-classifications?level=&search=&page=&size=
  const { data, isLoading, isFetching } = useGet<IProductClassification[]>(
    CATEGORIES_ENDPOINT,
    [CATEGORIES_QUERY_KEY, level],
    {
      level,
      search: debouncedSearch.trim(),
      page: currentPage,
      size: itemsPerPage > 0 ? itemsPerPage : undefined,
    }
  );
  const items = data?.data ?? [];
  const totalRecords =
    (data?.meta as unknown as IProductClassificationMeta | undefined)
      ?.totalRecords ?? 0;

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setCurrentPage(1);
  };

  // ── Delete (soft) ─────────────────────────────────────────────────────
  const { mutateAsync: deleteCategory } = useDelete<null>(undefined, [
    [CATEGORIES_QUERY_KEY],
  ]);

  const onConfirmDelete = () => {
    const target = deleteItem;
    setDeleteItem(undefined);
    if (!target) return;

    deleteCategory({ url: categoryEndpoint(target.id) })
      .then(() => toast.success(`${levelLabel} deleted successfully`))
      .catch((err) => {
        // useDelete already toasts the backend message.
        if (statusOf(err) === 409)
          toast.info("Delete its child classifications first, then try again.");
        else if (statusOf(err) === 404) invalidateAll();
      });
  };

  const columns = useMemo(
    () =>
      GetCategoryColumns(level, {
        onView: setViewItem,
        onEdit: canUpdate
          ? (item) => setFormState({ open: true, item })
          : undefined,
        onDelete: canDelete ? setDeleteItem : undefined,
      }),
    [level, canUpdate, canDelete]
  );

  return (
    <div>
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

      <FormProvider {...methods}>
        <CategoryFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          levelLabel={levelLabel}
          parentLabel={parentLabel}
          parentOptions={parentOptions}
          isParentsLoading={isParentsLoading}
          suggestedPosition={suggestedPosition}
          isPositionLoading={formState.open && !isEditMode && isSiblingsLoading}
          isEditMode={isEditMode}
          error={isEditMode ? updateError : createError}
          isPending={isEditMode ? isUpdating : isCreating}
        />
      </FormProvider>

      <CategoryViewModal
        item={viewItem}
        onClose={() => setViewItem(undefined)}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(undefined)}
        onConfirm={onConfirmDelete}
        title={`Delete ${levelLabel}?`}
        description={`Are you sure you want to delete "${
          deleteItem?.name ?? ""
        }"? It will be deactivated. Items that still have active children cannot be deleted.`}
      />
    </div>
  );
}
