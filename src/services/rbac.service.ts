import type { PermissionMap } from "@/src/config/rbac";
import { SUPER_ADMIN_ROLE } from "@/src/constants/auth/permissions";
import { axiosInstance } from "@/src/helpers/axios/axiosInstance";
import type { IRbacState } from "@/src/lib/redux/features/rbac/rbacTypes";

export interface ApiPermission {
  id: string;
  name: string;
  description: string;
}

export interface ApiModulePermissions {
  module: string;
  permissions: ApiPermission[];
}

export interface MyPermissionsResponse {
  userId: string;
  scope: string;
  roles: string[];
  branchId?: string | null;
  permissions: ApiModulePermissions[];
}

export const RBAC_QUERY_KEY = ["rbac-permissions"];

/** GET /permissions/me — the logged-in user's scope, roles and permissions. */
export async function fetchMyPermissions(): Promise<MyPermissionsResponse> {
  // axios interceptor unwraps the `{ success, message, data }` envelope.
  const response = await axiosInstance.get("/permissions/me");
  return response.data as MyPermissionsResponse;
}

/**
 * "BRANCH_CREATE" in module "BRANCH" → action "CREATE".
 * Names without the module prefix (e.g. "ROLE_PERMISSION_MANAGE" in module
 * "PERMISSION") keep their full name as the action key.
 */
function toActionKey(module: string, name: string): string {
  const prefix = `${module}_`;
  return name.startsWith(prefix) ? name.slice(prefix.length) : name;
}

/** Normalize the API payload into the redux `rbac` slice shape. */
export function toRbacState(
  me: MyPermissionsResponse
): Omit<IRbacState, "loaded"> {
  const permissions: PermissionMap = {};
  const permissionNames: string[] = [];

  for (const group of me.permissions ?? []) {
    const moduleKey = group.module.toUpperCase();
    permissions[moduleKey] = permissions[moduleKey] ?? {};
    for (const p of group.permissions ?? []) {
      permissions[moduleKey][toActionKey(moduleKey, p.name)] = true;
      permissionNames.push(p.name);
    }
  }

  const roles = me.roles ?? [];

  return {
    user: {
      id: me.userId,
      isSuperAdmin: roles.includes(SUPER_ADMIN_ROLE),
      roleName: roles[0] ?? null,
      branchId: me.branchId ?? null,
      scope: me.scope ?? null,
      roles,
    },
    permissions,
    permissionNames,
  };
}
