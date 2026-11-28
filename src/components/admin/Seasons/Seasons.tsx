"use client";

import DeleteConfirmDialog from "@/src/components/shared/DeleteConfirmDialog";
import { PERMISSION } from "@/src/constants/auth/permissions";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { setSortBy } from "@/src/lib/redux/features/filter/filterSlice";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { IGenericErrorResponse, IListMeta } from "@/src/types/common/common";
import { ISeason } from "@/src/types/season";
import { getApiErrorMessage, getApiFieldErrors } from "@/src/utils/apiError";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, Resolver, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SeasonFormType, seasonSchema } from "./Schema";
import SeasonFormModal from "./SeasonFormModal";
import SeasonsTable from "./SeasonsTable";
import { GetSeasonColumns } from "./TableColumns/SeasonColumns";
import { SeasonFormState } from "./types";
import {
  seasonEndpoint,
  seasonRoute,
  SEASONS_ENDPOINT,
  SEASONS_QUERY_KEY,
  toCreatePayload,
  toFormValues,
  toStatusParam,
  toUpdatePayload,
} from "./utils/seasonFormData";

const statusOf = (err: unknown) =>
  (err as IGenericErrorResponse | undefined)?.statusCode;

const FORM_FIELDS = new Set<keyof SeasonFormType>(["season", "status"]);

export default function SeasonsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const sortBy = useAppSelector((state) => state.filter.sortBy);

  const [formState, setFormState] = useState<SeasonFormState>({ open: false });
  const [deleteItem, setDeleteItem] = useState<ISeason>();
  const editItem = formState.item;
  const isEditMode = !!editItem;

  const canCreate = useAppSelector(selectHasPermission(PERMISSION.SEASON_CREATE));
  const canUpdate = useAppSelector(selectHasPermission(PERMISSION.SEASON_UPDATE));
  const canDelete = useAppSelector(selectHasPermission(PERMISSION.SEASON_DELETE));

  const queryClient = useQueryClient();
  const invalidateAll = () =>
    queryClient.invalidateQueries({ queryKey: [SEASONS_QUERY_KEY] });

  // Status filter lives in redux and is shared across tables — start clean.
  useEffect(() => {
    dispatch(setSortBy(""));
  }, [dispatch]);

  // ── Form ──────────────────────────────────────────────────────────────
  const methods = useForm<SeasonFormType>({
    resolver: yupResolver(seasonSchema) as Resolver<SeasonFormType>,
    defaultValues: toFormValues(),
  });

  const closeForm = () => setFormState({ open: false });

  // POST /seasons
  const {
    mutateAsync: createSeason,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = usePost<ISeason>(SEASONS_ENDPOINT, undefined, [[SEASONS_QUERY_KEY]]);

  // PATCH /seasons/{id} (changed fields only)
  const {
    mutateAsync: updateSeason,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = usePatch<ISeason>(undefined, [[SEASONS_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues(editItem));
      resetCreate();
      resetUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open, editItem?.id]);

  /** Backend field errors (400) under the inputs; 409 = duplicate name. */
  const showFieldErrors = (err: unknown) => {
    getApiFieldErrors(err).forEach(({ field, message }) => {
      const name = field as keyof SeasonFormType;
      if (FORM_FIELDS.has(name)) methods.setError(name, { message });
    });
    if (statusOf(err) === 409)
      methods.setError("season", {
        message: getApiErrorMessage(err, "Season name already exists"),
      });
  };

  const onSubmit = (data: SeasonFormType) => {
    if (!editItem) {
      createSeason(toCreatePayload(data) as unknown as Record<string, unknown>)
        .then(() => {
          toast.success("Season created successfully");
          closeForm();
        })
        .catch((err) => {
          // usePost does not toast — surface the backend message here.
          toast.error(getApiErrorMessage(err, "Failed to create season"));
          showFieldErrors(err);
        });
      return;
    }

    const payload = toUpdatePayload(editItem, data);
    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      closeForm();
      return;
    }

    updateSeason({
      url: seasonEndpoint(editItem.id),
      data: payload as Record<string, unknown>,
    })
      .then(() => {
        toast.success("Season updated successfully");
        closeForm();
      })
      .catch((err) => {
        // usePatch already toasts; mark the offending fields.
        showFieldErrors(err);
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
  const status = toStatusParam(sortBy);

  useEffect(() => {
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // GET /seasons?search=&status=&page=&size=
  const { data, isLoading, isFetching } = useGet<ISeason[]>(
    SEASONS_ENDPOINT,
    [SEASONS_QUERY_KEY, "list"],
    {
      search: debouncedSearch.trim(),
      status,
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
  const { mutateAsync: deleteSeason } = useDelete<null>(undefined, [
    [SEASONS_QUERY_KEY],
  ]);

  const onConfirmDelete = () => {
    const target = deleteItem;
    setDeleteItem(undefined);
    if (!target) return;

    deleteSeason({ url: seasonEndpoint(target.id) })
      .then(() => toast.success("Season deleted successfully"))
      .catch((err) => {
        // useDelete already toasts the backend message.
        if (statusOf(err) === 404) invalidateAll();
      });
  };

  const columns = useMemo(
    () =>
      GetSeasonColumns({
        onOpen: (item) => router.push(seasonRoute(item.id)),
        onEdit: canUpdate
          ? (item) => setFormState({ open: true, item })
          : undefined,
        onDelete: canDelete ? setDeleteItem : undefined,
      }),
    [router, canUpdate, canDelete]
  );

  return (
    <div className="w-full">
      <SeasonsTable
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
        createTitle="Add Season"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      <FormProvider {...methods}>
        <SeasonFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          isEditMode={isEditMode}
          error={isEditMode ? updateError : createError}
          isPending={isEditMode ? isUpdating : isCreating}
        />
      </FormProvider>

      <DeleteConfirmDialog
        isOpen={!!deleteItem}
        onClose={() => setDeleteItem(undefined)}
        onConfirm={onConfirmDelete}
        title="Delete season?"
        description={`Are you sure you want to delete "${
          deleteItem?.season ?? ""
        }"? This action cannot be undone.`}
      />
    </div>
  );
}
