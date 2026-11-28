import ArticlesTable from "@/src/components/admin/Styles/components/ArticlesTable";

interface PageProps {
  params: Promise<{
    seasonId: string;
    departmentId: string;
    categoryId: string;
  }>;
}

export default async function CategoryArticlesPage({ params }: PageProps) {
  const { seasonId, departmentId, categoryId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <ArticlesTable
        seasonId={seasonId}
        departmentId={departmentId}
        categoryId={categoryId}
      />
    </div>
  );
}
