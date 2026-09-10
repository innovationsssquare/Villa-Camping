import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeleton() {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="mt-2 space-y-1.5 px-0.5">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

