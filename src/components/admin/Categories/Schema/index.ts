import { CLASSIFICATION_ICONS } from "@/src/constants/ecommerce/classificationIcons";
import * as Yup from "yup";

const ICON_VALUES = ["", ...CLASSIFICATION_ICONS.map((i) => i.value)];

/** Parent is required for every level except GROUP. */
export const getCategorySchema = (requiresParent: boolean) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .max(150, "Name must be at most 150 characters"),
    parentId: requiresParent
      ? Yup.string().required("Parent is required")
      : Yup.string().default(""),
    icon: Yup.string()
      .default("")
      .max(100, "Icon must be at most 100 characters")
      .oneOf(ICON_VALUES, "Select an icon from the list"),
    position: Yup.number()
      // Empty input → undefined so `required` fires instead of typeError.
      .transform((value, original) => (original === "" ? undefined : value))
      .typeError("Position must be a number")
      .required("Position is required")
      .integer("Position must be a whole number")
      .min(1, "Position must be at least 1"),
  });

export type CategoryFormType = Yup.InferType<
  ReturnType<typeof getCategorySchema>
>;
