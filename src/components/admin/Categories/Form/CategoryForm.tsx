import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledIconSelectField from "@/src/components/shared/FromController/ControlledIconSelectField";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { CategoryFormType } from "../Schema";
import { CategoryFormProps } from "../types";

export default function CategoryForm({
  onSubmit,
  onCancel,
  levelLabel,
  parentLabel,
  parentOptions,
  isParentsLoading = false,
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

      <div>
        <InputLabel label="Icon" />
        <ControlledIconSelectField
          name="icon"
          placeholder="Select icon (optional)"
        />
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
