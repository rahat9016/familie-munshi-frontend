import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledPositionField from "@/src/components/shared/FromController/ControlledPositionField";
import ControlledTextareaField from "@/src/components/shared/FromController/ControlledTextareaField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { CategoryFormType } from "../Schema";
import { CategoryFormProps } from "../types";
import CategoryIconField from "./CategoryIconField";

export default function CategoryForm({
  onSubmit,
  onCancel,
  levelLabel,
  parentLabel,
  parentOptions,
  isParentsLoading = false,
  suggestedPosition,
  isPositionLoading = false,
  isEditMode = false,
  error,
  isPending = false,
}: CategoryFormProps) {
  const methods = useFormContext<CategoryFormType>();
  const parent = parentLabel?.toLowerCase();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Name" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder={`Enter ${levelLabel.toLowerCase()} name`}
        />
      </div>

      <div>
        <InputLabel label="Description" required />
        <ControlledTextareaField
          className="bg-light"
          name="description"
          placeholder={`Short description of the ${levelLabel.toLowerCase()}`}
        />
      </div>

      {parentLabel && (
        <div>
          <InputLabel label={parentLabel} required />
          <ControlledSearchableSelectField
            name="parentId"
            options={parentOptions.map((o) => ({
              label: o.label,
              value: String(o.value),
            }))}
            disabled={isParentsLoading}
            placeholder={isParentsLoading ? "Loading..." : `Select ${parent}`}
            searchPlaceholder={`Search ${parent}...`}
            emptyMessage={`No ${parent} found.`}
          />
        </div>
      )}

      <CategoryIconField />

      <ControlledPositionField
        suggestedPosition={isEditMode ? undefined : suggestedPosition}
        isLoading={!isEditMode && isPositionLoading}
      />

      <div>
        <InputLabel label="Status" />
        <div className="flex items-center gap-3">
          <ControlledToggleField name="isActive" />
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
