interface ResizeOptions {
  /** Longest edge of the output, in px. Images smaller than this are never
   *  upscaled — blowing a 300px file up to 1920 only adds blur and bytes. */
  maxEdge: number;
  /** JPEG quality, 0-1. Ignored when the output keeps its alpha channel. */
  quality: number;
}

/** The table cell renders ~40px, so 160 stays sharp on retina for a few KB. */
const THUMBNAIL: ResizeOptions = { maxEdge: 160, quality: 0.72 };

/** Full-page preview — 1920 covers a 4K display's detail panel at 2x. */
const PREVIEW: ResizeOptions = { maxEdge: 1920, quality: 0.92 };

/** Formats whose transparency must survive — re-encoding these to JPEG paints
 *  a white box behind cut-out product shots and logo labels. */
const ALPHA_TYPES = ["image/png", "image/webp", "image/gif", "image/avif"];

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Could not read the image file"));
    reader.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onerror = () => reject(new Error("Could not decode the image file"));
    img.onload = () => resolve(img);
    img.src = src;
  });

/** Resize in halving steps. Canvas' one-shot downscale of a 4000px photo to
 *  160px drops most source pixels and looks aliased; halving resamples them. */
const drawScaled = (
  source: CanvasImageSource,
  fromWidth: number,
  fromHeight: number,
  toWidth: number,
  toHeight: number,
  transparent: boolean
) => {
  let canvas = document.createElement("canvas");
  let width = fromWidth;
  let height = fromHeight;
  let current: CanvasImageSource = source;

  for (;;) {
    const nextWidth = Math.max(toWidth, Math.round(width / 2));
    const nextHeight = Math.max(toHeight, Math.round(height / 2));
    const done = nextWidth <= toWidth && nextHeight <= toHeight;

    const step = document.createElement("canvas");
    step.width = done ? toWidth : nextWidth;
    step.height = done ? toHeight : nextHeight;

    const ctx = step.getContext("2d");
    if (!ctx) throw new Error("Could not process the image file");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (!transparent) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, step.width, step.height);
    }
    ctx.drawImage(current, 0, 0, step.width, step.height);

    canvas = step;
    current = step;
    width = step.width;
    height = step.height;
    if (done) return canvas;
  }
};

const resize = async (file: File, { maxEdge, quality }: ResizeOptions) => {
  const img = await loadImage(await readAsDataUrl(file));
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));
  const transparent = ALPHA_TYPES.includes(file.type);

  const canvas = drawScaled(img, img.width, img.height, width, height, transparent);
  return transparent
    ? canvas.toDataURL("image/png")
    : canvas.toDataURL("image/jpeg", quality);
};

/** Small data URL kept inline in the record — used by list table cells. */
export const fileToThumbnail = (file: File) => resize(file, THUMBNAIL);

/** Full-size data URL for detail pages. Too large for localStorage — persist
 *  it with `imageStore`, which uses IndexedDB. */
export const fileToPreview = (file: File) => resize(file, PREVIEW);
