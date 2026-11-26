import { getBaseUrl } from "@/src/config/envConfig";

/**
 * Absolute URL for backend media. Relative paths (e.g. "/uploads/logo.png")
 * are resolved against the API origin so <img>/<Image> can load them.
 */
export const resolveMediaUrl = (raw?: string | null): string | null => {
  if (!raw) return null;
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  try {
    return new URL(raw, new URL(getBaseUrl()).origin).toString();
  } catch {
    return raw;
  }
};
