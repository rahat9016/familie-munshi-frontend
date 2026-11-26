import * as Yup from "yup";

export const profileSchema = Yup.object({
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
});

export type ProfileFormType = Yup.InferType<typeof profileSchema>;
