/**
 * Navigation source: types, API contract, mapper, and static fallback.
 * The header nav (genders + their category links) is API-driven via
 * `useNavigation`; this file holds the shapes and the fallback used until
 * the backend responds.
 */

/** A gender is just its display name (e.g. "Women"). Dynamic from API. */
export type Gender = string;

export interface NavLink {
  label: string;
  href: string;
  isHighlighted?: boolean;
}

const slugify = (label: string) =>
  label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cat = (label: string): NavLink => ({
  label,
  href: `/categories?c=${slugify(label)}`,
});

/** Lead "NEW IN" link shown first under every gender. */
const NEW_IN: NavLink = { label: "NEW IN", href: "/categories?filter=new" };

// ── Static fallback (used until the API responds) ──────────────────────────
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

// ── API contract (assumed; swap endpoint/shape when backend is ready) ──────
export const NAVIGATION_ENDPOINT = "/categories/navigation";

/**
 * Backend has no navigation endpoint yet — keep the request off and render
 * the static fallback. Flip to true once `NAVIGATION_ENDPOINT` exists.
 */
export const NAVIGATION_API_ENABLED = false;

export interface INavCategory {
  id: string;
  name: string;
  slug: string;
  isHighlighted?: boolean;
}

/** A top-level gender group with its child categories. */
export interface INavGroup {
  id: string;
  name: string;
  slug: string;
  children: INavCategory[];
}

/** Normalize the API navigation tree into genders + per-gender link lists. */
export function mapNavigation(groups: INavGroup[]): {
  genders: Gender[];
  navByGender: Record<Gender, NavLink[]>;
} {
  const genders: Gender[] = [];
  const navByGender: Record<Gender, NavLink[]> = {};

  for (const group of groups) {
    genders.push(group.name);
    navByGender[group.name] = [
      NEW_IN,
      ...group.children.map((c) => ({
        label: c.name,
        href: `/categories?c=${c.slug}`,
        isHighlighted: c.isHighlighted,
      })),
    ];
  }

  return { genders, navByGender };
}
