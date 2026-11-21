"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import CategoryForm from "./Form/CategoryForm";
import { CategoryFormModalProps } from "./types";

/** Create / update dialog. Must render inside the container's FormProvider. */
export default function CategoryFormModal({
  isOpen,
  onCancel,
  isEditMode = false,
  isPending = false,
  ...formProps
}: CategoryFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isEditMode ? "Update" : "Create"} {formProps.levelLabel}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          {...formProps}
          onCancel={onCancel}
          isEditMode={isEditMode}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
