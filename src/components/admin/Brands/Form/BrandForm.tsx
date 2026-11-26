import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledPositionField from "@/src/components/shared/FromController/ControlledPositionField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { BRAND_LOGO_TYPES } from "@/src/types/brand";
import { useFormContext } from "react-hook-form";
import { BrandFormType } from "../Schema";
import { BrandFormProps } from "../types";

export default function BrandForm({
  onSubmit,
  onCancel,
  isEditMode = false,
  suggestedPosition,
  isPositionLoading = false,
  error,
  isPending = false,
}: BrandFormProps) {
  const methods = useFormContext<BrandFormType>();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Logo" required />
        <FileUploadController
          name="logo"
          label="Upload logo (JPG, PNG, WEBP · max 2MB)"
          accept={BRAND_LOGO_TYPES}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <InputLabel label="Title" required />
          <ControlledInputField
            className="bg-light"
            name="title"
            placeholder="Nike"
          />
        </div>
        <ControlledPositionField
          suggestedPosition={isEditMode ? undefined : suggestedPosition}
          isLoading={!isEditMode && isPositionLoading}
          helperText="Must be unique"
        />
      </div>

      <div>
        <InputLabel label="Description" />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder="Short description of the brand"
        />
      </div>

      <div>
        <InputLabel label="Status" />
        <div className="flex items-center gap-3">
          <ControlledToggleField name="isActive" defaultChecked />
          <span className="text-sm text-secondary-gary">Active / Inactive</span>
        </div>
      </div>

      <ErrorMessage error={error} />

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton
          isLoading={isPending}
          label={isEditMode ? "Update" : "Create"}
        />
      </div>
    </form>
  );
}
