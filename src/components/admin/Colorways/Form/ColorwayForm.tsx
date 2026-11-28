import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { useFormContext } from "react-hook-form";
import { ColorwayFormType } from "../Schema";
import { ColorwayFormProps } from "../types";

export default function ColorwayForm({
  onSubmit,
  onCancel,
  error,
  isPending = false,
}: ColorwayFormProps) {
  const methods = useFormContext<ColorwayFormType>();

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-4 mt-2"
    >
      <div>
        <InputLabel label="Color Marketing Name" required />
        <ControlledInputField
          className="bg-light"
          name="marketingName"
          placeholder="e.g. Midnight Navy"
        />
      </div>

      <div>
        <InputLabel label="Colorway" required />
        <ControlledInputField
          className="bg-light"
          name="name"
          placeholder="e.g. Navy/White"
        />
      </div>

      <ErrorMessage error={error} />

      <div className="flex items-center justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        <SubmitButton label="Save" isLoading={isPending} />
      </div>
    </form>
  );
}
