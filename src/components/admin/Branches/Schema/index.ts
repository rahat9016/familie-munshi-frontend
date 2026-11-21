import { BRANCH_LOGO_MAX_BYTES, BRANCH_LOGO_TYPES } from "@/src/types/branch";
import * as Yup from "yup";

export const branchSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .max(255, "Name must be at most 255 characters"),
  address: Yup.string().default(""),
  phone: Yup.string()
    .trim()
    .default("")
    .max(20, "Phone must be at most 20 characters"),
  /** File = new upload; string = current logo URL (edit); null = none. */
  logo: Yup.mixed<File | string>()
    .nullable()
    .default(null)
    .test("type", "Logo must be JPG, PNG or WEBP", (value) =>
      value instanceof File
        ? (BRANCH_LOGO_TYPES as readonly string[]).includes(value.type)
        : true
    )
    .test("size", "Logo must be 2MB or smaller", (value) =>
      value instanceof File ? value.size <= BRANCH_LOGO_MAX_BYTES : true
    ),
  isActive: Yup.boolean().default(true),
});

export type BranchFormType = Yup.InferType<typeof branchSchema>;
