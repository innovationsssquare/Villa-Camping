import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PropertyCardSkeletonnew = () => {
  return (
    <Card className="overflow-hidden p-0 shadow-luxury hover:shadow-xl transition-all duration-300 bg-gradient-luxury border-0">
      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex md:h-80 p-0">
        {/* Image Section */}
        <div className="relative w-2/5 bg-gray-100 p-0">
          <Skeleton className="w-full h-full" />
          
          {/* Badges area */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          
          {/* Action buttons area */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          {/* Video button area */}
          <div className="absolute bottom-4 left-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Title and Location */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Great For Tags */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>

            {/* Amenities */}
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center gap-1">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price and Booking Section */}
        <div className="w-1/4 p-6 border-l border-gray-200 flex flex-col justify-between">
          <div className="text-right">
            <Skeleton className="h-4 w-20 mb-1 ml-auto" />
            <Skeleton className="h-8 w-32 mb-2 ml-auto" />
            <Skeleton className="h-3 w-40 ml-auto" />
          </div>
          <div className="space-y-3">
            <div className="p-2 border border-gray-200 rounded-md">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
              </div>
            </div>
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>

      {/* Mobile Layout (Vertical) */}
      <div className="md:hidden p-0">
        {/* Image Section */}
        <div className="relative h-64  ">
          <Skeleton className="w-full h-full p-0" />
          
          {/* Badges area */}
          <div className="absolute top-4 left-4 flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          
          {/* Action buttons area */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          {/* Video button area */}
          <div className="absolute bottom-4 left-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title, Rating and Location */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Great For Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-3 mb-4 ">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1 min-w-fit">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>

          {/* Price and Booking Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-3">
              <div className="p-2 border border-gray-200 rounded-md">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCardSkeletonnew;