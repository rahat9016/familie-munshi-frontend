import type { Action, PermissionMap } from "@/src/config/rbac";

export interface RbacUserInfo {
  id: string;
  isSuperAdmin: boolean;
  roleName: string | null;
  branchId: string | null;
  /** PLATFORM | BRANCH | ... (from GET /permissions/me) */
  scope: string | null;
  roles: string[];
}

export interface IRbacState {
  loaded: boolean;
  user: RbacUserInfo;
  // O(1) lookup: permissions[MODULE][ACTION] === true
  // e.g. permissions.BRANCH.CREATE, permissions.PERMISSION.ROLE_PERMISSION_MANAGE
  permissions: PermissionMap;
  // Raw permission names, e.g. ["BRANCH_CREATE", "USER_READ"]
  permissionNames: string[];
}

export type { Action, PermissionMap };
