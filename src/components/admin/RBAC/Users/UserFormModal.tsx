"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import UserForm from "./Form/UserForm";
import { UserFormModalProps } from "./types";

/** Create dialog. Must render inside the container's FormProvider. */
export default function UserFormModal({
  isOpen,
  onCancel,
  isPending = false,
  ...formProps
}: UserFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Create User
          </DialogTitle>
        </DialogHeader>
        <UserForm {...formProps} onCancel={onCancel} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
