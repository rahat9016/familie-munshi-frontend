import { IUserPayload } from "@/src/types/user";
import { UserFormType } from "../Schema";

export const USERS_QUERY_KEY = "users";
export const USERS_ENDPOINT = "/users";

export const userEndpoint = (id: string) => `${USERS_ENDPOINT}/${id}`;

/** Role options for "Manage roles" (all active roles, max page size 100). */
export const ROLE_OPTIONS_PARAMS = { isActive: true, page: 1, size: 100 };

/** Create User: custom roles only — system roles (isSystem=true) are skipped. */
export const CREATE_USER_ROLE_PARAMS = {
  ...ROLE_OPTIONS_PARAMS,
  isSystem: false,
};

/** Branch dropdown: paginated + server search (GET /branches). */
export const BRANCHES_ENDPOINT = "/branches";
export const BRANCH_OPTIONS_QUERY_KEY = ["branches", "options"];
export const BRANCH_OPTIONS_PARAMS = { isActive: true };

export const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
};

/** Form defaults (create only). */
export const toFormValues = (): UserFormType => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  profilePicture: null,
  isActive: true,
  roleId: "",
  assignBranch: false,
  branchId: "",
});

/** POST /users body; branchId only when "Assign to branch" is on. */
export const toCreatePayload = (data: UserFormType): IUserPayload => {
  const payload: IUserPayload = {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    password: data.password,
    isActive: data.isActive,
    roleId: data.roleId,
  };
  const phone = data.phone.trim();
  if (phone) payload.phone = phone;
  if (data.profilePicture instanceof File)
    payload.profilePicture = data.profilePicture;
  if (data.assignBranch && data.branchId) payload.branchId = data.branchId;
  return payload;
};

/** multipart body; skips undefined fields. */
export const toUserFormData = (payload: IUserPayload) => {
  const fd = new FormData();
  (Object.keys(payload) as (keyof IUserPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value === undefined) return;
    fd.append(key, value instanceof File ? value : String(value));
  });
  return fd;
};
