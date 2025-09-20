import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SUGGESTED_LOCATIONS = [
  {
    id: "1",
    name: "Lonavala",
    type: "city",
    coordinates: [73.4062, 18.7537],
    propertyCount: 45,
    description: "Hill station villas with scenic views",
    features: ["45 villas", "Hill Station", "Scenic Views"],
  },
  {
    id: "2",
    name: "Khandala",
    type: "area",
    coordinates: [73.3931, 18.7322],
    propertyCount: 23,
    description: "Peaceful retreat homes in nature",
    features: ["23 villas", "Nature Views", "Weekend Getaway"],
  },
  {
    id: "3",
    name: "Pune Hills",
    type: "area",
    coordinates: [73.8567, 18.5204],
    propertyCount: 67,
    description: "Modern villas near Pune city",
    features: ["67 villas", "City Access", "Modern Amenities"],
  },
  {
    id: "4",
    name: "Karjat",
    type: "city",
    coordinates: [73.3228, 18.9109],
    propertyCount: 34,
    description: "Valley view properties with adventure",
    features: ["34 villas", "Valley Views", "Adventure Sports"],
  },
  {
    id: "5",
    name: "Tiger Point",
    type: "landmark",
    coordinates: [73.417, 18.748],
    propertyCount: 12,
    description: "Exclusive properties near famous viewpoint",
    features: ["12 villas", "Viewpoint", "Exclusive"],
  },
  {
    id: "6",
    name: "Rajmachi Point",
    type: "landmark",
    coordinates: [73.45, 18.72],
    propertyCount: 8,
    description: "Heritage properties with trekking access",
    features: ["8 villas", "Heritage", "Trekking"],
  },
];

export const SearchBar = ({
  onSearch,
  onFilterClick,
  placeholder = "City, Neighborhood, Address...",
  onLocationSelect,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value) => {
    setSearchQuery(value);
    if (value.trim()) {
      const filtered = SUGGESTED_LOCATIONS.filter(
        (location) =>
          location.name.toLowerCase().includes(value.toLowerCase()) ||
          (location.description &&
            location.description.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredLocations(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredLocations(SUGGESTED_LOCATIONS.slice(0, 4)); // Show top 4 suggestions
      setShowSuggestions(true);
    }
  };

  const handleCurrentLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Find closest location or create a current location entry
          const currentLocation = {
            id: "current",
            name: "Current Location",
            type: "area",
            coordinates: [longitude, latitude],
            propertyCount: 0,
            description: "Properties near your current location",
          };
          setSearchQuery("Current Location");
          setShowSuggestions(false);
          onLocationSelect?.(currentLocation);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Fallback to a default location
          handleLocationClick(SUGGESTED_LOCATIONS[0]);
        }
      );
    }
  };

  const handleLocationClick = (location) => {
    setSearchQuery(location.name);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <form
        onSubmit={handleSearch}
        className="villa-search-bar  flex items-center gap-3 md:p-4 p-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg"
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (!searchQuery.trim()) {
                setFilteredLocations(SUGGESTED_LOCATIONS.slice(0, 4));
              }
              setShowSuggestions(true);
            }}
            className="pl-10 border-0 bg-transparent focus:ring-0 text-base placeholder:text-gray-500"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="h-10 w-10 p-0 bg-white border-gray-200 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 text-gray-600" />
        </Button>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full md:left-4 md:right-4 md:mt-2 mt-1 z-50 md:max-h-80 h-[60vh] overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl">
          <div className="md:p-4 p-2">
            {/* Current Location Option */}
            <button
              onClick={handleCurrentLocationClick}
              className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left mb-4 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">
                Use my current location
              </span>
            </button>

            {/* Search Results Section */}
            {(searchQuery.trim()
              ? filteredLocations
              : SUGGESTED_LOCATIONS.slice(0, 4)
            ).length > 0 && (
              <>
                <div className="text-sm text-gray-500 font-medium mb-3 px-1">
                  {searchQuery.trim() ? "Search Results" : "Popular Locations"}
                </div>

                {(searchQuery.trim()
                  ? filteredLocations
                  : SUGGESTED_LOCATIONS.slice(0, 4)
                ).map((location) => (
                  <button
                    key={location.id}
                    onClick={() => handleLocationClick(location)}
                    className="w-full p-3 hover:bg-gray-50 rounded-lg transition-colors text-left mb-2 group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3 mt-1 group-hover:bg-villa-primary/10 transition-colors">
                          <MapPin className="w-5 h-5 text-gray-600 group-hover:text-villa-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 mb-1">
                            {location.name}
                          </div>
                          {location.description && (
                            <div className="text-sm text-gray-600 mb-2">
                              {location.description}
                            </div>
                          )}
                          {location.features && (
                            <div className="flex flex-wrap gap-1">
                              {location.features.map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4 mt-1">
                        <div className="text-lg font-bold text-gray-900">
                          {location.propertyCount || 0}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
