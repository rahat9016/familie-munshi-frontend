/** Scopes returned by GET /permissions/me that grant admin-panel access. */
export const ADMIN_PANEL_SCOPES = ["PLATFORM", "BRANCH"] as const;

/** Role that bypasses every permission check in the UI. */
export const SUPER_ADMIN_ROLE = "SYS_SUPER_ADMIN";

/**
 * Permission names as returned by GET /permissions/me
 * (`permissions[].permissions[].name`). Menu items and admin routes are
 * gated by these — nothing is hardcoded per role.
 */
export const PERMISSION = {
  BRANCH_LIST: "BRANCH_LIST",
  BRANCH_READ: "BRANCH_READ",
  BRANCH_CREATE: "BRANCH_CREATE",
  BRANCH_UPDATE: "BRANCH_UPDATE",
  BRANCH_DELETE: "BRANCH_DELETE",

  ROLE_READ: "ROLE_READ",
  ROLE_CREATE: "ROLE_CREATE",
  ROLE_UPDATE: "ROLE_UPDATE",
  ROLE_DELETE: "ROLE_DELETE",

  USER_READ: "USER_READ",
  USER_CREATE: "USER_CREATE",
  USER_UPDATE: "USER_UPDATE",
  USER_DELETE: "USER_DELETE",
  USER_ROLE_ASSIGN: "USER_ROLE_ASSIGN",
  USER_ROLE_REMOVE: "USER_ROLE_REMOVE",
  USER_ROLE_MANAGE: "USER_ROLE_MANAGE",

  PERMISSION_READ: "PERMISSION_READ",
  ROLE_PERMISSION_MANAGE: "ROLE_PERMISSION_MANAGE",

  PRODUCT_CLASSIFICATION_VIEW: "PRODUCT_CLASSIFICATION_VIEW",
  PRODUCT_CLASSIFICATION_CREATE: "PRODUCT_CLASSIFICATION_CREATE",
  PRODUCT_CLASSIFICATION_UPDATE: "PRODUCT_CLASSIFICATION_UPDATE",
  PRODUCT_CLASSIFICATION_DELETE: "PRODUCT_CLASSIFICATION_DELETE",
} as const;

/** Backend permission modules (`permissions[].module`). */
export const PERMISSION_MODULE = {
  BRANCH: "BRANCH",
  USER: "USER",
  ROLE: "ROLE",
  PERMISSION: "PERMISSION",
  PRODUCT_CLASSIFICATION: "PRODUCT_CLASSIFICATION",
} as const;

export const isAdminPanelScope = (scope?: string | null): boolean =>
  !!scope &&
  (ADMIN_PANEL_SCOPES as readonly string[]).includes(scope.toUpperCase());
