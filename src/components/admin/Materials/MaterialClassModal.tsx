"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, useForm } from "react-hook-form";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import { materialClassSchema } from "./Schema/materialSchema";
import { IMaterialClass, MaterialClassFormValues } from "./types";

const emptyValues: MaterialClassFormValues = {
  materialType: "",
  name: "",
};

interface MaterialClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterialClass | null;
  onSubmit: (values: MaterialClassFormValues) => void;
}

export default function MaterialClassModal({
  isOpen,
  onClose,
  initial,
  onSubmit,
}: MaterialClassModalProps) {
  // Remounted by the caller on every open (see its `key`), so the default
  // values are always in sync with `initial` — no reset effect needed.
  const methods = useForm<MaterialClassFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(materialClassSchema) as any,
    defaultValues: initial
      ? { materialType: initial.materialType, name: initial.name }
      : emptyValues,
  });

  const { handleSubmit } = methods;

  const submit = (values: MaterialClassFormValues) => {
    onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material Class" : "Create Material Class"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div>
              <InputLabel label="Material Type" required />
              <ControlledSearchableSelectField
                name="materialType"
                options={MATERIAL_TYPES}
                placeholder="Select Material Type"
                searchPlaceholder="Search material type..."
              />
            </div>

            <div>
              <InputLabel label="Material Class" required />
              <ControlledInputField
                name="name"
                placeholder="e.g. Woven"
                className="h-11"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-11 border-light-dark"
              >
                Cancel
              </Button>
              <SubmitButton
                label={initial ? "Update" : "Create"}
                className="h-11"
              />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
