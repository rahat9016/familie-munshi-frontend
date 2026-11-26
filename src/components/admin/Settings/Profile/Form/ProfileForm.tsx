"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Lock, UserRound } from "lucide-react";
import { useFormContext } from "react-hook-form";
import SettingsSection from "../../SettingsSection";
import { ProfileFormType } from "../Schema";
import { ProfileFormProps } from "../types";
import ProfilePictureField from "./ProfilePictureField";

export default function ProfileForm({
  onSubmit,
  onReset,
  email,
  initials,
  error,
  isPending = false,
}: ProfileFormProps) {
  const methods = useFormContext<ProfileFormType>();
  const { isDirty } = methods.formState;

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <SettingsSection
        title="Personal information"
        description="Your name, photo and contact number across the admin panel."
        icon={UserRound}
      >
        <div className="space-y-5">
          <ProfilePictureField initials={initials} />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputLabel label="Email" />
              <div
                className="flex h-11 items-center gap-2 rounded-md border border-light-silver bg-light px-3 text-sm text-secondary-gary"
                title="Email cannot be changed"
              >
                <span className="truncate flex-1">{email || "—"}</span>
                <Lock className="w-3.5 h-3.5 shrink-0" />
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
          </div>

          <ErrorMessage error={error} />

          <div className="flex items-center justify-end gap-3 border-t border-light-dark pt-4">
            <Button
              type="button"
              onClick={onReset}
              disabled={isPending || !isDirty}
              className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
            >
              Reset
            </Button>
            <SubmitButton isLoading={isPending} label="Save changes" />
          </div>
        </div>
      </SettingsSection>
    </form>
  );
}
