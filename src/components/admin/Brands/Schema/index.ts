import { BRAND_LOGO_MAX_BYTES, BRAND_LOGO_TYPES } from "@/src/types/brand";
import * as Yup from "yup";

export const brandSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .max(150, "Title must be at most 150 characters"),
  description: Yup.string().default(""),
  /**
   * File = new upload; string = current logo URL (edit). Required: create
   * needs a file, and the API cannot remove an existing logo.
   */
  logo: Yup.mixed<File | string>()
    .nullable()
    .default(null)
    .test("required", "Logo is required", (value) => !!value)
    .test("type", "Logo must be JPG, PNG or WEBP", (value) =>
      value instanceof File ? BRAND_LOGO_TYPES.includes(value.type) : true
    )
    .test("size", "Logo must be 2MB or smaller", (value) =>
      value instanceof File ? value.size <= BRAND_LOGO_MAX_BYTES : true
    ),
  position: Yup.number()
    // Empty input → undefined so `required` fires instead of typeError.
    .transform((value, original) => (original === "" ? undefined : value))
    .typeError("Position must be a number")
    .required("Position is required")
    .integer("Position must be a whole number")
    .min(1, "Position must be at least 1"),
  isActive: Yup.boolean().default(true),
});

export type BrandFormType = Yup.InferType<typeof brandSchema>;
