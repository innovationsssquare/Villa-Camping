import { Skeleton } from "@/components/ui/skeleton";

export function TrendingVideoSkeleton() {
  return (
    <div className="relative aspect-[9/15] sm:aspect-[9/16] w-full rounded-2xl overflow-hidden border border-neutral-200/80 bg-neutral-100 flex flex-col justify-between p-2.5 sm:p-3">
      {/* Top badges */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-14 rounded-full bg-neutral-200" />
        <Skeleton className="h-4 w-12 rounded-full bg-neutral-200" />
      </div>

      {/* Center play button placeholder */}
      <div className="flex items-center justify-center">
        <Skeleton className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-neutral-200" />
      </div>

      {/* Bottom info */}
      <div className="space-y-1.5">
        <Skeleton className="h-3.5 w-4/5 rounded-md bg-neutral-200" />
        <div className="flex items-center gap-1.5 pt-0.5">
          <Skeleton className="w-4 h-4 rounded-full bg-neutral-200 shrink-0" />
          <Skeleton className="h-3 w-1/2 rounded-md bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

export default TrendingVideoSkeleton;
