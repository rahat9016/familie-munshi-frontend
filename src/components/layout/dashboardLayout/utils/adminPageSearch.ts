import { type MenuItem } from "@/src/utils/getMenuItems";
import { type AdminSearchPage } from "../types";

export const ADMIN_SEARCH_DEBOUNCE_MS = 300;
export const ADMIN_SEARCH_MAX_RESULTS = 8;

/** Menu tree → flat list of pages (leaf items + every child). */
export function flattenMenuPages(items: MenuItem[]): AdminSearchPage[] {
  const pages: AdminSearchPage[] = [];

  for (const item of items) {
    if (item.href) {
      pages.push({ label: item.label, href: item.href, icon: item.icon });
    }
    for (const child of item.children ?? []) {
      pages.push({
        label: child.label,
        href: child.href,
        group: item.label,
        icon: item.icon,
      });
    }
  }

  return pages;
}

/**
 * Rank pages against `query` (case-insensitive):
 * label prefix > label contains > group/segment contains.
 * Empty query returns every page.
 */
export function filterPages(
  pages: AdminSearchPage[],
  query: string
): AdminSearchPage[] {
  const q = query.trim().toLowerCase();
  if (!q) return pages.slice(0, ADMIN_SEARCH_MAX_RESULTS);

  return pages
    .map((page) => {
      const label = page.label.toLowerCase();
      const group = page.group?.toLowerCase() ?? "";
      const score = label.startsWith(q)
        ? 3
        : label.includes(q)
          ? 2
          : group.includes(q)
            ? 1
            : 0;
      return { page, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, ADMIN_SEARCH_MAX_RESULTS)
    .map((r) => r.page);
}
