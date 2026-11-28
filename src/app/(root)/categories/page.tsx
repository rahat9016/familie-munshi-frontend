import CatalogPage from "@/src/components/home/Catalog/CatalogPage";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ g?: string; c?: string; n?: string; s?: string }>;
}) {
  const { g, c, n, s } = await searchParams;
  return (
    <CatalogPage
      gender={g}
      category={c}
      categoryName={n}
      subCategoryId={s}
    />
  );
}
