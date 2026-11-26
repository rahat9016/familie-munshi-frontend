import { resolveMediaUrl } from "@/src/utils/resolveMediaUrl";

/** Brand as returned by /api/v1/brands (list + detail). */
export interface IBrand {
  id: string;
  title: string;
  description?: string | null;
  logoUrl?: string | null;
  /** Display order; unique across brands. */
  position: number | null;
  active?: boolean;
  actions?: string;
}

/**
 * POST / PATCH /brands body (multipart/form-data).
 * Create: title, logo, position required. Update: send only changed fields;
 * omitted logo keeps the current one.
 */
export interface IBrandPayload {
  title?: string;
  description?: string;
  logo?: File;
  position?: number;
  isActive?: boolean;
}

export interface IBrandListQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  /** 1–100, default 20. */
  size?: number;
}

export const BRAND_LOGO_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const BRAND_LOGO_MAX_BYTES = 2 * 1024 * 1024;

export const isBrandActive = (b?: IBrand | null) => b?.active !== false;

export const getBrandLogo = (b?: IBrand | null) => resolveMediaUrl(b?.logoUrl);
