"use client"

import { useState } from "react"
import { Heart, Star, Users, Bed, Bath, MapPin, Trash2 } from "lucide-react"
import { Button } from "@heroui/react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"



export function PropertyCardHorizontal({ property, onRemove }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }

  const discount = property.originalPrice
    ? Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)
    : 0

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full md:w-80 h-48 md:h-56 flex-shrink-0">
          <img
            src={property.images[currentImageIndex] || "/placeholder.svg"}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Navigation Arrows */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {property.bestRated && <Badge className="bg-yellow-500 text-white text-xs px-2 py-1">Best Rated</Badge>}
            {property.popular && <Badge className="bg-blue-600 text-white text-xs px-2 py-1">Popular</Badge>}
            {property.seasonal && <Badge className="bg-green-600 text-white text-xs px-2 py-1">Seasonal</Badge>}
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-gray-900">{property.rating}</span>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              {/* Property Name */}
              <h3 className="font-semibold text-lg md:text-xl text-gray-900 mb-2 line-clamp-2">{property.name}</h3>

              {/* Location */}
              <div className="flex items-center gap-1 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm line-clamp-1">{property.location}</span>
              </div>
            </div>

            {/* Remove Button */}
            {onRemove && (
              <button
                onClick={() => onRemove(property.id)}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 md:gap-6 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Upto {property.guests}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Guests</span>
            </div>
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{property.rooms}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Rooms</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{property.baths}</span>
              <span className="text-xs text-gray-500 hidden sm:inline">Baths</span>
            </div>
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-gray-900">₹{property.price.toLocaleString()}</span>
              {property.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{property.originalPrice.toLocaleString()}</span>
              )}
              {discount > 0 && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                  {discount}% OFF
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Heart className="w-4 h-4 mr-1 fill-red-500 text-red-500" />
                Saved
              </Button>
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 px-6">
                Book Now
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-2">For Per Night + Taxes</div>
        </CardContent>
      </div>
    </Card>
  )
}
