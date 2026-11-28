/** One colorway image. `url` is presigned and expires — don't cache long. */
export interface IColorwayImage {
  id: string;
  url: string;
  /** 0 = cover. */
  position: number;
}

/**
 * Colorway as returned by /colorways (list + detail).
 * Note: responses use `active`; requests and filters use `isActive`.
 */
export interface IColorway {
  id: string;
  /** Server generated, e.g. "CLR-ZW12AB". Immutable. */
  code: string;
  marketingName: string;
  name: string;
  colorSpecification: string | null;
  description: string | null;
  /** Stored uppercase, e.g. "PANTONE". */
  colorStandard: string | null;
  colorReference: string | null;
  /** "#RRGGBB", uppercase. */
  hexCode: string | null;
  active: boolean;
  inTheme: boolean;
  sustainabilityLabel: boolean;
  planSms: boolean;
  plan3dSms: boolean;
  actualSms: boolean;
  /** yyyy-MM-dd */
  startDate: string | null;
  endDate: string | null;
  clearanceDate: string | null;
  imageCount: number;
  /** Sorted by position; `images[0]` is the cover. */
  images: IColorwayImage[];
  createdAt: string;
  updatedAt: string;
}

/** POST /colorways body. */
export interface IColorwayCreatePayload {
  marketingName: string;
  name: string;
}

/**
 * PATCH /colorways/{id} body — send only changed fields.
 * Omitted/null keeps the current value. Dates can't be cleared; blank
 * marketingName/name/colorStandard is ignored by the server.
 */
export interface IColorwayUpdatePayload {
  marketingName?: string;
  name?: string;
  colorSpecification?: string;
  description?: string;
  colorStandard?: string;
  colorReference?: string;
  hexCode?: string;
  isActive?: boolean;
  inTheme?: boolean;
  sustainabilityLabel?: boolean;
  planSms?: boolean;
  plan3dSms?: boolean;
  actualSms?: boolean;
  startDate?: string;
  endDate?: string;
  clearanceDate?: string;
}

/** GET /colorways query. */
export interface IColorwayListQuery {
  search?: string;
  code?: string;
  colorStandard?: string;
  isActive?: boolean;
  inTheme?: boolean;
  /** Starts at 1. */
  page?: number;
  /** 1–100, default 20. */
  size?: number;
}

/** PUT /colorways/{id}/images/order body — every image id exactly once. */
export interface IColorwayImageOrderPayload {
  imageIds: string[];
}

/** Editable text fields (PATCH key = field name). */
export type ColorwayTextField =
  | "marketingName"
  | "name"
  | "colorSpecification"
  | "description"
  | "colorStandard"
  | "colorReference"
  | "hexCode"
  | "startDate"
  | "endDate"
  | "clearanceDate";

/** Boolean flags as named in responses (`active` → `isActive` in PATCH). */
export type ColorwayFlag =
  | "active"
  | "inTheme"
  | "sustainabilityLabel"
  | "planSms"
  | "plan3dSms"
  | "actualSms";

export const COLORWAY_STANDARDS = ["PANTONE", "RAL", "CUSTOM"] as const;

export const COLORWAY_MAX_IMAGES = 10;
export const COLORWAY_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const HEX_CODE_PATTERN = /^#[0-9A-Fa-f]{6}$/;

export const getColorwayCover = (c?: IColorway | null) =>
  c?.images?.[0]?.url ?? "";
