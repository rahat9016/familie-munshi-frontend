"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useDelete } from "@/src/hooks/useDelete";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { IRole } from "@/src/types/role";
import { getUserFullName } from "@/src/types/user";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ROLES_ENDPOINT,
  ROLES_QUERY_KEY,
} from "../../Roles/utils/roleFormData";
import { ROLE_OPTIONS_PARAMS, USERS_QUERY_KEY } from "../utils/userFormData";
import UserRoleForm from "./Form/UserRoleForm";
import { UserRoleFormType, userRoleSchema } from "./Schema";
import { UserRoleAction, UserRolesProps } from "./types";
import {
  toFormValues,
  userRoleEndpoint,
  userRolesEndpoint,
} from "./utils/userRoleData";

/** Assign / remove a role for one user. */
export default function UserRolesPage({
  user,
  onClose,
  canAssign,
  canRemove,
}: UserRolesProps) {
  const isOpen = !!user;
  const [lastAction, setLastAction] = useState<UserRoleAction | null>(null);

  const methods = useForm<UserRoleFormType>({
    resolver: yupResolver(userRoleSchema),
    defaultValues: toFormValues(),
  });

  // GET /system/roles?isActive=true — role options
  const { data: rolesRes, isLoading: isRolesLoading } = useGet<IRole[]>(
    ROLES_ENDPOINT,
    [ROLES_QUERY_KEY, "options"],
    ROLE_OPTIONS_PARAMS,
    { enabled: isOpen }
  );
  const roles = useMemo(
    () => (Array.isArray(rolesRes?.data) ? rolesRes.data : []),
    [rolesRes]
  );
  const roleOptions = useMemo(
    () => roles.map((r) => ({ label: r.name, value: r.id })),
    [roles]
  );
  const roleName = (id: string) =>
    roles.find((r) => r.id === id)?.name ?? "role";

  // POST /system/users/{userId}/roles
  const assign = usePost(undefined, undefined, [[USERS_QUERY_KEY]]);
  // DELETE /system/users/{userId}/roles/{roleId}
  const remove = useDelete(undefined, [[USERS_QUERY_KEY]]);

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues());
      assign.reset();
      remove.reset();
      setLastAction(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id]);

  const onAssign = (data: UserRoleFormType) => {
    if (!user) return;
    setLastAction("assign");
    remove.reset();
    assign
      .mutateAsync({
        endpoint: userRolesEndpoint(user.id),
        data: { roleId: data.roleId },
      })
      .then(() => {
        toast.success(
          `"${roleName(data.roleId)}" assigned to ${getUserFullName(user)}`
        );
        methods.reset();
        onClose();
      })
      .catch(() => {
        // error surfaced via `error` prop
      });
  };

  const onRemove = (data: UserRoleFormType) => {
    if (!user) return;
    setLastAction("remove");
    assign.reset();
    remove
      .mutateAsync({ url: userRoleEndpoint(user.id, data.roleId) })
      .then(() => {
        toast.success(
          `"${roleName(data.roleId)}" removed from ${getUserFullName(user)}`
        );
        methods.reset();
        onClose();
      })
      .catch(() => {
        // useDelete already toasts; message also shown in the form
      });
  };

  const pendingAction: UserRoleAction | null = assign.isPending
    ? "assign"
    : remove.isPending
      ? "remove"
      : null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !pendingAction && onClose()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Manage roles
          </DialogTitle>
          <DialogDescription>
            User{" "}
            <span className="font-medium text-secondary">
              {user ? getUserFullName(user) : ""}
            </span>{" "}
            · {user?.email}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <UserRoleForm
            onAssign={canAssign ? onAssign : undefined}
            onRemove={canRemove ? onRemove : undefined}
            onCancel={onClose}
            roleOptions={roleOptions}
            isRolesLoading={isRolesLoading}
            error={lastAction === "remove" ? remove.error : assign.error}
            pendingAction={pendingAction}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
