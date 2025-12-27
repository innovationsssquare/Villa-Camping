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

const VillaCamp = () => {
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

export default VillaCamp;

// "use client"

// import { MapContainer } from "@/components/Searchonmap/map-container"
// import { PropertyDrawer } from "@/components/Searchonmap/property-drawer"
// import { SearchHeader } from "@/components/Searchonmap/search-header"
// import { useState, useEffect } from "react"

// // Mock property data for Lonavala/Pune area
// const mockProperties = [
//   {
//     id: "1",
//     title: "Luxury Villa with Pool",
//     price: 8500,
//     location: "Lonavala",
//     coordinates: { lat: 18.7537, lng: 73.4135 },
//     beds: 4,
//     baths: 3,
//     sqft: 2500,
//     image: "/luxury-villa-with-pool-lonavala.jpg",
//     amenities: ["Pool", "WiFi", "AC", "Kitchen"],
//     rating: 4.8,
//     reviews: 24,
//     isHot: true,
//   },
//   {
//     id: "2",
//     title: "Cozy Mountain Retreat",
//     price: 6200,
//     location: "Khandala",
//     coordinates: { lat: 18.7645, lng: 73.3897 },
//     beds: 3,
//     baths: 2,
//     sqft: 1800,
//     image: "/mountain-retreat-villa-khandala.jpg",
//     amenities: ["Mountain View", "Fireplace", "Garden"],
//     rating: 4.6,
//     reviews: 18,
//     isHot: false,
//   },
//   {
//     id: "3",
//     title: "Modern Villa with Valley View",
//     price: 12000,
//     location: "Pune Hills",
//     coordinates: { lat: 18.5204, lng: 73.8567 },
//     beds: 5,
//     baths: 4,
//     sqft: 3200,
//     image: "/modern-villa-valley-view-pune.jpg",
//     amenities: ["Valley View", "Jacuzzi", "BBQ Area", "Parking"],
//     rating: 4.9,
//     reviews: 31,
//     isHot: true,
//   },
//   {
//     id: "4",
//     title: "Heritage Bungalow",
//     price: 4800,
//     location: "Mahabaleshwar",
//     coordinates: { lat: 17.9334, lng: 73.6582 },
//     beds: 2,
//     baths: 2,
//     sqft: 1500,
//     image: "/heritage-bungalow-mahabaleshwar.jpg",
//     amenities: ["Heritage", "Garden", "Peaceful"],
//     rating: 4.4,
//     reviews: 12,
//     isHot: false,
//   },
// ]

// export default function VillaCampMap() {
//   const [selectedProperty, setSelectedProperty] = useState(null)
//   const [isDrawerOpen, setIsDrawerOpen] = useState(true)
//   const [searchQuery, setSearchQuery] = useState("")
//   const [filteredProperties, setFilteredProperties] = useState(mockProperties)

//   useEffect(() => {
//     if (searchQuery) {
//       const filtered = mockProperties.filter(
//         (property) =>
//           property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           property.title.toLowerCase().includes(searchQuery.toLowerCase()),
//       )
//       setFilteredProperties(filtered)
//     } else {
//       setFilteredProperties(mockProperties)
//     }
//   }, [searchQuery])

//   return (
//     <div className="h-screen flex flex-col bg-background">
//       <SearchHeader
//         searchQuery={searchQuery}
//         onSearchChange={setSearchQuery}
//         propertyCount={filteredProperties.length}
//       />

//       <div className="flex-1 relative">
//         <MapContainer
//           properties={filteredProperties}
//           selectedProperty={selectedProperty}
//           onPropertySelect={setSelectedProperty}
//         />

//         <PropertyDrawer
//           properties={filteredProperties}
//           isOpen={isDrawerOpen}
//           onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
//           selectedProperty={selectedProperty}
//           onPropertySelect={setSelectedProperty}
//         />
//       </div>

//     </div>
//   )
// }
