import * as Yup from "yup";

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .min(5)
    .max(100),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64),
});

export type LoginFormType = Yup.InferType<typeof loginSchema>;
