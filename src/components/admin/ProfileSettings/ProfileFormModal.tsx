"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import ProfileForm from "./Form/ProfileForm";
import { ProfileFormModalProps } from "./types";

/** Profile settings dialog. Must render inside the container's FormProvider. */
export default function ProfileFormModal({
  isOpen,
  onCancel,
  isPending = false,
  ...formProps
}: ProfileFormModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isPending && onCancel()}
    >
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary text-xl font-semibold">
            Profile settings
          </DialogTitle>
        </DialogHeader>
        <ProfileForm {...formProps} onCancel={onCancel} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}
