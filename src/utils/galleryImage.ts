import { putImage } from "./imageStore";
import { fileToPreview, fileToThumbnail } from "./imageThumbnail";

export interface IGalleryImage {
  /** Key of the full-size preview in the IndexedDB image store. */
  id: string;
  /** Small inline data URL — what list table cells render. */
  thumbnail: string;
}

const createImageId = () =>
  `IMG-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase()}`;

/**
 * Turn an uploaded file into the two sizes a gallery needs: a thumbnail small
 * enough to live inline in the record, and a full-size preview parked in
 * IndexedDB so detail pages can show it sharp.
 */
export const prepareGalleryImage = async (
  file: File
): Promise<IGalleryImage> => {
  const [thumbnail, preview] = await Promise.all([
    fileToThumbnail(file),
    fileToPreview(file),
  ]);
  const id = createImageId();
  await putImage(id, preview);
  return { id, thumbnail };
};

export const prepareGalleryImages = (files: File[]) =>
  Promise.all(files.map(prepareGalleryImage));

/** Records saved before galleries existed carry a single `image` data URL, and
 *  the first gallery version stored plain strings — fold both into the current
 *  `{ id, thumbnail }` shape. */
export const normalizeGalleryImages = (
  images: unknown,
  legacyImage?: string
): IGalleryImage[] => {
  if (Array.isArray(images)) {
    return images
      .map((entry) =>
        typeof entry === "string"
          ? { id: "", thumbnail: entry }
          : entry && typeof entry.thumbnail === "string"
          ? { id: String(entry.id ?? ""), thumbnail: entry.thumbnail }
          : null
      )
      .filter((entry): entry is IGalleryImage => entry !== null);
  }
  return legacyImage ? [{ id: "", thumbnail: legacyImage }] : [];
};
