import { Card, CardContent } from "@/components/ui/card"
import {Skeleton} from "@heroui/react";
import { Badge } from "@/components/ui/badge"

export default function VillaScreenSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 animate-pulse">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-50 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Image Gallery Skeleton */}
      <div className="relative bg-gray-200">
        <Skeleton className="w-full h-64 sm:h-80" />
        <div className="absolute bottom-4 right-4 flex gap-2 items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Villa Title & Location */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

    

        {/* Description */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-24 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Check-in Details */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-28 mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-muted rounded-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-8 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-16" />
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Booking Bar */}
      <div className="sticky bottom-0 bg-background border-t border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-24 mb-1" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
