/** Max edge (px) of the stored thumbnail. The table cell renders ~40px, so
 *  160 stays sharp on retina while keeping the data URL a few KB. */
const MAX_EDGE = 160;
const QUALITY = 0.7;

/**
 * Read an image file and return a downscaled JPEG data URL.
 *
 * Full-resolution `readAsDataURL` output is megabytes per image, which
 * overflows the localStorage quota once a few rows have one.
 */
export const fileToThumbnail = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Could not read the image file"));
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("Could not decode the image file"));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process the image file"));
          return;
        }
        // JPEG has no alpha — paint white so transparent PNGs don't go black.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", QUALITY));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
