"use client";
import React, { useState, useCallback, useEffect } from "react";
import { Heart, Camera, ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
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
import { useVilla } from "@/lib/context/VillaContext";
import { useRouter } from "next/navigation";
import ImageGalleryDialog from "../Propertyviewcomponents/image-gallery-dialog";
import VideoModal from "../Availableweekend/VideoModal";

const VillaHero = () => {
  const villa = useVilla();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <div className="relative">
        <div className="relative h-64 bg-gray-50 overflow-hidden rounded-none">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {villa?.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    height={256}
                    unoptimized
                    width={400}
                    priority={index === 0}
                    alt={`${villa?.name} ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Top-Left Tag / Badge - Redesigned, small, Airbnb luxury style */}
          {((Array.isArray(villa?.tags) && villa.tags.length > 0) || (typeof villa?.tags === "string" && villa.tags)) && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-black/5 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-900 tracking-tight capitalize">
                  {Array.isArray(villa.tags) ? villa.tags[0] : villa.tags}
                </span>
              </div>
            </div>
          )}

          {/* Heart Icon */}
          <button className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-xs z-10 border border-black/5 text-gray-700 hover:text-[#ff6900] active:scale-90 transition-transform">
            <Heart className="w-4 h-4" />
          </button>

          {/* View Photos & Video Buttons - Square, Transparent & Positioned at bottom-right above dots */}
          <div className="absolute bottom-6 right-3 flex items-center space-x-2 z-10">
            <button
              type="button"
              onClick={() => openGallery(0)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              View Photos
            </button>
            <VideoModal
              thumbnailSrc={villa?.images?.[0]}
              videoUrl={villa?.reelVideo}
              trigger={
                <button
                  type="button"
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white font-semibold text-xs px-2.5 py-1.5 rounded-xl shadow-md flex items-center gap-1 justify-center active:scale-95 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Video</span>
                </button>
              }
            />
          </div>

          {/* Carousel Dots - Strictly Centered at bottom with compact width to guarantee zero overlap */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10 pointer-events-none bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
            {villa?.images?.slice(0, 8).map((_, index) => (
              <span
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === (currentSlide % Math.min(8, villa.images.length))
                    ? "w-4 h-1.5 bg-white shadow-xs"
                    : "w-1.5 h-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={villa?.images}
        initialIndex={galleryStartIndex}
      />
    </>
  );
};

export default VillaHero;
