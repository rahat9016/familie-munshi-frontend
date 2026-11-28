import StyleCategoriesTable from "@/src/components/admin/Styles/components/StyleCategoriesTable";

interface PageProps {
  params: Promise<{
    seasonId: string;
    departmentId: string;
  }>;
}

export default async function DepartmentCategoriesPage({ params }: PageProps) {
  const { seasonId, departmentId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <StyleCategoriesTable seasonId={seasonId} departmentId={departmentId} />
    </div>
  );
}
