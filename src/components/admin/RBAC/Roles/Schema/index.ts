import * as Yup from "yup";

export const roleSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  description: Yup.string()
    .default("")
    .max(1000, "Description must be at most 1000 characters"),
});

export type RoleFormType = Yup.InferType<typeof roleSchema>;
