/** Permission as returned by /api/v1/permissions. */
export interface IPermission {
  id: string;
  /** Permission code, e.g. "BRANCH_CREATE". */
  name: string;
  module: string;
  description?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  actions?: string;
}

/** GET /api/v1/permissions/tree item. */
export interface IPermissionTreeGroup {
  module: string;
  permissions: Pick<IPermission, "id" | "name" | "description">[];
}
