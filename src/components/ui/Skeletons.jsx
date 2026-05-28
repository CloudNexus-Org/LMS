export function Skeleton({ className = '', rounded = 'rounded-[16px]', animate = 'animate-pulse' }) {
  return (
    <div className={`bg-border/60 ${rounded} ${animate} ${className}`} />
  );
}

export function SkeletonText({ lines = 1, className = '', lastLineShort = false }) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 w-full ${lastLineShort && i === lines - 1 ? 'w-2/3' : ''}`} 
          rounded="rounded-md" 
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-[24px] border border-border bg-elevated p-5">
      <Skeleton className="mb-4 aspect-video w-full" rounded="rounded-[16px]" />
      <SkeletonText lines={2} className="mb-4" />
      <div className="mt-auto flex items-center justify-between">
        <Skeleton className="h-6 w-1/3" rounded="rounded-md" />
        <Skeleton className="h-8 w-1/4" rounded="rounded-full" />
      </div>
    </div>
  );
}

export function DashboardGridSkeleton({ cards = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: cards }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
