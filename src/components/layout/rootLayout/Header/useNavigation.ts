"use client";

import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { useGet } from "@/src/hooks/useGet";
import {
  ClassificationIconType,
  type IProductClassification,
  type IProductClassificationTreeNode,
} from "@/src/types/productClassification";
import { Tag } from "lucide-react";
import { useMemo } from "react";
import { defaultMegaMenu, type MegaMenuData } from "./megaMenuData";
import type { Gender, NavLink } from "./navLinks";

const ROOTS_ENDPOINT = "/product-classifications/roots";
const TREE_ENDPOINT = "/product-classifications/tree";
const NAV_QUERY_KEY = "product-classifications-nav";
/** Header nav rarely changes — avoid refetching on every mount/focus. */
const NAV_STALE_TIME = 5 * 60 * 1000;

/** Lead "NEW IN" link shown first under every root. */
const NEW_IN: NavLink = { label: "NEW IN", href: "/categories?filter=new" };

/** Catalog link; `n` carries the display name so the page needs no lookup. */
export const catalogHref = (id: string, name: string) =>
  `/categories?c=${encodeURIComponent(id)}&n=${encodeURIComponent(name)}`;
/** Lucide icon (fallback Tag) + uploaded icon URL when iconType = FILE. */
const iconFor = (node: IProductClassificationTreeNode) => ({
  icon:
    (node.iconType === ClassificationIconType.LUCIDE &&
      getClassificationIcon(node.icon)?.Icon) ||
    Tag,
  iconUrl:
    node.iconType === ClassificationIconType.FILE && node.iconUrl
      ? node.iconUrl
      : undefined,
});

/**
 * Tree (root → parent category → segment → category → sub-category) →
 * header links. Each parent category becomes a nav link, its segments the
 * mega-menu columns, and their categories the column items. Sub-categories
 * are not shown here — the catalog page loads them per category.
 */
function mapTreeToNav(tree: IProductClassificationTreeNode): NavLink[] {
  return [
    NEW_IN,
    ...tree.children.map<NavLink>((parent) => {
      const segments = parent.children.filter((s) => s.children.length);
      const menu: MegaMenuData | undefined = segments.length
        ? {
            columns: segments.map((segment) => ({
              id: segment.id,
              heading: segment.name,
              items: segment.children.map((category) => ({
                label: category.name,
                href: catalogHref(category.id, category.name),
                ...iconFor(category),
              })),
            })),
            promo: defaultMegaMenu.promo,
          }
        : undefined;

      return {
        id: parent.id,
        label: parent.name,
        href: catalogHref(parent.id, parent.name),
        menu,
      };
    }),
  ];
}

/** Root classifications (Men / Women / Kids) — drive the gender tabs. */
export function useNavigationRoots() {
  const { data, isLoading } = useGet<IProductClassification[]>(
    ROOTS_ENDPOINT,
    [NAV_QUERY_KEY, "roots"],
    undefined,
    { staleTime: NAV_STALE_TIME }
  );

  const roots = useMemo(
    () => (data?.data ?? []).filter((r) => r.active),
    [data]
  );
  const genders: Gender[] = useMemo(() => roots.map((r) => r.name), [roots]);

  return { roots, genders, isLoading };
}

/**
 * Category tree for one root. Disabled until `rootId` is known; React Query
 * dedupes by key so every header part shares one request per root.
 */
export function useClassificationTree(rootId?: string) {
  const { data, isLoading } = useGet<IProductClassificationTreeNode>(
    `${TREE_ENDPOINT}/${rootId}`,
    [NAV_QUERY_KEY, "tree", rootId ?? ""],
    undefined,
    { enabled: !!rootId, staleTime: NAV_STALE_TIME }
  );

  const tree = data?.data;
  const navLinks = useMemo(() => (tree ? mapTreeToNav(tree) : []), [tree]);

  return { navLinks, isLoading };
}
