"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Bed, Bath, Square, Flame } from "lucide-react"





export function PropertyMarker({ property, isSelected, onSelect }) {
  const [showCard, setShowCard] = useState(false)

  return (
    <div className="relative">
      {/* Price Marker */}
      <button
        onClick={onSelect}
        onMouseEnter={() => setShowCard(true)}
        onMouseLeave={() => setShowCard(false)}
        className={`
          relative px-3 py-2 rounded-full text-white font-semibold text-sm shadow-lg transition-all duration-200
          ${property.isHot ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"}
          ${isSelected ? "scale-110 shadow-xl" : "hover:scale-105"}
        `}
      >
        ₹{(property.price / 1000).toFixed(0)}K
        {property.isHot && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <Flame className="w-2 h-2 text-white" />
          </div>
        )}
      </button>

      {/* Property Card on Hover */}
      {showCard && (
        <Card className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 duration-200">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              {property.isHot && (
                <Badge className="absolute top-2 left-2 bg-secondary text-secondary-foreground">
                  <Flame className="w-3 h-3 mr-1" />
                  Hot Deal
                </Badge>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-card-foreground text-balance">{property.title}</h3>
                <p className="text-sm text-muted-foreground">{property.location}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{property.baths}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{property.sqft} sqft</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{property.rating}</span>
                  <span className="text-sm text-muted-foreground">({property.reviews})</span>
                </div>
                <div className="text-lg font-bold text-primary">₹{property.price.toLocaleString()}/night</div>
              </div>

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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
