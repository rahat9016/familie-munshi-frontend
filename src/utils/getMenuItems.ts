import {
  Building2,
  FolderTree,
  LayoutDashboard,
  Shirt,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PERMISSION } from "../constants/auth/permissions";

/**
 * Admin navigation — the single source of truth for BOTH the header/sidebar
 * menu AND admin route protection (see `getRequiredPermissions`).
 *
 * `permissions` = any-of list of permission names from GET /permissions/me.
 *  - omitted on a leaf → always visible / allowed (e.g. Dashboard)
 *  - on a group        → children inherit it unless they declare their own
 *
 * To expose a page, add it here with the permission the backend grants.
 * Pages whose backend module does not exist yet (Orders, Customers,
 * Settings, CMS, Career…) are intentionally absent: hidden from the menu and
 * denied by the route guard until a permission is added.
 */

export interface MenuChild {
  label: string;
  href: string;
  matchRoutes?: string[];
  permissions?: string[];
}

export interface MenuItem {
  segment?: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  matchRoutes?: string[];
  children?: MenuChild[];
  permissions?: string[];
}

const CLASSIFICATION_VIEW = [PERMISSION.PRODUCT_CLASSIFICATION_VIEW];

export function getMenuItems(): MenuItem[] {
  return [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },

    // Styles / PLM (mock data) — no backend permission yet, so visible to
    // every admin. Add `permissions` once the backend module exists.
    // Nested pages (/admin/product-development/...) inherit this rule.
    {
      segment: "Style & PLM",
      label: "Product Development",
      icon: Shirt,
      href: "/admin/product-development",
    },

    {
      segment: "Category & Brand",
      label: "Category Hierarchy",
      icon: FolderTree,
      permissions: CLASSIFICATION_VIEW,
      children: [
        { label: "Group", href: "/admin/group" },
        { label: "Parent Category", href: "/admin/parent-category" },
        { label: "Segment", href: "/admin/segment" },
        { label: "Category", href: "/admin/category" },
        { label: "Sub Category", href: "/admin/sub-category" },
        {
          label: "Brand List",
          href: "/admin/brands",
          permissions: [PERMISSION.BRAND_LIST_VIEW],
        },
      ],
    },

    {
      label: "Branches",
      icon: Building2,
      href: "/admin/branches",
      permissions: [PERMISSION.BRANCH_LIST, PERMISSION.BRANCH_READ],
    },
    {
      segment: "Access Control",
      label: "User Management",
      icon: Users,
      children: [
        {
          label: "Users",
          href: "/admin/user-management/users",
          permissions: [PERMISSION.USER_READ],
        },
        {
          label: "Roles",
          href: "/admin/user-management/roles",
          permissions: [PERMISSION.ROLE_READ],
        },
        {
          label: "Permissions",
          href: "/admin/user-management/permissions",
          permissions: [PERMISSION.PERMISSION_READ],
        },
      ],
    },
  ];
}

type RouteRule = {
  path: string;
  permissions: string[];
  /** Match only pages BELOW `path` (not `path` itself). */
  descendantsOnly?: boolean;
};

/**
 * Routes outside the menu, or that need a stricter permission than their
 * menu entry (write screens nested under a read-only list page).
 */
const EXTRA_ROUTE_RULES: RouteRule[] = [
  // Personal account settings (profile, my permissions) — every admin.
  // Not in the nav menu; reached from the header profile dropdown.
  { path: "/admin/settings", permissions: [] },
];

/** Flatten the menu (+ extra rules) into path → required permissions. */
function buildRouteRules(): RouteRule[] {
  const rules: RouteRule[] = [{ path: "/admin", permissions: [] }];

  for (const item of getMenuItems()) {
    const own = item.permissions ?? [];
    if (item.href) {
      for (const path of [item.href, ...(item.matchRoutes ?? [])]) {
        rules.push({ path, permissions: own });
      }
    }
    for (const child of item.children ?? []) {
      const perms = child.permissions ?? own;
      for (const path of [child.href, ...(child.matchRoutes ?? [])]) {
        rules.push({ path, permissions: perms });
      }
    }
  }

  return [...rules, ...EXTRA_ROUTE_RULES];
}

const ROUTE_RULES = buildRouteRules();

/**
 * Permissions required to open `pathname` (any-of).
 *  - longest matching configured prefix wins, so nested pages
 *    (e.g. /admin/user-management/permissions/123) inherit their parent's rule
 *  - `/admin` matches exactly only
 *  - returns `null` for routes not in the config → deny by default
 */
export function getRequiredPermissions(pathname: string): string[] | null {
  const path = pathname.replace(/\/+$/, "") || "/";
  let best: RouteRule | null = null;
  let bestScore = -1;

  for (const rule of ROUTE_RULES) {
    const isDescendant = path.startsWith(`${rule.path}/`);
    const matches =
      rule.path === "/admin"
        ? path === "/admin"
        : rule.descendantsOnly
          ? isDescendant
          : path === rule.path || isDescendant;
    // Longer prefix wins; a descendants-only rule beats the same-path rule.
    const score = rule.path.length * 2 + (rule.descendantsOnly ? 1 : 0);
    if (matches && score > bestScore) {
      best = rule;
      bestScore = score;
    }
  }

  return best ? best.permissions : null;
}

/** true when no permission is required or the user holds any of them. */
export function hasAnyPermission(
  required: string[] | undefined,
  granted: ReadonlySet<string>
): boolean {
  return (
    !required || required.length === 0 || required.some((p) => granted.has(p))
  );
}

/**
 * Filter menu by the user's granted permission names.
 *  - item/child shown when it (or its group) permission is granted
 *  - a group with no remaining children is dropped
 */
export function filterMenuByAccess(
  items: MenuItem[],
  granted: ReadonlySet<string>
): MenuItem[] {
  const out: MenuItem[] = [];
  for (const item of items) {
    if (item.children) {
      const children = item.children.filter((c) =>
        hasAnyPermission(c.permissions ?? item.permissions, granted)
      );
      if (children.length > 0) out.push({ ...item, children });
    } else if (hasAnyPermission(item.permissions, granted)) {
      out.push(item);
    }
  }
  return out;
}
