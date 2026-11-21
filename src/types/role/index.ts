export type RoleScope = "PLATFORM" | "BRANCH" | string;

/** Role as returned by /api/v1/system/roles (list + detail). */
export interface IRole {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  /** true = built-in system role, false = custom role. */
  isSystem: boolean;
  scope?: RoleScope | null;
  branch?: { id: string; name: string } | null;
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}

/** POST /system/roles body. */
export interface IRolePayload {
  name: string;
  description?: string;
}

/** POST /system/roles/{id}/permissions body (1–100 codes). */
export interface IRolePermissionsPayload {
  permissionCodes: string[];
}

/** Branch roles require a branchId when assigned to a new user. */
export const isBranchRole = (role?: IRole | null) => role?.scope === "BRANCH";
