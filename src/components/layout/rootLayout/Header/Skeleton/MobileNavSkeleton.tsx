/** Placeholder rows in the mobile category drawer. */
export default function MobileNavSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 px-4 py-2" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-3.5 rounded bg-gray-200 animate-pulse"
          style={{ width: `${55 + ((i * 17) % 35)}%` }}
        />
      ))}
    </div>
  );
}
