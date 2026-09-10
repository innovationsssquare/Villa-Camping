import { Skeleton } from "@/components/ui/skeleton";

export function PropertyReviewSkeleton() {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 w-full h-[210px] sm:h-[225px] shadow-2xs select-none">
      {/* Top row: Avatar + Name + Google G */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-200 shrink-0" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-24 rounded-md bg-neutral-200" />
              <Skeleton className="h-2.5 w-20 rounded-md bg-neutral-200" />
            </div>
          </div>
          <Skeleton className="w-5 h-5 rounded-full bg-neutral-200 shrink-0" />
        </div>

        {/* Stars line */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-full bg-neutral-200" />
            ))}
          </div>
          <Skeleton className="h-2.5 w-14 rounded-md bg-neutral-200 ml-1" />
        </div>

        {/* Review text lines */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-full rounded-md bg-neutral-200" />
          <Skeleton className="h-3 w-5/6 rounded-md bg-neutral-200" />
          <Skeleton className="h-3 w-3/4 rounded-md bg-neutral-200" />
        </div>
      </div>

      {/* Bottom stay info bar */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 mt-2">
        <Skeleton className="h-7 flex-1 rounded-xl bg-neutral-100" />
        <Skeleton className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-neutral-200 shrink-0" />
      </div>
    </div>
  );
}

export default PropertyReviewSkeleton;
