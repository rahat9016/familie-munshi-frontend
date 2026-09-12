"use client";

import { useCallback, useRef, useState } from "react";

interface UseImageDropOptions {
  /** Accept every dropped image; otherwise only the first is handed over. */
  multiple?: boolean;
  /** Skip drop handling entirely (e.g. a read-only view). */
  disabled?: boolean;
}

/**
 * Drag-and-drop image intake for any upload surface.
 *
 * Spread `dropHandlers` onto the element that should accept the drop and use
 * `isDragging` for the hover styling. Non-image files are ignored, so dropping
 * a PDF on a picture slot is a no-op instead of a broken preview.
 */
export function useImageDrop(
  onFiles: (files: File[]) => void,
  { multiple = false, disabled = false }: UseImageDropOptions = {}
) {
  const [isDragging, setIsDragging] = useState(false);
  // Dragging over a child fires dragleave on the parent — count enter/leave
  // pairs so the highlight does not flicker.
  const depth = useRef(0);

  const reset = useCallback(() => {
    depth.current = 0;
    setIsDragging(false);
  }, []);

  const onDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      depth.current += 1;
      setIsDragging(true);
    },
    [disabled]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      // Without this the browser navigates to the dropped file.
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    },
    [disabled]
  );

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setIsDragging(false);
    },
    [disabled]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      reset();

      const images = Array.from(e.dataTransfer.files ?? []).filter((file) =>
        file.type.startsWith("image/")
      );
      if (images.length === 0) return;
      onFiles(multiple ? images : images.slice(0, 1));
    },
    [disabled, multiple, onFiles, reset]
  );

  return {
    isDragging,
    dropHandlers: { onDragEnter, onDragOver, onDragLeave, onDrop },
  };
}
