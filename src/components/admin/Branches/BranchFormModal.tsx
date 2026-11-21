"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import BranchForm from "./Form/BranchForm";
import { BranchFormModalProps } from "./types";

/** Create / update dialog. Must render inside the container's FormProvider. */
export default function BranchFormModal({
  isOpen,
  onCancel,
  isEditMode = false,
  isPending = false,
  ...formProps
}: BranchFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isEditMode ? "Update" : "Create"} Branch
          </DialogTitle>
        </DialogHeader>
        <BranchForm
          {...formProps}
          onCancel={onCancel}
          isEditMode={isEditMode}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
