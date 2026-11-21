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
  });

export type CategoryFormType = Yup.InferType<
  ReturnType<typeof getCategorySchema>
>;
