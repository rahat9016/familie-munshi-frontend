"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Camera, Undo2 } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ProfileFormType } from "../Schema";
import { ProfilePictureFieldProps } from "../types";
import { PROFILE_PICTURE_TYPES } from "../utils/profileFormData";

/** Avatar preview + "Change photo". Value: current URL or a newly picked File. */
export default function ProfilePictureField({
  initials,
}: ProfilePictureFieldProps) {
  const { control, setValue, resetField, formState } =
    useFormContext<ProfileFormType>();
  const value = useWatch({ control, name: "profilePicture" });
  const inputRef = useRef<HTMLInputElement>(null);

  const fileUrl = useMemo(
    () => (value instanceof File ? URL.createObjectURL(value) : null),
    [value]
  );
  useEffect(
    () => () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    },
    [fileUrl]
  );

  const src = fileUrl ?? (typeof value === "string" ? value : undefined);
  const error = formState.errors.profilePicture?.message;

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-picking the same file
    if (file)
      setValue("profilePicture", file, {
        shouldDirty: true,
        shouldValidate: true,
      });
  };

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-20 border border-light-dark">
        {src && (
          <AvatarImage
            src={src}
            alt="Profile picture"
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-light text-lg font-semibold text-secondary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="space-y-1.5">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="w-4 h-4" />
            Change photo
          </Button>
          {value instanceof File && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => resetField("profilePicture")}
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </Button>
          )}
        </div>
        <p className="text-xs text-secondary-gary">
          JPG, PNG or WEBP · max 2MB
        </p>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <input
          ref={inputRef}
          type="file"
          accept={PROFILE_PICTURE_TYPES.join(",")}
          className="hidden"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}
