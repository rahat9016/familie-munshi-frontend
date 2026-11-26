/** User as returned by /api/v1/users (list + detail). */
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  active?: boolean;
  /** Not returned yet; accepted on create. */
  phone?: string | null;
  profilePicture?: string | null;
  actions?: string;
}

/** POST /users body (sent as multipart/form-data). */
export interface IUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  profilePicture?: File;
  isActive?: boolean;
  roleId: string;
  /** Required when the role's scope is BRANCH. */
  branchId?: string;
}

export const isUserActive = (u?: IUser | null) => u?.active !== false;

export const getUserFullName = (u?: IUser | null) =>
  [u?.firstName, u?.lastName].filter(Boolean).join(" ") || "—";

/** Current user's profile endpoint (GET; PATCH for self-update). */
export const USERS_ME_ENDPOINT = "/users/me";
/** Shared by UserFetcher and Profile settings so an update refreshes both. */
export const USERS_ME_QUERY_KEY = ["users-me"];

/** GET /users/me response `data`. */
export interface IMyProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  active: boolean;
}

/** PATCH /users/me body — send only changed fields; phone "" clears it. */
export interface IUpdateMyProfileBody {
  firstName?: string;
  lastName?: string;
  phone?: string;
}
