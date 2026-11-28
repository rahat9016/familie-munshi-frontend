import * as Yup from "yup";

/** Create form — the server fills in everything else. */
export const colorwaySchema = Yup.object({
  marketingName: Yup.string()
    .trim()
    .required("Color marketing name is required")
    .max(150, "Color marketing name must be at most 150 characters"),
  name: Yup.string()
    .trim()
    .required("Colorway is required")
    .max(150, "Colorway must be at most 150 characters"),
});

export type ColorwayFormType = Yup.InferType<typeof colorwaySchema>;
