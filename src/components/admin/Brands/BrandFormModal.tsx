"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import BrandForm from "./Form/BrandForm";
import { BrandFormModalProps } from "./types";

/** Create / update dialog. Must render inside the container's FormProvider. */
export default function BrandFormModal({
  isOpen,
  onCancel,
  isEditMode = false,
  isPending = false,
  ...formProps
}: BrandFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isEditMode ? "Update" : "Create"} Brand
          </DialogTitle>
        </DialogHeader>
        <BrandForm
          {...formProps}
          onCancel={onCancel}
          isEditMode={isEditMode}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
