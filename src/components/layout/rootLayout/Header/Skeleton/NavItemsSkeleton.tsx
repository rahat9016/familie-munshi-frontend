/** Placeholder category links while the selected root's tree loads. */
export default function NavItemsSkeleton() {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-4 py-2" aria-hidden>
      {[56, 88, 72, 96, 64, 80, 70, 90].map((w, i) => (
        <div
          key={i}
          className="h-3.5 shrink-0 rounded bg-gray-200 animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
