import { BRANCH_LOGO_MAX_BYTES } from "@/src/types/branch";
import * as Yup from "yup";

const PICTURE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

/** `branchId` is required only when "Assign to branch" is on. */
export const userSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .max(120, "First name must be at most 120 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .max(120, "Last name must be at most 120 characters"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email")
    .max(150, "Email must be at most 150 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(255, "Password must be at most 255 characters"),
  phone: Yup.string()
    .trim()
    .default("")
    .max(20, "Phone must be at most 20 characters"),
  profilePicture: Yup.mixed<File | string>()
    .nullable()
    .default(null)
    .test("type", "Picture must be JPG, PNG or WEBP", (value) =>
      value instanceof File ? PICTURE_TYPES.includes(value.type) : true
    )
    .test("size", "Picture must be 2MB or smaller", (value) =>
      value instanceof File ? value.size <= BRANCH_LOGO_MAX_BYTES : true
    ),
  isActive: Yup.boolean().default(true),
  roleId: Yup.string().required("Role is required"),
  assignBranch: Yup.boolean().default(false),
  branchId: Yup.string()
    .default("")
    .when("assignBranch", {
      is: true,
      then: (s) => s.required("Select a branch"),
    }),
});

export type UserFormType = Yup.InferType<typeof userSchema>;
