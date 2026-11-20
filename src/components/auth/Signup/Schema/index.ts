import * as Yup from "yup";

export const signupSchema = Yup.object({
  firstName: Yup.string().required("First name is required").min(1).max(120),
  lastName: Yup.string().required("Last name is required").min(1).max(120),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .min(5)
    .max(100),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(64),

  rePassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

export type SignupFormType = Yup.InferType<typeof signupSchema>;
