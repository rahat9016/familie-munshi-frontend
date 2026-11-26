import { IMyProfile, IUpdateMyProfileBody } from "@/src/types/user";
import { ProfileFormType } from "../Schema";

/** Profile → form defaults. */
export const toFormValues = (profile?: IMyProfile): ProfileFormType => ({
  firstName: profile?.firstName ?? "",
  lastName: profile?.lastName ?? "",
  phone: profile?.phone ?? "",
});

/** PATCH body: only changed fields; phone "" clears it. */
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
  return body;
};
