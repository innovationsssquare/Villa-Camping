import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import Image from "next/image";






export function PropertyCard({ property, onBookNow }) {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Use the imported hero image as fallback
  const displayImages = property.images || [property.image || propertyHero];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

    if (isLeftSwipe && currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < displayImages.length - 1) {
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
  }, [property._id]);

  const handleBookNow = () => {
    if (onBookNow) {
      onBookNow(property._id);
    }
  };

  return (
    <Card className="relative overflow-hidden p-0   transition-all duration-300 ease-smooth group rounded-2xl border border-gray-300  w-full mx-auto">
      {/* Card Header with Rating and Like Button */}
      <CardHeader className="absolute z-20 top-2 md:top-3 left-2 md:left-3 right-2 md:right-3 flex flex-row items-start justify-between p-0">
        {/* Rating Badge */}
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-2 md:px-3 py-1 md:py-1.5 flex items-center gap-1 md:gap-1.5 shadow-lg">
          <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-rating-star text-rating-star" />
          <span className="text-xs md:text-sm font-medium text-foreground">
            {property.rating}
          </span>
        </div>

        {/* Heart Button */}
        <Button
          size="sm"
          variant="secondary"
          className="bg-white/80 backdrop-blur-sm hover:bg-white/95 rounded-full h-6 w-6 md:h-8 md:w-8 p-0 border-0 shadow-lg"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart
            className={cn(
              "h-3 w-3 md:h-4 md:w-4 transition-all duration-200 ease-bounce",
              isLiked ? "fill-heart-red text-heart-red" : "text-gray-600"
            )}
          />
        </Button>
      </CardHeader>

      {/* Image Carousel */}
      <div
        className="relative w-full h-32 md:h-72 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
        height={50}
        width={50}
        unoptimized
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-smooth"
          src={displayImages[currentImageIndex]}
        />

        {/* Navigation Arrows */}
        {displayImages.length > 1 && (
          <>
            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-backdrop-blur/80 hover:bg-backdrop-blur rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                currentImageIndex === 0 && "pointer-events-none"
              )}
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-backdrop-blur/80 hover:bg-backdrop-blur rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                currentImageIndex === displayImages.length - 1 && "pointer-events-none"
              )}
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </Button>
          </>
        )}

        {/* Image Indicators */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {displayImages.map((_, index) => (
              <Button
                key={index}
                size="sm"
                variant="secondary"
                className={cn(
                  "w-2 h-2 min-w-0 rounded-full transition-all duration-200 p-0 border-0",
                  index === currentImageIndex
                    ? "bg-backdrop-blur"
                    : "bg-backdrop-blur/50 hover:bg-backdrop-blur/70"
                )}
                onClick={() => goToImage(index)}
              />
            ))}
          </div>
        )}

        {/* Best Rated Badge */}
        {property.bestRated && (
          <div className="absolute bottom-3 right-3 bg-white text-card-text-light text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10 font-medium">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            Best Rated
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>

      {/* Card Content */}
      <CardContent className="md:p-4   p-1 -mt-6 md:space-y-3 space-y-1">
        {/* Property Name */}
        <h3 className="font-semibold md:text-lg text-sm text-foreground leading-tight">
          {property.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-card-text-muted">
          <MapPin className="h-4 w-4" />
          <span className="md:text-sm text-xs">{property.location.addressLine}</span>
        </div>

        {/* Property Details */}
        <div className="flex items-center gap-4 md:text-sm text-xs text-card-text-muted">
          <div className="flex items-center gap-1">
            <span>Up to {property.maxCapacity} Guests</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{property.rooms} Rooms</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{property.baths} Baths</span>
          </div>
        </div>

        {/* Pricing and Book Button */}
        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                ₹{property?.basePricePerNight?.toLocaleString()}
              </span>
              {property?.originalPrice && (
                <span className="text-sm text-card-text-muted line-through">
                  ₹{property?.originalPrice?.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-xs text-card-text-muted">For Per Night + Taxes</span>
          </div>

          {/* <Button
            onClick={handleBookNow}
            className=" text-black bg-white border text-xs font-semibold hover:shadow-lg transition-all duration-200 ease-bounce rounded-md px-6"
          >
            Book Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}

export default PropertyCard;