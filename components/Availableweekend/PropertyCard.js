import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Users,
  Utensils,
  Wifi,
  Trees,
  Waves,
  Play,
  BadgeCheck,
} from "lucide-react";
import VideoModal from "./VideoModal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Bed,
  Bath,
  Mountain,
  Sun,
  Home,
  Coffee,
  Tv,
  Wind,
  Baby,
  Snowflake,
  AirVent,
  Building2,
  GlassWater,
} from "lucide-react";
import { FaUmbrellaBeach, FaPeopleGroup, FaChild, FaTv } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

const PropertyCardnew = ({ property }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();

  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const amenitiesIcons = {
    "AC": <Wind className="w-6 h-6 text-gray-600" />,
    WiFi: <Wifi className="w-6 h-6 text-gray-600" />,
    Balcony: <Home className="w-6 h-6 text-gray-600" />,
    TV: <FaTv className="w-6 h-6 text-gray-600" />,
    "Breakfast Included": <Utensils className="w-6 h-6 text-gray-600" />,
    "BBQ Grill": <Waves className="w-6 h-6 text-gray-600" />,
    Jacuzzi: <Coffee className="w-6 h-6 text-gray-600" />,
    "Mini Bar": <GlassWater className="w-6 h-6 text-gray-600" />,
    Heater: <Snowflake className="w-6 h-6 text-gray-600" />,
  };

  const greatForIcons = {
    "Mountain View": <Mountain className="w-4 h-4 text-gray-600" />,
    "Ideal for Families": <FaChild className="w-4 h-4 text-gray-600" />,
    "Ideal for Groups": <FaPeopleGroup className="w-4 h-4 text-gray-600" />,
    Beachfront: <FaUmbrellaBeach className="w-4 h-4 text-gray-600" />,
    "Nature Retreat": <Trees className="w-4 h-4 text-gray-600" />,
    "Romantic Getaway": <Heart className="w-4 h-4 text-gray-600" />,
  };

  return (
    <Card
      className={`overflow-hidden shadow-none p-0 transition-all duration-300 bg-gradient-luxury border border-gray-300`}
    >
      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex md:h-80">
        {/* Image Section */}
        <div className="relative w-2/5 bg-gray-100">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {property?.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    height={50}
                    width={50}
                    unoptimized
                    src={image}
                    alt={`${property?.name} - Image ${index + 1}`}
                    className="w-full h-80 object-fill"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          <div className="absolute top-4 left-4 flex gap-2">
            {property?.tags && (
              <Badge className="bg-white text-black font-normal">
                <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                Best Rated
              </Badge>
            )}
            {/* {isLuxury && (
              <Badge className="bg-primary text-primary-foreground font-light">
                Luxury
              </Badge>
            )} */}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/50 hover:bg-white text-black"
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/50 hover:bg-white text-black"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal
              thumbnailSrc={property?.images[0]}
              videoUrl={property?.reelVideo}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Title and Location */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {property?.name}
                  </h3>
                  {property?.isapproved && (
                    <div className="w-4 h-4 bg-verified-green rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-card rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property?.address?.addressLine}, {property?.address?.city}
                  </span>
                  <span className="text-location-blue">23km</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                  <span className="font-semibold">
                    {property?.averageRating} of 5
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Upto {property?.maxCapacity} Guests
              </span>
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {property?.rooms} Rooms
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {property?.baths} Baths
              </span>
            </div>

            {/* Great For Tags */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mr-2">
                Great for:
              </span>
              <div className="inline-flex gap-2">
                {property?.greatFor?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex gap-4">
              {property?.topamenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
                >
                  <div>
                    {amenitiesIcons[amenity] || (
                      <Building2 className="w-6 h-6 text-gray-600" />
                    )}
                    {index === 5 && villa.topamenities.length > 6 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          +{villa?.amenities?.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price and Booking Section */}
        <div className="w-1/4 p-6 border-l border-gray-200 flex flex-col justify-between">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">
              Min 1 Nights
            </div>
            <div className="text-2xl font-bold text-price-text mb-2">
              {property?.pricing?.weekdayPrice}{" "}
            </div>
            <div className="text-xs text-muted-foreground">
              for 1 Nights + Taxes
            </div>
          </div>
          <div className="space-y-3">
            <Button className="w-full bg-black hover:bg-black text-primary-foreground font-semibold">
              View →
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout (Vertical) */}
      <div className="md:hidden">
        {/* Image Section */}
        <div className="relative h-auto bg-gray-100">
          <Carousel className="w-full h-64" setApi={setApi}>
            <CarouselContent>
              {property?.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    height={50}
                    unoptimized
                    width={50}
                    src={image}
                    alt={`${property?.name} - Image ${index + 1}`}
                    className="w-full h-64 object-fill"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" /> */}
          </Carousel>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {property?.images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            {property?.tags &&
              property?.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-white text-black rounded-full font-semibold text-xs"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            {/* {isLuxury && (
              <Badge className="bg-black text-primary-foreground rounded-full font-semibold text-xs">
                Luxury
              </Badge>
            )} */}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-card text-foreground rounded-md h-8 w-8"
              onPress={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              
              size="icon"
              className="bg-white/80 hover:bg-card text-foreground rounded-md h-8 w-8"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal
              thumbnailSrc={property?.images[0]}
              videoUrl={property?.reelVideo}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title, Rating and Location */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {property?.name}
                </h3>
                {property?.isapproved && (
                  <BadgeCheck className="text-xs text-green-500" size={14} />
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {property?.address?.addressLine}, {property?.address?.city}
                </span>
                <span className="text-blue-500">5km</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-star-gold text-star-gold fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">
                  {property?.averageRating} of 5
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Upto {property?.maxCapacity} Guests
            </span>
            <span className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property?.rooms} Rooms
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property?.baths} Baths
            </span>
          </div>

          {/* Great For Tags */}
          <div className="mb-4">
            {property?.greatFor?.length > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-wrap  items-center">
                  <p className="text-sm text-villa-text-light">Great for:</p>
                  {property.greatFor.slice(0, 1).map((item, index) => (
                    <div
                      key={index}
                      className="bg-villa-green/10 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {greatForIcons[item] || (
                        <Sun className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-5   gap-3 mb-4 overflow-hidden">
            {property?.topamenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col  items-center gap-1 text-xs text-muted-foreground w-full px-2"
              >
                <div>
                  {amenitiesIcons[amenity] || (
                    <Building2 className="w-6 h-6 text-gray-600" />
                  )}
                  {index === 5 && villa.topamenities.length > 6 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        +{villa?.amenities?.length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs">{amenity}</p>
              </div>
            ))}
          </div>

          {/* Price and Booking Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  Min 1 Nights
                </div>
                <div className="text-xs text-muted-foreground">
                  for 1 Nights + Taxes
                </div>
              </div>
              <div className="text-xl font-bold text-price-text">
                {property?.pricing?.weekdayPrice}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() =>
                  router.push(`/view-villa/68e6b22178066ac5b42c4e98`)
                }
                className="w-full bg-black  text-primary-foreground font-semibold"
              >
                Book Now →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCardnew;
