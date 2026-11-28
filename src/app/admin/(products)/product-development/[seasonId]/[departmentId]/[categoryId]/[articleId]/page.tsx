import ArticleDetailView from "@/src/components/admin/Styles/components/ArticleDetailView";

interface PageProps {
  params: Promise<{
    seasonId: string;
    departmentId: string;
    categoryId: string;
    articleId: string;
  }>;
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { seasonId, departmentId, categoryId, articleId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <ArticleDetailView
        seasonId={seasonId}
        departmentId={departmentId}
        categoryId={categoryId}
        articleId={articleId}
      />
    </div>
  );
}
