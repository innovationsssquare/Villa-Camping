"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, SlidersHorizontal, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";

export const SearchBar = ({
  locations = [],
  onLocationSelect,
  placeholder = "Search destination, city, or area...",
  onFilterClick,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const searchRef = useRef(null);

  const { selectedLocationId } = useSelector((state) => state.properties);

  /* Set initial input value from Redux locationId */
  useEffect(() => {
    if (!selectedLocationId || !locations.length || isTyping) return;

    const selectedLocation = locations.find(
      (loc) => loc._id === selectedLocationId
    );

    if (selectedLocation) {
      setSearchQuery(selectedLocation.name);
    }
  }, [selectedLocationId, locations, isTyping]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Handle input typing */
  const handleInputChange = (value) => {
    setIsTyping(true);
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredLocations(locations.slice(0, 6));
    } else {
      setFilteredLocations(
        locations.filter((loc) =>
          loc.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    setShowSuggestions(true);
  };

  /* Handle location select */
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

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchQuery("");
    setFilteredLocations(locations.slice(0, 6));
    setShowSuggestions(true);
  };

  const visibleLocations = searchQuery.trim()
    ? filteredLocations
    : locations.slice(0, 6);

  return (
    <div ref={searchRef} className="relative w-full">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 px-3 py-2 md:py-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:border-[#ff6900]/40 focus-within:border-[#ff6900] focus-within:ring-2 focus-within:ring-[#ff6900]/20">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 shrink-0">
          <Search className="h-4 w-4 text-[#ff6900]" />
        </div>

        <div className="flex-1 relative min-w-0">
          <Input
            type="text"
            value={searchQuery}
            placeholder={placeholder}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (!searchQuery.trim()) {
                setFilteredLocations(locations.slice(0, 6));
              }
              setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") setShowSuggestions(false);
            }}
            className="w-full border-0 bg-transparent p-0 h-9 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:outline-none shadow-none"
          />
        </div>

        {searchQuery.trim() && (
          <button
            type="button"
            onClick={handleClear}
            className="w-6 h-6 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer shrink-0"
            aria-label="Clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {onFilterClick && (
          <>
            <div className="w-[1px] h-6 bg-neutral-200 shrink-0 mx-0.5" />
            <button
              type="button"
              onClick={onFilterClick}
              className="p-2 bg-neutral-100 hover:bg-orange-50 text-neutral-700 hover:text-[#ff6900] active:scale-95 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 border border-transparent hover:border-orange-200"
              title="Filter Properties"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Suggestions Dropdown Card */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 max-h-80 overflow-y-auto bg-white/98 backdrop-blur-md border border-neutral-200/90 shadow-[0_20px_45px_rgba(0,0,0,0.16)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150 p-2">
          <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100 mb-1">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              {searchQuery.trim() ? "Search Results" : "Destinations in Maharashtra"}
            </span>

            <button
              type="button"
              onClick={() => setShowSuggestions(false)}
              className="p-1 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {visibleLocations.length === 0 ? (
              <div className="text-center text-sm text-neutral-500 py-6">
                No destinations matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              visibleLocations.map((location) => {
                const isActive = location._id === selectedLocationId;

                return (
                  <button
                    key={location._id}
                    type="button"
                    onClick={() => handleLocationClick(location)}
                    className={`w-full p-2.5 rounded-xl text-left transition-all flex items-center gap-3 cursor-pointer ${
                      isActive
                        ? "bg-orange-50/90 border border-orange-200/90 text-neutral-900"
                        : "hover:bg-neutral-50 text-neutral-800 border border-transparent"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-[#ff6900] text-white shadow-xs"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm truncate">
                          {location.name}
                        </span>
                        {isActive && (
                          <Check className="w-4 h-4 text-[#ff6900] shrink-0" />
                        )}
                      </div>

                      {location.description && (
                        <p className="text-xs text-neutral-500 truncate mt-0.5">
                          {location.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

