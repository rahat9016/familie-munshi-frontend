"use client";

import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { cn } from "@/src/lib/utils";
import {
  ClassificationIconType,
  IClassificationIconSource,
} from "@/src/types/productClassification";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import Image from "next/image";

/** `ShoppingCart` → `shopping-cart` (DynamicIcon expects kebab-case). */
const toKebab = (name: string) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

interface ClassificationIconProps {
  source?: Partial<IClassificationIconSource> | null;
  /** Used as alt text for uploaded icons. */
  name?: string;
  size?: number;
  className?: string;
}

/**
 * Renders a classification icon: uploaded file (iconUrl) or lucide name.
 * Returns null when there is no icon. Never cache `iconUrl` long-term —
 * it is a presigned URL that expires after 7 days.
 */
export default function ClassificationIcon({
  source,
  name = "",
  size = 20,
  className,
}: ClassificationIconProps) {
  if (!source) return null;
  const { iconType, icon, iconUrl } = source;

  if (iconType === ClassificationIconType.FILE && iconUrl) {
    return (
      <Image
        src={iconUrl}
        alt={name}
        width={size}
        height={size}
        // Presigned S3 URL on any host — skip the optimizer.
        unoptimized
        className={cn("shrink-0 object-contain", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (iconType === ClassificationIconType.LUCIDE && icon) {
    const known = getClassificationIcon(icon);
    if (known)
      return (
        <known.Icon size={size} className={cn("shrink-0", className)} />
      );
    return (
      <DynamicIcon
        name={toKebab(icon) as IconName}
        size={size}
        className={cn("shrink-0", className)}
      />
    );
  }

  return null;
}

/** true when the row/node has an icon to render. */
export const hasClassificationIcon = (
  source?: Partial<IClassificationIconSource> | null
) =>
  !!source &&
  ((source.iconType === ClassificationIconType.FILE && !!source.iconUrl) ||
    (source.iconType === ClassificationIconType.LUCIDE && !!source.icon));
