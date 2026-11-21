"use client";

import { PERMISSION } from "@/src/constants/auth/permissions";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePatch } from "@/src/hooks/usePatch";
import { usePost } from "@/src/hooks/usePost";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  IBranch,
  IBranchListMeta,
  IBranchPayload,
  isBranchActive,
} from "@/src/types/branch";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BranchesTable from "./BranchesTable";
import BranchFormModal from "./BranchFormModal";
import BranchViewModal from "./BranchViewModal";
import { BranchFormType, branchSchema } from "./Schema";
import { GetBranchColumns } from "./TableColumns/BranchColumns";
import { BranchFormState } from "./types";
import {
  BRANCHES_QUERY_KEY,
  MULTIPART_CONFIG,
  toBranchFormData,
  toFormValues,
} from "./utils/branchFormData";

export default function BranchesPage() {
  const [formState, setFormState] = useState<BranchFormState>({ open: false });
  const [viewId, setViewId] = useState<string>();
  const editItem = formState.item;
  const isEditMode = !!editItem;

  const canCreate = useAppSelector(
    selectHasPermission(PERMISSION.BRANCH_CREATE)
  );
  const canUpdate = useAppSelector(
    selectHasPermission(PERMISSION.BRANCH_UPDATE)
  );

  // ── Form ──────────────────────────────────────────────────────────────
  const methods = useForm<BranchFormType>({
    resolver: yupResolver(branchSchema),
    defaultValues: toFormValues(),
  });

  const closeForm = () => setFormState({ open: false });

  // POST /branches (multipart)
  const {
    mutateAsync: createBranch,
    isPending: isCreating,
    error: createError,
    reset: resetCreate,
  } = usePost<IBranch>("/branches", undefined, [[BRANCHES_QUERY_KEY]]);

  // PATCH /branches/{id} (multipart, changed fields only)
  const {
    mutateAsync: updateBranch,
    isPending: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = usePatch<IBranch>(undefined, [[BRANCHES_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues(editItem));
      resetCreate();
      resetUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open, editItem?.id]);

  const onSubmit = (data: BranchFormType) => {
    const name = data.name.trim();
    const address = data.address.trim();
    const phone = data.phone.trim();

    if (!editItem) {
      const payload: IBranchPayload = { name, isActive: data.isActive };
      if (address) payload.address = address;
      if (phone) payload.phone = phone;
      if (data.logo instanceof File) payload.logo = data.logo;

      createBranch({
        data: toBranchFormData(payload),
        config: MULTIPART_CONFIG,
      })
        .then(() => {
          toast.success(`Branch "${name}" created`);
          methods.reset();
          closeForm();
        })
        .catch(() => {
          // error surfaced via `error` prop
        });
      return;
    }

    // Send only changed fields.
    const payload: IBranchPayload = {};
    if (name !== editItem.name) payload.name = name;
    if (address !== (editItem.address ?? "")) payload.address = address;
    if (phone !== (editItem.phone ?? "")) payload.phone = phone;
    if (data.logo instanceof File) payload.logo = data.logo;
    if (data.isActive !== isBranchActive(editItem))
      payload.isActive = data.isActive;

    if (Object.keys(payload).length === 0) {
      toast.info("No changes to save");
      closeForm();
      return;
    }

    updateBranch({
      url: `/branches/${editItem.id}`,
      data: toBranchFormData(payload),
      config: MULTIPART_CONFIG,
    })
      .then(() => {
        toast.success(`Branch "${name}" updated`);
        methods.reset();
        closeForm();
      })
      .catch(() => {
        // error surfaced via toast + `error` prop
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

  // GET /branches?search=&isActive=&page=&size= (size max 100)
  const { data, isLoading, isFetching } = useGet<IBranch[]>(
    "/branches",
    [BRANCHES_QUERY_KEY],
    {
      search: debouncedSearch.trim(),
      isActive,
      page: currentPage,
      size: itemsPerPage > 0 ? Math.min(itemsPerPage, 100) : undefined,
    }
  );
  const items = data?.data ?? [];
  const totalRecords =
    (data?.meta as unknown as IBranchListMeta | undefined)?.totalRecords ?? 0;

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setCurrentPage(1);
  };

  const columns = useMemo(
    () =>
      GetBranchColumns({
        onView: (b) => setViewId(b.id),
        onEdit: canUpdate
          ? (item) => setFormState({ open: true, item })
          : undefined,
      }),
    [canUpdate]
  );

  const isPending = isEditMode ? isUpdating : isCreating;

  return (
    <div>
      <BranchesTable
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
        createTitle="Create Branch"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      <FormProvider {...methods}>
        <BranchFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          isEditMode={isEditMode}
          error={isEditMode ? updateError : createError}
          isPending={isPending}
        />
      </FormProvider>

      <BranchViewModal branchId={viewId} onClose={() => setViewId(undefined)} />
    </div>
  );
}
