"use client"
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/Googlemapsearch/SearchBar";
import { FilterChips } from "@/components/Googlemapsearch/FilterChips";
import MapView from "@/components/Googlemapsearch/MapView";
import { PropertyCountHeader } from "@/components/Googlemapsearch/PropertyCountHeade";
import { FilterDrawer } from "@/components/Googlemapsearch/FilterDrawer";
import { PropertiesListDrawer } from "@/components/Googlemapsearch/PropertiesListDrawer";
import { SearchDrawer } from "@/components/Googlemapsearch/SearchDrawer";

const Mappropertyview = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isPropertiesDrawerOpen, setIsPropertiesDrawerOpen] = useState(false);

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationProperties, setLocationProperties] = useState([]);

  const handleSearch = (query) => {

    // Simulate location search and auto-select
    const mockLocation = {
      id: query.toLowerCase().replace(/\s+/g, "-"),
      name: query,
      type: "city",
      coordinates: [73.4062, 18.7537], // Default to Lonavala area
      propertyCount: Math.floor(Math.random() * 500) + 50, // Random property count
    };

    handleLocationSelect(mockLocation);
  };

  const handleFilterClick = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);

    // Simulate fetching properties for the selected location
    const mockProperties = [
      {
        id: "1",
        price: 785000,
        title: `Luxury Villa in ${location.name}`,
        address: `${location.name}, Maharashtra`,
        beds: 4,
        baths: 4,
        sqft: 2819,
        coordinates: location.coordinates,
        image: "/src/assets/villa-1.jpg",
        type: "villa",
        features: ["Pool", "Garden", "Mountain View"],
        isHot: true,
        has3DTour: true,
        description: `Beautiful luxury property in ${location.name} with modern amenities.`,
      },
      {
        id: "2",
        price: 332000,
        title: `Cozy Retreat in ${location.name}`,
        address: `${location.name}, Maharashtra`,
        beds: 3,
        baths: 2,
        sqft: 1850,
        coordinates: location.coordinates,
        image: "/src/assets/villa-2.jpg",
        type: "villa",
        features: ["Garden", "Parking"],
        isDeal: true,
        description: `Perfect retreat in ${location.name} for weekend getaways.`,
      },
      {
        id: "3",
        price: 170000,
        title: `Modern House in ${location.name}`,
        address: `${location.name}, Maharashtra`,
        beds: 2,
        baths: 2,
        sqft: 1200,
        coordinates: location.coordinates,
        image: "/src/assets/house-1.jpg",
        type: "house",
        isDeal: true,
        has3DTour: true,
        description: `Contemporary house design in ${location.name}.`,
      },
    ];

    setLocationProperties(mockProperties);
    // Don't auto-open properties drawer - only open when user clicks bottom header
  };

  const handlePropertySelect = (property) => {
  };

  const handleApiKeySubmit = (apiKey) => {
    setGoogleMapsApiKey(apiKey);
    setShowApiKeyInput(false);
  };



  return (
    <div className="fixed inset-0 h-screen z-50 overflow-hidden ">
      {/* Header with Search */}
      <div className="absolute top-0 left-0 right-0 z-30 md:p-4 p-1 ">
        <SearchBar
          onSearch={handleSearch}
          onFilterClick={handleFilterClick}
          placeholder="Search Lonavala, Pune areas..."
          onLocationSelect={handleLocationSelect}
        />
      {/* Filter Chips */}
      <div className="absolute top-16 overflow-hidden mx-1.5 rounded-md   left-0 right-0 z-20">
        <FilterChips
          onFilterSelect={(filter) => console.log("Filter:", filter)}
        />
      </div>
      </div>


      {/* Map View */}
      <div className="h-screen flex-1">
        <MapView
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          onPropertySelect={handlePropertySelect}
          selectedLocation={selectedLocation}
        />
      </div>

      {/* Property Count Header - Bottom clickable bar */}
 
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <PropertyCountHeader
            count={selectedLocation?.propertyCount || 0}
            location={selectedLocation?.name}
            onToggleDrawer={() =>
              setIsPropertiesDrawerOpen(!isPropertiesDrawerOpen)
            }
            isDrawerOpen={isPropertiesDrawerOpen}
          />
        </div>
     

      {/* Search Drawer - Commented out as not needed */}
      
      {/* <SearchDrawer
        isOpen={isSearchDrawerOpen}
        onOpenChange={setIsSearchDrawerOpen}
        onLocationSelect={handleLocationSelect}
      /> */}
     

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
      />

      {/* Properties List Drawer */}
      <PropertiesListDrawer
        isOpen={isPropertiesDrawerOpen}
        onOpenChange={setIsPropertiesDrawerOpen}
        properties={locationProperties}
        location={selectedLocation?.name}
        totalCount={selectedLocation?.propertyCount || 191}
      />
    </div>
  );
};

export default Mappropertyview;

