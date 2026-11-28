/** Hierarchy order (top → bottom). Enum order = display/sort order. */
export enum ProductClassificationLevel {
  GROUP = "GROUP",
  PARENT_CATEGORY = "PARENT_CATEGORY",
  SEGMENT = "SEGMENT",
  CATEGORY = "CATEGORY",
  SUB_CATEGORY = "SUB_CATEGORY",
}

export const PRODUCT_CLASSIFICATION_LEVELS = Object.values(
  ProductClassificationLevel
);

export const PRODUCT_CLASSIFICATION_LEVEL_LABEL: Record<
  ProductClassificationLevel,
  string
> = {
  [ProductClassificationLevel.GROUP]: "Group",
  [ProductClassificationLevel.PARENT_CATEGORY]: "Parent Category",
  [ProductClassificationLevel.SEGMENT]: "Segment",
  [ProductClassificationLevel.CATEGORY]: "Category",
  [ProductClassificationLevel.SUB_CATEGORY]: "Sub Category",
};

/** Levels a row of each level may hang under (GROUP has none). */
export const PRODUCT_CLASSIFICATION_ALLOWED_PARENT_LEVELS: Record<
  ProductClassificationLevel,
  ProductClassificationLevel[]
> = {
  [ProductClassificationLevel.GROUP]: [],
  [ProductClassificationLevel.PARENT_CATEGORY]: [
    ProductClassificationLevel.GROUP,
  ],
  [ProductClassificationLevel.SEGMENT]: [
    ProductClassificationLevel.PARENT_CATEGORY,
  ],
  [ProductClassificationLevel.CATEGORY]: [ProductClassificationLevel.SEGMENT],
  [ProductClassificationLevel.SUB_CATEGORY]: [
    ProductClassificationLevel.CATEGORY,
  ],
};

/** Label for the parent field/column (e.g. "Segment"); null for GROUP. */
export const getParentLevelLabel = (
  level: ProductClassificationLevel
): string | null => {
  const parents = PRODUCT_CLASSIFICATION_ALLOWED_PARENT_LEVELS[level];
  return parents.length
    ? parents.map((p) => PRODUCT_CLASSIFICATION_LEVEL_LABEL[p]).join(" / ")
    : null;
};

export enum ClassificationIconType {
  FILE = "FILE",
  LUCIDE = "LUCIDE",
}

/** Uploaded icon limits (mirror backend). */
export const CLASSIFICATION_ICON_MAX_BYTES = 512 * 1024;
export const CLASSIFICATION_ICON_TYPES = [
  "image/svg+xml",
  "image/png",
  "image/webp",
  "image/jpeg",
];
/** kebab-case (`shopping-cart`) or PascalCase (`ShoppingCart`), ≤ 100 chars. */
export const LUCIDE_ICON_NAME = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*|[A-Z][A-Za-z0-9]*)$/;

/** Fields needed to render a classification icon. */
export interface IClassificationIconSource {
  iconType: ClassificationIconType | null;
  /** Lucide name; only when iconType = LUCIDE. */
  icon: string | null;
  /** Presigned S3 URL (expires after 7 days); only when iconType = FILE. */
  iconUrl: string | null;
}

export interface IProductClassification extends IClassificationIconSource {
  id: string;
  code: string;
  name: string;
  description: string | null;
  level: ProductClassificationLevel;
  active: boolean;
  parentId: string | null;
  parentName: string | null;
  /** Display order among siblings. */
  position: number | null;
  actions?: string;
}

export interface IProductClassificationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  totalRecords: number;
}

export interface IProductClassificationQuery {
  level: ProductClassificationLevel;
  search?: string;
  page?: number;
  size?: number;
}

/**
 * multipart body for POST / and PATCH /{id}. PATCH: send only what changed.
 * Send `icon` OR `iconFile`, never both (400). `icon: ""` on PATCH removes it.
 */
export interface IProductClassificationPayload {
  name?: string;
  /** `""` on PATCH clears it. */
  description?: string;
  level?: ProductClassificationLevel;
  /** Omit for GROUP; required on create for every other level. */
  parentId?: string;
  position?: number;
  /** Defaults to true on create. */
  isActive?: boolean;
  icon?: string;
  iconFile?: File;
}

/** Node of GET /product-classifications/tree/{rootId} (recursive). */
export interface IProductClassificationTreeNode
  extends IClassificationIconSource {
  id: string;
  name: string;
  description: string | null;
  position: number;
  children: IProductClassificationTreeNode[];
}
