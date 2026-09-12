import ColorwayDetailView from "@/src/components/admin/Styles/components/ColorwayDetailView";

interface PageProps {
  params: Promise<{ colorwayCode: string }>;
}

export default async function ColorwayDetailPage({ params }: PageProps) {
  const { colorwayCode } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <ColorwayDetailView colorwayCode={colorwayCode} />
    </div>
  );
}
