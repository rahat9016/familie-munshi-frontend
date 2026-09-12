import { useImageDrop } from "@/src/hooks/useImageDrop";
import { ProfilePictureSectionProps } from "@/src/types/account/account.types";
import { Camera, User } from "lucide-react";
import Image from "next/image";
import { Controller, useFormContext } from "react-hook-form";
import { ProfileFormValues } from "../Schema/profileSchema";

export default function ProfilePictureSection({
  firstName,
  lastName,
  email,
  initialProfilePicture,
}: ProfilePictureSectionProps) {
  const { control, setValue, watch } = useFormContext<ProfileFormValues>();
  const profilePicture = watch("profilePicture");

  const { isDragging, dropHandlers } = useImageDrop((files) =>
    setValue("profilePicture", files[0], { shouldDirty: true })
  );

  const currentPreview =
    profilePicture instanceof File
      ? URL.createObjectURL(profilePicture)
      : typeof profilePicture === "string"
        ? profilePicture
        : initialProfilePicture;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-light-silver p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div
            {...dropHandlers}
            className={`relative group rounded-full ${
              isDragging ? "ring-4 ring-primary" : ""
            }`}
            title="Drop an image here to change the picture"
          >
            {currentPreview ? (
              <Image
                src={currentPreview}
                alt={firstName || "Profile"}
                width={120}
                height={120}
                className="w-30 h-30 rounded-full object-cover ring-4 ring-primary/20"
              />
            ) : (
              <div className="w-30 h-30 rounded-full bg-linear-to-br from-primary/10 to-primary/20 flex items-center justify-center ring-4 ring-primary/10">
                <User size={48} className="text-primary" />
              </div>
            )}
            <label
              htmlFor="profilePictureFile"
              className={`absolute inset-0 rounded-full bg-black/40 flex items-center justify-center transition-opacity cursor-pointer group-hover:opacity-100 ${
                isDragging ? "opacity-100" : "opacity-0"
              }`}
            >
              <Camera size={28} className="text-white" />
            </label>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{email}</p>

            <Controller
              name="profilePicture"
              control={control}
              render={({ field }) => (
                <input
                  id="profilePictureFile"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      field.onChange(file);
                    }
                  }}
                />
              )}
            />

            <button
              type="button"
              onClick={() =>
                document.getElementById("profilePictureFile")?.click()
              }
              className="text-sm font-medium text-primary hover:underline cursor-pointer"
            >
              Change Profile Picture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
