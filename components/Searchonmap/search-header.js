"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchDrawer } from "./search-drawer"

export function SearchHeader({ searchQuery, onSearchChange, propertyCount }) {
  const [showFilters, setShowFilters] = useState(false)
  const [showSearchDrawer, setShowSearchDrawer] = useState(false)

  const handleLocationSelect = (location) => {
    if (location === "current") {
      // Handle current location logic
      onSearchChange("Current Location")
    } else {
      onSearchChange(location)
    }
  }

  return (
    <>
      <div className="bg-white border-b border-border p-4 space-y-4 relative z-10">
        {/* Search Bar */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowSearchDrawer(true)}
            className="flex-1 flex items-center gap-3 h-12 px-4 bg-input border border-border rounded-lg text-left hover:bg-muted transition-colors"
          >
            <Search className="text-muted-foreground w-4 h-4 flex-shrink-0" />
            <span className={`text-base ${searchQuery ? "text-foreground" : "text-muted-foreground"}`}>
              {searchQuery || "Search Lonavala, Pune, Khandala..."}
            </span>
          </button>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 bg-transparent"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {propertyCount} Villas
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            ₹5K-15K
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Pool
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Mountain View
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            Hot Deals
          </Badge>
          <Badge variant="outline" className="whitespace-nowrap">
            4+ Beds
          </Badge>
        </div>

        {/* Extended Filters */}
        {showFilters && (
          <div className="bg-card rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Price Range</label>
                <select className="w-full p-2 border border-border rounded-md bg-input">
                  <option>₹5K - ₹15K</option>
                  <option>₹10K - ₹25K</option>
                  <option>₹20K+</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-card-foreground mb-2 block">Bedrooms</label>
                <select className="w-full p-2 border border-border rounded-md bg-input">
                  <option>Any</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {["Pool", "WiFi", "AC", "Kitchen", "Parking", "Garden", "Mountain View", "Valley View"].map(
                  (amenity) => (
                    <Badge
                      key={amenity}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {amenity}
                    </Badge>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <SearchDrawer
        isOpen={showSearchDrawer}
        onClose={() => setShowSearchDrawer(false)}
        onLocationSelect={handleLocationSelect}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </>
  )
}
