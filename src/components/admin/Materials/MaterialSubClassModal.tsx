"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
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
import { materialSubClassSchema } from "./Schema/materialSchema";
import { IMaterialClass, IMaterialSubClass, MaterialSubClassFormValues } from "./types";

/** `materialType` is UI-only — it narrows the parent class list — while only
 *  `classId` and `name` get persisted. */
type SubClassFormValues = MaterialSubClassFormValues & { materialType: string };

const emptyValues: SubClassFormValues = {
  materialType: "",
  classId: "",
  name: "",
};

interface MaterialSubClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterialSubClass | null;
  classes: IMaterialClass[];
  onSubmit: (values: MaterialSubClassFormValues) => void;
}

export default function MaterialSubClassModal({
  isOpen,
  onClose,
  initial,
  classes,
  onSubmit,
}: MaterialSubClassModalProps) {
  // Remounted by the caller on every open (see its `key`), so the default
  // values are always in sync with `initial` — no reset effect needed.
  const methods = useForm<SubClassFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(materialSubClassSchema) as any,
    defaultValues: initial
      ? {
          materialType:
            classes.find((c) => c.id === initial.classId)?.materialType ?? "",
          classId: initial.classId,
          name: initial.name,
        }
      : emptyValues,
  });

  const { control, handleSubmit, setValue } = methods;
  const materialType = useWatch({ control, name: "materialType" });

  const parentOptions = useMemo(
    () => classes.filter((c) => c.materialType === materialType),
    [classes, materialType]
  );

  const submit = ({ materialType: _materialType, ...values }: SubClassFormValues) => {
    onSubmit({ ...values, name: values.name.trim() });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material Sub Class" : "Create Material Sub Class"}
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
                onChanged={() => setValue("classId", "")}
              />
            </div>

            <div>
              <InputLabel label="Parent Material Class" required />
              <ControlledSearchableSelectField
                name="classId"
                options={parentOptions.map((cls) => ({
                  value: cls.id,
                  label: cls.name,
                }))}
                disabled={!materialType}
                placeholder={
                  materialType
                    ? "Select Parent Class"
                    : "Select a Material Type first"
                }
                searchPlaceholder="Search parent class..."
                emptyMessage={`No class under ${materialType}. Create one first.`}
              />
            </div>

            <div>
              <InputLabel label="Material Sub Class" required />
              <ControlledInputField
                name="name"
                placeholder="e.g. Cotton Woven"
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
