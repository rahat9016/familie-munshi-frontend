"use client";

import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface StyleTab {
  label: string;
  href: string;
  /** Extra prefixes that keep this tab active (drill-down routes). */
  matchPrefixes?: string[];
}

export const STYLE_TABS: StyleTab[] = [
  { label: "Style", href: "/admin/product-development" },
  { label: "Material", href: "/admin/product-development/material" },
  { label: "Color Way", href: "/admin/product-development/color-way" },
  { label: "Size Chart Template", href: "/admin/product-development/size-chart-template" },
  { label: "Care Label Info", href: "/admin/product-development/care-label-info" },
  { label: "Supplier", href: "/admin/product-development/supplier" },
  { label: "Documents", href: "/admin/product-development/documents" },
];

function isTabActive(tab: StyleTab, pathname: string) {
  if (pathname === tab.href) return true;
  if (tab.href !== "/admin/product-development" && pathname.startsWith(`${tab.href}/`)) {
    return true;
  }
  // "Style" also owns the season → department → category → article drill-down,
  // which lives under /admin/product-development/<seasonId>/...
  if (tab.href === "/admin/product-development") {
    const otherTab = STYLE_TABS.some(
      (t) => t.href !== "/admin/product-development" && (pathname === t.href || pathname.startsWith(`${t.href}/`))
    );
    return !otherTab && pathname.startsWith("/admin/product-development");
  }
  return false;
}

export default function StyleTabHeader() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Style sections"
      className="w-full mb-3 overflow-x-auto scrollbar-hide"
    >
      <div className="flex w-max min-w-full items-center gap-1 bg-white border border-light-dark rounded-lg p-1.5 shadow-sm">
        {STYLE_TABS.map((tab) => {
          const isActive = isTabActive(tab, pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-md transition-colors",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary-dark hover:bg-light hover:text-primary"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
