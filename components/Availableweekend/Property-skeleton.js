import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeleton() {
  return (
    <Card className="relative w-52 overflow-hidden p-0 rounded-2xl border border-gray-300 md:w-full mx-auto">
      <CardHeader className="absolute z-20 top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 flex flex-row items-start justify-between p-0">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardHeader>

      <Skeleton className="w-full h-32 md:h-60" />

      <CardContent className="md:p-4 p-1 -mt-6 md:space-y-3 space-y-1 bg-white relative z-10">
        
        <Skeleton className="h-6 w-1/2" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        <div className="flex items-end justify-between p-2 ">
          <div className="space-y-1">
            <Skeleton className="h-7 md:w-60 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
