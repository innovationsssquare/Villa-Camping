import React, { useState, useCallback, useEffect } from "react";
import { Heart, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import villaHeroImage from "@/public/Homeasset/villa-hero.jpg";
import Image from "next/image";
import { Button } from "@heroui/react";

const  HotelHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();
  const images = [
    villaHeroImage,
    villaHeroImage,
    villaHeroImage,
    villaHeroImage,
  ];

  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative">
      <div className="relative h-60 bg-gray-50 overflow-hidden rounded-none">
        <Carousel setApi={setApi} className="w-full h-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image}
                  alt={`Barkat Villa ${index + 1}`}
                  className="w-full h-64 object-cover rounded-none"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-0 hover:bg-black/80" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-0 hover:bg-black/80" /> */}
        </Carousel>

        {/* Best Rated Badge */}
        <div className="absolute top-4 left-4 bg-background px-3 py-1 rounded-full flex items-center shadow-md z-10">
          <span className="text-xs font-medium">⭐ Best Rated</span>
        </div>

        {/* Heart Icon */}
        <button className="absolute top-4 right-4 p-2 bg-background rounded-full shadow-md z-10">
          <Heart className="w-5 h-5" />
        </button>

        {/* View Photos Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button size="md" className="absolute bottom-3 right-3 border bg-[#201e1e80]  border-gray-600   rounded-lg flex flex-col gap-0 justify-center items-center  text-white z-10">
              <span className="text-xs font-medium">View</span>
              <span className="text-xs font-medium">Photos</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Villa Photo Gallery</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Villa ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default  HotelHero;
