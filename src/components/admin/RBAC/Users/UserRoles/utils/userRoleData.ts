import { UserRoleFormType } from "../Schema";

/** POST /system/users/{userId}/roles */
export const userRolesEndpoint = (userId: string) =>
  `/system/users/${userId}/roles`;

/** DELETE /system/users/{userId}/roles/{roleId} */
export const userRoleEndpoint = (userId: string, roleId: string) =>
  `${userRolesEndpoint(userId)}/${roleId}`;

export const toFormValues = (): UserRoleFormType => ({ roleId: "" });
