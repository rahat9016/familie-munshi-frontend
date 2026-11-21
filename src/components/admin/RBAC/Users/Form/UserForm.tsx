import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import { FileUploadController } from "@/src/components/shared/FromController/FileUploadController";
import ControlledPaginatedSelectField from "@/src/components/shared/FromController/ControlledPaginatedSelectField";
import ControlledInputField from "@/src/components/shared/FromController/ControlledInputField";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import ControlledToggleField from "@/src/components/shared/FromController/ControlledToggleField";
import InputLabel from "@/src/components/shared/InputLabel";
import SubmitButton from "@/src/components/shared/SubmitButton";
import { Button } from "@/src/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { IBranch } from "@/src/types/branch";
import { UserFormType } from "../Schema";
import { UserFormProps } from "../types";
import {
  BRANCH_OPTIONS_PARAMS,
  BRANCH_OPTIONS_QUERY_KEY,
  BRANCHES_ENDPOINT,
} from "../utils/userFormData";

const toBranchOption = (b: IBranch) => ({ value: b.id, label: b.name });

const toSelect = (options: UserFormProps["roleOptions"]) =>
  options.map((o) => ({ label: o.label, value: String(o.value) }));

export default function UserForm({
  onSubmit,
  onCancel,
  roleOptions,
  isRolesLoading = false,
  assignBranch = false,
  error,
  isPending = false,
}: UserFormProps) {
  const methods = useFormContext<UserFormType>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Profile picture" />
        <FileUploadController
          name="profilePicture"
          label="Upload picture (JPG, PNG, WEBP · max 2MB)"
          accept={["image/jpeg", "image/jpg", "image/png", "image/webp"]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="First name" required />
          <ControlledInputField
            className="bg-light"
            name="firstName"
            placeholder="Rahim"
          />
        </div>
        <div>
          <InputLabel label="Last name" required />
          <ControlledInputField
            className="bg-light"
            name="lastName"
            placeholder="Uddin"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <InputLabel label="Email" required />
          <ControlledInputField
            className="bg-light"
            name="email"
            type="email"
            placeholder="rahim@example.com"
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
        <InputLabel label="Password" required />
        <div className="relative">
          <ControlledInputField
            className="bg-light pr-10"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="6–255 characters"
          />
          <Button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-1 right-1 flex items-center text-black bg-transparent hover:bg-transparent shadow-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </Button>
        </div>
      </div>

      {/* Toggle on → Branch first, Role (branch roles only) below it.
          Toggle off → Role only (non-branch roles), full width. */}
      <div className="space-y-4">
        {/* Same height as inputs (h-11); leading-none keeps the toggle centred. */}
        <div className="flex h-11 items-center justify-between gap-3 rounded-lg border border-light-dark bg-light px-4">
          <span className="text-sm font-medium text-secondary">
            Assign to branch
          </span>
          <div className="flex items-center leading-none">
            <ControlledToggleField name="assignBranch" />
          </div>
        </div>

        {assignBranch && (
          <div>
            <InputLabel label="Branch" required />
            <ControlledPaginatedSelectField<IBranch>
              name="branchId"
              endpoint={BRANCHES_ENDPOINT}
              queryKey={BRANCH_OPTIONS_QUERY_KEY}
              params={BRANCH_OPTIONS_PARAMS}
              getOption={toBranchOption}
              placeholder="Select branch"
              searchPlaceholder="Search branch..."
              emptyMessage="No branch found."
            />
          </div>
        )}

        <div>
          <InputLabel label={assignBranch ? "Branch role" : "Role"} required />
          <ControlledSearchableSelectField
            name="roleId"
            options={toSelect(roleOptions)}
            disabled={isRolesLoading}
            placeholder={
              isRolesLoading
                ? "Loading..."
                : assignBranch
                  ? "Select branch role"
                  : "Select role"
            }
            searchPlaceholder="Search role..."
            emptyMessage={
              assignBranch ? "No branch role found." : "No role found."
            }
          />
        </div>
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
        <SubmitButton isLoading={isPending} label="Create" />
      </div>
    </form>
  );
}
