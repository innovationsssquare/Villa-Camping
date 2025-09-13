"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";
import {
  Heart,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function Weekendcard({ property }) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !property?.images || property?.images?.length <= 1) {
      return;
    }
  }, [isMobile, property?.images]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < property?.images?.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < property?.images?.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property?.id]);

  return (
    <Card
      isFooterBlurred
      className="md:w-full md:h-[400px] h-60 w-52 rounded-2xl group hover:shadow-lg transition-all duration-300"
    >
      <CardHeader className="absolute z-10 md:top-3 top-0 flex-row items-start justify-between w-full md:px-3 px-1">
        {/* Rating Badge */}
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="md:text-sm text-xs font-medium text-black">
            {property?.rating}
          </span>
        </div>

        {/* Heart Icon */}
        <Button
          isIconOnly
          variant="flat"
          className="bg-white/50 backdrop-blur-sm hover:bg-white rounded-full md:h-8 md:w-8  "
          onPress={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={cn(
              "h-4 w-4 transition-colors duration-200",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </Button>
      </CardHeader>

      <div
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          removeWrapper
          alt={`${property?.name} - Image ${currentImageIndex + 1}`}
          className="z-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={
            property?.images?.[currentImageIndex] ||
            property?.image ||
            "/placeholder.svg"
          }
        />

        {property?.images && property?.images?.length > 1 && (
          <>
            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                currentImageIndex === 0 && "opacity-0 pointer-events-none"
              )}
              onPress={prevImage}
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </Button>

            <Button
              isIconOnly
              variant="flat"
              size="sm"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                currentImageIndex === property?.images?.length - 1 &&
                  "opacity-0 pointer-events-none"
              )}
              onPress={nextImage}
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </Button>
          </>
        )}

        {property?.images && property?.images?.length > 1 && (
          <div className="absolute md:top-4 top-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
            {property?.images.map((_, index) => (
              <Button
                key={index}
                isIconOnly
                size="sm"
                variant="flat"
                className={cn(
                  "w-2 h-2 min-w-2 rounded-full transition-all duration-200 p-0",
                  index === currentImageIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                )}
                onPress={() => goToImage(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Best Rated Badge */}
      {property?.bestRated && (
        <div className="absolute bottom-20 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          Best Rated
        </div>
      )}

      <CardFooter className="absolute bg-black/60 bottom-0 z-10 border-t-1 border-white/20 justify-between h-14 md:h-auto">
        <div className="flex flex-col gap-1 flex-grow">
          {/* Property Name */}
          <h3 className="text-white font-semibold md:text-lg text-xs leading-tight">
            {property?.name}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-white/80">
            <MapPin className="h-3 w-3" />
            <span className="text-xs">{property?.location?.addressLine}</span>
          </div>

          {/* Property Details */}
          <div className="md:flex hidden items-center gap-3 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Upto {property?.maxCapacity} Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              <span>{property?.rooms} Rooms</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-3 w-3" />
              <span>{property?.baths} Baths</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold text-white">
              ₹{property?.basePricePerNight?.toLocaleString()}
            </span>
            {property?.basePricePerNight && (
              <span className="text-xs text-white/60 line-through">
                ₹{property?.basePricePerNight?.toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-xs text-white/60">For Per Night + Taxes</span>
        </div>

        <Button
          onPress={() => router.push(`/view-villa/${property._id}`)}
          size="sm"
          radius="full"
          className="bg-transparent text-sm font-bold border border-white text-white hover:bg-white/90 transition-all duration-200 absolute md:right-6 md:bottom-6 right-3 bottom-3"
        >
          Book Now
        </Button>
      </CardFooter>
    </Card>
  );
}

export default Weekendcard;
