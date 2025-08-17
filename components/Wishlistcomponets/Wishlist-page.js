"use client"

import { useState } from "react"
import { Heart, Grid, List } from "lucide-react"
import { Button } from "@heroui/react"
import { PropertyCardHorizontal } from "./property-card-horizontal"

// Mock wishlist data
const mockWishlistProperties = [
  {
    id: 1,
    name: "The Ganga House",
    location: "Varanasi, Uttar Pradesh",
    category: "Villa",
    propertyType: "2BHK",
    rating: 4.8,
    guests: 10,
    rooms: 4,
    baths: 2,
    price: 20847,
    originalPrice: 25000,
    images: ["/luxury-villa-pool.png", "/villa-bedroom-interior.png", "/luxurious-villa-living-room.png"],
    bestRated: true,
    popular: false,
    seasonal: false,
  },
  {
    id: 2,
    name: "Barkat Villa - Ramgarh",
    location: "Nainital, Uttarakhand",
    category: "Villa",
    propertyType: "3BHK",
    rating: 4.8,
    guests: 15,
    rooms: 5,
    baths: 5,
    price: 50523,
    originalPrice: 54948,
    images: ["/placeholder-y1um0.png", "/villa-mountain-view.png", "/villa-dining-area.png"],
    bestRated: false,
    popular: true,
    seasonal: false,
  },
  {
    id: 3,
    name: "Mountain Camp Retreat",
    location: "Manali, Himachal Pradesh",
    category: "Camping",
    propertyType: "4BHK",
    rating: 4.5,
    guests: 6,
    rooms: 4,
    baths: 2,
    price: 8500,
    originalPrice: null,
    images: ["/mountain-camping-site.png", "/mountain-tents.png", "/campfire-mountain-view.png"],
    bestRated: false,
    popular: false,
    seasonal: true,
  },
]

export default function WishlistPage() {
  const [wishlistProperties, setWishlistProperties] = useState(mockWishlistProperties)
  const [viewMode, setViewMode] = useState("list")

  const handleRemoveFromWishlist = (propertyId) => {
    setWishlistProperties((prev) => prev.filter((property) => property.id !== propertyId))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
                {wishlistProperties.length} properties
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === "list" ? "solid" : "outline"}
                onClick={() => setViewMode("list")}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "grid" ? "solid" : "outline"}
                onClick={() => setViewMode("grid")}
                className="p-2"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistProperties.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Start exploring and save your favorite properties</p>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">Explore Properties</Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 gap-6" : "space-y-6"}>
            {wishlistProperties.map((property) => (
              <PropertyCardHorizontal key={property.id} property={property} onRemove={handleRemoveFromWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
