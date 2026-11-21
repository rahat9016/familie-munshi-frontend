"use client";

import { PERMISSION } from "@/src/constants/auth/permissions";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePost } from "@/src/hooks/usePost";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { IListMeta } from "@/src/types/common/common";
import { IRole } from "@/src/types/role";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import RoleFormModal from "./RoleFormModal";
import RolePermissions from "./RolePermissions/RolePermissions";
import RolesTable from "./RolesTable";
import RoleViewModal from "./RoleViewModal";
import { RoleFormType, roleSchema } from "./Schema";
import { GetRoleColumns } from "./TableColumns/RoleColumns";
import { RoleFormState } from "./types";
import {
  ROLES_ENDPOINT,
  ROLES_QUERY_KEY,
  toCreatePayload,
  toFormValues,
} from "./utils/roleFormData";

export default function RolesPage() {
  const [formState, setFormState] = useState<RoleFormState>({ open: false });
  const [viewId, setViewId] = useState<string>();
  const [permissionsRole, setPermissionsRole] = useState<IRole>();

  const canCreate = useAppSelector(selectHasPermission(PERMISSION.ROLE_CREATE));
  const canManagePermissions = useAppSelector(
    selectHasPermission(PERMISSION.ROLE_PERMISSION_MANAGE)
  );

  // ── Form (create only — API has no role update/delete yet) ────────────
  const methods = useForm<RoleFormType>({
    resolver: yupResolver(roleSchema),
    defaultValues: toFormValues(),
  });

  const closeForm = () => setFormState({ open: false });

  // POST /system/roles
  const {
    mutateAsync: createRole,
    isPending,
    error,
    reset,
  } = usePost<IRole>(ROLES_ENDPOINT, undefined, [[ROLES_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues());
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open]);

  const onSubmit = (data: RoleFormType) => {
    createRole({ ...toCreatePayload(data) })
      .then(() => {
        toast.success(`Role "${data.name.trim()}" created`);
        methods.reset();
        closeForm();
      })
      .catch(() => {
        // error surfaced via `error` prop
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

  // GET /system/roles?search=&isActive=&page=&size= (size max 100)
  const { data, isLoading, isFetching } = useGet<IRole[]>(
    ROLES_ENDPOINT,
    [ROLES_QUERY_KEY],
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

  const columns = useMemo(
    () =>
      GetRoleColumns({
        onView: (r) => setViewId(r.id),
        onAssignPermissions: canManagePermissions
          ? setPermissionsRole
          : undefined,
      }),
    [canManagePermissions]
  );

  return (
    <div>
      <RolesTable
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
        createTitle="Create Role"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      <FormProvider {...methods}>
        <RoleFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          error={error}
          isPending={isPending}
        />
      </FormProvider>

      <RoleViewModal roleId={viewId} onClose={() => setViewId(undefined)} />

      <RolePermissions
        role={permissionsRole}
        onClose={() => setPermissionsRole(undefined)}
      />
    </div>
  );
}
