import { IMyProfile, IUpdateMyProfileBody } from "@/src/types/user";
import type { ProfileFormType } from "../Schema";

export const PROFILE_PICTURE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const PROFILE_PICTURE_MAX_BYTES = 2 * 1024 * 1024;

/** Profile → form defaults (picture = current URL until a new file is picked). */
export const toFormValues = (profile?: IMyProfile): ProfileFormType => ({
  firstName: profile?.firstName ?? "",
  lastName: profile?.lastName ?? "",
  phone: profile?.phone ?? "",
  profilePicture: profile?.profilePicture ?? null,
});

/** PATCH body: only changed fields; phone "" clears it; picture only when a new file was picked. */
export const toUpdatePayload = (
  original: IMyProfile,
  data: ProfileFormType
): IUpdateMyProfileBody => {
  const body: IUpdateMyProfileBody = {};
  const firstName = data.firstName.trim();
  const lastName = data.lastName.trim();
  const phone = data.phone.trim();
  if (firstName !== original.firstName) body.firstName = firstName;
  if (lastName !== original.lastName) body.lastName = lastName;
  if (phone !== (original.phone ?? "")) body.phone = phone;
  if (data.profilePicture instanceof File)
    body.profilePicture = data.profilePicture;
  return body;
};

/** multipart body for PATCH /users/me; skips undefined fields. */
export const toProfileFormData = (body: IUpdateMyProfileBody) => {
  const fd = new FormData();
  (Object.keys(body) as (keyof IUpdateMyProfileBody)[]).forEach((key) => {
    const value = body[key];
    if (value === undefined) return;
    fd.append(key, value);
  });
  return fd;
};

/** "Rahim Uddin" → "RU" (avatar fallback). */
export const getInitials = (firstName?: string, lastName?: string) =>
  [firstName, lastName]
    .map((n) => n?.trim()?.[0] ?? "")
    .join("")
    .toUpperCase() || "?";
