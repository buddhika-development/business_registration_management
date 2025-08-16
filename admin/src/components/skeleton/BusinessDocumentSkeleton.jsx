const SkeletonBar = ({ className = '' }) => (
  <div className={`h-4 rounded bg-slate-200 ${className}`} />
);

export const DocumentSkeletonList = ({ rows = 4 }) => (
  <div className="mt-6 space-y-3 animate-pulse">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-200" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            <SkeletonBar className="w-40" />
            <SkeletonBar className="w-24" />
            <SkeletonBar className="w-64" />
            <SkeletonBar className="w-32" />
          </div>
        </div>
      </div>
    ))}
  </div>
);