import * as Yup from "yup";

export const branchSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  contact: Yup.string().default(""),
  country: Yup.string().default(""),
  city: Yup.string().default(""),
  area: Yup.string().default(""),
  address: Yup.string().default(""),
  isActive: Yup.boolean().default(true),
});

export type BranchFormValues = Yup.InferType<typeof branchSchema>;
