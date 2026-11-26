import * as Yup from "yup";
import {
  PROFILE_PICTURE_MAX_BYTES,
  PROFILE_PICTURE_TYPES,
} from "../utils/profileFormData";

export const profileSchema = Yup.object({
  /** Read-only — shown in the form, never sent (API can't change email). */
  email: Yup.string().default(""),
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .max(120, "First name must be at most 120 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .max(120, "Last name must be at most 120 characters"),
  phone: Yup.string()
    .trim()
    .default("")
    .max(20, "Phone must be at most 20 characters"),
  /** Current URL (string) or a newly picked File. */
  profilePicture: Yup.mixed<File | string>()
    .nullable()
    .default(null)
    .test("type", "Picture must be JPG, PNG or WEBP", (value) =>
      value instanceof File ? PROFILE_PICTURE_TYPES.includes(value.type) : true
    )
    .test("size", "Picture must be 2MB or smaller", (value) =>
      value instanceof File ? value.size <= PROFILE_PICTURE_MAX_BYTES : true
    ),
});

export type ProfileFormType = Yup.InferType<typeof profileSchema>;
