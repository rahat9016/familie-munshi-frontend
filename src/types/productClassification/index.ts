export enum ProductClassificationLevel {
  GROUP = "GROUP",
  PARENT_CATEGORY = "PARENT_CATEGORY",
  CATEGORY = "CATEGORY",
  SEGMENT = "SEGMENT",
  SUB_CATEGORY = "SUB_CATEGORY",
}

export const PRODUCT_CLASSIFICATION_LEVEL_LABEL: Record<
  ProductClassificationLevel,
  string
> = {
  [ProductClassificationLevel.GROUP]: "Group",
  [ProductClassificationLevel.PARENT_CATEGORY]: "Parent Category",
  [ProductClassificationLevel.CATEGORY]: "Category",
  [ProductClassificationLevel.SEGMENT]: "Segment",
  [ProductClassificationLevel.SUB_CATEGORY]: "Sub Category",
};

/** Level directly above each level (GROUP has none). */
export const PRODUCT_CLASSIFICATION_PARENT_LEVEL: Record<
  ProductClassificationLevel,
  ProductClassificationLevel | null
> = {
  [ProductClassificationLevel.GROUP]: null,
  [ProductClassificationLevel.PARENT_CATEGORY]:
    ProductClassificationLevel.GROUP,
  [ProductClassificationLevel.CATEGORY]:
    ProductClassificationLevel.PARENT_CATEGORY,
  [ProductClassificationLevel.SEGMENT]: ProductClassificationLevel.CATEGORY,
  [ProductClassificationLevel.SUB_CATEGORY]: ProductClassificationLevel.SEGMENT,
};

export interface IProductClassification {
  id: string;
  code: string;
  name: string;
  level: ProductClassificationLevel;
  icon: string | null;
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

export interface ICreateProductClassificationBody {
  name: string;
  level: ProductClassificationLevel;
  /** Omit for GROUP; required for every other level. */
  parentId?: string;
  /** Plain string (icon name or URL). Omit when empty. */
  icon?: string;
  /** Display order among siblings. */
  position: number;
}

/** PATCH body — every field optional; send only what changed. */
export interface IUpdateProductClassificationBody {
  name?: string;
  parentId?: string;
  /** `""` clears the icon; omit to keep it. */
  icon?: string;
  level?: ProductClassificationLevel;
  position?: number;
}

/** Node of GET /product-classifications/tree/{rootId} (recursive). */
export interface IProductClassificationTreeNode {
  id: string;
  name: string;
  icon: string | null;
  children: IProductClassificationTreeNode[];
}
