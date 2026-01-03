"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Play } from "lucide-react";
import { Button } from "@heroui/react";

import { TrendingVideoSkeleton } from "./TrendingVideoSkeleton";
import VideoModal from "../Availableweekend/VideoModal";
import { fetchTrendingReels } from "@/Redux/Slices/propertiesSlice";

export default function TrendingVideos() {
  const dispatch = useDispatch();
  const { reelsvideo, reelloading, reelerror } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchTrendingReels());
  }, [dispatch]);

  return (
    <div className="w-full px-4 md:py-6 py-2 bg-white mb-4">
      {/* Header */}
      <div className="md:mb-6 mb-2 flex justify-between items-center w-full">
        <div>
          <h2 className="md:text-4xl font-medium text-foreground">
            Trending Videos
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">Powered By</span>
            <span className="text-sm font-medium text-red-500">📹 Shorts</span>
          </div>
        </div>

        <Button
          size="sm"
          className="flex gap-1 items-center text-xs font-medium bg-orange-200 rounded-full"
        >
          <span>View All</span>
          <div className="bg-orange-500 rounded-full flex justify-center items-center p-1">
            <Play className="fill-white text-white" size={12} />
          </div>
        </Button>
      </div>

      {/* Carousel */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-3">
          {reelloading
            ? Array.from({ length: 4 }).map((_, i) => (
                <CarouselItem key={i} className="pl-3 basis-2/5 md:basis-6/36">
                  <TrendingVideoSkeleton />
                </CarouselItem>
              ))
            : reelsvideo.map((video) => (
                <CarouselItem
                  key={video.id}
                  className="pl-3 basis-2/5 md:basis-6/36"
                >
                  <Card className="overflow-hidden border border-gray-200 shadow-none bg-white rounded-xl p-0">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Video Modal Trigger */}
                        <img
                          src={video.image || "/placeholder.svg"}
                          alt={video.title}
                          className="w-full h-40 object-cover rounded-t-xl"
                        />
                        <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <VideoModal
                              thumbnailSrc={video.image}
                              videoUrl={video.videoUrl}
                            />
                        </div>

                        <div className="absolute bottom-2 left-2">
                          <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                            {video.views}
                          </span>
                        </div>
                      </div>

                      <div className="p-2">
                        <h3 className="font-medium md:text-sm text-xs text-black mb-3 line-clamp-2">
                          {video.title}
                        </h3>

                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5">
                            <AvatarFallback className="text-xs bg-gray-200">
                              {video.author.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <span className="text-xs md:text-sm text-gray-600 font-medium truncate">
                            {video.author}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselPrevious className="left-0 -translate-x-1/2 hidden" />
        <CarouselNext className="right-0 translate-x-1/2 hidden" />
      </Carousel>
    </div>
  );
}
