import {
  ClassificationIconType,
  IProductClassification,
  IProductClassificationPayload,
  ProductClassificationLevel,
} from "@/src/types/productClassification";
import { CategoryFormType } from "../Schema";

/** Root key — invalidating it refreshes every list and by-level option set. */
export const CATEGORIES_QUERY_KEY = "product-classifications";
export const CATEGORIES_ENDPOINT = "/product-classifications";

export const categoryEndpoint = (id: string) => `${CATEGORIES_ENDPOINT}/${id}`;

export const byLevelEndpoint = (level: ProductClassificationLevel | null) =>
  `${CATEGORIES_ENDPOINT}/by-level/${level}`;

export const byLevelQueryKey = (level: ProductClassificationLevel | null) => [
  CATEGORIES_QUERY_KEY,
  "by-level",
  level ?? "none",
];

/** POST / PATCH are multipart; overrides the instance's JSON default. */
export const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
};

/** `accept` list for the icon file input. */
export const ICON_ACCEPT = [
  "image/svg+xml",
  "image/png",
  "image/webp",
  "image/jpeg",
  ".svg",
  ".png",
  ".webp",
  ".jpg",
  ".jpeg",
];

/** Entity → form defaults (create when `item` is omitted). */
export const toFormValues = (
  item?: IProductClassification
): CategoryFormType => {
  const isFile = item?.iconType === ClassificationIconType.FILE;
  return {
    name: item?.name ?? "",
    description: item?.description ?? "",
    parentId: item?.parentId ?? "",
    iconSource: isFile
      ? ClassificationIconType.FILE
      : ClassificationIconType.LUCIDE,
    icon: !isFile ? (item?.icon ?? "") : "",
    // Current URL → FileUploadController preview; replaced by a File on change.
    iconFile: isFile ? (item?.iconUrl ?? null) : null,
    position: item?.position ?? 1,
    // Create starts inactive; activate once the row is set up.
    isActive: item?.active ?? false,
  };
};

/**
 * Next free position among siblings: highest existing position + 1 (1 when
 * none). Siblings = same parent; pass no `parentId` to use the whole level
 * (GROUP, or before a parent is picked).
 */
export const getNextPosition = (
  items: IProductClassification[],
  parentId?: string | null
): number => {
  const siblings = parentId
    ? items.filter((item) => item.parentId === parentId)
    : items;
  return (
    siblings.reduce((max, item) => Math.max(max, item.position ?? 0), 0) + 1
  );
};

/** POST body: omit parentId for GROUP; at most one icon source. */
export const toCreatePayload = (
  data: CategoryFormType,
  level: ProductClassificationLevel,
  requiresParent: boolean
): IProductClassificationPayload => {
  const body: IProductClassificationPayload = {
    name: data.name.trim(),
    level,
    position: data.position,
    isActive: data.isActive,
  };
  body.description = data.description.trim();
  if (requiresParent && data.parentId) body.parentId = data.parentId;
  if (data.iconSource === ClassificationIconType.FILE) {
    if (data.iconFile instanceof File) body.iconFile = data.iconFile;
  } else {
    const icon = data.icon.trim();
    if (icon) body.icon = icon;
  }
  return body;
};

/**
 * Icon change for PATCH: nothing (unchanged), `icon` (lucide name, or ""
 * to remove) or `iconFile` (new upload) — never both.
 */
const iconChange = (
  original: IProductClassification,
  data: CategoryFormType
): Pick<IProductClassificationPayload, "icon" | "iconFile"> => {
  const hadIcon =
    (original.iconType === ClassificationIconType.FILE && !!original.iconUrl) ||
    (original.iconType === ClassificationIconType.LUCIDE && !!original.icon);

  if (data.iconSource === ClassificationIconType.FILE) {
    if (data.iconFile instanceof File) return { iconFile: data.iconFile };
    // Still showing the current uploaded file → unchanged.
    if (
      typeof data.iconFile === "string" &&
      original.iconType === ClassificationIconType.FILE
    )
      return {};
    // No file picked: remove whatever icon existed.
    return hadIcon ? { icon: "" } : {};
  }

  const icon = data.icon.trim();
  if (!icon) return hadIcon ? { icon: "" } : {};
  if (original.iconType === ClassificationIconType.LUCIDE && icon === original.icon)
    return {};
  return { icon };
};

/** PATCH body: only changed fields. */
export const toUpdatePayload = (
  original: IProductClassification,
  data: CategoryFormType,
  requiresParent: boolean
): IProductClassificationPayload => {
  const body: IProductClassificationPayload = {};
  const name = data.name.trim();
  if (name !== original.name) body.name = name;
  const description = data.description.trim();
  if (description !== (original.description ?? ""))
    body.description = description;
  if (requiresParent && data.parentId && data.parentId !== original.parentId)
    body.parentId = data.parentId;
  if (data.position !== original.position) body.position = data.position;
  if (data.isActive !== original.active) body.isActive = data.isActive;
  return { ...body, ...iconChange(original, data) };
};

/** First word of a description, for telling same-named options apart. */
export const firstWord = (text?: string | null) =>
  text?.trim().split(/\s+/)[0] ?? "";

/** Parent option label: "Name · Firstword" (just the name when no description). */
export const toParentOptionLabel = (item: IProductClassification) => {
  const word = firstWord(item.description);
  return word ? `${item.name} · ${word}` : item.name;
};

/** multipart body; skips undefined fields so PATCH sends only changes. */
export const toCategoryFormData = (payload: IProductClassificationPayload) => {
  const fd = new FormData();
  (Object.keys(payload) as (keyof IProductClassificationPayload)[]).forEach(
    (key) => {
      const value = payload[key];
      if (value === undefined) return;
      fd.append(key, value instanceof File ? value : String(value));
    }
  );
  return fd;
};
