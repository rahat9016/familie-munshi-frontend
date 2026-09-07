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

export const materialClassSchema = Yup.object({
  materialType: Yup.string().required("Material Type is required"),
  name: Yup.string().trim().required("Material Class is required"),
});

export type MaterialClassFormSchemaValues = Yup.InferType<
  typeof materialClassSchema
>;

/** Sub class form also carries `materialType` — UI-only, used to narrow the
 *  parent class list — while only `classId` and `name` are persisted. */
export const materialSubClassSchema = Yup.object({
  materialType: Yup.string().required("Material Type is required"),
  classId: Yup.string().required("Parent Material Class is required"),
  name: Yup.string().trim().required("Material Sub Class is required"),
});

export type MaterialSubClassFormSchemaValues = Yup.InferType<
  typeof materialSubClassSchema
>;
