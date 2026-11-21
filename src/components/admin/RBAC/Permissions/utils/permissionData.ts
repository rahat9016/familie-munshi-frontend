export const PERMISSIONS_QUERY_KEY = "permissions";
export const PERMISSIONS_ENDPOINT = "/permissions";
export const PERMISSION_TREE_ENDPOINT = "/permissions/tree";

export const permissionEndpoint = (id: string) =>
  `${PERMISSIONS_ENDPOINT}/${id}`;

/** Radix Select can't use "" as an item value. */
export const ALL_MODULES = "__ALL__";

/** "PRODUCT_CLASSIFICATION" → "Product Classification" */
export const formatModule = (module: string) =>
  module
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
