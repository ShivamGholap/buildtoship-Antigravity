import React from "react";

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-stone-200/80 rounded-md ${className}`} />;
}

export function AdvisoryCardSkeleton() {
  return (
    <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="pt-2 flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}
