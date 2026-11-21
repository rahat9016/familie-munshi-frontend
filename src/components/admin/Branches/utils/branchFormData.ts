import {
  getBranchLogo,
  IBranch,
  IBranchPayload,
  isBranchActive,
} from "@/src/types/branch";
import { BranchFormType } from "../Schema";

export const BRANCHES_QUERY_KEY = "branches";

/** multipart config for POST / PATCH /branches. */
export const MULTIPART_CONFIG = {
  headers: { "Content-Type": "multipart/form-data" },
};

/** Build multipart body; skips undefined fields so PATCH sends only changes. */
export const toBranchFormData = (payload: IBranchPayload) => {
  const fd = new FormData();
  (Object.keys(payload) as (keyof IBranchPayload)[]).forEach((key) => {
    const value = payload[key];
    if (value === undefined) return;
    fd.append(key, value instanceof File ? value : String(value));
  });
  return fd;
};

/** Entity → form defaults (create when `item` is omitted). */
export const toFormValues = (item?: IBranch): BranchFormType => ({
  name: item?.name ?? "",
  address: item?.address ?? "",
  phone: item?.phone ?? "",
  // Current URL → FileUploadController preview; replaced by a File on change.
  logo: getBranchLogo(item),
  isActive: item ? isBranchActive(item) : true,
});
