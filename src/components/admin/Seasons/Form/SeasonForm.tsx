import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSelectField from "@/src/components/shared/FromController/ControlledSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { SeasonFormType } from "../Schema";
import { SeasonFormProps } from "../types";
import { SEASON_STATUS_OPTIONS } from "../utils/seasonFormData";

export default function SeasonForm({
  onSubmit,
  onCancel,
  isEditMode = false,
  error,
  isPending = false,
}: SeasonFormProps) {
  const methods = useFormContext<SeasonFormType>();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Season Name" required />
        <ControlledInputField
          className="bg-light"
          name="season"
          placeholder="e.g. AW26"
        />
      </div>

      <div>
        <InputLabel label="Status" required />
        <ControlledSelectField
          name="status"
          options={SEASON_STATUS_OPTIONS}
          placeholder="Select status"
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
          label={isEditMode ? "Update" : "Create"}
          isLoading={isPending}
        />
      </div>
    </form>
  );
}
