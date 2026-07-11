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
import ButtonLoader from "@/components/Loadercomponents/button-loader";

// Desktop imports
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal, Filter, MapPin, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { PropertyCard } from "@/components/Googlemapsearch/PropertyCard";
import { ScrollArea } from "@/components/ui/scroll-area";

const Mappropertyview = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSearchDrawerOpen, setIsSearchDrawerOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isPropertiesDrawerOpen, setIsPropertiesDrawerOpen] = useState(false);

  const [googleMapsApiKey, setGoogleMapsApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedcategory, setSelectedcategory] = useState(null);
  const [locationProperties, setLocationProperties] = useState([]);

  // Hover synchronization state
  const [hoveredPropertyId, setHoveredPropertyId] = useState(null);
  const [hoverSource, setHoverSource] = useState(null); // 'map' or 'list'

  const handlePropertyHover = (propertyId, source) => {
    setHoveredPropertyId(propertyId);
    setHoverSource(source);
  };

  useEffect(() => {
    if (hoveredPropertyId && hoverSource === "map") {
      const cardElement = document.getElementById(`property-card-${hoveredPropertyId}`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [hoveredPropertyId, hoverSource]);

  // Sorting & local property type filtering states
  const [sortBy, setSortBy] = useState("price-low");
  const [selectedType, setSelectedType] = useState("all");
  const [isDesktop, setIsDesktop] = useState(false);

  const {
    mapLoading,
    mapData,
    mapError,
    locationLoading,
    locationData,
    locationError,
    selectedLocationId,
  } = useSelector((state) => state.properties);
  const { selectedCategoryId } = useSelector((state) => state.booking);

  // Monitor screen size for FilterDrawer responsiveness
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const listener = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  useEffect(() => {
    dispatch(fetchPropertylocation());
  }, [dispatch]);

  useEffect(() => {
    if (!locationData?.length) return;
    if (selectedLocationId) return; // already selected

    // Prefer popular location
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
        locationId: location,
        categoryId: null,
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
      propertyCount: Math.floor(Math.random() * 500) + 50,
    };

    handleLocationSelect(mockLocation._id);
  };

  const handleFilterClick = () => {
    setIsFilterDrawerOpen(true);
  };

  const handlePropertySelect = (property) => {};

  const handleApiKeySubmit = (apiKey) => {
    setGoogleMapsApiKey(apiKey);
    setShowApiKeyInput(false);
  };

  // Sorting & Filtering helpers
  const isWeekendIST = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const day = now.getDay(); // 0 = Sun, 6 = Sat
    return day === 0 || day === 6;
  };

  const getEffectivePrice = (property) => {
    return isWeekendIST()
      ? property.price?.weekendPrice ?? 0
      : property.price?.weekdayPrice ?? 0;
  };

  const sortedProperties = [...(mapData || [])].sort((a, b) => {
    const priceA = getEffectivePrice(a);
    const priceB = getEffectivePrice(b);

    switch (sortBy) {
      case "price-low":
        return priceA - priceB;
      case "price-high":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const filteredProperties =
    selectedType === "all"
      ? sortedProperties
      : sortedProperties.filter((property) => property.type === selectedType);

  const normalizedProperties = filteredProperties.map((property) => ({
    ...property,
    id: property.id || property._id,
  }));

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-white z-50 flex">
      {/* ======================================================== */}
      {/* 📱 MOBILE VIEW (Standard overlay sheet behavior)        */}
      {/* ======================================================== */}
      <div className="flex flex-col flex-1 relative lg:hidden h-full overflow-hidden">
        {/* Header with Search */}
        <div className="absolute top-0 left-0 right-0 z-30 p-1">
          <SearchBar
            locations={locationData}
            placeholder="Search Lonavala, Pune areas..."
            onLocationSelect={handleLocationSelect}
            onFilterClick={() => setIsFilterDrawerOpen(true)}
          />
          {/* Filter Chips */}
          <div className="absolute top-16 overflow-hidden mx-1.5 rounded-md left-0 right-0 z-20">
            <FilterChips
              onFilterSelect={(filter) => setSelectedcategory(filter)}
            />
          </div>
        </div>

        {/* Map View */}
        <div className="h-full w-full">
          <MapView
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            onPropertySelect={handlePropertySelect}
            selectedLocation={mapData?.location}
            properties={normalizedProperties}
            loading={mapLoading}
            hoveredPropertyId={hoveredPropertyId}
            onPropertyHover={handlePropertyHover}
          />
        </div>

        {/* Property Count Header - Bottom clickable bar */}
        <div className="fixed bottom-0 left-0 right-0 z-20">
          <PropertyCountHeader
            count={normalizedProperties.length || 0}
            location={mapData?.location}
            onToggleDrawer={() =>
              setIsPropertiesDrawerOpen(!isPropertiesDrawerOpen)
            }
            isDrawerOpen={isPropertiesDrawerOpen}
          />
        </div>

        {/* Properties List Drawer */}
        <PropertiesListDrawer
          isOpen={isPropertiesDrawerOpen}
          onOpenChange={setIsPropertiesDrawerOpen}
          properties={normalizedProperties}
          location={mapData?.location}
          totalCount={normalizedProperties.length || 0}
        />
      </div>

      {/* ======================================================== */}
      {/* 💻 DESKTOP VIEW (Premium Split-Screen Map & List View)  */}
      {/* ======================================================== */}
      <div className="hidden lg:flex flex-row flex-1 h-full overflow-hidden">
        {/* Left Side: Property Listings & Controls */}
        <div className="w-[50%] xl:w-[45%] h-full flex flex-col border-r border-gray-150 bg-white relative">
          
          {/* Subtype/Sort Control Strip */}
          <div className="px-6 py-4 bg-white border-b border-gray-150 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center gap-2 text-gray-500 hover:text-black cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Home
              </Button>
              <div className="flex flex-col">
                <div className="text-sm font-semibold text-gray-800">
                  {normalizedProperties.length > 0
                    ? `${normalizedProperties.length} properties found`
                    : "No properties found"}
                </div>
                {mapData?.location && (
                  <span className="text-xs text-gray-500 font-medium">in {mapData.location}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort dropdown */}
              <div className="w-40">
                <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                  <SelectTrigger className="bg-white border-gray-200 text-xs h-9 cursor-pointer">
                    <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subtype filter dropdown */}
              <div className="w-36">
                <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
                  <SelectTrigger className="bg-white border-gray-200 text-xs h-9 cursor-pointer">
                    <Filter className="w-3.5 h-3.5 mr-2 text-gray-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="camping">Camping</SelectItem>
                    <SelectItem value="cottage">Cottage</SelectItem>
                    <SelectItem value="hotel">Hotel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Listings List Area */}
          <ScrollArea className="flex-1 h-full px-6 py-5">
            {normalizedProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 pb-12">
                {normalizedProperties.map((property) => (
                  <div
                    key={property.id}
                    id={`property-card-${property.id}`}
                    className="w-full"
                    onMouseEnter={() => handlePropertyHover(property.id, "list")}
                    onMouseLeave={() => handlePropertyHover(null, null)}
                  >
                    <PropertyCard
                      property={property}
                      horizontal={true}
                      isHovered={hoveredPropertyId === property.id}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
                <MapPin className="h-12 w-12 mb-3 text-gray-300 animate-bounce" />
                <p className="text-base font-semibold text-gray-700">No properties found</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Try adjusting your filters or category tags to search a wider variety.
                </p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Right Side: Sticky Interactive Google Map */}
        <div className="flex-1 h-full relative">
          {/* Floating SearchBar and FilterChips Overlay on Map */}
          <div className="absolute top-6 left-6 right-6 z-30 flex flex-col gap-2.5">
            <SearchBar
              locations={locationData}
              placeholder="Search Lonavala, Pune areas..."
              onLocationSelect={handleLocationSelect}
              onFilterClick={() => setIsFilterDrawerOpen(true)}
            />
            <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/80 px-2 py-0">
              <FilterChips
                onFilterSelect={(filter) => setSelectedcategory(filter)}
                className="px-2 py-1"
              />
            </div>
          </div>

          <MapView
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            onPropertySelect={handlePropertySelect}
            selectedLocation={mapData?.location}
            properties={filteredProperties}
            loading={mapLoading}
            hoveredPropertyId={hoveredPropertyId}
            onPropertyHover={handlePropertyHover}
          />
        </div>
      </div>

      {/* Shared Filter Drawer with screen-responsive side settings */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        side={isDesktop ? "right" : "bottom"}
      />
    </div>
  );
};

export default Mappropertyview;
