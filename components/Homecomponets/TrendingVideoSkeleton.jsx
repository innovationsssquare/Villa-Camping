import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TrendingVideoSkeleton() {
  return (
    <Card className="border border-gray-200 shadow-none rounded-xl">
      <CardContent className="p-0">
        <Skeleton className="w-full h-40 rounded-t-xl" />
        <div className="p-2 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
