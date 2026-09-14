"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  SlidersHorizontal,
  X,
  PanelLeftClose,
  RotateCcw,
  MapPin,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Filter,
  Check,
} from "lucide-react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import {
  addPriceRange,
  removePriceRange,
  setRating,
  setSearchQuery,
  setSortBy,
  clearAllFilters,
  setPriceMin,
  setPriceMax,
  setPropertyType,
  clearPropertyType,
  setCurrentPage,
} from "@/Redux/Slices/propertyFilterSlice";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";
import {
  setSelectedCategory,
  setSelectedCategoryname,
  setCheckin,
  setCheckout,
  setSelectedGuest,
} from "@/Redux/Slices/bookingSlice";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { SortDrawer } from "./SortDrawer";
import PropertyCardnew from "../Availableweekend/PropertyCard";
import PropertyCardSkeletonnew from "../Availableweekend/PropertyCardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { KNOWN_CATEGORY_IDS } from "@/lib/categoryUtils";

export const PROPERTY_TYPES_BY_SLUG = {
  villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
  camping: ["Single Tent", "Couple Tent", "Family Tent"],
  cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
  hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
};

const PRICE_RANGE_OPTIONS = [
  { id: "all", label: "All Prices", min: null, max: null },
  { id: "under-10k", label: "Under ₹10,000", min: 0, max: 10000 },
  { id: "10k-20k", label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { id: "20k-30k", label: "₹20,000 – ₹30,000", min: 20000, max: 30000 },
  { id: "30k-40k", label: "₹30,000 – ₹40,000", min: 30000, max: 40000 },
  { id: "above-40k", label: "Above ₹40,000", min: 40000, max: null },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "low-high", label: "Price: Low → High" },
  { id: "high-low", label: "Price: High → Low" },
  { id: "rating", label: "Top Rated" },
];

export default function PropertyFilterListing({ categorySlug }) {
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [showFloatingBar, setShowFloatingBar] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isVisible: isNavVisible } = useScrollDirection();

  // Butter-smooth scroll tracking with hysteresis to prevent edge jitter
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          setShowFloatingBar((prev) => {
            if (!prev && currentY > 80) return true;
            if (prev && currentY < 40) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    selectedPriceRanges,
    selectedPropertyTypes,
    searchQuery,
    sortBy,
    currentPage,
    priceMin,
    priceMax,
  } = useSelector((state) => state.propertyFilter);

  const searchParams = useSearchParams();
  const paramCheckin = searchParams?.get("checkin") || searchParams?.get("checkIn");
  const paramCheckout = searchParams?.get("checkout") || searchParams?.get("checkOut");
  const paramAdults = searchParams?.get("adults");
  const paramChildren = searchParams?.get("children");

  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId, selectedCategoryName, checkin, checkout } =
    useSelector((state) => state.booking);
  const { dataloading, data, pagination } = useSelector(
    (state) => state.properties
  );

  // 1. Ensure categories are loaded
  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchAllCategories());
    }
  }, [categories, dispatch]);

  // 2. Sync URL search params (dates and guests) into Redux
  useEffect(() => {
    if (paramCheckin) dispatch(setCheckin(paramCheckin));
    if (paramCheckout) dispatch(setCheckout(paramCheckout));
    if (paramAdults || paramChildren) {
      dispatch(
        setSelectedGuest({
          adults: Number(paramAdults) || 1,
          childrenn: Number(paramChildren) || 0,
        })
      );
    }
  }, [paramCheckin, paramCheckout, paramAdults, paramChildren, dispatch]);

  // 2.1 Enforce date & guest selection: redirect to / if dates are missing
  useEffect(() => {
    const hasIn = paramCheckin || checkin;
    const hasOut = paramCheckout || checkout;
    if (!hasIn || !hasOut) {
      addToast({
        title: "Select dates & guests first",
        description: "Please choose your stay dates and guests before viewing stays.",
        color: "warning",
      });
      router.replace("/");
    }
  }, [paramCheckin, checkin, paramCheckout, checkout, router]);

  // 3. Sync categorySlug parameter with Redux category state
  useEffect(() => {
    if (categorySlug === "all") {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedCategoryname("All Stays"));
      dispatch(clearPropertyType());
      dispatch(setCurrentPage(1));
    } else if (categorySlug && categories?.length > 0) {
      const matchedCategory = categories.find(
        (cat) =>
          cat.slug?.toLowerCase() === categorySlug.toLowerCase() ||
          cat.name?.toLowerCase() === categorySlug.toLowerCase()
      );
      if (matchedCategory) {
        dispatch(setSelectedCategory(matchedCategory._id));
        dispatch(setSelectedCategoryname(matchedCategory.name));
        dispatch(clearPropertyType());
        dispatch(setCurrentPage(1));
      }
    }
  }, [categorySlug, categories, dispatch]);

  // 4. Fetch properties from backend with pagination & filters
  useEffect(() => {
    // Resolve category ID with immediate fallback to slug or KNOWN_CATEGORY_IDS
    let effectiveCategory = null;
    if (categorySlug && categorySlug !== "all") {
      const matched = categories?.find(
        (c) =>
          c.slug?.toLowerCase() === categorySlug.toLowerCase() ||
          c.name?.toLowerCase() === categorySlug.toLowerCase()
      );
      if (matched) {
        effectiveCategory = matched._id;
      } else {
        const upper = categorySlug.toUpperCase();
        if (KNOWN_CATEGORY_IDS[upper]) {
          effectiveCategory = KNOWN_CATEGORY_IDS[upper];
        }
      }
    }
    if (!effectiveCategory) {
      effectiveCategory =
        selectedCategoryId ||
        (categories?.length > 0 ? categories[0]._id : KNOWN_CATEGORY_IDS.VILLA);
    }
    if (effectiveCategory) {
      const upper = String(effectiveCategory).trim().toUpperCase();
      if (KNOWN_CATEGORY_IDS[upper]) {
        effectiveCategory = KNOWN_CATEGORY_IDS[upper];
      }
    }

    let effectiveCheckIn = paramCheckin || checkin;
    let effectiveCheckOut = paramCheckout || checkout;

    if (!effectiveCheckIn) {
      effectiveCheckIn = new Date().toISOString();
    }
    if (!effectiveCheckOut) {
      const inDate = new Date(effectiveCheckIn);
      effectiveCheckOut = new Date(
        inDate.getTime() + 24 * 60 * 60 * 1000
      ).toISOString();
    }

    if (effectiveCategory) {
      dispatch(
        fetchAllProperties({
          categoryId: effectiveCategory,
          checkIn: effectiveCheckIn,
          checkOut: effectiveCheckOut,
          subtype: selectedPropertyTypes,
          priceMin: priceMin,
          priceMax: priceMax,
          sortBy: sortBy,
          search: searchQuery,
          page: currentPage || 1,
          limit: 6,
        })
      );
    }
  }, [
    dispatch,
    selectedCategoryId,
    categorySlug,
    categories,
    checkin,
    checkout,
    paramCheckin,
    paramCheckout,
    selectedPropertyTypes,
    priceMin,
    priceMax,
    sortBy,
    searchQuery,
    currentPage,
  ]);

  // Resolve Active Category Object
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || !categories?.length) return null;
    return categories.find((c) => c._id === selectedCategoryId) || null;
  }, [selectedCategoryId, categories]);

  // Subtypes based on active category
  const availableSubtypes = useMemo(() => {
    if (!activeCategory) return [];
    return PROPERTY_TYPES_BY_SLUG[activeCategory.slug] || [];
  }, [activeCategory]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId) count++;
    if (selectedPropertyTypes) count++;
    if (priceMin != null || priceMax != null) count++;
    if (searchQuery) count++;
    if (sortBy && sortBy !== "popular") count++;
    return count;
  }, [selectedCategoryId, selectedPropertyTypes, priceMin, priceMax, searchQuery, sortBy]);

  const handlePriceRangeChange = (rangeId) => {
    selectedPriceRanges.forEach((r) => dispatch(removePriceRange(r)));
    dispatch(setCurrentPage(1));

    if (rangeId === "all") {
      dispatch(setPriceMin(null));
      dispatch(setPriceMax(null));
      return;
    }

    const range = PRICE_RANGE_OPTIONS.find((r) => r.id === rangeId);
    if (!range) return;

    dispatch(addPriceRange(rangeId));
    dispatch(setPriceMin(range.min));
    dispatch(setPriceMax(range.max));
  };

  const clearAllFiltersHandler = () => {
    dispatch(clearAllFilters());
    dispatch(clearPropertyType());
    dispatch(setCurrentPage(1));
  };

  const formatPrice = (val) => {
    if (val == null) return "0";
    return Number(val).toLocaleString("en-IN");
  };

  const activePriceRangeId = useMemo(() => {
    if (selectedPriceRanges.length > 0) return selectedPriceRanges[0];
    return "all";
  }, [selectedPriceRanges]);

  // Pagination calculation
  const totalItems =
    pagination?.total != null ? pagination.total : data?.length || 0;
  const limit = pagination?.limit || 6;
  const totalPages =
    pagination?.totalPages != null
      ? pagination.totalPages
      : Math.max(1, Math.ceil(totalItems / limit));
  const currentActivePage =
    pagination?.page != null ? pagination.page : currentPage || 1;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentActivePage)
      return;
    dispatch(setCurrentPage(newPage));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const getPageNumbers = (current, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, "...", total];
    }
    if (current >= total - 2) {
      return [1, "...", total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  return (
    <div className="w-full bg-neutral-50/60 min-h-screen pb-28 md:pb-16 text-neutral-900">
      {/* ========================================================================= */}
      {/* DESKTOP TOP STICKY FILTER & SEARCH BAR (Sticks Flush to Navbar with 0 Gap)*/}
      {/* ========================================================================= */}
      <div className="hidden md:block sticky md:top-16 z-30 w-full bg-white/98 backdrop-blur-md border-b border-neutral-200/90 shadow-2xs mb-5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          {/* Desktop Toolbar */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Filter Toggle & Search Input */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  showFilterSidebar
                    ? "bg-neutral-900 text-white border-neutral-900 hover:bg-black"
                    : "bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-400"
                }`}
                title={showFilterSidebar ? "Hide Filters" : "Show Filters"}
              >
                {showFilterSidebar ? (
                  <PanelLeftClose className="w-4 h-4 text-[#ff6900]" />
                ) : (
                  <SlidersHorizontal className="w-4 h-4 text-[#ff6900]" />
                )}
                <span>{showFilterSidebar ? "Hide Filters" : "Filters"}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#ff6900] text-white text-[10px] flex items-center justify-center font-bold ml-0.5">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <div className="relative w-64 lg:w-72">
                <input
                  type="text"
                  placeholder="Search by name or area..."
                  value={searchQuery}
                  onChange={(e) => {
                    dispatch(setSearchQuery(e.target.value));
                    dispatch(setCurrentPage(1));
                  }}
                  className="w-full h-10 pl-9 pr-8 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white rounded-xl border border-neutral-200/90 focus:border-[#ff6900] text-xs font-medium placeholder-neutral-400 text-neutral-900 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-[#ff6900] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(setSearchQuery(""));
                      dispatch(setCurrentPage(1));
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right: Quick Price Range, Sort, and Map View */}
            <div className="flex items-center gap-2.5">
              {/* Price Range Select */}
              <Select
                value={activePriceRangeId}
                onValueChange={handlePriceRangeChange}
              >
                <SelectTrigger className="w-[160px] h-10 text-xs font-semibold bg-white border-neutral-200/90 hover:border-neutral-400 rounded-xl text-neutral-800 shadow-2xs">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200 rounded-xl shadow-lg">
                  {PRICE_RANGE_OPTIONS.map((range) => (
                    <SelectItem
                      key={range.id}
                      value={range.id}
                      className="text-xs font-medium text-neutral-800 hover:bg-orange-50 hover:text-[#ff6900] cursor-pointer"
                    >
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Select */}
              <Select
                value={sortBy || "popular"}
                onValueChange={(value) => {
                  dispatch(setSortBy(value));
                  dispatch(setCurrentPage(1));
                }}
              >
                <SelectTrigger className="w-[150px] h-10 text-xs font-semibold bg-white border-neutral-200/90 hover:border-neutral-400 rounded-xl text-neutral-800 shadow-2xs">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-200 rounded-xl shadow-lg">
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.id}
                      value={opt.id}
                      className="text-xs font-medium cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Map Button */}
              <button
                type="button"
                onClick={() => router.push("/search-your-gateway")}
                className="h-10 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <FaMapMarkedAlt className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE BODY (Banner, Sidebar, Property Cards & Pagination)                 */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Quick Search Bar */}
        <div className="md:hidden relative w-full mb-3 mt-1">
          <input
            type="text"
            placeholder="Search stays by name or area..."
            value={searchQuery}
            onChange={(e) => {
              dispatch(setSearchQuery(e.target.value));
              dispatch(setCurrentPage(1));
            }}
            className="w-full h-10 pl-9 pr-8 bg-white rounded-2xl border border-neutral-200/90 shadow-2xs text-xs font-medium placeholder-neutral-400 text-neutral-900 outline-none focus:border-[#ff6900]"
          />
          <Search className="w-4 h-4 text-[#ff6900] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                dispatch(setSearchQuery(""));
                dispatch(setCurrentPage(1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Header Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#ff6900] bg-orange-50 border border-orange-200/80 px-2.5 py-0.5 rounded-full">
                Handpicked Getaways
              </span>
              {checkin && checkout && (
                <span className="text-[10px] font-semibold text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded-full">
                  Dates Selected
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-neutral-900 tracking-tight">
              {selectedCategoryName || "All Stays"}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Verified premium stays with private pools, mountain views & instant confirmation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200/90 shadow-2xs px-3 py-1.5 rounded-full">
              ✨ {totalItems} {totalItems === 1 ? "Stay" : "Stays"} Available
            </span>
          </div>
        </div>

        {/* Main Layout: Desktop Sidebar + Property Cards */}
        <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
          {/* Desktop Filter Sidebar */}
          {showFilterSidebar && (
            <div className="hidden md:block w-72 lg:w-80 shrink-0 sticky top-32">
              <div className="bg-white rounded-3xl border border-neutral-200/90 shadow-xs overflow-hidden">
                <ScrollArea className="h-[calc(100vh-150px)]">
                  <div className="p-5 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-150">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-[#ff6900]" />
                        <span className="font-bold text-sm text-neutral-900">
                          Filters
                        </span>
                        {activeFiltersCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#ff6900] text-white text-[11px] font-bold flex items-center justify-center">
                            {activeFiltersCount}
                          </span>
                        )}
                      </div>

                      {activeFiltersCount > 0 && (
                        <button
                          type="button"
                          onClick={clearAllFiltersHandler}
                          className="text-xs font-semibold text-[#ff6900] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>

                    {/* Stay Categories */}
                    <div>
                      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
                        Category
                      </h4>
                      <div className="space-y-1.5">
                        {categories?.map((cat) => {
                          const isSelected = selectedCategoryId === cat._id;
                          return (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => {
                                dispatch(setSelectedCategory(cat._id));
                                dispatch(setSelectedCategoryname(cat.name));
                                dispatch(clearPropertyType());
                                dispatch(setCurrentPage(1));
                                const p = new URLSearchParams();
                                const inD = paramCheckin || checkin;
                                const outD = paramCheckout || checkout;
                                if (inD) p.set("checkin", inD);
                                if (outD) p.set("checkout", outD);
                                if (paramAdults) p.set("adults", paramAdults);
                                if (paramChildren) p.set("children", paramChildren);
                                const q = p.toString();
                                router.push(
                                  `/category/${cat.slug || cat.name.toLowerCase()}${q ? `?${q}` : ""}`
                                );
                              }}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-orange-50 text-[#ff6900] border border-orange-200/80 shadow-2xs"
                                  : "text-neutral-700 hover:bg-neutral-100"
                              }`}
                            >
                              <span>{cat.name}</span>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-[#ff6900]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Subtype / Room Type */}
                    {availableSubtypes.length > 0 && (
                      <div className="pt-3 border-t border-neutral-150">
                        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-3">
                          Property Type
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {availableSubtypes.map((type) => {
                            const isSelected = selectedPropertyTypes === type;
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    dispatch(clearPropertyType());
                                  } else {
                                    dispatch(setPropertyType(type));
                                  }
                                  dispatch(setCurrentPage(1));
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-neutral-900 text-white shadow-xs"
                                    : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700"
                                }`}
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Price Range Slider */}
                    <div className="pt-3 border-t border-neutral-150">
                      <div className="flex items-baseline justify-between mb-2">
                        <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                          Price Range
                        </h4>
                        <span className="text-xs font-bold text-[#ff6900]">
                          ₹{formatPrice(priceMin ?? 0)} – ₹
                          {formatPrice(priceMax ?? 60000)}
                        </span>
                      </div>

                      <div className="py-2">
                        <Slider
                          min={0}
                          max={60000}
                          step={1000}
                          value={[priceMin ?? 0, priceMax ?? 60000]}
                          onValueChange={([min, max]) => {
                            dispatch(setPriceMin(min));
                            dispatch(setPriceMax(max));
                            dispatch(setCurrentPage(1));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Main Properties List Column */}
          <div className="flex-1 w-full min-w-0">
            {/* Property Cards Container */}
            <div className="flex flex-col gap-6 mb-8">
              {dataloading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <PropertyCardSkeletonnew key={`skeleton-${index}`} />
                ))
              ) : data && data.length > 0 ? (
                data.map((property) => (
                  <PropertyCardnew key={property._id} property={property} />
                ))
              ) : (
                /* Empty Results State */
                <div className="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-12 text-center shadow-xs">
                  <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff6900] flex items-center justify-center mx-auto mb-4">
                    <Search className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">
                    No properties match your filters
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto mb-5">
                    Try adjusting your price range, clearing subtype options, or browsing another stay category.
                  </p>
                  <button
                    type="button"
                    onClick={clearAllFiltersHandler}
                    className="px-5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </div>

            {/* ========================================================================= */}
            {/* PAGINATION COMPONENT                                                      */}
            {/* ========================================================================= */}
            {totalPages > 1 ? (
              <div className="mt-8 pt-6 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Results Count Summary */}
                <div className="text-xs font-medium text-neutral-500">
                  Showing{" "}
                  <span className="font-bold text-neutral-800">
                    {(currentActivePage - 1) * limit + 1}
                  </span>
                  –
                  <span className="font-bold text-neutral-800">
                    {Math.min(currentActivePage * limit, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-neutral-800">
                    {totalItems}
                  </span>{" "}
                  stays
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1.5">
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentActivePage <= 1 || dataloading}
                    onClick={() => handlePageChange(currentActivePage - 1)}
                    className={`h-9 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      currentActivePage <= 1
                        ? "opacity-40 cursor-not-allowed border-neutral-200 text-neutral-400 bg-neutral-50"
                        : "border-neutral-200/90 hover:border-[#ff6900] text-neutral-800 bg-white hover:bg-orange-50/50 cursor-pointer shadow-2xs"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers(currentActivePage, totalPages).map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-8 text-center text-neutral-400 text-xs font-bold"
                        >
                          ...
                        </span>
                      );
                    }
                    const isActive = p === currentActivePage;
                    return (
                      <button
                        key={`page-${p}`}
                        type="button"
                        disabled={dataloading}
                        onClick={() => handlePageChange(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white shadow-xs scale-105"
                            : "bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 hover:border-neutral-300"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentActivePage >= totalPages || dataloading}
                    onClick={() => handlePageChange(currentActivePage + 1)}
                    className={`h-9 px-3 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      currentActivePage >= totalPages
                        ? "opacity-40 cursor-not-allowed border-neutral-200 text-neutral-400 bg-neutral-50"
                        : "border-neutral-200/90 hover:border-[#ff6900] text-neutral-800 bg-white hover:bg-orange-50/50 cursor-pointer shadow-2xs"
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              totalItems > 0 && (
                <div className="mt-8 pt-5 border-t border-neutral-200/60 text-center text-xs text-neutral-400 font-medium">
                  Showing all {totalItems} available {totalItems === 1 ? "stay" : "stays"}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FLOATING ACTION PILL: FILTERS & MAP (Airbnb Signature UX)         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showFloatingBar && (
          <motion.div
            key="mobile-floating-action-pill"
            initial={{ opacity: 0, y: 22, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.92 }}
            transition={{
              duration: 0.28,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn(
              "fixed left-1/2 -translate-x-1/2 z-40 md:hidden flex items-center h-10 rounded-full bg-neutral-950/95 backdrop-blur-md border border-white/20 shadow-[0_6px_24px_rgba(0,0,0,0.35)] px-1.5 py-1 text-white transition-[bottom] duration-300 whitespace-nowrap min-w-max",
              isNavVisible ? "bottom-20" : "bottom-5"
            )}
          >
            <SortDrawer
              trigger={
                <button
                  type="button"
                  className="h-8 px-4 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                  <span className="whitespace-nowrap">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#ff6900] text-white text-[10px] flex items-center justify-center font-bold ml-0.5 shrink-0">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              }
            />

            <div className="w-px h-3.5 bg-white/20 shrink-0 mx-0.5" />

            <button
              type="button"
              onClick={() => router.push("/search-your-gateway")}
              className="h-8 px-4 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap shrink-0"
            >
              <FaMapMarkedAlt className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
              <span className="whitespace-nowrap">Map View</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
