"use client";

import React, { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbarcomponents/Navbar";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/Googlemapsearch/SearchBar";
import { FilterChips } from "@/components/Googlemapsearch/FilterChips";
import MapView from "@/components/Googlemapsearch/MapView";
import { PropertyCountHeader } from "@/components/Googlemapsearch/PropertyCountHeade";
import { FilterDrawer } from "@/components/Googlemapsearch/FilterDrawer";
import { PropertiesListDrawer } from "@/components/Googlemapsearch/PropertiesListDrawer";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPropertiesBymap,
  fetchPropertylocation,
  setselectedLocationId,
} from "@/Redux/Slices/propertiesSlice";
import { setSelectedCategory } from "@/Redux/Slices/bookingSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import {
  SlidersHorizontal,
  MapPin,
  RotateCcw,
  ChevronDown,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PropertyCard } from "@/components/Googlemapsearch/PropertyCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import PropertyCardSkeletonnew from "@/components/Availableweekend/PropertyCardSkeleton";

const Mappropertyview = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isPropertiesDrawerOpen, setIsPropertiesDrawerOpen] = useState(false);

  // Price popover state
  const [isPricePopoverOpen, setIsPricePopoverOpen] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState([1000, 50000]);

  // Active / selected property state (for active card border & map popup sync)
  const [activePropertyId, setActivePropertyId] = useState(null);

  // Sorting & Filtering states
  const [sortBy, setSortBy] = useState("price-low");
  const [selectedType, setSelectedType] = useState("all");
  const [customFilters, setCustomFilters] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const {
    mapLoading,
    mapData,
    locationData,
    selectedLocationId,
  } = useSelector((state) => state.properties);
  const { selectedCategoryId } = useSelector((state) => state.booking);

  // Monitor screen size for responsiveness
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mediaQuery.matches);

    const listener = (e) => setIsDesktop(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  // Fetch locations & map properties initially
  useEffect(() => {
    dispatch(fetchPropertylocation());
    // Immediately fetch map properties on mount (backend returns all destinations if no locationId)
    dispatch(
      fetchPropertiesBymap({
        locationId: selectedLocationId || "",
        categoryId: selectedCategoryId,
      })
    );
  }, [dispatch]);

  // Set default location if none selected
  useEffect(() => {
    if (!locationData?.length) return;
    if (selectedLocationId) return;

    const defaultLocation =
      locationData.find((loc) => loc.isPopular) || locationData[0];

    if (defaultLocation?._id) {
      const locationId = defaultLocation._id;
      dispatch(setselectedLocationId(locationId));

      dispatch(
        fetchPropertiesBymap({
          locationId: locationId,
          categoryId: selectedCategoryId,
        })
      );
    }
  }, [locationData, selectedLocationId, selectedCategoryId, dispatch]);

  // Dismiss any open popup card / active card whenever location, filters, or loading changes
  useEffect(() => {
    setActivePropertyId(null);
  }, [selectedLocationId, selectedType, customFilters, sortBy, mapLoading]);

  const handleLocationSelect = (locationId) => {
    setActivePropertyId(null);
    dispatch(setselectedLocationId(locationId));
    dispatch(
      fetchPropertiesBymap({
        locationId: locationId,
        categoryId: selectedCategoryId,
      })
    );
  };

  const handleCategorySelect = (categoryId) => {
    setActivePropertyId(null);
    dispatch(setSelectedCategory(categoryId));
    dispatch(
      fetchPropertiesBymap({
        locationId: selectedLocationId || "",
        categoryId: categoryId,
      })
    );
  };

  const handleApplyDrawerFilters = (filters) => {
    setActivePropertyId(null);
    setCustomFilters(filters);
    if (filters?.priceRange) {
      setTempPriceRange(filters.priceRange);
    }
  };

  const resetAllFilters = () => {
    setActivePropertyId(null);
    setSelectedType("all");
    setCustomFilters(null);
    setTempPriceRange([1000, 50000]);
    setSortBy("price-low");
    dispatch(setSelectedCategory(null));
    dispatch(
      fetchPropertiesBymap({
        locationId: selectedLocationId || "",
        categoryId: null,
      })
    );
  };

  // Pricing helper
  const isWeekendIST = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
    const day = now.getDay();
    return day === 0 || day === 6;
  };

  const getEffectivePrice = (property) => {
    return isWeekendIST()
      ? property.price?.weekendPrice ?? 0
      : property.price?.weekdayPrice ?? 0;
  };

  // Filter & Sort pipeline
  const filteredAndSortedProperties = useMemo(() => {
    let list = [...(mapData || [])];

    // 1. Filter by property type (Villa, Camping, Cottage, Hotel)
    if (selectedType !== "all") {
      list = list.filter(
        (p) =>
          (p.type || p.category || "").toLowerCase() ===
          selectedType.toLowerCase()
      );
    }

    // 2. Filter by drawer/popover filters (price range, rooms)
    if (customFilters) {
      if (customFilters.priceRange?.length === 2) {
        const [minPrice, maxPrice] = customFilters.priceRange;
        list = list.filter((p) => {
          const price = getEffectivePrice(p);
          return price >= minPrice && price <= maxPrice;
        });
      }

      if (
        customFilters.selectedRooms &&
        customFilters.selectedRooms !== "any"
      ) {
        const targetRooms = parseInt(customFilters.selectedRooms, 10);
        list = list.filter((p) => {
          if (customFilters.selectedRooms === "5+") {
            return (p.rooms || 0) >= 5;
          }
          return (p.rooms || 0) === targetRooms;
        });
      }
    }

    // 3. Sort
    list.sort((a, b) => {
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

    return list.map((property) => ({
      ...property,
      id: property.id || property._id,
    }));
  }, [mapData, selectedType, customFilters, sortBy]);

  const currentLocationName =
    locationData?.find((loc) => loc._id === selectedLocationId)?.name ||
    mapData?.[0]?.location ||
    "Destination";

  // When card in list is clicked -> set active & highlight marker/popup on map
  const handleCardClick = (property) => {
    setActivePropertyId(property.id);
  };

  // When marker on map is clicked -> set active & scroll card into view
  const handleMarkerSelect = (property) => {
    if (property) {
      setActivePropertyId(property.id);
      const cardElement = document.getElementById(`property-card-${property.id}`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    } else {
      setActivePropertyId(null);
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden bg-white z-50 flex flex-col font-sans">
      {/* ======================================================== */}
      {/* 📱 MOBILE VIEW (Full Map + Floating Search + Bottom Drawer) */}
      {/* ======================================================== */}
      <div className="flex flex-col flex-1 relative lg:hidden h-full overflow-hidden">
        {/* Floating Top Search & Categories Bar */}
        <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2">
          <SearchBar
            locations={locationData}
            placeholder="Search destination..."
            onLocationSelect={handleLocationSelect}
            onFilterClick={() => setIsFilterDrawerOpen(true)}
          />

          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-neutral-200/90 px-2 py-0.5">
            <FilterChips
              onFilterSelect={handleCategorySelect}
              className="px-1 py-1"
            />
          </div>
        </div>

        {/* Full-Screen Interactive Google Map */}
        <div className="h-full w-full">
          <MapView
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            selectedLocation={currentLocationName}
            properties={filteredAndSortedProperties}
            loading={mapLoading}
            activePropertyId={activePropertyId}
            onPropertySelect={handleMarkerSelect}
          />
        </div>

        {/* Mobile Bottom Peek Bar (Smoothly hides when a property card is selected on the map) */}
        <div
          className={`fixed bottom-0 left-0 right-0 z-20 transition-all duration-300 ${
            activePropertyId
              ? "translate-y-full opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100"
          }`}
        >
          <PropertyCountHeader
            count={filteredAndSortedProperties.length || 0}
            location={currentLocationName}
            onToggleDrawer={() =>
              setIsPropertiesDrawerOpen(!isPropertiesDrawerOpen)
            }
            isDrawerOpen={isPropertiesDrawerOpen}
          />
        </div>

        {/* Mobile Properties List Bottom Sheet */}
        <PropertiesListDrawer
          isOpen={isPropertiesDrawerOpen}
          onOpenChange={setIsPropertiesDrawerOpen}
          properties={filteredAndSortedProperties}
          location={currentLocationName}
          totalCount={filteredAndSortedProperties.length || 0}
        />
      </div>

      {/* ======================================================== */}
      {/* 💻 DESKTOP VIEW (Actual App Navbar + Filters + Split Map) */}
      {/* ======================================================== */}
      <div className="hidden lg:flex flex-col flex-1 h-screen overflow-hidden">
        {/* 1. ACTUAL WEBSITE NAVBAR (User Request) */}
        <Navbar />

        {/* 2. MAIN DESKTOP BODY (Offset below fixed Navbar ~136px) */}
        <div className="flex flex-col flex-1 h-full pt-[136px] overflow-hidden bg-white">
          {/* FILTER STRIP (Location, Filters, Price, Type of Place, Sort) */}
          <div className="border-b border-neutral-200/90 bg-white px-8 py-3 flex items-center justify-between shrink-0 gap-4 z-20">
            {/* Left: Filter Buttons */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* 1. LOCATION DROPDOWN (User Request: Fetch/Select Locations) */}
              <div className="w-44 sm:w-48">
                <Select
                  value={selectedLocationId || ""}
                  onValueChange={handleLocationSelect}
                >
                  <SelectTrigger className="rounded-full border-neutral-300 hover:border-neutral-900 text-xs h-9 font-semibold text-neutral-800 bg-white cursor-pointer px-3.5 shadow-2xs">
                    <MapPin className="w-3.5 h-3.5 text-[#ff6900] mr-1.5 shrink-0" />
                    <SelectValue placeholder="Select Destination">
                      {currentLocationName}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border border-neutral-200 max-h-72 bg-white">
                    {locationData?.map((loc) => (
                      <SelectItem
                        key={loc._id}
                        value={loc._id}
                        className="font-semibold text-xs py-2 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
                          <span>{loc.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* [Filters] Button */}
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                  customFilters
                    ? "border-[#ff6900] bg-orange-50 text-[#ff6900] font-bold shadow-xs"
                    : "border-neutral-300 hover:border-neutral-900 text-neutral-800 bg-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {customFilters && (
                  <span className="w-4 h-4 rounded-full bg-[#ff6900] text-white text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>

              {/* [Price ⌵] Popover */}
              <Popover
                open={isPricePopoverOpen}
                onOpenChange={setIsPricePopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
                      customFilters?.priceRange
                        ? "border-[#ff6900] bg-orange-50 text-[#ff6900] font-bold"
                        : "border-neutral-300 hover:border-neutral-900 text-neutral-800 bg-white"
                    }`}
                  >
                    <span>
                      {customFilters?.priceRange
                        ? `₹${customFilters.priceRange[0].toLocaleString()} - ₹${customFilters.priceRange[1].toLocaleString()}`
                        : "Price"}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-80 p-5 rounded-2xl shadow-xl border border-neutral-200 bg-white"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-900">
                        Price per night
                      </span>
                      {customFilters?.priceRange && (
                        <button
                          onClick={() => {
                            setCustomFilters((prev) =>
                              prev ? { ...prev, priceRange: [1000, 50000] } : null
                            );
                            setTempPriceRange([1000, 50000]);
                          }}
                          className="text-[11px] font-semibold text-[#ff6900] hover:underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                      <span>₹{tempPriceRange[0].toLocaleString()}</span>
                      <span>₹{tempPriceRange[1].toLocaleString()}</span>
                    </div>
                    <Slider
                      value={tempPriceRange}
                      min={1000}
                      max={50000}
                      step={500}
                      onValueChange={setTempPriceRange}
                      className="my-3"
                    />
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPricePopoverOpen(false)}
                        className="text-xs rounded-xl h-8 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCustomFilters((prev) => ({
                            ...(prev || {}),
                            priceRange: tempPriceRange,
                          }));
                          setIsPricePopoverOpen(false);
                        }}
                        className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs rounded-xl h-8 cursor-pointer font-bold"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* [Type of place ⌵] Select Dropdown (Villa, Camping, Cottage, Hotel) */}
              <div className="w-40">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="rounded-full border-neutral-300 hover:border-neutral-900 text-xs h-9 font-semibold text-neutral-800 bg-white cursor-pointer px-4">
                    <SelectValue placeholder="Type of place" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border border-neutral-200">
                    <SelectItem value="all" className="font-semibold text-xs">
                      All Types
                    </SelectItem>
                    <SelectItem value="villa" className="font-semibold text-xs">
                      Villa
                    </SelectItem>
                    <SelectItem value="camping" className="font-semibold text-xs">
                      Camping
                    </SelectItem>
                    <SelectItem value="cottage" className="font-semibold text-xs">
                      Cottage
                    </SelectItem>
                    <SelectItem value="hotel" className="font-semibold text-xs">
                      Hotel
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset All Filters Button */}
              {(selectedType !== "all" || customFilters) && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs font-semibold text-[#ff6900] hover:underline px-2 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            {/* Right: Total Stays count & Sort */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-500 font-medium hidden sm:inline">
                {filteredAndSortedProperties.length} stays found
              </span>

              <div className="w-44">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="rounded-full border-neutral-300 text-xs h-9 font-semibold text-neutral-800 bg-white cursor-pointer">
                    <SlidersHorizontal className="w-3 h-3 mr-1 text-neutral-500" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-xl border border-neutral-200">
                    <SelectItem value="price-low" className="font-semibold text-xs">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high" className="font-semibold text-xs">
                      Price: High to Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 3. SPLIT-SCREEN MAIN CONTENT */}
          <div className="flex-1 flex overflow-hidden">
            {/* LEFT SIDE: Property Listings Feed */}
            <div className="w-[52%] xl:w-[48%] 2xl:w-[46%] h-full flex flex-col bg-white border-r border-neutral-200/90 shrink-0">
              <ScrollArea className="flex-1 h-full px-6 py-5">
                {/* Heading */}
                <div className="mb-5">
                  <div className="flex items-center justify-between gap-2">
                    <h1 className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                      {filteredAndSortedProperties.length > 0
                        ? `Over ${filteredAndSortedProperties.length} homes in ${currentLocationName}`
                        : `No homes found in ${currentLocationName}`}
                    </h1>
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                      <Tag className="w-3 h-3 text-[#ff6900]" />
                      <span className="font-medium">Prices include all fees</span>
                    </div>
                  </div>
                </div>

                {/* Cards List (Horizontal Airbnb Cards with Active Orange Border & Direct Routing) */}
                {mapLoading ? (
                  <div className="space-y-4 pb-16">
                    <PropertyCardSkeletonnew />
                    <PropertyCardSkeletonnew />
                    <PropertyCardSkeletonnew />
                  </div>
                ) : filteredAndSortedProperties.length > 0 ? (
                  <div className="space-y-4 pb-20">
                    {filteredAndSortedProperties.map((property) => {
                      const isActive = activePropertyId === property.id;
                      return (
                        <div
                          key={property.id}
                          id={`property-card-${property.id}`}
                          className="transition-all duration-200"
                        >
                          <PropertyCard
                            property={property}
                            horizontal={true}
                            isActive={isActive}
                            onClick={() => handleCardClick(property)}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-28 text-center px-4">
                    <div className="w-14 h-14 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center mb-4 shadow-xs">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">
                      No properties found in {currentLocationName}
                    </h3>
                    <p className="text-xs text-neutral-500 max-w-xs mb-5">
                      Try adjusting your filters, location, or price range to view available stays.
                    </p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </button>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* RIGHT SIDE: Framed Rounded Google Map */}
            <div className="flex-1 h-full p-4 lg:p-6 bg-neutral-50/40 relative overflow-hidden flex flex-col">
              <MapView
                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                selectedLocation={currentLocationName}
                properties={filteredAndSortedProperties}
                loading={mapLoading}
                activePropertyId={activePropertyId}
                onPropertySelect={handleMarkerSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onOpenChange={setIsFilterDrawerOpen}
        side={isDesktop ? "right" : "bottom"}
        onApply={handleApplyDrawerFilters}
      />
    </div>
  );
};

export default Mappropertyview;
