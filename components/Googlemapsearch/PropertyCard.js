import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

export const PropertyCard = ({ property, onClose, compact = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const images = property.images || [property.image];

  if (compact) {
    return (
      <Card className="w-full bg-white shadow-none border border-gray-200 rounded-xl overflow-hidden  transition-all duration-300 animate-fade-in">
        <CardContent className="p-0">
          <div className="flex">
            <Image
              height={40}
              width={40}
              src={property.image}
              alt={property.title}
              className="w-24 h-24 object-cover"
            />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-villa-primary">
                  ₹
                  {property.price >= 1000000
                    ? `${(property.price / 1000000).toFixed(1)}M`
                    : `${(property.price / 1000).toFixed(0)}K`}
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
                <span className="line-clamp-1">{property.address}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center">
                  <Bed className="w-3 h-3 mr-1" />
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-3 h-3 mr-1" />
                  <span>{property.baths}</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-3 h-3 mr-1" />
                  <span>{property.sqft}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full relative max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden animate-scale-in h-[60vh] mx-auto">
      <CardContent className="p-0">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
          >
            <X className="w-4 h-4" />
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
                      className="w-full h-56 object-cover"
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
              alt={property.title}
              className="w-full h-56 object-cover"
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

        <ScrollArea className="h-80">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-villa-primary">
                ₹{property.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-villa-text">
                {property.title}
              </h3>
              <Badge
                variant="outline"
                className="text-villa-text-muted capitalize"
              >
                {property.type}
              </Badge>
            </div>

            <div className="flex items-center text-villa-text-muted mb-4">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{property.address}</span>
            </div>

          
            <div className="flex gap-2">
              <Button className="flex-1 bg-black hover:bg-villa-primary/90">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline">
                <IoLogoWhatsapp className="text-green-600"/>
                Chat
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
