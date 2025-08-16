import React from 'react'

const SkeletonBar = ({ className = "" }) => (
  <div className={`h-4 rounded bg-slate-200 ${className}`} />
);

export const SkeletonRows = ({ rows = 8 }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-8">
    {Array.from({ length: rows }).map((_, i) => (
      <React.Fragment key={i}>
        <SkeletonBar className="w-32" />
        <SkeletonBar className="w-48" />
      </React.Fragment>
    ))}
  </div>
);
