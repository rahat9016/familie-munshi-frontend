"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import SeasonForm from "./Form/SeasonForm";
import { SeasonFormModalProps } from "./types";

/** Create / update dialog. Must render inside the container's FormProvider. */
export default function SeasonFormModal({
  isOpen,
  onCancel,
  isEditMode = false,
  isPending = false,
  ...formProps
}: SeasonFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            {isEditMode ? "Update" : "Create"} Season
          </DialogTitle>
        </DialogHeader>
        <SeasonForm
          {...formProps}
          onCancel={onCancel}
          isEditMode={isEditMode}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
