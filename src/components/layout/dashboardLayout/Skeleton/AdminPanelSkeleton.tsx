import { Skeleton } from "@/src/components/ui/skeleton";

const NAV_PILLS = ["w-24", "w-36", "w-20", "w-28", "w-32"];
const TABLE_ROWS = 8;
const TABLE_COLS = ["w-10", "w-2/3", "w-1/2", "w-1/2", "w-16", "w-8"];

/**
 * Full-screen placeholder for the admin panel while access/permissions load.
 * Mirrors AdminLayout: header (logo · search · profile), nav row, table page.
 */
export default function AdminPanelSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading admin panel"
      className="flex h-screen w-full flex-col overflow-hidden bg-light"
    >
      <span className="sr-only">Loading admin panel…</span>

      {/* Header */}
      <div className="bg-white border-b border-skeleton">
        <div className="h-16 flex items-center px-3 md:px-6 gap-3 md:gap-6">
          <div className="flex items-center gap-2.5 shrink-0">
            <Skeleton className="size-11 lg:size-16 rounded-full" />
            <div className="hidden sm:block space-y-1.5">
              <Skeleton className="h-5 w-36 lg:h-7 lg:w-52" />
              <Skeleton className="h-2.5 w-40 lg:w-52" />
            </div>
          </div>

          <div className="flex flex-1 min-w-0 justify-center">
            <Skeleton className="h-11 w-full max-w-3xl rounded-lg" />
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex flex-col items-end space-y-1.5">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
            <Skeleton className="size-8 md:size-10 rounded-full" />
          </div>
        </div>

        {/* Nav row */}
        <div className="h-11 flex items-center justify-center gap-2 px-3 md:px-6 border-t border-skeleton">
          {NAV_PILLS.map((width, i) => (
            <Skeleton
              key={i}
              className={`h-7 ${width} ${i > 0 ? "hidden lg:block" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Page content: table card */}
      <div className="flex-1 min-h-0 p-3 sm:p-4">
        <div className="rounded-lg border border-light-dark bg-white">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-5 border-b border-light-dark">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-11 w-full lg:w-[26rem] xl:w-[32rem]" />
            <Skeleton className="h-11 w-28" />
          </div>

          <div className="px-5">
            <div className="flex items-center gap-6 h-14 border-b border-light-dark">
              {TABLE_COLS.map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
            </div>
            {Array.from({ length: TABLE_ROWS }).map((_, row) => (
              <div
                key={row}
                className="flex items-center gap-6 h-14 border-b border-light-dark last:border-b-0"
              >
                {TABLE_COLS.map((width, i) => (
                  <div key={i} className="flex-1">
                    <Skeleton className={`h-4 ${width}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-5 border-t border-light-dark">
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="size-9" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
