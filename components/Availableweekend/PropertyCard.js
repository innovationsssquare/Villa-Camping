import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Home,
  Bath,
  Utensils,
  Wifi,
  Mountain,
  Trees,
  Waves,
  Play,
  BadgeCheck,
} from "lucide-react";
import VideoModal from "./VideoModal";
import Image from "next/image";


const PropertyCardnew = ({
  title = "Paashaan - Khopoli",
  location = "Lonavala, Maharashtra",
  distance = "19.6km to Kune Falls",
  guests = 12,
  rooms = 4,
  baths = 4,
  price = "₹14,61,686",
  rating = 5,
  duration = "Min 2 Nights",
  isVerified = true,
  isBestRated = true,
  isLuxury = true,
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const propertyImages = [
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    ,
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
  ];

  const amenities = [
    { icon: Waves, label: "Heated Pool" },
    { icon: Trees, label: "Lawn" },
    { icon: Mountain, label: "Mountain View" },
    { icon: Utensils, label: "Meals Available" },
    { icon: Wifi, label: "WiFi" },
  ];

  const greatFor = ["Food", "Senior Citizens"];

  return (
    <Card
      className={`overflow-hidden shadow-none p-0 transition-all duration-300 bg-gradient-luxury border border-gray-300 ${className}`}
    >
      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex md:h-80">
        {/* Image Section */}
        <div className="relative w-2/5 bg-gray-100">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {propertyImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                     height={50}
                     width={50}
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          <div className="absolute top-4 left-4 flex gap-2">
            {isBestRated && (
              <Badge className="bg-card text-primary font-semibold">
                <Star className="w-3 h-3 mr-1" />
                Best Rated
              </Badge>
            )}
            {isLuxury && (
              <Badge className="bg-primary text-primary-foreground font-semibold">
                Luxury
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-card/80 hover:bg-card text-foreground"
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
              className="bg-card/80 hover:bg-card text-foreground"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal thumbnailSrc={propertyImages[0]} />
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
                    {title}
                  </h3>
                  {isVerified && (
                    <div className="w-4 h-4 bg-verified-green rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-card rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {location}
                  </span>
                  <span className="text-location-blue">{distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                  <span className="font-semibold">{rating} of 5</span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Upto {guests} Guests
              </span>
              <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {rooms} Rooms
              </span>
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {baths} Baths
              </span>
            </div>

            {/* Great For Tags */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mr-2">
                Great for:
              </span>
              <div className="inline-flex gap-2">
                {greatFor.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex gap-4">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 text-xs text-muted-foreground"
                >
                  <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                    <amenity.icon className="w-4 h-4 text-verified-green" />
                  </div>
                  <span className="text-center max-w-12">{amenity.label}</span>
                </div>
              ))}
              <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                  <span className="text-xs font-semibold text-verified-green">
                    27+
                  </span>
                </div>
                <span className="text-center">More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price and Booking Section */}
        <div className="w-1/4 p-6 border-l border-gray-200 flex flex-col justify-between">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">{duration}</div>
            <div className="text-2xl font-bold text-price-text mb-2">
              {price}
            </div>
            <div className="text-xs text-muted-foreground">
              for 23 Nights + Taxes (1 room)
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
          <Carousel className="w-full h-full">
            <CarouselContent>
              {propertyImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                  height={50}
                  unoptimized
                  width={50}
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" /> */}
          </Carousel>

          <div className="absolute top-4 left-4 flex gap-2">
            {isBestRated && (
              <Badge className="bg-white text-black rounded-full font-semibold text-xs">
                <Star className="w-3 h-3 mr-1" />
                Best Rated
              </Badge>
            )}
            {isLuxury && (
              <Badge className="bg-black text-primary-foreground rounded-full font-semibold text-xs">
                Luxury
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-card text-foreground h-8 w-8"
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
              className="bg-white/80 hover:bg-card text-foreground h-8 w-8"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal thumbnailSrc={propertyImages[0]} />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title, Rating and Location */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {title}
                </h3>
                {isVerified && (
                  <BadgeCheck className="text-xs text-green-500" size={14}/>
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {location}
                </span>
                <span className="text-blue-500">{distance}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-star-gold text-star-gold fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">{rating} of 5</span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Upto {guests} Guests
            </span>
            <span className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {rooms} Rooms
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {baths} Baths
            </span>
          </div>

          {/* Great For Tags */}
          <div className="mb-4">
            <span className="text-sm text-muted-foreground mr-2">
              Great for:
            </span>
            <div className="inline-flex gap-2">
              {greatFor.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-gray-200 text-black">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="flex gap-3 mb-4 overflow-hidden">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 text-xs text-muted-foreground min-w-fit"
              >
                <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                  <amenity.icon className="w-4 h-4 text-verified-green" />
                </div>
                <span className="text-center whitespace-nowrap">
                  {amenity.label}
                </span>
              </div>
            ))}
            <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground min-w-fit">
              <div className="w-8 h-8 rounded-full bg-success-light flex items-center justify-center">
                <span className="text-xs font-semibold text-verified-green">
                  27+
                </span>
              </div>
              <span className="text-center">More</span>
            </div>
          </div>

          {/* Price and Booking Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">{duration}</div>
                <div className="text-xs text-muted-foreground">
                  for 23 Nights + Taxes (1 room)
                </div>
              </div>
              <div className="text-xl font-bold text-price-text">{price}</div>
            </div>
            <div className="space-y-3">
              <Button className="w-full bg-black  text-primary-foreground font-semibold">
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
