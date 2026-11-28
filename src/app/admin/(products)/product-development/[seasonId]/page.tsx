import DepartmentsTable from "@/src/components/admin/Styles/components/DepartmentsTable";

interface PageProps {
  params: Promise<{
    seasonId: string;
  }>;
}

export default async function SeasonDepartmentsPage({ params }: PageProps) {
  const { seasonId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <DepartmentsTable seasonId={seasonId} />
    </div>
  );
}
