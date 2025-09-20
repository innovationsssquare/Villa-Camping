"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, MapPin, Navigation, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LocationService} from "./location-service"



export function SearchDrawer({ isOpen, onClose, onLocationSelect, searchQuery, onSearchChange }) {
  const [selectedFilter, setSelectedFilter] = useState("for-rent")
  const [locations, setLocations] = useState([])
  const [recentSearches, setRecentSearches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Load locations when drawer opens or search query changes
  useEffect(() => {
    if (isOpen) {
      loadLocations()
    }
  }, [isOpen, searchQuery])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("villa-camp-recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const loadLocations = async () => {
    setIsLoading(true)
    try {
      let locationData

      if (searchQuery.trim()) {
        locationData = await LocationService.searchLocations(searchQuery)
      } else {
        locationData = await LocationService.getAvailableLocations()
      }

      setLocations(locationData)
    } catch (error) {
      console.error("Failed to load locations:", error)
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLocationSelect = (locationName) => {
    // Save to recent searches
    const updated = [locationName, ...recentSearches.filter((s) => s !== locationName)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("villa-camp-recent-searches", JSON.stringify(updated))

    onLocationSelect(locationName)
    onClose()
  }

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const nearbyLocations = await LocationService.getNearbyLocations({ lat: latitude, lng: longitude })
            if (nearbyLocations.length > 0) {
              handleLocationSelect(nearbyLocations[0].name)
            } else {
              handleLocationSelect("Current Location")
            }
          } catch (error) {
            handleLocationSelect("Current Location")
          }
        },
        () => {
          handleLocationSelect("Current Location")
        },
      )
    } else {
      handleLocationSelect("Current Location")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="bg-white w-full max-w-md mx-auto mt-16 rounded-t-2xl shadow-xl animate-in slide-in-from-bottom-full duration-300">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 border-none shadow-none text-base"
            autoFocus
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex p-4 gap-2">
          <Button
            variant={selectedFilter === "for-rent" ? "default" : "outline"}
            onClick={() => setSelectedFilter("for-rent")}
            className="flex-1"
          >
            For Rent
          </Button>
          <Button
            variant={selectedFilter === "sold" ? "default" : "outline"}
            onClick={() => setSelectedFilter("sold")}
            className="flex-1"
          >
            Sold
          </Button>
        </div>

        {/* Current Location Option */}
        <div className="px-4 pb-4">
          <button
            onClick={handleCurrentLocation}
            className="flex items-center gap-3 w-full p-3 hover:bg-muted rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Navigation className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium">Use my current location</span>
          </button>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent Searches
            </h3>
            <div className="space-y-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(search)}
                  className="flex items-center gap-3 w-full p-2 hover:bg-muted rounded-lg transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Available Locations */}
        <div className="px-4 pb-6 max-h-96 overflow-y-auto">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {searchQuery ? "Search Results" : "Available Locations"}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {locations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleLocationSelect(location.name)}
                  className="flex items-center justify-between w-full p-3 hover:bg-muted rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-card rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-card-foreground" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">{location.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {location.propertyCount} villas
                        </Badge>
                        {location.popularAmenities.slice(0, 2).map((amenity) => (
                          <Badge key={amenity} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="outline"
                      className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      {location.propertyCount}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchQuery && locations.length === 0 && (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">No locations found for {searchQuery}</div>
              <div className="text-sm text-muted-foreground">Try searching for Lonavala, Khandala, or Pune Hills</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
