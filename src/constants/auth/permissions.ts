/** Scopes returned by GET /permissions/me that grant admin-panel access. */
export const ADMIN_PANEL_SCOPES = ["PLATFORM", "BRANCH"] as const;

/** Role that bypasses every permission check in the UI. */
export const SUPER_ADMIN_ROLE = "SYS_SUPER_ADMIN";

/**
 * Permission modules as returned by the backend (`permissions[].module`).
 * Menu items / route guards reference these keys. Modules the backend does
 * not expose yet (PRODUCT, ORDER, ...) are only visible to the super admin.
 */
export const PERMISSION_MODULE = {
  BRANCH: "BRANCH",
  USER: "USER",
  ROLE: "ROLE",
  PERMISSION: "PERMISSION",
  PRODUCT: "PRODUCT",
  ORDER: "ORDER",
  CUSTOMER: "CUSTOMER",
  ACTION: "ACTION",
} as const;

export const isAdminPanelScope = (scope?: string | null): boolean =>
  !!scope &&
  (ADMIN_PANEL_SCOPES as readonly string[]).includes(scope.toUpperCase());
