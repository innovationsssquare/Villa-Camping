import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Bed,
  Bath,
  Square,
  MapPin,
  Camera,
  Eye,
  Heart,
  Share,
  Phone,
} from "lucide-react";
import Image from "next/image";
import { IoLogoWhatsapp } from "react-icons/io";
import { getDisplayPrice } from "./getDisplayPrice";
import { useRouter } from "next/navigation";

export const PropertyCard = ({ property, onClose, compact = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const images = property.images || [property.image];
  const router = useRouter();


  
  if (compact) {
    return (
      <Card className="w-full p-0 bg-white shadow-none border border-gray-200 rounded-xl overflow-hidden  transition-all duration-300 animate-fade-in">
        <CardContent className="p-0">
          <div className="flex justify-between w-full">
            <Image
              height={40}
              width={40}
              unoptimized
              src={property.image}
              alt={property.title}
              className="w-24 h-auto object-cover"
            />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-villa-primary">
                  ₹{getDisplayPrice(property.price)}
                </span>
                <div className="flex gap-1">
                  {property.isHot && (
                    <Badge className="bg-red-500 text-white text-xs">🔥</Badge>
                  )}
                  {property.isDeal && (
                    <Badge className="bg-green-500 text-white text-xs">
                      💰
                    </Badge>
                  )}
                </div>
              </div>
              <h4 className="font-semibold text-sm text-villa-text mb-1 line-clamp-1">
                {property.title}
              </h4>
              <div className="flex items-center text-xs text-villa-text-muted mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{property.location}</span>
              </div>
              
            </div>
            <div className="justify-center items-center flex px-4">
               {property?.type === "villa" ? (
                <Button
                  onPress={() => router.push(`/view-Villa/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View 
                </Button>
              ) : property?.type === "camping" ? (
                <Button
                  onPress={() => router.push(`/view-Camping/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View 
                </Button>
              ) : property?.type === "cottage" ? (
                <Button
                  onPress={() => router.push(`/view-Cottage/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View 
                </Button>
              ) : property?.type === "hotel" ? (
                <Button
                  onPress={() => router.push(`/view-Hotel/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View 
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-60 p-0  relative max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden animate-scale-in h-auto md:h-[50vh] mx-auto">
      <CardContent className="p-0">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute cursor-pointer top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
          >
            <X className="w-2 h-2" />
          </button>
        )}

        <div className="relative">
          {images.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <Image
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-44 object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <Image
              src={property.image}
              height={20}
              width={20}
              unoptimized
              alt={property.title}
              className="w-full h-32 object-cover"
            />
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {property.isHot && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold animate-pulse">
                🔥 Hot
              </Badge>
            )}
            {property.isDeal && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                💰 Great Deal
              </Badge>
            )}
            {property.has3DTour && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-1">
                <Camera className="w-3 h-3" />
                3D Tour
              </Badge>
            )}
          </div>
        </div>

        <ScrollArea className="h-auto">
          <div className="p-3">
            <div className="flex items-center justify-between ">
              <span className="text-lg font-bold text-villa-primary">
                ₹{getDisplayPrice(property.price)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => setIsFavorite(!isFavorite)}
                  className="p-2"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
                <Button isIconOnly variant="light" className="p-2">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-md font-bold text-villa-text">
                {property.title}
              </h3>
              <Badge
                variant="outline"
                className="text-orange-500 capitalize bg-orange-200 border border-orange-500"
              >
                {property.type}
              </Badge>
            </div>

            <div className="flex items-center text-villa-text-muted mb-4">
              <MapPin className="w-4 h-4 mr-1 text-red-400 flex-shrink-0" />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="flex gap-2">
              {property?.type === "villa" ? (
                <Button
                  onPress={() => router.push(`/view-Villa/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              ) : property?.type === "camping" ? (
                <Button
                  onPress={() => router.push(`/view-Camping/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              ) : property?.type === "cottage" ? (
                <Button
                  onPress={() => router.push(`/view-Cottage/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              ) : property?.type === "hotel" ? (
                <Button
                  onPress={() => router.push(`/view-Hotel/${property?.id}`)}
                  className="flex-1 bg-black text-white hover:bg-villa-primary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
