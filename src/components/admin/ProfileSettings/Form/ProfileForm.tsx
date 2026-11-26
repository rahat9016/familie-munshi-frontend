import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Mail } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ProfileFormType } from "../Schema";
import { ProfileFormProps } from "../types";

export default function ProfileForm({
  onSubmit,
  onCancel,
  email,
  isLoading = false,
  error,
  isPending = false,
}: ProfileFormProps) {
  const methods = useFormContext<ProfileFormType>();

  if (isLoading) {
    return (
      <div className="mt-2 space-y-5">
        <Skeleton className="h-10 w-full rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-11 w-full rounded-md" />
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
        <Skeleton className="h-11 w-full rounded-md" />
      </div>
    );
  }

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      {email && (
        <div className="flex items-center gap-2 rounded-md bg-light px-3 py-2.5 text-sm text-secondary-dark">
          <Mail className="w-4 h-4 shrink-0 text-secondary-gary" />
          <span className="truncate">{email}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="First name" required />
          <ControlledInputField
            className="bg-light"
            name="firstName"
            placeholder="First name"
          />
        </div>
        <div>
          <InputLabel label="Last name" required />
          <ControlledInputField
            className="bg-light"
            name="lastName"
            placeholder="Last name"
          />
        </div>
      </div>

      <div>
        <InputLabel label="Phone" />
        <ControlledInputField
          className="bg-light"
          name="phone"
          type="tel"
          placeholder="+49 30 1234567"
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
        <SubmitButton isLoading={isPending} label="Save changes" />
      </div>
    </form>
  );
}
