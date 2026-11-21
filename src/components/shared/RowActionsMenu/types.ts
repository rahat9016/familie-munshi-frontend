import type { LucideIcon } from "lucide-react";

export interface RowAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  /** "danger" = red (delete). */
  variant?: "default" | "danger";
  /** Hide without restructuring the list (e.g. missing permission). */
  hidden?: boolean;
}

export interface RowActionsMenuProps {
  actions: RowAction[];
  /** aria-label for the trigger. */
  label?: string;
}
