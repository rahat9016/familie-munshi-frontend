/**
 * Admin category dummy data — derived from the storefront header's own nav
 * data (navLinks.ts genders/categories + megaMenuData.ts columns/items) so
 * the admin hierarchy mirrors exactly what shoppers see, instead of an
 * unrelated made-up dataset.
 */
import { getMegaMenu } from "@/src/components/layout/rootLayout/Header/megaMenuData";
import {
  GENDERS_FALLBACK,
  navByGenderFallback,
} from "@/src/components/layout/rootLayout/Header/navLinks";
import { mockGroupsList } from "./mockGroupData";

// Legacy mock shapes (used by Styles/PLM mocks only).
export interface IParentCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  groupId?: string;
  groupName?: string;
  createdAt: string;
  actions?: string;
}

export interface ICategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  parentCategory?: {
    id: string;
    name: string;
    icon?: string;
  };
  updatedAt?: string;
  createdAt: string;
  actions?: string;
}

export interface ISegment {
  id: string;
  name: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | string;
  categoryId: string;
  categoryName?: string;
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
  actions?: string;
}

export interface ISubCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string | null;
  status?: "ACTIVE" | "INACTIVE" | string;
  segmentId: string;
  segmentName?: string;
  categoryId?: string;
  categoryName?: string;
  category?: {
    id: string;
    name: string;
    icon?: string | null;
  };
  createdAt: string;
  actions?: string;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Header's fallback nav shares the same category list under every gender —
// spread real Parent Categories round-robin across groups for admin variety.
const navCategoryLabels = navByGenderFallback[GENDERS_FALLBACK[0]]
  .map((link) => link.label)
  .filter((label) => label !== "NEW IN");

export const mockParentCategoriesList: IParentCategory[] =
  navCategoryLabels.map((label, index) => {
    const group = mockGroupsList[index % mockGroupsList.length];
    return {
      id: slug(label),
      name: label,
      description: `${label} — from header navigation`,
      status: "ACTIVE",
      groupId: group.id,
      groupName: group.name,
      createdAt: "2026-01-05",
    };
  });

export const mockCategoriesList: ICategory[] = mockParentCategoriesList.flatMap(
  (parent) =>
    getMegaMenu(parent.name).columns.map((column) => ({
      id: `${parent.id}-${slug(column.heading)}`,
      name: column.heading,
      status: "ACTIVE",
      parentCategoryId: parent.id,
      parentCategoryName: parent.name,
      createdAt: "2026-01-05",
    }))
);

// One default "General" segment per category — keeps every existing
// sub-category valid while admins can add more specific segments later.
export const mockSegmentsList: ISegment[] = mockCategoriesList.map(
  (category) => ({
    id: `${category.id}-general`,
    name: "General",
    description: `Default segment for ${category.name}`,
    status: "ACTIVE",
    categoryId: category.id,
    categoryName: category.name,
    createdAt: "2026-01-05",
  })
);

export const mockSubCategoriesList: ISubCategory[] =
  mockParentCategoriesList.flatMap((parent) =>
    getMegaMenu(parent.name).columns.flatMap((column) => {
      const categoryId = `${parent.id}-${slug(column.heading)}`;
      const segmentId = `${categoryId}-general`;
      return column.items.map((menuItem) => ({
        id: `${categoryId}-${slug(menuItem.label)}`,
        name: menuItem.label,
        status: "ACTIVE",
        segmentId,
        segmentName: "General",
        categoryId,
        categoryName: column.heading,
        createdAt: "2026-01-05",
      }));
    })
  );
