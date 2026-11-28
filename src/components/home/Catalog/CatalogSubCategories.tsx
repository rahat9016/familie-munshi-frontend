"use client";

import ClassificationIcon from "@/src/components/shared/ClassificationIcon/ClassificationIcon";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGet } from "@/src/hooks/useGet";
import { cn } from "@/src/lib/utils";
import type { IProductClassification } from "@/src/types/productClassification";
import Link from "next/link";
import { useMemo } from "react";

/** Sub-categories rarely change — skip refetch on every mount/focus. */
const STALE_TIME = 5 * 60 * 1000;

interface CatalogSubCategoriesProps {
  categoryId: string;
  categoryName: string;
  /** Selected sub-category id (`s` query param). */
  selectedId?: string;
  /** "list" = desktop sidebar, "chips" = mobile horizontal scroller. */
  variant?: "list" | "chips";
}

const subHref = (categoryId: string, categoryName: string, subId: string) =>
  `/categories?${new URLSearchParams({ c: categoryId, n: categoryName, s: subId })}`;

/** Sub-categories of a category — GET /product-classifications/{id}/children. */
export default function CatalogSubCategories({
  categoryId,
  categoryName,
  selectedId,
  variant = "list",
}: CatalogSubCategoriesProps) {
  const { data, isLoading } = useGet<IProductClassification[]>(
    `/product-classifications/${categoryId}/children`,
    ["product-classifications-nav", "children", categoryId],
    undefined,
    { staleTime: STALE_TIME }
  );

  const subs = useMemo(
    () =>
      (Array.isArray(data?.data) ? data.data : [])
        .filter((s) => s.active !== false)
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [data]
  );

  const isChips = variant === "chips";

  if (isLoading) {
    return (
      <div className={cn(isChips ? "flex gap-2" : "space-y-3")}>
        {Array.from({ length: isChips ? 4 : 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className={cn(isChips ? "h-8 w-24 rounded-full" : "h-4 w-3/4")}
          />
        ))}
      </div>
    );
  }

  if (!subs.length) {
    return isChips ? null : (
      <p className="text-sm text-gray-500">No sub categories.</p>
    );
  }

  return (
    <ul
      className={cn(
        isChips
          ? "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]"
          : "space-y-2.5"
      )}
    >
      {subs.map((sub) => {
        const active = selectedId === sub.id;
        return (
          <li key={sub.id} className={cn(isChips && "shrink-0")}>
            <Link
              href={subHref(categoryId, categoryName, sub.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 text-sm font-semibold transition-colors",
                isChips
                  ? "rounded-full border px-3 py-1.5"
                  : "text-secondary hover:text-primary",
                isChips && active
                  ? "border-primary bg-primary text-white"
                  : isChips && "border-gray-200 text-secondary",
                !isChips && active && "text-primary"
              )}
            >
              <ClassificationIcon source={sub} name={sub.name} size={16} />
              {sub.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
