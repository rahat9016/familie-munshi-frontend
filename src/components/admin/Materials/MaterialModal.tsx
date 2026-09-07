"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ControlledCheckField } from "@/src/components/shared/FromController/ControlledCheckField";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
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
import { Input } from "@/src/components/ui/input";
import { MATERIAL_TYPES } from "./data/materialHierarchy";
import { materialSchema } from "./Schema/materialSchema";
import { IMaterial, MaterialFormValues } from "./types";

const emptyValues: MaterialFormValues = {
  material: "",
  materialType: "",
  materialClass: "",
  materialSubClass: "",
  materialDescription: "",
  isSustainable: false,
};

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initial?: IMaterial | null;
  /** Class / sub class names come from the live taxonomy, not a static map. */
  getClassOptions: (materialType: string) => string[];
  getSubClassOptions: (materialType: string, materialClass: string) => string[];
  /** Code the new material would receive for the currently selected type, e.g. "ADD-ONS-0001". */
  getNextCode: (materialType: string) => string;
  onSubmit: (values: MaterialFormValues) => void;
}

export default function MaterialModal({
  isOpen,
  onClose,
  initial,
  getClassOptions,
  getSubClassOptions,
  getNextCode,
  onSubmit,
}: MaterialModalProps) {
  // Remounted by the caller on every open (see its `key`), so the default
  // values are always in sync with `initial` — no reset effect needed.
  const methods = useForm<MaterialFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(materialSchema) as any,
    defaultValues: initial
      ? {
          material: initial.material,
          materialType: initial.materialType,
          materialClass: initial.materialClass,
          materialSubClass: initial.materialSubClass,
          materialDescription: initial.materialDescription,
          isSustainable: initial.isSustainable,
        }
      : emptyValues,
  });

  const { control, handleSubmit, setValue } = methods;
  const materialType = useWatch({ control, name: "materialType" });
  const materialClass = useWatch({ control, name: "materialClass" });

  const classOptions = useMemo(
    () => getClassOptions(materialType),
    [getClassOptions, materialType]
  );
  const subClassOptions = useMemo(
    () => getSubClassOptions(materialType, materialClass),
    [getSubClassOptions, materialType, materialClass]
  );

  const submit = (values: MaterialFormValues) => {
    onSubmit({
      ...values,
      material: values.material.trim(),
      materialDescription: values.materialDescription.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-secondary-dark">
            {initial ? "Edit Material" : "Create Material"}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(submit)} className="space-y-4">
            <div>
              <InputLabel label="Code" />
              <Input
                value={initial ? initial.code : getNextCode(materialType)}
                disabled
                placeholder="Select Material Type to generate"
                className="h-11 bg-light text-secondary-gary"
              />
            </div>

            <div>
              <InputLabel label="Material Type" required />
              <ControlledSearchableSelectField
                name="materialType"
                options={MATERIAL_TYPES}
                placeholder="Select Material Type"
                searchPlaceholder="Search material type..."
                // Changing a parent invalidates everything below it.
                onChanged={() => {
                  setValue("materialClass", "");
                  setValue("materialSubClass", "");
                }}
              />
            </div>

            <div>
              <InputLabel label="Material Class" required />
              <ControlledSearchableSelectField
                name="materialClass"
                options={classOptions}
                disabled={!materialType}
                placeholder="Select Material Class"
                searchPlaceholder="Search material class..."
                onChanged={() => setValue("materialSubClass", "")}
              />
            </div>

            <div>
              <InputLabel label="Material Sub Class" required />
              <ControlledSearchableSelectField
                name="materialSubClass"
                options={subClassOptions}
                disabled={!materialClass}
                placeholder="Select Material Sub Class"
                searchPlaceholder="Search material sub class..."
              />
            </div>

            <div>
              <InputLabel label="Material" required />
              <ControlledInputField
                name="material"
                placeholder="e.g. 100% Cotton Poplin 120gsm"
                className="h-11"
              />
            </div>

            <div>
              <InputLabel label="Material Description" />
              <ControlledTextareaField
                name="materialDescription"
                placeholder="Short description"
                className="h-20"
              />
            </div>

            <ControlledCheckField name="isSustainable" label="Sustainable" />

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
