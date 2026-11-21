"use client";

import ErrorMessage from "@/src/components/shared/Errors/ErrorMessage";
import ControlledSearchableSelectField from "@/src/components/shared/FromController/ControlledSearchableSelectField";
import InputLabel from "@/src/components/shared/InputLabel";
import { Button } from "@/src/components/ui/button";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { UserRoleFormType } from "../Schema";
import { UserRoleFormProps } from "../types";

export default function UserRoleForm({
  onAssign,
  onRemove,
  onCancel,
  roleOptions,
  isRolesLoading = false,
  error,
  pendingAction = null,
}: UserRoleFormProps) {
  const methods = useFormContext<UserRoleFormType>();
  const busy = pendingAction !== null;

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full space-y-5 mt-2"
    >
      <div>
        <InputLabel label="Role" required />
        <ControlledSearchableSelectField
          name="roleId"
          options={roleOptions.map((o) => ({
            label: o.label,
            value: String(o.value),
          }))}
          disabled={isRolesLoading || busy}
          placeholder={isRolesLoading ? "Loading..." : "Select role"}
          searchPlaceholder="Search role..."
          emptyMessage="No role found."
        />
      </div>

      <ErrorMessage error={error} />

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          onClick={onCancel}
          disabled={busy}
          className="text-secondary-foreground bg-transparent hover:bg-transparent border shadow-none cursor-pointer"
        >
          Cancel
        </Button>
        {onRemove && (
          <Button
            type="button"
            disabled={busy}
            onClick={methods.handleSubmit(onRemove)}
            className="h-11 gap-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
          >
            {pendingAction === "remove" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4" />
            )}
            Remove role
          </Button>
        )}
        {onAssign && (
          <Button
            type="button"
            disabled={busy}
            onClick={methods.handleSubmit(onAssign)}
            className="h-11 gap-2 bg-primary text-white hover:bg-primary/90"
          >
            {pendingAction === "assign" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            Assign role
          </Button>
        )}
      </div>
    </form>
  );
}
