import {
  CLASSIFICATION_ICON_MAX_BYTES,
  CLASSIFICATION_ICON_TYPES,
  ClassificationIconType,
  LUCIDE_ICON_NAME,
} from "@/src/types/productClassification";
import * as Yup from "yup";

/** Parent is required for every level except GROUP. */
export const getCategorySchema = (requiresParent: boolean) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .max(150, "Name must be at most 150 characters"),
    description: Yup.string()
      .trim()
      .required("Description is required")
      .max(500, "Description must be at most 500 characters"),
    parentId: requiresParent
      ? Yup.string().required("Parent is required")
      : Yup.string().default(""),
    /** Which icon input is shown; only that one is sent. */
    iconSource: Yup.mixed<ClassificationIconType>()
      .oneOf(Object.values(ClassificationIconType))
      .default(ClassificationIconType.LUCIDE)
      .required(),
    /** Lucide name (iconSource = LUCIDE). Empty = no icon. */
    icon: Yup.string()
      .default("")
      .test(
        "lucide-name",
        "Invalid lucide-react icon name",
        (value) =>
          !value || (value.length <= 100 && LUCIDE_ICON_NAME.test(value))
      ),
    /**
     * Uploaded icon (iconSource = FILE). File = new upload; string = current
     * iconUrl (edit, unchanged); null = none / removed.
     */
    iconFile: Yup.mixed<File | string>()
      .nullable()
      .default(null)
      .test("type", "Icon must be SVG, PNG, WEBP or JPG.", (value) =>
        value instanceof File
          ? CLASSIFICATION_ICON_TYPES.includes(value.type)
          : true
      )
      .test("size", "Icon file cannot exceed 512 KB.", (value) =>
        value instanceof File
          ? value.size <= CLASSIFICATION_ICON_MAX_BYTES
          : true
      )
      .test("empty", "Icon file cannot be empty.", (value) =>
        value instanceof File ? value.size > 0 : true
      ),
    position: Yup.number()
      // Empty input → undefined so `required` fires instead of typeError.
      .transform((value, original) => (original === "" ? undefined : value))
      .typeError("Position must be a number")
      .required("Position is required")
      .integer("Position must be a whole number")
      .min(1, "Position must be at least 1"),
    isActive: Yup.boolean().default(false),
  });

export type CategoryFormType = Yup.InferType<
  ReturnType<typeof getCategorySchema>
>;
