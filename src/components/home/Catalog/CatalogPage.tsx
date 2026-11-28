import { ChevronRight } from "lucide-react";
import Link from "next/link";
import ProductGrid from "../common/ProductGrid";
import { makeProducts } from "../data/homeData";
import CatalogSubCategories from "./CatalogSubCategories";
import FilterBar from "./FilterBar";

/** Static fallback for legacy slug links (`?c=clothing`, e.g. footer). */
const SUBCATEGORIES = [
  "T-shirts & Polos",
  "Shirts",
  "Sweatshirts & Hoodies",
  "Trousers",
  "Shorts",
  "Suits & Tailoring",
  "Jeans",
  "Knitwear",
  "Sportswear",
  "Tracksuits & Joggers",
  "Jackets",
  "Coats",
  "Underwear & Socks",
  "Swimwear",
  "Loungewear & Sleepwear",
  "Sale",
];

interface CatalogPageProps {
  gender?: string;
  /** Classification id (header links) or legacy slug. */
  category?: string;
  /** Display name for an id-based `category`. */
  categoryName?: string;
  /** Selected sub-category id. */
  subCategoryId?: string;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CatalogPage({
  gender,
  category = "Clothing",
  categoryName,
  subCategoryId,
}: CatalogPageProps) {
  const categoryId = UUID.test(category) ? category : undefined;
  const cat = categoryName || (categoryId ? "Products" : cap(category));
  const title = gender ? `${cap(gender)}'s ${cat}` : cat;

  const breadcrumb = gender ? (
    <nav className="flex items-center gap-1 text-sm text-gray-500">
      <Link href="/categories" className="hover:text-primary">{cap(gender)}</Link>
      <ChevronRight size={14} className="text-gray-400" />
      <span className="font-medium text-secondary">{cat}</span>
    </nav>
  ) : null;

  return (
    <div className="container  py-2 2xl:py-4">
      {/* Mobile title */}
      <div className="lg:hidden mb-6">
        {breadcrumb}
        <h1 className="mt-2 text-3xl font-bold text-secondary md:text-4xl">{title}</h1>
        {categoryId && (
          <div className="mt-4">
            <CatalogSubCategories
              categoryId={categoryId}
              categoryName={cat}
              selectedId={subCategoryId}
              variant="chips"
            />
          </div>
        )}
      </div>

      <div className="flex gap-6 lg:gap-8 xl:gap-10">
        {/* Sidebar */}
        <aside className="hidden shrink-0 lg:block lg:w-[15%]">
          {breadcrumb}
          <h1 className="mt-2 mb-6 text-3xl font-bold text-secondary md:text-4xl">{title}</h1>
          {categoryId ? (
            <CatalogSubCategories
              categoryId={categoryId}
              categoryName={cat}
              selectedId={subCategoryId}
            />
          ) : (
            <ul className="space-y-2.5">
              {SUBCATEGORIES.map((s) => (
                <li key={s}>
                  <Link
                    href="/categories?c=clothing"
                    className="text-sm font-semibold text-secondary hover:text-primary"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <FilterBar />

          <div className="mt-1">
            <ProductGrid
              products={makeProducts(`catalog-${subCategoryId ?? category}`, 12)}
              cols={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
