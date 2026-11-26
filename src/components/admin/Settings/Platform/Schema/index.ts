import * as Yup from "yup";

export const settingsSchema = Yup.object({
  // General
  siteName: Yup.string().required("Site name is required"),
  legalName: Yup.string().default(""),
  supportEmail: Yup.string()
    .email("Enter a valid email")
    .required("Support email is required"),
  supportPhone: Yup.string().default(""),
  logoUrl: Yup.string().default(""),
  description: Yup.string().default(""),
  maintenanceMode: Yup.boolean().default(false),

  // Store
  currency: Yup.string().required("Currency is required"),
  timezone: Yup.string().required("Timezone is required"),
  language: Yup.string().required("Language is required"),
  weightUnit: Yup.string().default("kg"),
  orderPrefix: Yup.string().default(""),
  taxRate: Yup.number()
    .typeError("Tax rate must be a number")
    .min(0, "Tax rate cannot be negative")
    .max(100, "Tax rate cannot exceed 100")
    .default(0),
  freeShippingThreshold: Yup.number()
    .typeError("Threshold must be a number")
    .min(0, "Threshold cannot be negative")
    .default(0),
  storeAddress: Yup.string().default(""),
});

export type SettingsFormValues = Yup.InferType<typeof settingsSchema>;
