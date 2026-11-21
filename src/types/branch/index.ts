import { getBaseUrl } from "@/src/config/envConfig";

/** Branch as returned by /api/v1/branches. */
export interface IBranch {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  /** Logo URL. Backend may name it `logo` or `logoUrl`. */
  logo?: string | null;
  logoUrl?: string | null;
  isActive?: boolean;
  /** Some endpoints use `active` instead of `isActive`. */
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  actions?: string;
}

/** Fields accepted by POST / PATCH (sent as multipart/form-data). */
export interface IBranchPayload {
  name?: string;
  address?: string;
  phone?: string;
  logo?: File;
  isActive?: boolean;
}

export const BRANCH_LOGO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;
export const BRANCH_LOGO_MAX_BYTES = 2 * 1024 * 1024;

export const isBranchActive = (b?: IBranch | null) =>
  (b?.isActive ?? b?.active ?? true) === true;

/**
 * Logo URL. Relative paths (e.g. "/uploads/logo.png") are resolved against
 * the API origin so <img>/<Image> can load them.
 */
export const getBranchLogo = (b?: IBranch | null): string | null => {
  const raw = b?.logoUrl || b?.logo;
  if (!raw) return null;
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  try {
    return new URL(raw, new URL(getBaseUrl()).origin).toString();
  } catch {
    return raw;
  }
};
