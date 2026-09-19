"use client";
import React, { useState, useEffect } from "react";
import { Heart, Play, Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useCottage } from "@/lib/context/CottageContext";
import { useRouter } from "next/navigation";
import ImageGalleryDialog from "../Propertyviewcomponents/image-gallery-dialog";
import VideoModal from "../Availableweekend/VideoModal";
import { useWishlist } from "@/hooks/useWishlist";

const CottageHero = () => {
  const cottage = useCottage();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const { isLiked, handleWishlist } = useWishlist({
    property: cottage,
    propertyType: "cottage",
  });

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

  const images =
    cottage?.cottageimages && cottage.cottageimages.length > 0
      ? cottage.cottageimages
      : cottage?.images && cottage.images.length > 0
      ? cottage.images
      : ["/placeholder.svg"];

  return (
    <>
      <div className="relative">
        <div className="relative h-64 bg-gray-50 overflow-hidden rounded-none">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    height={256}
                    unoptimized
                    width={400}
                    priority={index === 0}
                    alt={`${cottage?.name} ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Top-Left Tag / Badge */}
          {((Array.isArray(cottage?.tags) && cottage.tags.length > 0) ||
            (typeof cottage?.tags === "string" && cottage.tags)) && (
            <div className="absolute top-3 left-3 z-10">
              <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-xs border border-black/5 flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <span className="text-[11px] font-semibold text-neutral-900 tracking-tight capitalize">
                  {Array.isArray(cottage.tags) ? cottage.tags[0] : cottage.tags}
                </span>
              </div>
            </div>
          )}

          {/* Heart Icon */}
          <button
            type="button"
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-md rounded-full shadow-xs z-10 border border-black/5 active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
            aria-label={isLiked ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700 hover:text-red-500"
              }`}
            />
          </button>

          {/* View Photos & Video Buttons */}
          <div className="absolute bottom-6 right-3 flex items-center space-x-2 z-10">
            <button
              type="button"
              onClick={() => openGallery(0)}
              className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/25 text-white font-semibold text-xs px-3 py-1.5 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              View Photos
            </button>
            <VideoModal
              thumbnailSrc={images[0]}
              videoUrl={cottage?.reelVideo}
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

          {/* Slide Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
            {images.slice(0, 7).map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-5 bg-white" : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        initialIndex={galleryStartIndex}
        title={cottage?.name}
        property={cottage}
        propertyType="cottage"
      />
    </>
  );
};

export default CottageHero;
