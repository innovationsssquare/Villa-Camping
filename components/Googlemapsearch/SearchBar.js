"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";

export const SearchBar = ({
  locations = [],
  onLocationSelect,
  placeholder = "Search location...",
  onFilterClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const searchRef = useRef(null);

  const { selectedLocationId } = useSelector(
    (state) => state.properties
  );

  /* ---------------------------------------------
     Set initial input value from Redux locationId
  --------------------------------------------- */
  useEffect(() => {
    if (!selectedLocationId || !locations.length || isTyping) return;

    const selectedLocation = locations.find(
      (loc) => loc._id === selectedLocationId
    );

    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
  }, [selectedLocationId, locations, isTyping]);

  /* ---------------------------------------------
     Close dropdown on outside click
  --------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------------------------------------
     Handle input typing
  --------------------------------------------- */
  const handleInputChange = (value) => {
    setIsTyping(true);
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

  /* ---------------------------------------------
     Handle location select
  --------------------------------------------- */
  const handleLocationClick = (location) => {
    if (location._id === selectedLocationId) {
      setShowSuggestions(false);
      return;
    }

    setSearchQuery(location.name);
    setShowSuggestions(false);
    setIsTyping(false);

    onLocationSelect?.(location._id);
  };

  const visibleLocations = searchQuery.trim()
    ? filteredLocations
    : locations.slice(0, 4);

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center gap-3 md:p-4 p-2 rounded-xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            value={searchQuery}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (!searchQuery.trim()) {
                setFilteredLocations(locations.slice(0, 4));
                setShowSuggestions(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            className="pl-10 border-0 bg-transparent focus:ring-0 text-sm focus:outline-none"
          />
        </div>
        {onFilterClick && (
          <button
            onClick={onFilterClick}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 active:scale-95 rounded-lg text-gray-700 transition-all cursor-pointer flex items-center justify-center border border-gray-200"
            title="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
      <span className="text-xs font-medium text-gray-500">
        {searchQuery.trim() ? "Search Results" : "Popular Locations"}
      </span>

      <button
        onClick={() => setShowSuggestions(false)}
        className="p-1 rounded-full hover:bg-gray-100 transition"
        aria-label="Close suggestions"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    </div>
          <div className="p-2">
            {visibleLocations.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-6">
                No locations found
              </div>
            ) : (
              <>
                <div className="text-xs text-gray-500 font-medium mb-2 px-2">
                  {searchQuery.trim()
                    ? "Search Results"
                    : "Popular Locations"}
                </div>

                {visibleLocations.map((location) => {
                  const isActive =
                    location._id === selectedLocationId;

                  return (
                    <button
                      key={location._id}
                      onClick={() => handleLocationClick(location)}
                      className={`w-full p-3 rounded-lg text-left mb-1 transition-colors
                        ${
                          isActive
                            ? "bg-orange-100 border border-orange-500 text-orange-500"
                            : "hover:bg-gray-50"
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center mt-1
                            ${
                              isActive
                                ? "bg-white/20"
                                : "bg-gray-100"
                            }`}
                        >
                          <MapPin className="w-4 h-4" />
                        </div>

                        <div className="flex-1">
                          <div className="font-semibold text-sm">
                            {location.name}
                          </div>

                          {location.description && (
                            <div
                              className={`text-xs mt-1 ${
                                isActive
                                  ? "text-orange-500/80"
                                  : "text-gray-600"
                              }`}
                            >
                              {location.description}
                            </div>
                          )}

                          {location.features?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {location.features.map((f, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  {f}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
