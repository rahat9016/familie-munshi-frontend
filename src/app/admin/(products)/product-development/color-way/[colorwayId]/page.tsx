import ColorwayDetail from "@/src/components/admin/Colorways/ColorwayDetail/ColorwayDetail";

interface PageProps {
  params: Promise<{ colorwayId: string }>;
}

export default async function page({ params }: PageProps) {
  const { colorwayId } = await params;

  return (
    <div className="w-full p-4 sm:p-0">
      <ColorwayDetail colorwayId={colorwayId} />
    </div>
  );
}
