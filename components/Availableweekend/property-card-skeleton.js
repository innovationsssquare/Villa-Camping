"use client"

import { Card, CardHeader, CardFooter } from "@heroui/react"

export function PropertyCardSkeleton() {
  return (
    <Card className="w-full h-[400px] animate-pulse">
      <CardHeader className="absolute z-10 top-3 flex-row items-start justify-between w-full px-3">
        <div className="bg-gray-300 rounded-full px-2 py-1 flex items-center gap-1 w-16 h-6">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="w-6 h-3 bg-gray-400 rounded"></div>
        </div>

        <div className="bg-gray-300 rounded-full h-8 w-8 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
        </div>
      </CardHeader>

      <div className="relative w-full h-full bg-gray-300">
        {/* Navigation Buttons Skeleton */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-gray-400 rounded-full"></div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 bg-gray-400 rounded-full"></div>

        {/* Image Dots Skeleton */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        </div>
      </div>

      <div className="absolute bottom-20 right-3 bg-gray-400 text-xs px-2 py-1 rounded flex items-center gap-1 z-10 w-20 h-6">
        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        <div className="w-12 h-3 bg-gray-500 rounded"></div>
      </div>

      <CardFooter className="absolute bg-gray-800/60 bottom-0 z-10 border-t-1 border-gray-600/20 justify-between">
        <div className="flex flex-col gap-1 flex-grow">
          <div className="w-48 h-5 bg-gray-400 rounded"></div>

          <div className="flex items-center gap-1 mt-1">
            <div className="w-3 h-3 bg-gray-500 rounded"></div>
            <div className="w-32 h-3 bg-gray-500 rounded"></div>
          </div>

          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <div className="w-16 h-3 bg-gray-500 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <div className="w-12 h-3 bg-gray-500 rounded"></div>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <div className="w-12 h-3 bg-gray-500 rounded"></div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <div className="w-20 h-5 bg-gray-400 rounded"></div>
            <div className="w-16 h-3 bg-gray-500 rounded"></div>
          </div>
          <div className="w-28 h-3 bg-gray-500 rounded mt-1"></div>
        </div>

        <div className="bg-gray-400 rounded-full h-8 w-8 flex items-center justify-center">
          <div className="w-4 h-4 bg-gray-500 rounded"></div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default PropertyCardSkeleton
