import { ApiModulePermissions } from "@/src/utils/rbac";

/** "PRODUCT_CLASSIFICATION" → "Product Classification" */
export const humanize = (value: string) =>
  value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");

export const countPermissions = (modules: ApiModulePermissions[]) =>
  modules.reduce((sum, m) => sum + (m.permissions?.length ?? 0), 0);

/**
 * Case-insensitive filter. A module name match keeps the whole module;
 * otherwise only permissions whose name/description match. Empty modules
 * are dropped; modules sorted A→Z.
 */
export const filterModules = (
  modules: ApiModulePermissions[],
  query: string
): ApiModulePermissions[] => {
  const q = query.trim().toLowerCase();
  const sorted = [...modules].sort((a, b) => a.module.localeCompare(b.module));
  if (!q) return sorted.filter((m) => m.permissions?.length);

  return sorted
    .map((m) => {
      const moduleMatch =
        m.module.toLowerCase().includes(q) ||
        humanize(m.module).toLowerCase().includes(q);
      if (moduleMatch) return m;
      return {
        ...m,
        permissions: (m.permissions ?? []).filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q)
        ),
      };
    })
    .filter((m) => m.permissions?.length);
};
