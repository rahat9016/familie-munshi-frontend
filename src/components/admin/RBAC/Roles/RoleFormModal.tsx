"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import RoleForm from "./Form/RoleForm";
import { RoleFormModalProps } from "./types";

/** Create dialog. Must render inside the container's FormProvider. */
export default function RoleFormModal({
  isOpen,
  onCancel,
  isPending = false,
  ...formProps
}: RoleFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Create Role
          </DialogTitle>
        </DialogHeader>
        <RoleForm {...formProps} onCancel={onCancel} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
