/** Placeholder pills while root classifications (Men/Women/Kids) load. */
export default function GenderTabsSkeleton() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {[56, 48, 64].map((w, i) => (
        <div
          key={i}
          className="h-8 rounded-md bg-gray-200 animate-pulse"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
