import type { MegaMenuData } from "./megaMenuData";

/**
 * Navigation shapes + static category list. The header itself is API-driven
 * (`useNavigation`: /product-classifications/roots + /tree/{id}); the static
 * data below only feeds the footer and admin mock data.
 */

/** A gender is just its display name (e.g. "Women"). Dynamic from API. */
export type Gender = string;

export interface NavLink {
  /** Classification id (absent for synthetic links like "NEW IN"). */
  id?: string;
  label: string;
  href: string;
  isHighlighted?: boolean;
  /** Mega-menu content; links without it are not expandable. */
  menu?: MegaMenuData;
}

const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cat = (label: string): NavLink => ({
  label,
  href: `/categories?c=${slugify(label)}`,
});

/** Lead "NEW IN" link shown first under every gender. */
const NEW_IN: NavLink = { label: "NEW IN", href: "/categories?filter=new" };

// ── Static data (footer + admin mocks) ─────────────────────────────────────
const CATEGORIES: NavLink[] = [
  NEW_IN,
  cat("Custom-Teamwear"),
  cat("Rent-a-Dress"),
  cat("Golden-Draw"),
  cat("Clothing"),
  cat("Basics"),
  cat("Sportswear"),
  cat("Streetwear"),
  cat("Workwear"),
  cat("Accessories"),
  cat("Baggage"),
  cat("Shoes"),
];

export const GENDERS_FALLBACK: Gender[] = ["Women", "Men", "Kids"];

export const navByGenderFallback: Record<Gender, NavLink[]> = {
  Women: CATEGORIES,
  Men: CATEGORIES,
  Kids: CATEGORIES,
};

/** Backwards-compatible flat list. */
export const navLinks = CATEGORIES;
