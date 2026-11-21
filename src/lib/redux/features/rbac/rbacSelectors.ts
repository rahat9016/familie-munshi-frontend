import { isAdminPanelScope } from "@/src/constants/auth/permissions";
import { RootState } from "../../store";
import type { Action } from "@/src/config/rbac";

export const selectRbac = (state: RootState) => state.rbac;
export const selectRbacUser = (state: RootState) => state.rbac.user;
export const selectRbacLoaded = (state: RootState) => state.rbac.loaded;

export const selectIsSuperAdmin = (state: RootState) =>
  state.rbac.user.isSuperAdmin;

export const selectCanAccessAdminPanel = (state: RootState) =>
  isAdminPanelScope(state.rbac.user.scope);

/**
 * Curried selector: can the user perform `action` on `module`?
 * e.g. selectCan("BRANCH", "CREATE"). Driven only by GET /permissions/me.
 */
export const selectCan =
  (module: string, action: Action) =>
  (state: RootState): boolean =>
    state.rbac.permissions[module.toUpperCase()]?.[action.toUpperCase()] ??
    false;

/** Curried selector by raw permission name, e.g. "ROLE_PERMISSION_MANAGE". */
export const selectHasPermission =
  (name: string) =>
  (state: RootState): boolean =>
    state.rbac.permissionNames.includes(name);

/** Curried selector: does the user hold ANY of the given permission names? */
export const selectHasAnyPermission =
  (names: string[]) =>
  (state: RootState): boolean =>
    names.length === 0 ||
    names.some((n) => state.rbac.permissionNames.includes(n));
