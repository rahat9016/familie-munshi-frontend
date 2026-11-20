import {
  Calendar,
  FolderTree,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
  type LucideIcon,
} from "lucide-react";
import { PERMISSION_MODULE } from "../constants/auth/permissions";

export interface MenuChild {
  label: string;
  href: string;
  matchRoutes?: string[];
  /** Backend permission module gating this child (needs <MODULE>_READ); omit = always visible. */
  resource?: string;
}

export interface MenuItem {
  segment?: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  matchRoutes?: string[];
  children?: MenuChild[];
  /** Backend permission module gating this item/group (needs <MODULE>_READ); omit = always visible. */
  resource?: string;
  /** Only visible to super admin. */
  superOnly?: boolean;
}

export function getMenuItems(): MenuItem[] {
  const menuItems: (MenuItem | false)[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },

    // Dedicated Seasons & Styles PLM section
    {
      segment: "Style & PLM Management",
      label: "Seasons & Styles (PLM)",
      icon: Calendar,
      resource: PERMISSION_MODULE.PRODUCT,
      href: "/admin/styles",
      matchRoutes: ["/admin/styles"],
    },

    // 4-Tier Category Hierarchy & Brand section
    {
      segment: "Category & Brand",
      label: "Category Hierarchy",
      icon: FolderTree,
      resource: PERMISSION_MODULE.PRODUCT,
      children: [
        {
          label: "Group",
          href: "/admin/group",
        },
        {
          label: "Parent Category",
          href: "/admin/parent-category",
        },
        {
          label: "Category",
          href: "/admin/category",
        },
        {
          label: "Segment",
          href: "/admin/segment",
        },
        {
          label: "Sub Category",
          href: "/admin/sub-category",
        },
        { label: "Brand List", href: "/admin/brands" },
      ],
    },

    {
      segment: "Order Management",
      label: "Orders",
      icon: ShoppingCart,
      resource: PERMISSION_MODULE.ORDER,
      children: [
        { label: "All Orders", href: "/admin/orders" },
        { label: "Return & Refund", href: "/admin/orders/return-refund" },
        { label: "Transactions", href: "/admin/orders/transactions" },
      ],
    },
    {
      segment: "User Management",
      label: "Users",
      icon: Users,
      href: "/admin/users",
      resource: PERMISSION_MODULE.CUSTOMER,
    },
    {
      segment: "Access Control",
      label: "Branch RBAC",
      icon: ShieldCheck,
      children: [
        {
          label: "Branches",
          href: "/admin/rbac/branches",
          resource: PERMISSION_MODULE.BRANCH,
        },
        {
          label: "Roles",
          href: "/admin/rbac/roles",
          resource: PERMISSION_MODULE.ROLE,
        },
        {
          label: "Actions",
          href: "/admin/rbac/actions",
          resource: PERMISSION_MODULE.ACTION,
        },
        {
          label: "Users",
          href: "/admin/rbac/users",
          resource: PERMISSION_MODULE.USER,
        },
        {
          label: "Permissions",
          href: "/admin/rbac/permissions",
          resource: PERMISSION_MODULE.PERMISSION,
        },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      superOnly: true,
    },
  ];

  return menuItems.filter(Boolean) as MenuItem[];
}

/**
 * Filter menu items by the user's RBAC access.
 * `can(resource)` → true if the user may see that resource (super admin
 * bypasses; otherwise any granted action counts).
 *  - leaf/group with a `resource` → hidden unless `can(resource)`.
 *  - group children with a `resource` → individually filtered.
 *  - a group with no remaining children is dropped.
 */
export function filterMenuByAccess(
  items: MenuItem[],
  can: (resource: string) => boolean,
  isSuperAdmin = false
): MenuItem[] {
  const out: MenuItem[] = [];
  for (const item of items) {
    if (item.superOnly && !isSuperAdmin) continue;
    if (item.resource && !can(item.resource)) continue;

    if (item.children) {
      const children = item.children.filter(
        (c) => !c.resource || can(c.resource)
      );
      if (children.length === 0) continue;
      out.push({ ...item, children });
    } else {
      out.push(item);
    }
  }
  return out;
}
