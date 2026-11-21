import { IRolePermissionsPayload } from "@/src/types/role";
import { ROLES_ENDPOINT } from "../../utils/roleFormData";
import { RolePermissionsFormType } from "../Schema";

export const PERMISSION_TREE_ENDPOINT = "/permissions/tree";
export const PERMISSION_TREE_QUERY_KEY = ["permissions", "tree"];

export const rolePermissionsEndpoint = (roleId: string) =>
  `${ROLES_ENDPOINT}/${roleId}/permissions`;

export const toFormValues = (): RolePermissionsFormType => ({
  permissionCodes: [],
});

/** Server trims + uppercases too; dedupe here. */
export const toPayload = (
  data: RolePermissionsFormType
): IRolePermissionsPayload => ({
  permissionCodes: Array.from(
    new Set(data.permissionCodes.map((c) => c.trim().toUpperCase()))
  ),
});

/** "PRODUCT_CLASSIFICATION" → "Product Classification" */
export const formatModule = (module: string) =>
  module
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
