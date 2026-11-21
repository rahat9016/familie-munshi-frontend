import {
  ICreateProductClassificationBody,
  IProductClassification,
  IUpdateProductClassificationBody,
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

/** Entity → form defaults (create when `item` is omitted). */
export const toFormValues = (
  item?: IProductClassification
): CategoryFormType => ({
  name: item?.name ?? "",
  parentId: item?.parentId ?? "",
  icon: item?.icon ?? "",
});

/** POST body: omit parentId for GROUP, omit empty icon. */
export const toCreatePayload = (
  data: CategoryFormType,
  level: ProductClassificationLevel,
  requiresParent: boolean
): ICreateProductClassificationBody => {
  const body: ICreateProductClassificationBody = {
    name: data.name.trim(),
    level,
  };
  if (requiresParent && data.parentId) body.parentId = data.parentId;
  const icon = data.icon.trim();
  if (icon) body.icon = icon;
  return body;
};

/** PATCH body: only changed fields; icon "" clears it. */
export const toUpdatePayload = (
  original: IProductClassification,
  data: CategoryFormType,
  requiresParent: boolean
): IUpdateProductClassificationBody => {
  const body: IUpdateProductClassificationBody = {};
  const name = data.name.trim();
  if (name !== original.name) body.name = name;
  if (requiresParent && data.parentId && data.parentId !== original.parentId)
    body.parentId = data.parentId;
  const icon = data.icon.trim();
  if (icon !== (original.icon ?? "")) body.icon = icon;
  return body;
};
