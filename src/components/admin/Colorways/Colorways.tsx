"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { PERMISSION } from "@/src/constants/auth/permissions";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { usePut } from "@/src/hooks/usePut";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { setSortBy } from "@/src/lib/redux/features/filter/filterSlice";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import {
  ColorwayFlag,
  ColorwayTextField,
  IColorway,
  IColorwayUpdatePayload,
} from "@/src/types/colorway";
import { IGenericErrorResponse, IListMeta } from "@/src/types/common/common";
import { getApiErrorMessage, getApiFieldErrors } from "@/src/utils/apiError";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ColorwayFormModal from "./ColorwayFormModal";
import ColorwaysTable from "./ColorwaysTable";
import { colorwaySchema, ColorwayFormType } from "./Schema";
import { GetColorwayColumns } from "./TableColumns/ColorwayColumns";
import {
  colorwayEndpoint,
  colorwayImageOrderEndpoint,
  colorwayImagesEndpoint,
  colorwayRoute,
  COLORWAYS_ENDPOINT,
  COLORWAYS_QUERY_KEY,
  MULTIPART_CONFIG,
  toCoverOrder,
  toCreatePayload,
  toFieldPatch,
  toFlagPatch,
  toFormValues,
  toImagesFormData,
  toIsActiveParam,
  validateImageFiles,
} from "./utils/colorwayFormData";

const statusOf = (err: unknown) =>
  (err as IGenericErrorResponse | undefined)?.statusCode;

const FORM_FIELDS = new Set<keyof ColorwayFormType>(["marketingName", "name"]);

export default function ColorwaysPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state) => state.filter.sortBy);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<IColorway>();

  const canCreate = useAppSelector(
    selectHasPermission(PERMISSION.COLORWAY_CREATE)
  );
  const canView = useAppSelector(selectHasPermission(PERMISSION.COLORWAY_VIEW));
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.COLORWAY_UPDATE)
  );
  const canDelete = useAppSelector(
    selectHasPermission(PERMISSION.COLORWAY_DELETE)
  );

  const queryClient = useQueryClient();
  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: [COLORWAYS_QUERY_KEY] });

  // Status filter lives in redux and is shared across tables — start clean.
  useEffect(() => {
    dispatch(setSortBy(""));
  }, [dispatch]);

  // ── Create ────────────────────────────────────────────────────────────
  const methods = useForm<ColorwayFormType>({
    resolver: yupResolver(colorwaySchema),
    defaultValues: toFormValues(),
  });

  const {
    mutateAsync: createColorway,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = usePost<IColorway>(COLORWAYS_ENDPOINT, undefined, [
    [COLORWAYS_QUERY_KEY],
  ]);

  const openForm = () => {
    methods.reset(toFormValues());
    resetCreate();
    setIsFormOpen(true);
  };

  const onSubmit = (data: ColorwayFormType) => {
    createColorway(toCreatePayload(data) as unknown as Record<string, unknown>)
      .then((created) => {
        toast.success(`Colorway ${created?.code ?? ""} created`);
        methods.reset(toFormValues());
        setIsFormOpen(false);
      })
      .catch((err) => {
        // usePost does not toast — surface the backend message here.
        toast.error(getApiErrorMessage(err, "Failed to create colorway"));
        getApiFieldErrors(err).forEach(({ field, message }) => {
          const name = field as keyof ColorwayFormType;
          if (FORM_FIELDS.has(name)) methods.setError(name, { message });
        });
      });
  };

  // ── Inline edit ───────────────────────────────────────────────────────
  // usePatch / usePut toast their own errors.
  const { mutateAsync: updateColorway } = usePatch<IColorway>(undefined, [
    [COLORWAYS_QUERY_KEY],
  ]);
  const { mutateAsync: uploadImages } = usePost<IColorway>();
  const { mutateAsync: reorderImages } = usePut<IColorway>();

  /** Resolves `false` when the server rejects the change. */
  const patch = (item: IColorway, payload: IColorwayUpdatePayload) =>
    updateColorway({
      url: colorwayEndpoint(item.id),
      data: payload as Record<string, unknown>,
    })
      .then(() => true)
      .catch((err) => {
        if (statusOf(err) === 404) invalidateAll();
        return false;
      });

  const handleFieldChange = (
    item: IColorway,
    field: ColorwayTextField,
    value: string
  ) => {
    const result = toFieldPatch(item, field, value);
    // Unchanged, or blank on a field that can't be cleared → restore.
    if (!result) return false;
    if ("error" in result) {
      toast.error(result.error);
      return false;
    }
    return patch(item, result.payload);
  };

  const handleFlagChange = (
    item: IColorway,
    field: ColorwayFlag,
    value: boolean
  ) => patch(item, toFlagPatch(field, value));

  /** List image cell: append the file, then make it the cover. */
  const handleImageUpload = async (item: IColorway, file: File) => {
    const invalid = validateImageFiles([file], item.images.length);
    if (invalid) {
      toast.error(invalid);
      return;
    }
    let updated: IColorway;
    try {
      updated = await uploadImages({
        endpoint: colorwayImagesEndpoint(item.id),
        data: toImagesFormData([file]),
        config: MULTIPART_CONFIG,
      });
    } catch (err) {
      // usePost does not toast.
      toast.error(getApiErrorMessage(err, "Could not upload the image"));
      invalidateAll();
      return;
    }

    // Appended last; move it to the front so it replaces the cover.
    const added = updated?.images?.[updated.images.length - 1];
    if (item.images.length > 0 && added) {
      // usePut toasts its own error; the image is still uploaded.
      await reorderImages({
        url: colorwayImageOrderEndpoint(item.id),
        data: { imageIds: toCoverOrder(updated, added.id) },
      }).catch(() => undefined);
    }
    toast.success("Image uploaded");
    invalidateAll();
  };

  // ── List ──────────────────────────────────────────────────────────────
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const { search, debouncedSearch, handleSearchChange } =
    useSearchDebounce(300);
  const isActive = toIsActiveParam(sortBy);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // GET /colorways?search=&isActive=&page=&size=
  const { data, isLoading, isFetching } = useGet<IColorway[]>(
    COLORWAYS_ENDPOINT,
    [COLORWAYS_QUERY_KEY, "list"],
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

  // ── Delete (hard, removes images too) ─────────────────────────────────
  const { mutateAsync: deleteColorway } = useDelete<null>(undefined, [
    [COLORWAYS_QUERY_KEY],
  ]);

  const onConfirmDelete = () => {
    const target = deleteItem;
    setDeleteItem(undefined);
    if (!target) return;

    deleteColorway({ url: colorwayEndpoint(target.id) })
      .then(() => toast.success(`Colorway ${target.code} deleted`))
      .catch((err) => {
        // useDelete already toasts the backend message.
        if (statusOf(err) === 404) invalidateAll();
      });
  };

  const columns = useMemo(
    () =>
      GetColorwayColumns({
        onView: canView ? (item) => router.push(colorwayRoute(item.id)) : undefined,
        onFieldChange: canUpdate ? handleFieldChange : undefined,
        onFlagChange: canUpdate ? handleFlagChange : undefined,
        onImageUpload: canUpdate ? handleImageUpload : undefined,
        onDelete: canDelete ? setDeleteItem : undefined,
      }),
    // Handlers only close over stable hooks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canView, canUpdate, canDelete]
  );

  return (
    <div className="w-full">
      <ColorwaysTable
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
        createTitle="New Colorway"
        setIsModalOpen={openForm}
      />

      <FormProvider {...methods}>
        <ColorwayFormModal
          isOpen={isFormOpen}
          onSubmit={onSubmit}
          onCancel={() => setIsFormOpen(false)}
          error={createError}
          isPending={isCreating}
        />
      </FormProvider>

      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(undefined)}
        onConfirm={onConfirmDelete}
        title="Delete colorway?"
        description={`Delete "${deleteItem?.code ?? ""} · ${
          deleteItem?.marketingName ?? ""
        }" permanently? Its images are removed too. This can't be undone.`}
      />
    </div>
  );
}
