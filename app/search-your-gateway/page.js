"use client";
import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPropertiesBymap,
  fetchPropertylocation,
  setselectedLocationId,
} from "@/Redux/Slices/propertiesSlice";
import { setSelectedCategory } from "@/Redux/Slices/bookingSlice";

const Mappropertyview = () => {
  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isPropertiesDrawerOpen, setIsPropertiesDrawerOpen] = useState(false);

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedcategory, setSelectedcategory] = useState(null);
  // const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [locationProperties, setLocationProperties] = useState([]);
  const {
    mapLoading,
    mapData,
    mapError,
    locationLoading,
    locationData,
    locationError,
    selectedLocationId
  } = useSelector((state) => state.properties);
  const { selectedCategoryId } = useSelector((state) => state.booking);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPropertylocation());
  }, [dispatch]);

  useEffect(() => {
    if (!locationData?.length) return;
    if (selectedLocationId) return; // already selected

    // 1️⃣ Prefer popular location
    const defaultLocation =
      locationData.find((loc) => loc.isPopular) || locationData[0];

    const locationId = defaultLocation._id;

    dispatch(setselectedLocationId(locationId));

    dispatch(
      fetchPropertiesBymap({
        locationId: locationId,
        categoryId: selectedCategoryId,
      })
    );
  }, [locationData]);

  const handleLocationSelect = (location) => {
    dispatch(setselectedLocationId(location));
    dispatch(setSelectedCategory(null));

    dispatch(
      fetchPropertiesBymap({
        locationId: selectedLocationId,
        category: selectedCategoryId,
      })
    );
  };

  useEffect(() => {
    if (!selectedLocationId) return;

    dispatch(
      fetchPropertiesBymap({
        locationId: selectedLocationId,
        categoryId: selectedCategoryId,
      })
    );
  }, [selectedCategoryId]);

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

  const handlePropertySelect = (property) => {};

  const handleApiKeySubmit = (apiKey) => {
    setGoogleMapsApiKey(apiKey);
    setShowApiKeyInput(false);
  };

  return (
    <div className="fixed inset-0 h-screen z-50 overflow-hidden ">
      {/* Header with Search */}
      <div className="absolute top-0 left-0 right-0 z-30 md:p-4 p-1 ">
        <SearchBar
          locations={locationData} // 👈 pass redux locations
          placeholder="Search Lonavala, Pune areas..."
          onLocationSelect={handleLocationSelect}
          onFilterClick={() => setIsFilterDrawerOpen(true)}
        />
        {/* Filter Chips */}
        <div className="absolute top-16 overflow-hidden mx-1.5 rounded-md   left-0 right-0 z-20">
          <FilterChips
            onFilterSelect={(filter) => setSelectedcategory(filter)}
          />
        </div>
      </div>

      {/* Map View */}
      <div className="h-screen flex-1">
        <MapView
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          onPropertySelect={handlePropertySelect}
          selectedLocation={mapData?.location}
          properties={mapData || []}
          loading={mapLoading}
        />
      </div>

      {/* Property Count Header - Bottom clickable bar */}

      <div className="fixed bottom-0 left-0 right-0 z-20">
        <PropertyCountHeader
          count={mapData?.length || 0}
          location={mapData?.location}
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
        properties={mapData || []}
        location={mapData?.location}
        totalCount={mapData?.length || 0}
      />
    </div>
  );
};

export default Mappropertyview;
