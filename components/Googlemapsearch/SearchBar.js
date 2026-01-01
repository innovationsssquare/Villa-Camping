import React, { useState, useRef, useEffect } from "react";
import { Search, Filter, MapPin, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SearchBar = ({
  locations = [],
  onLocationSelect,
  onFilterClick,
  placeholder,
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
  if (!value.trim()) {
    setFilteredLocations(locations.slice(0, 5));
  } else {
    setFilteredLocations(
      locations.filter((loc) =>
        loc.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }
  setShowSuggestions(true);
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
  onLocationSelect(location?._id);
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
                setFilteredLocations(locations?.slice(0, 4));
              }
              setShowSuggestions(true);
            }}
            className="pl-10 border-0 bg-transparent focus:ring-0 text-sm placeholder:text-gray-500"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onFilterClick}
          className="h-10 w-10 p-0 bg-white border-gray-200 hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 text-gray-600 " />
        </Button>
      </form>

      {/* Enhanced Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full md:left-4 md:right-4 md:mt-2 mt-1 z-50 md:max-h-80 h-[60vh] overflow-y-auto scrollbar-hide bg-white border border-gray-200 shadow-lg rounded-xl">
          <div className="md:p-4 p-2">
            {/* Current Location Option */}
            {/* <button
              onClick={handleCurrentLocationClick}
              className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left mb-4 border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Navigation className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">
                Use my current location
              </span>
            </button> */}

            {/* Search Results Section */}
            {(searchQuery.trim()
              ? filteredLocations
              : locations.slice(0, 4)
            ).length > 0 && (
              <>
                <div className="text-sm text-gray-500 font-medium mb-3 px-1">
                  {searchQuery.trim() ? "Search Results" : "Popular Locations"}
                </div>

                {(searchQuery.trim()
                  ? filteredLocations
                  : locations.slice(0, 4)
                ).map((location) => (
                  <button
                    key={location._id}
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
