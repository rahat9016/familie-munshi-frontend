"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { useGet } from "@/src/hooks/useGet";
import { usePost } from "@/src/hooks/usePost";
import { IPermissionTreeGroup } from "@/src/types/permission";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ROLES_QUERY_KEY } from "../utils/roleFormData";
import RolePermissionsForm from "./Form/RolePermissionsForm";
import { RolePermissionsFormType, rolePermissionsSchema } from "./Schema";
import { RolePermissionsProps } from "./types";
import {
  PERMISSION_TREE_ENDPOINT,
  PERMISSION_TREE_QUERY_KEY,
  rolePermissionsEndpoint,
  toFormValues,
  toPayload,
} from "./utils/rolePermissionsData";

/** Assign permissions to a role (POST /system/roles/{id}/permissions). */
export default function RolePermissionsPage({
  role,
  onClose,
}: RolePermissionsProps) {
  const isOpen = !!role;

  const methods = useForm<RolePermissionsFormType>({
    resolver: yupResolver(rolePermissionsSchema),
    defaultValues: toFormValues(),
  });

  // GET /permissions/tree — picker options grouped by module
  const { data, isLoading } = useGet<IPermissionTreeGroup[]>(
    PERMISSION_TREE_ENDPOINT,
    PERMISSION_TREE_QUERY_KEY,
    undefined,
    { enabled: isOpen, staleTime: 5 * 60 * 1000 }
  );
  const groups = Array.isArray(data?.data) ? data.data : [];

  const {
    mutateAsync: assignPermissions,
    isPending,
    error,
    reset,
  } = usePost(undefined, undefined, [[ROLES_QUERY_KEY]]);

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues());
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, role?.id]);

  const onSubmit = (formData: RolePermissionsFormType) => {
    if (!role) return;
    const payload = toPayload(formData);
    assignPermissions({
      endpoint: rolePermissionsEndpoint(role.id),
      data: { ...payload },
    })
      .then(() => {
        toast.success(
          `${payload.permissionCodes.length} permission(s) assigned to "${role.name}"`
        );
        methods.reset();
        onClose();
      })
      .catch(() => {
        // error surfaced via `error` prop
      });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onClose()}
    >
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Assign permissions
          </DialogTitle>
          <DialogDescription>
            Role{" "}
            <span className="font-medium text-secondary">{role?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <RolePermissionsForm
            onSubmit={onSubmit}
            onCancel={onClose}
            groups={groups}
            isGroupsLoading={isLoading}
            error={error}
            isPending={isPending}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
