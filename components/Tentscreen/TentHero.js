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
import { useRouter } from "next/navigation";
import { useCamping } from "@/lib/context/CampingContext";
import VideoModal from "../Availableweekend/VideoModal";
import ImageGalleryDialog from "../Propertyviewcomponents/image-gallery-dialog";

const TentHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();
  const camping = useCamping();
  const router = useRouter();
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
        <div className="relative h-60 bg-gray-50 overflow-hidden rounded-none">
          <Carousel setApi={setApi} className="w-full h-full">
            <CarouselContent>
              {camping?.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    src={image}
                    height={80}
                    unoptimized
                    width={50}
                    alt={`${camping?.name} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-none"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-0 hover:bg-black/80" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white border-0 hover:bg-black/80" /> */}
          </Carousel>

          {/* Best Rated Badge */}
          {camping?.tags && (
            <div className="absolute top-4 left-4 bg-background px-3 py-1 rounded-full flex items-center shadow-md z-10">
              {camping?.tags?.map((tag, k) => (
                <span key={k} className="text-xs font-medium capitalize">
                  ⭐ {tag}
                </span>
              ))}
            </div>
          )}

          {/* Heart Icon */}
          <button className="absolute top-4 right-4 p-2 bg-background rounded-full shadow-md z-10">
            <Heart className="w-5 h-5" />
          </button>

          {/* View Photos Button */}
          <Button
            onPress={() => openGallery(0)}
            size="md"
            className="absolute bottom-4 right-22 border bg-[#201e1e80]  border-gray-600   rounded-lg flex flex-col gap-0 justify-center items-center  text-white z-10"
          >
            <span className="text-xs font-medium">View</span>
            <span className="text-xs font-medium">Photos</span>
          </Button>
          <div className="absolute bottom-4 right-3 border bg-[#201e1e80]  border-gray-600   rounded-lg flex flex-col gap-0 justify-center items-center  text-white z-10">
            <VideoModal
              thumbnailSrc={camping?.images[0]}
              videoUrl={camping?.reelVideo}
            />
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {camping?.images.map((_, index) => (
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
      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={camping?.images}
        initialIndex={galleryStartIndex}
      />
    </>
  );
};

export default TentHero;
