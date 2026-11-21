import { Skeleton } from "@/src/components/ui/skeleton";

/** Loading placeholder matching a list of DetailRow. */
export default function DetailRowsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="mt-2" aria-busy="true" aria-label="Loading details">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-3 gap-3 py-3 border-b last:border-b-0"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className={`col-span-2 h-4 ${i % 2 ? "w-1/2" : "w-3/4"}`} />
        </div>
      ))}
    </div>
  );
}
