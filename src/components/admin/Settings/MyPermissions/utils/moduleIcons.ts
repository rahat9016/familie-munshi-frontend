import {
  Box,
  Building2,
  FolderTree,
  KeyRound,
  ShieldCheck,
  Tag,
  Users,
  type LucideIcon,
} from "lucide-react";

const MODULE_ICONS: Record<string, LucideIcon> = {
  BRANCH: Building2,
  BRAND: Tag,
  PERMISSION: KeyRound,
  PRODUCT_CLASSIFICATION: FolderTree,
  ROLE: ShieldCheck,
  USER: Users,
};

/** Icon for a backend permission module; generic box for unknown modules. */
export const getModuleIcon = (module: string): LucideIcon =>
  MODULE_ICONS[module.toUpperCase()] ?? Box;
