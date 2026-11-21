import { CLASSIFICATION_ICONS } from "@/src/constants/ecommerce/classificationIcons";
import * as yup from "yup";

export interface ClassificationFormValues {
  name: string;
  icon?: string;
  parentId?: string;
}

const ICON_VALUES = ["", ...CLASSIFICATION_ICONS.map((i) => i.value)];

export const getClassificationSchema = (requiresParent: boolean) =>
  yup.object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .max(150, "Name must be at most 150 characters"),
    icon: yup
      .string()
      .optional()
      .max(100, "Icon must be at most 100 characters")
      .oneOf(ICON_VALUES, "Select an icon from the list"),
    parentId: requiresParent
      ? yup.string().required("Parent is required")
      : yup.string().optional(),
  });
