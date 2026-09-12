import MaterialDetailView from "@/src/components/admin/Materials/MaterialDetailView";

interface PageProps {
  params: Promise<{ materialId: string }>;
}

export default async function MaterialDetailPage({ params }: PageProps) {
  const { materialId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <MaterialDetailView materialId={materialId} />
    </div>
  );
}
