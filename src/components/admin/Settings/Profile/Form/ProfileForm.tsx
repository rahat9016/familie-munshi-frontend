"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { UserRound } from "lucide-react";
import { useFormContext } from "react-hook-form";
import SettingsSection from "../../SettingsSection";
import { ProfileFormType } from "../Schema";
import { ProfileFormProps } from "../types";
import { PROFILE_PICTURE_TYPES } from "../utils/profileFormData";

export default function ProfileForm({
  onSubmit,
  onReset,
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
          <div>
            <InputLabel label="Profile picture" />
            <FileUploadController
              name="profilePicture"
              label="Upload picture (JPG, PNG, WEBP · max 2MB)"
              accept={PROFILE_PICTURE_TYPES}
              imgClassName="object-cover"
            />
          </div>

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
              {/* Read-only: the API doesn't allow changing email. */}
              <ControlledInputField
                className="bg-light"
                name="email"
                type="email"
                disabled
              />
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
