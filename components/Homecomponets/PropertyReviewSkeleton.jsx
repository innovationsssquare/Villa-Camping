import { Skeleton } from "@/components/ui/skeleton";

export function PropertyReviewSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-2.5 sm:p-4 w-full h-[200px] sm:h-[240px] shadow-2xs select-none">
      <div>
        {/* Top row: Avatar + Name + Badge */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <Skeleton className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-neutral-200 shrink-0" />
            <div className="space-y-1 min-w-0">
              <Skeleton className="h-3 sm:h-3.5 w-16 sm:w-24 rounded-md bg-neutral-200" />
              <Skeleton className="h-2 sm:h-2.5 w-12 sm:w-16 rounded-md bg-neutral-200" />
            </div>
          </div>
          <Skeleton className="w-5 sm:w-14 h-4 sm:h-5 rounded-full bg-neutral-200 shrink-0" />
        </div>

        {/* Stars line */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-neutral-200" />
            ))}
          </div>
          <Skeleton className="h-2 sm:h-2.5 w-10 sm:w-14 rounded-md bg-neutral-200 ml-1" />
        </div>

        {/* Review text lines */}
        <div className="space-y-1 mb-2 sm:mb-2.5">
          <Skeleton className="h-2.5 sm:h-3 w-full rounded-md bg-neutral-200" />
          <Skeleton className="h-2.5 sm:h-3 w-4/5 rounded-md bg-neutral-200" />
        </div>

        {/* Image thumbnails stack row */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Skeleton className="w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-neutral-200 shrink-0" />
          <Skeleton className="w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-neutral-200 shrink-0" />
          <Skeleton className="w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl bg-neutral-200 shrink-0 hidden xs:block" />
        </div>
      </div>

      {/* Bottom stay info bar */}
      <div className="flex items-center justify-between gap-1.5 pt-1.5 sm:pt-2 border-t border-neutral-100 mt-1.5">
        <Skeleton className="h-5 sm:h-6 flex-1 rounded-lg sm:rounded-xl bg-neutral-100" />
      </div>
    </div>
  );
}

export default PropertyReviewSkeleton;
