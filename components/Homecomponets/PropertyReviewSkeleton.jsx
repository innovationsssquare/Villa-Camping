import { Skeleton } from "@/components/ui/skeleton";

export function PropertyReviewSkeleton() {
  return (
    <div className="md:w-80 w-40 overflow-hidden p-0 rounded-xl border border-gray-200 bg-white">
      <Skeleton className="md:h-48 h-24 w-full" />

      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />

        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
