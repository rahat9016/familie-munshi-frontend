"use client";

import { PERMISSION } from "@/src/constants/auth/permissions";
import { useGet } from "@/src/hooks/useGet";
import { usePagination } from "@/src/hooks/usePagination";
import { usePost } from "@/src/hooks/usePost";
import { useSearchDebounce } from "@/src/hooks/useSearchDebounce";
import { selectHasPermission } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { IListMeta } from "@/src/types/common/common";
import { IRole, isBranchRole } from "@/src/types/role";
import { IUser } from "@/src/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROLES_ENDPOINT, ROLES_QUERY_KEY } from "../Roles/utils/roleFormData";
import { UserFormType, userSchema } from "./Schema";
import { GetUserColumns } from "./TableColumns/UserColumns";
import { UserFormState } from "./types";
import UserFormModal from "./UserFormModal";
import UserRoles from "./UserRoles/UserRoles";
import UsersTable from "./UsersTable";
import UserViewModal from "./UserViewModal";
import {
  MULTIPART_CONFIG,
  CREATE_USER_ROLE_PARAMS,
  toCreatePayload,
  toFormValues,
  toUserFormData,
  USERS_ENDPOINT,
  USERS_QUERY_KEY,
} from "./utils/userFormData";

export default function UsersPage() {
  const [formState, setFormState] = useState<UserFormState>({ open: false });
  const [viewId, setViewId] = useState<string>();
  const [rolesUser, setRolesUser] = useState<IUser>();

  const canCreate = useAppSelector(selectHasPermission(PERMISSION.USER_CREATE));
  const canAssignRole = useAppSelector(
    selectHasPermission(PERMISSION.USER_ROLE_ASSIGN)
  );
  const canRemoveRole = useAppSelector(
    selectHasPermission(PERMISSION.USER_ROLE_REMOVE)
  );

  // ── Form (create only — API has no user update/delete yet) ────────────
  // Role options: GET /system/roles?isActive=true&isSystem=false (while form open)
  const { data: rolesRes, isLoading: isRolesLoading } = useGet<IRole[]>(
    ROLES_ENDPOINT,
    [ROLES_QUERY_KEY, "options", "custom"],
    CREATE_USER_ROLE_PARAMS,
    { enabled: formState.open }
  );
  const roles = useMemo(
    () => (Array.isArray(rolesRes?.data) ? rolesRes.data : []),
    [rolesRes]
  );

  const methods = useForm<UserFormType>({
    resolver: yupResolver(userSchema),
    defaultValues: toFormValues(),
  });

  const assignBranch = methods.watch("assignBranch");

  // Toggle off → drop branch. Either way the role list changes scope,
  // so clear a role that no longer fits.
  useEffect(() => {
    const sub = methods.watch((values, { name }) => {
      if (name !== "assignBranch") return;
      if (!values.assignBranch) {
        methods.setValue("branchId", "");
        methods.clearErrors("branchId");
      }
      const role = roles.find((r) => r.id === values.roleId);
      if (role && isBranchRole(role) !== !!values.assignBranch) {
        methods.setValue("roleId", "");
      }
    });
    return () => sub.unsubscribe();
  }, [methods, roles]);

  // Branch roles when "Assign to branch" is on, other roles when off.
  const roleOptions = useMemo(
    () =>
      roles
        .filter((r) => isBranchRole(r) === !!assignBranch)
        .map((r) => ({
          label: `${r.name} · ${r.scope ?? "—"}`,
          value: r.id,
        })),
    [roles, assignBranch]
  );

  const closeForm = () => setFormState({ open: false });

  // POST /users (multipart)
  const {
    mutateAsync: createUser,
    isPending,
    error,
    reset,
  } = usePost<IUser>(USERS_ENDPOINT, undefined, [[USERS_QUERY_KEY]]);

  useEffect(() => {
    if (formState.open) {
      methods.reset(toFormValues());
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.open]);

  const onSubmit = (data: UserFormType) => {
    const payload = toCreatePayload(data);
    createUser({ data: toUserFormData(payload), config: MULTIPART_CONFIG })
      .then(() => {
        toast.success(
          `User "${payload.firstName} ${payload.lastName}" created`
        );
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

  // GET /users?search=&isActive=&page=&size= (size max 100)
  const { data, isLoading, isFetching } = useGet<IUser[]>(
    USERS_ENDPOINT,
    [USERS_QUERY_KEY],
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
      GetUserColumns({
        onView: (u) => setViewId(u.id),
        onManageRoles:
          canAssignRole || canRemoveRole ? setRolesUser : undefined,
      }),
    [canAssignRole, canRemoveRole]
  );

  return (
    <div>
      <UsersTable
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
        createTitle="Create User"
        setIsModalOpen={() => setFormState({ open: true })}
      />

      <FormProvider {...methods}>
        <UserFormModal
          isOpen={formState.open}
          onSubmit={onSubmit}
          onCancel={closeForm}
          roleOptions={roleOptions}
          isRolesLoading={isRolesLoading}
          assignBranch={assignBranch}
          error={error}
          isPending={isPending}
        />
      </FormProvider>

      <UserViewModal userId={viewId} onClose={() => setViewId(undefined)} />

      <UserRoles
        user={rolesUser}
        onClose={() => setRolesUser(undefined)}
        canAssign={canAssignRole}
        canRemove={canRemoveRole}
      />
    </div>
  );
}
