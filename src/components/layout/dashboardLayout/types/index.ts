import type { LucideIcon } from "lucide-react";

/** One navigable admin page, flattened from the accessible menu. */
export interface AdminSearchPage {
  label: string;
  href: string;
  /** Parent menu label (e.g. "User Management") for grouped children. */
  group?: string;
  icon: LucideIcon;
}
