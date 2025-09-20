"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Bed,
  Bath,
  Square,
  Flame,
  Heart,
  Share,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";

export function PropertyCard({
  property,
  isSelected,
  onSelect,
  variant = "full",
}) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock multiple images for carousel
  const images = [
    property.image,
    property.image.replace("key=99cvr", "key=abc123"),
    property.image.replace("key=99cvr", "key=def456"),
  ];

  if (variant === "compact") {
    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? "ring-2 ring-primary shadow-lg" : ""
        }`}
        onClick={onSelect}
      >
        <CardContent className="p-0">
          <div className="flex gap-3 p-3">
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover rounded-lg"
              />
              {property.isHot && (
                <Badge className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs px-1">
                  Hot
                </Badge>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-card-foreground truncate">
                {property.title}
              </h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                <span className="flex items-center gap-1">
                  <Bed className="w-3 h-3" />
                  {property.beds}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3 h-3" />
                  {property.baths}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{property.rating}</span>
                </div>
                <div className="text-sm font-bold text-primary">
                  ₹{(property.price / 1000).toFixed(0)}K
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 hover:shadow-xl ${
        isSelected ? "ring-2 ring-primary shadow-xl" : ""
      }`}
    >
      <CardContent className="p-0">
        {/* Image Carousel */}
        <div className="relative">
          <div className="relative h-48 overflow-hidden">
            <img
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />

            {/* Image Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isHot && (
              <Badge className="bg-secondary text-secondary-foreground shadow-lg">
                <Flame className="w-3 h-3 mr-1" />
                Hot Deal
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorited(!isFavorited);
              }}
            >
              <Heart
                className={`w-4 h-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="w-8 h-8 bg-white/90 hover:bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-card-foreground text-balance leading-tight">
              {property.title}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.location}
            </p>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{property.beds} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{property.baths} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{property.sqft} sqft</span>
            </div>
          </div>

          {/* Rating and Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({property.reviews} reviews)
              </span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">
                ₹{property.price.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">per night</div>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                // Handle booking
              }}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                // Handle contact
              }}
            >
              <Users className="w-4 h-4 mr-2" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
