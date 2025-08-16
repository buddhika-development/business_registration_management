export const Skeleton = () => (
  <div className="mt-8 space-y-6 animate-pulse">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl border border-slate-200 bg-white"
      >
        {[...Array(6)].map((__, j) => (
          <div key={j} className="h-4 rounded bg-slate-200" />
        ))}
      </div>
    ))}
  </div>
);