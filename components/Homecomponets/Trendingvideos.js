"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play } from "lucide-react";
import { Button } from "@heroui/react";

const trendingVideos = [
  {
    id: 1,
    title: "Agra Itinerary #agra #agrafort...",
    author: "Shaina Sharma",
    views: "201 Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    authorAvatar: "/indian-woman-profile.png",
  },
  {
    id: 2,
    title: "A perfect 3N/4D Wayanad itinerary",
    author: "Ournotfrom...",
    views: "11K Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    authorAvatar: "/travel-blogger-profile.jpg",
  },
  {
    id: 3,
    title: "Unique Things to do in Pondicherry",
    author: "Grishma Uda",
    views: "9 Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",

    authorAvatar: "/young-woman-smiling.png",
  },
  {
    id: 4,
    title: "Agra Itinerary #agra #agrafort...",
    author: "Shaina Sharma",
    views: "201 Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",

    authorAvatar: "/indian-woman-profile.png",
  },
  {
    id: 5,
    title: "A perfect 3N/4D Wayanad itinerary",
    author: "Ournotfrom...",
    views: "11K Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    authorAvatar: "/travel-blogger-profile.jpg",
  },
  {
    id: 6,
    title: "Unique Things to do in Pondicherry",
    author: "Grishma Uda",
    views: "9 Views",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",

    authorAvatar: "/young-woman-smiling.png",
  },
];

export default function TrendingVideos() {
  return (
    <div className="w-full px-4 md:py-6 py-2 bg-white mb-4">
      <div className="md:mb-6 mb-2 flex justify-between items-center w-full">
        <div>
          <h2 className="md:text-4xl  font-medium text-foreground">
            Trending Videos
          </h2>
          <div className="flex items-center  gap-1">
            <span className="text-sm text-gray-600">Powered By</span>
            <span className="text-sm font-medium text-red-500">📹 Shorts</span>
          </div>
        </div>
        <Button size="sm" className="flex gap-1 justify-between  items-center text-xs font-medium bg-orange-200 rounded-full ">
          <div className="p-1">
            <span>View All</span>
          </div>
          
          <div className="bg-orange-500 rounded-full flex justify-center items-center p-1">
            <Play className="fill-white text-white" size={12} />
          </div>
        </Button>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-3">
          {trendingVideos.map((video) => (
            <CarouselItem
              key={video.id}
              className="pl-3 basis-2/5 md:basis-6/36"
            >
              <Card className="overflow-hidden border border-gray-200 shadow-none bg-white rounded-xl p-0">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={video.image || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <Play
                          className="w-3 h-3 text-gray-800 ml-0.5"
                          fill="currentColor"
                        />
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-md font-medium">
                        {video.views}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <h3 className="font-medium md:text-sm text-xs text-black mb-3 line-clamp-2 leading-tight">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage
                          src={video.authorAvatar || "/placeholder.svg"}
                        />
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
