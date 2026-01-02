import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, Camera } from "lucide-react";
import Image from "next/image";
import { getDisplayPrice } from "./getDisplayPrice";

export const PropertyHoverCard = ({ property, position }) => {
  console.log("card",property)

  const displayPrice = getDisplayPrice(property.price);

  return (
    <div
      className="fixed z-50 pointer-events-none animate-fade-in"
      style={{
        left: position.x + 10,
        top: position.y - 100,
        transform:
          position.x > window.innerWidth / 2 ? "translateX(-100%)" : "none",
      }}
    >
      <Card className="w-60 bg-white p-0 shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <CardContent className="p-0">
          <div className="relative p-0">
            <Image
              src={property.image}
              height={50}
              width={50}
              unoptimized
              alt={property.title}
              className="w-full h-32 object-cover"
            />

            <div className="absolute top-2 left-2 flex gap-1">
              {property.isHot && (
                <Badge className="bg-red-500 text-white text-xs font-semibold">
                  🔥
                </Badge>
              )}
              {property.isDeal && (
                <Badge className="bg-green-500 text-white text-xs font-semibold">
                  💰
                </Badge>
              )}
              {property.has3DTour && (
                <Badge className="bg-blue-500 text-white text-xs font-semibold flex items-center gap-1">
                  <Camera className="w-2 h-2" />
                  3D
                </Badge>
              )}
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl font-bold text-villa-primary">
                 ₹{ getDisplayPrice(property.price)}
              </span>
              <Badge variant="outline" className="text-xs capitalize">
                {property.type}
              </Badge>
            </div>

            <h4 className="font-semibold text-sm text-villa-text mb-2 line-clamp-1">
              {property.title}
            </h4>

            <div className="flex items-center text-xs text-villa-text-muted mb-3">
              <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">{property.location}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
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
    </div>
  );
};
