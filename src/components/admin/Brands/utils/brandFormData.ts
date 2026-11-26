import { axiosInstance } from "@/src/helpers/axios/axiosInstance";
import {
  getBrandLogo,
  IBrand,
  IBrandPayload,
  isBrandActive,
} from "@/src/types/brand";
import { IListMeta } from "@/src/types/common/common";
import type { BrandFormType } from "../Schema";

/** Root key — invalidating it refreshes list, detail and position lookups. */
export const BRANDS_QUERY_KEY = "brands";
export const BRANDS_ENDPOINT = "/brands";
export const brandEndpoint = (id: string) => `${BRANDS_ENDPOINT}/${id}`;

export const NEXT_POSITION_QUERY_KEY = [BRANDS_QUERY_KEY, "next-position"];
/** API max page size; safety cap on pages walked (100 × 50 = 5000 brands). */
const POSITION_PAGE_SIZE = 100;
const POSITION_MAX_PAGES = 50;

export const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
};

/** Entity → form defaults (create when `item` is omitted). */
export const toFormValues = (
  item?: IBrand,
  suggestedPosition = 1
): BrandFormType => ({
  title: item?.title ?? "",
  description: item?.description ?? "",
  // Current URL → FileUploadController preview; replaced by a File on change.
  logo: getBrandLogo(item),
  position: item?.position ?? suggestedPosition,
  isActive: item ? isBrandActive(item) : true,
});

/** Highest position in a list (0 when none). */
export const getMaxBrandPosition = (brands: IBrand[]) =>
  brands.reduce((max, b) => Math.max(max, b.position ?? 0), 0);

/**
 * Auto-increment source: walks every page of GET /brands (active and
 * inactive) and returns highest position + 1, so the suggestion is right
 * regardless of list order or brand count.
 */
export const fetchNextBrandPosition = async (): Promise<number> => {
  let max = 0;
  for (let page = 1; page <= POSITION_MAX_PAGES; page++) {
    // axiosInstance unwraps the envelope to { data, meta }.
    const res = (await axiosInstance.get(BRANDS_ENDPOINT, {
      params: { page, size: POSITION_PAGE_SIZE },
    })) as unknown as { data?: IBrand[]; meta?: IListMeta };
    max = Math.max(max, getMaxBrandPosition(res.data ?? []));
    if (page >= (res.meta?.lastPage ?? 1)) break;
  }
  return max + 1;
};

/** POST body: title, logo, position required; empty description omitted. */
export const toCreatePayload = (data: BrandFormType): IBrandPayload => {
  const payload: IBrandPayload = {
    title: data.title.trim(),
    position: data.position,
    isActive: data.isActive,
  };
  const description = data.description.trim();
  if (description) payload.description = description;
  if (data.logo instanceof File) payload.logo = data.logo;
  return payload;
};

/** PATCH body: only changed fields; logo only when a new file was picked. */
export const toUpdatePayload = (
  original: IBrand,
  data: BrandFormType
): IBrandPayload => {
  const payload: IBrandPayload = {};
  const title = data.title.trim();
  const description = data.description.trim();
  if (title !== original.title) payload.title = title;
  if (description !== (original.description ?? ""))
    payload.description = description;
  if (data.logo instanceof File) payload.logo = data.logo;
  if (data.position !== original.position) payload.position = data.position;
  if (data.isActive !== isBrandActive(original))
    payload.isActive = data.isActive;
  return payload;
};

/** multipart body; skips undefined fields so PATCH sends only changes. */
export const toBrandFormData = (payload: IBrandPayload) => {
  const fd = new FormData();
  (Object.keys(payload) as (keyof IBrandPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value === undefined) return;
    fd.append(key, value instanceof File ? value : String(value));
  });
  return fd;
};
