import {
  COLORWAY_IMAGE_TYPES,
  COLORWAY_MAX_IMAGES,
  ColorwayFlag,
  ColorwayTextField,
  HEX_CODE_PATTERN,
  IColorway,
  IColorwayCreatePayload,
  IColorwayUpdatePayload,
} from "@/src/types/colorway";
import { ColorwayFormType } from "../Schema";

/** Root key — invalidating it refreshes the list and every detail query. */
export const COLORWAYS_QUERY_KEY = "colorways";
export const COLORWAYS_ENDPOINT = "/colorways";

export const COLORWAYS_ROUTE = "/admin/product-development/color-way";

export const colorwayEndpoint = (id: string) => `${COLORWAYS_ENDPOINT}/${id}`;
export const colorwayDetailQueryKey = (id: string) => [
  COLORWAYS_QUERY_KEY,
  "detail",
  id,
];
export const colorwayRoute = (id: string) => `${COLORWAYS_ROUTE}/${id}`;

export const colorwayImagesEndpoint = (id: string) =>
  `${colorwayEndpoint(id)}/images`;
export const colorwayImageEndpoint = (id: string, imageId: string) =>
  `${colorwayImagesEndpoint(id)}/${imageId}`;
export const colorwayImageOrderEndpoint = (id: string) =>
  `${colorwayImagesEndpoint(id)}/order`;

/** Image upload is multipart; overrides the instance's JSON default. */
export const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
};

/** Status filter values (redux `filter.sortBy`) → `isActive` query param. */
export const COLORWAY_STATUS_OPTIONS = [
  { label: "All Status", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export const toIsActiveParam = (sortBy?: string) =>
  sortBy === "active" ? true : sortBy === "inactive" ? false : undefined;

/** Create form defaults. */
export const toFormValues = (): ColorwayFormType => ({
  marketingName: "",
  name: "",
});

export const toCreatePayload = (
  data: ColorwayFormType
): IColorwayCreatePayload => ({
  marketingName: data.marketingName.trim(),
  name: data.name.trim(),
});

/** Fields the server ignores when blank — they can't be cleared. */
const NON_CLEARABLE: ColorwayTextField[] = [
  "marketingName",
  "name",
  "colorStandard",
  "startDate",
  "endDate",
  "clearanceDate",
];

export type FieldPatchResult =
  | { payload: IColorwayUpdatePayload }
  | { error: string }
  | null;

/**
 * One inline-edited text field → PATCH body.
 * `null` = nothing to send (unchanged, or blank on a non-clearable field).
 */
export const toFieldPatch = (
  item: IColorway,
  field: ColorwayTextField,
  raw: string
): FieldPatchResult => {
  let value = raw.trim();
  if (field === "colorStandard" || field === "hexCode")
    value = value.toUpperCase();

  if (value === (item[field] ?? "")) return null;
  if (!value && NON_CLEARABLE.includes(field)) return null;

  if (field === "hexCode") {
    if (!value) return { error: "Hex code can't be cleared" };
    if (!HEX_CODE_PATTERN.test(value))
      return { error: "Hex must be in #RRGGBB format" };
  }

  return { payload: { [field]: value } };
};

/** One flag toggle → PATCH body (`active` is sent as `isActive`). */
export const toFlagPatch = (
  field: ColorwayFlag,
  value: boolean
): IColorwayUpdatePayload =>
  field === "active" ? { isActive: value } : { [field]: value };

/** Client check before upload; server enforces the same rules (+ max size). */
export const validateImageFiles = (
  files: File[],
  existingCount: number
): string | null => {
  if (files.some((f) => !COLORWAY_IMAGE_TYPES.includes(f.type)))
    return "Images must be JPG, PNG or WEBP";
  if (existingCount + files.length > COLORWAY_MAX_IMAGES)
    return `A colorway holds at most ${COLORWAY_MAX_IMAGES} images`;
  return null;
};

/** POST /colorways/{id}/images body — one `images` part per file. */
export const toImagesFormData = (files: File[]) => {
  const fd = new FormData();
  files.forEach((f) => fd.append("images", f));
  return fd;
};

/** Image order with `imageId` moved to the front (new cover). */
export const toCoverOrder = (item: IColorway, imageId: string) => [
  imageId,
  ...item.images.map((img) => img.id).filter((id) => id !== imageId),
];

export const formatDateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
