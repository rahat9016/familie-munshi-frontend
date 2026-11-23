"use client";

import { getClassificationIcon } from "@/src/constants/ecommerce/classificationIcons";
import { useGet } from "@/src/hooks/useGet";
import type {
  IProductClassification,
  IProductClassificationTreeNode,
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

const hrefFor = (id: string) => `/categories?c=${id}`;
const iconFor = (icon: string | null) =>
  getClassificationIcon(icon)?.Icon ?? Tag;

/**
 * Sub-categories of a category, flattened across its segments (a segment
 * with no children stands in for itself).
 */
const leavesOf = (category: IProductClassificationTreeNode) =>
  category.children.flatMap((segment) =>
    segment.children.length ? segment.children : [segment]
  );

/**
 * Tree (root → parent category → category → segment → sub-category) →
 * header links. Each parent category becomes a nav link, its categories the
 * mega-menu columns, and their sub-categories the column items.
 */
function mapTreeToNav(tree: IProductClassificationTreeNode): NavLink[] {
  return [
    NEW_IN,
    ...tree.children.map<NavLink>((parent) => {
      const menu: MegaMenuData | undefined = parent.children.length
        ? {
            columns: parent.children.map((category) => ({
              id: category.id,
              heading: category.name,
              items: leavesOf(category).map((leaf) => ({
                label: leaf.name,
                href: hrefFor(leaf.id),
                icon: iconFor(leaf.icon),
              })),
            })),
            promo: defaultMegaMenu.promo,
          }
        : undefined;

      return {
        id: parent.id,
        label: parent.name,
        href: hrefFor(parent.id),
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
