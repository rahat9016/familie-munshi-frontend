import { IRolePayload } from "@/src/types/role";
import { RoleFormType } from "../Schema";

export const ROLES_QUERY_KEY = "roles";
export const ROLES_ENDPOINT = "/system/roles";

export const roleEndpoint = (id: string) => `${ROLES_ENDPOINT}/${id}`;

/** Form defaults (create only). */
export const toFormValues = (): RoleFormType => ({
  name: "",
  description: "",
});

/** POST body; omits empty description. */
export const toCreatePayload = (data: RoleFormType): IRolePayload => {
  const payload: IRolePayload = { name: data.name.trim() };
  const description = data.description.trim();
  if (description) payload.description = description;
  return payload;
};
