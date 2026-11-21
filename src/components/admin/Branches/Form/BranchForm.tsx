import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { BranchFormType } from "../Schema";
import { BRANCH_LOGO_TYPES } from "@/src/types/branch";
import { BranchFormProps } from "../types";

export default function BranchForm({
  onSubmit,
  onCancel,
  isEditMode = false,
  error,
  isPending = false,
}: BranchFormProps) {
  const methods = useFormContext<BranchFormType>();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Logo" />
        <FileUploadController
          name="logo"
          label="Upload logo (JPG, PNG, WEBP · max 2MB)"
          accept={[...BRANCH_LOGO_TYPES]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Name" required />
          <ControlledInputField
            className="bg-light"
            name="name"
            placeholder="Familie Munshi Berlin"
          />
        </div>
        <div>
          <InputLabel label="Phone" />
          <ControlledInputField
            className="bg-light"
            name="phone"
            placeholder="+49 30 1234567"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Address" />
        <ControlledInputField
          className="bg-light"
          name="address"
          placeholder="Street, postcode, city"
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
