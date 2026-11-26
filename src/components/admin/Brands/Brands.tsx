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
import { IBrand } from "@/src/types/brand";
import { IGenericErrorResponse, IListMeta } from "@/src/types/common/common";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BrandFormModal from "./BrandFormModal";
import BrandsTable from "./BrandsTable";
import BrandViewModal from "./BrandViewModal";
import { BrandFormType, brandSchema } from "./Schema";
import { GetBrandColumns } from "./TableColumns/BrandColumns";
import { BrandFormState } from "./types";
import {
  brandEndpoint,
  BRANDS_ENDPOINT,
  BRANDS_QUERY_KEY,
  fetchNextBrandPosition,
  MULTIPART_CONFIG,
  NEXT_POSITION_QUERY_KEY,
  toBrandFormData,
  toCreatePayload,
  toFormValues,
  toUpdatePayload,
} from "./utils/brandFormData";

const statusOf = (err: unknown) =>
  (err as IGenericErrorResponse | undefined)?.statusCode;

export default function BrandsPage() {
  const [formState, setFormState] = useState<BrandFormState>({ open: false });
  const [viewId, setViewId] = useState<string>();
  const [deleteItem, setDeleteItem] = useState<IBrand>();
  const editItem = formState.item;
  const isEditMode = !!editItem;

  const canCreate = useAppSelector(
    selectHasPermission(PERMISSION.BRAND_CREATE)
  );
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.BRAND_UPDATE)
  );
  const canDelete = useAppSelector(
    selectHasPermission(PERMISSION.BRAND_DELETE)
  );
  const canView = useAppSelector(selectHasPermission(PERMISSION.BRAND_VIEW));

  const queryClient = useQueryClient();
  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: [BRANDS_QUERY_KEY] });

  // ── Form ──────────────────────────────────────────────────────────────
  const methods = useForm<BrandFormType>({
    resolver: yupResolver(brandSchema) as Resolver<BrandFormType>,
    defaultValues: toFormValues(),
  });

  const closeForm = () => setFormState({ open: false });

  // Position auto-increment (create only): highest position across ALL
  // brands + 1. Under the root key, so every create/update/delete refreshes it.
  const {
    data: nextPosition,
    isLoading: isPositionLoading,
    refetch: refetchNextPosition,
  } = useQuery({
    queryKey: NEXT_POSITION_QUERY_KEY,
    queryFn: fetchNextBrandPosition,
    enabled: formState.open && !isEditMode,
    retry: false,
  });
  const suggestedPosition = isEditMode ? undefined : nextPosition;

  // POST /brands (multipart)
  const {
    mutateAsync: createBrand,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = usePost<IBrand>(BRANDS_ENDPOINT, undefined, [[BRANDS_QUERY_KEY]]);

  // PATCH /brands/{id} (multipart, changed fields only)
  const {
    mutateAsync: updateBrand,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = usePatch<IBrand>(undefined, [[BRANDS_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues(editItem));
      resetCreate();
      resetUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open, editItem?.id]);

  // Keep position on the auto-increment value until the user types their own.
  useAutoPosition(methods, "position", {
    active: formState.open && !isEditMode,
    suggested: suggestedPosition,
  });

  const onSubmit = (data: BrandFormType) => {
    const title = data.title.trim();

    if (!editItem) {
      createBrand({
        data: toBrandFormData(toCreatePayload(data)),
        config: MULTIPART_CONFIG,
      })
        .then(() => {
          toast.success(`Brand "${title}" created`);
          methods.reset();
          closeForm();
        })
        .catch((err) => {
          // 409 → position/title taken (e.g. another admin just created a
          // brand). Re-read the next position; if the field was left on
          // auto it moves to the new value. Message shows via `error`.
          if (statusOf(err) === 409) refetchNextPosition();
        });
      return;
    }

    const payload = toUpdatePayload(editItem, data);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      closeForm();
      return;
    }

    updateBrand({
      url: brandEndpoint(editItem.id),
      data: toBrandFormData(payload),
      config: MULTIPART_CONFIG,
    })
      .then(() => {
        toast.success(`Brand "${title}" updated`);
        methods.reset();
        closeForm();
      })
      .catch((err) => {
        // 404 → brand removed meanwhile; refresh the list.
        if (statusOf(err) === 404) {
          closeForm();
          invalidateAll();
        }
      });
  };

  // ── List ──────────────────────────────────────────────────────────────
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(300);

  // Table status filter (ACTIVE / INACTIVE / "") → isActive query param.
  const { sortBy } = useAppSelector((state) => state.filter);
  const isActive =
    sortBy === "ACTIVE" ? true : sortBy === "INACTIVE" ? false : undefined;

  useEffect(() => setCurrentPage(1), [isActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // GET /brands?search=&isActive=&page=&size= (size max 100)
  const { data, isLoading, isFetching } = useGet<IBrand[]>(
    BRANDS_ENDPOINT,
    [BRANDS_QUERY_KEY],
    {
      search: debouncedSearch.trim(),
      isActive,
      page: currentPage,
      size: itemsPerPage > 0 ? Math.min(itemsPerPage, 100) : undefined,
    }
  );
  const items = data?.data ?? [];
  const totalRecords =
    (data?.meta as unknown as IListMeta | undefined)?.totalRecords ?? 0;

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setCurrentPage(1);
  };

  // ── Delete ────────────────────────────────────────────────────────────
  const { mutateAsync: deleteBrand } = useDelete<null>(undefined, [
    [BRANDS_QUERY_KEY],
  ]);

  const onConfirmDelete = () => {
    const target = deleteItem;
    setDeleteItem(undefined);
    if (!target) return;

    deleteBrand({ url: brandEndpoint(target.id) })
      .then(() => toast.success(`Brand "${target.title}" deleted`))
      .catch((err) => {
        // useDelete already toasts the backend message.
        if (statusOf(err) === 404) invalidateAll();
      });
  };

  const columns = useMemo(
    () =>
      GetBrandColumns({
        onView: canView ? (b) => setViewId(b.id) : undefined,
        onEdit: canUpdate
          ? (item) => setFormState({ open: true, item })
          : undefined,
        onDelete: canDelete ? setDeleteItem : undefined,
      }),
    [canView, canUpdate, canDelete]
  );

  return (
    <div>
      <BrandsTable
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
        createTitle="Create Brand"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      <FormProvider {...methods}>
        <BrandFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          isEditMode={isEditMode}
          suggestedPosition={suggestedPosition}
          isPositionLoading={isPositionLoading}
          error={isEditMode ? updateError : createError}
          isPending={isEditMode ? isUpdating : isCreating}
        />
      </FormProvider>

      <BrandViewModal brandId={viewId} onClose={() => setViewId(undefined)} />

      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(undefined)}
        onConfirm={onConfirmDelete}
        title="Delete brand?"
        description={`Are you sure you want to delete "${
          deleteItem?.title ?? ""
        }"?`}
      />
    </div>
  );
}
