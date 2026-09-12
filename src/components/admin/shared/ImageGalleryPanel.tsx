"use client";

import { ImageIcon, Star, Upload, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useImageDrop } from "@/src/hooks/useImageDrop";
import { cn } from "@/src/lib/utils";
import { IGalleryImage } from "@/src/utils/galleryImage";
import { getImages } from "@/src/utils/imageStore";

interface ImageGalleryPanelProps {
  images: IGalleryImage[];
  /** Alt text stem — the index is appended per thumbnail. */
  alt: string;
  onAdd: (files: File[]) => void | Promise<void>;
  onRemove: (index: number) => void;
  onSetPrimary: (index: number) => void;
}

/**
 * Drop-or-browse image gallery shared by the record detail pages. Thumbnails
 * come from the record itself; the full-size preview is fetched from the
 * IndexedDB image store, since it is far too large to keep in localStorage.
 */
export default function ImageGalleryPanel({
  images,
  alt,
  onAdd,
  onRemove,
  onSetPrimary,
}: ImageGalleryPanelProps) {
  // A <label> opens the picker natively, and `sr-only` keeps the input
  // rendered — WebKit ignores clicks aimed at a `display: none` input.
  const inputId = useId();
  const [selected, setSelected] = useState(0);
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const imageIds = images
    .map((image) => image.id)
    .filter(Boolean)
    .join(",");

  useEffect(() => {
    const ids = imageIds ? imageIds.split(",") : [];
    // Stale entries are harmless — lookups are by id, and a missing one falls
    // back to the thumbnail — so there is nothing to clear when the list empties.
    if (ids.length === 0) return;
    let cancelled = false;
    getImages(ids).then((loaded) => {
      if (!cancelled) setPreviews(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [imageIds]);

  const { isDragging, dropHandlers } = useImageDrop(onAdd, { multiple: true });

  // Removing an image can leave the selection past the end of the list.
  const activeIndex = Math.min(selected, Math.max(0, images.length - 1));
  const active = images[activeIndex];
  const preview = active ? previews[active.id] ?? active.thumbnail : "";

  return (
    <div
      {...dropHandlers}
      className={cn(
        "space-y-3 rounded-lg border border-dashed bg-white p-3 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-light-dark"
      )}
    >
      <label
        htmlFor={inputId}
        className="group relative flex h-64 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-light"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={alt} className="h-full w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-center text-sm text-secondary-gary">
            <ImageIcon className="size-6" />
            Drop Image Here
            <span className="text-xs">
              or click to browse — multiple files welcome
            </span>
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100">
          <Upload className="size-5 text-white" />
        </span>
      </label>

      {/* Index 0 is the thumbnail the list table renders. */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div
              key={image.id || `legacy-${index}`}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-md border",
                index === activeIndex
                  ? "border-primary ring-1 ring-primary"
                  : "border-light-dark"
              )}
            >
              <button
                type="button"
                onClick={() => setSelected(index)}
                title={index === 0 ? "Primary image" : "Preview image"}
                className="size-full cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.thumbnail}
                  alt={`${alt} ${index + 1}`}
                  className="size-full object-cover"
                />
              </button>

              {index === 0 ? (
                <span className="absolute bottom-0 inset-x-0 bg-primary/90 py-0.5 text-center text-[10px] font-semibold text-white">
                  Primary
                </span>
              ) : (
                <button
                  type="button"
                  title="Make primary"
                  onClick={() => {
                    onSetPrimary(index);
                    setSelected(0);
                  }}
                  className="absolute bottom-1 left-1 cursor-pointer rounded bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100"
                >
                  <Star className="size-3" />
                </button>
              )}

              <button
                type="button"
                title="Remove image"
                onClick={() => {
                  onRemove(index);
                  setSelected(0);
                }}
                className="absolute right-1 top-1 cursor-pointer rounded bg-black/60 p-1 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        htmlFor={inputId}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md border border-light-dark px-3 py-1.5 text-sm font-semibold text-secondary-dark transition-colors hover:border-primary hover:text-primary"
      >
        <Upload className="size-4" />
        Add Images
      </label>

      <input
        id={inputId}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        // Clearing `value` drops the FileList, so it waits for the read.
        onChange={async (e) => {
          const input = e.currentTarget;
          await onAdd(Array.from(input.files ?? []));
          input.value = "";
        }}
      />
    </div>
  );
}
