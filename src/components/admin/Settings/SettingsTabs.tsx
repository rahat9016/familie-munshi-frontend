"use client";

import { selectIsSuperAdmin } from "@/src/lib/redux/features/rbac/rbacSelectors";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { cn } from "@/src/lib/utils";
import {
  KeyRound,
  SlidersHorizontal,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsTab {
  label: string;
  href: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
}

export const SETTINGS_BASE_PATH = "/admin/settings";

export const SETTINGS_TABS: SettingsTab[] = [
  { label: "Profile", href: SETTINGS_BASE_PATH, icon: UserRound },
  {
    label: "My permissions",
    href: `${SETTINGS_BASE_PATH}/permissions`,
    icon: KeyRound,
  },
  {
    label: "Platform",
    href: `${SETTINGS_BASE_PATH}/platform`,
    icon: SlidersHorizontal,
    superAdminOnly: true,
  },
];

const isTabActive = (href: string, pathname: string) =>
  href === SETTINGS_BASE_PATH
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);

export default function SettingsTabs() {
  const pathname = usePathname();
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin);
  const tabs = SETTINGS_TABS.filter((t) => !t.superAdminOnly || isSuperAdmin);

  return (
    <nav
      aria-label="Settings sections"
      className="overflow-x-auto scrollbar-hide"
    >
      <div className="flex w-max min-w-full items-center gap-1 rounded-lg border border-light-dark bg-white p-1.5">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab.href, pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-secondary-dark hover:bg-light hover:text-primary"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
