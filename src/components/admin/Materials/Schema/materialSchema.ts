import * as Yup from "yup";

export const materialSchema = Yup.object({
  materialType: Yup.string().required("Material Type is required"),
  materialClass: Yup.string().required("Material Class is required"),
  materialSubClass: Yup.string().required("Material Sub Class is required"),
  material: Yup.string().trim().required("Material is required"),
  materialDescription: Yup.string().trim().default(""),
  isSustainable: Yup.boolean().default(false),
});

export type MaterialFormSchemaValues = Yup.InferType<typeof materialSchema>;
