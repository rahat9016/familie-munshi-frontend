"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ColorwayForm from "./Form/ColorwayForm";
import { ColorwayFormModalProps } from "./types";

/** Create dialog. Must render inside the container's FormProvider. */
export default function ColorwayFormModal({
  isOpen,
  onCancel,
  isPending = false,
  ...formProps
}: ColorwayFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Create Colorway
          </DialogTitle>
        </DialogHeader>
        <ColorwayForm
          {...formProps}
          onCancel={onCancel}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
