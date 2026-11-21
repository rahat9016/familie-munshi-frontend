"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { mockBranchesList } from "@/src/components/admin/Branches/data/mockBranchData";
import { mockRolesList } from "../../Roles/data/mockRoleData";
import { makeUserSchema, UserFormValues } from "../Schema/userSchema";
import { RbacUser } from "../types";
import UserForm from "./UserForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: UserFormValues) => void;
  initialValues?: RbacUser;
  isSuperAdmin: boolean;
}

const roleOptions = mockRolesList.map((r) => ({ label: r.name, value: r.id }));

const branchOptions = mockBranchesList.map((b) => ({
  label: `${b.code ?? b.id.slice(0, 6)}${b.city ? ` · ${b.city}` : ""}`,
  value: b.id,
}));

export default function CreateUpdateUser({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  isSuperAdmin,
}: Props) {
  const isUpdate = !!initialValues;
  const schema = useMemo(() => makeUserSchema(isUpdate), [isUpdate]);

  const methods = useForm<UserFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "", phone: "",
      roleId: "", branchId: "", gender: "", dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      methods.reset({
        firstName: initialValues?.firstName ?? "",
        lastName: initialValues?.lastName ?? "",
        email: initialValues?.email ?? "",
        password: "",
        phone: initialValues?.phone ?? "",
        roleId: initialValues?.role?.id ?? "",
        branchId: initialValues?.branchId ?? "",
        gender: initialValues?.gender ?? "",
        dateOfBirth: initialValues?.dateOfBirth?.slice(0, 10) ?? "",
      });
    }
  }, [isOpen, initialValues, methods]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isUpdate ? "Update" : "Create"} User
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <UserForm
            isEditMode={isUpdate}
            isSuperAdmin={isSuperAdmin}
            roleOptions={roleOptions}
            branchOptions={branchOptions}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
