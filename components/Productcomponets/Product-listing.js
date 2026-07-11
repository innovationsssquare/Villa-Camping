"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Star,
  Filter,
  X,
  Menu,
  SlidersHorizontal,
  PanelLeftClose,
} from "lucide-react";
import { Button } from "@heroui/react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Pagination } from "@/components/ui/pagination";
import {
  addPriceRange,
  removePriceRange,
  addCategory,
  removeCategory,
  addPropertyType,
  removePropertyType,
  setRating,
  setSearchQuery,
  setSortBy,
  setShowPopular,
  setShowSeasonal,
  setFilteredProperties,
  setTotalCount,
  setTotalPages,
  setLoading,
  setShowMobileFilters,
  clearAllFilters,
  setPriceMin,
  setPriceMax,
  setPropertyTypes,
  setPropertyType,
  clearPropertyType,
} from "@/Redux/Slices/propertyFilterSlice";
import PropertyCardSkeleton from "../Availableweekend/property-card-skeleton";
import { IoSearchCircle } from "react-icons/io5";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";
import { SortDrawer } from "./SortDrawer";
import { Separator } from "@/components/ui/separator";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import PropertyCardnew from "../Availableweekend/PropertyCard";
import PropertyCardSkeletonnew from "../Availableweekend/PropertyCardSkeleton";
import { NavigationCarousel } from "../Availableweekend/NavigationCarousel";
import {
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";

export const PROPERTY_TYPES_BY_SLUG = {
  villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
  camping: ["Single Tent", "Couple Tent", "Family Tent"],
  cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
  hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
};

export default function PropertyFilterListing({ categorySlug }) {
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const dispatch = useDispatch();
  const {
    selectedPriceRanges,
    selectedCategories,
    selectedPropertyTypes,
    selectedRating,
    searchQuery,
    sortBy,
    showPopular,
    showSeasonal,
    filteredProperties,
    currentPage,
    itemsPerPage,
    totalCount,
    totalPages,
    loading,
    showMobileFilters,
    priceMin,
    priceMax,
  } = useSelector((state) => state.propertyFilter);
  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId, checkin, checkout, selectedGuest } = useSelector(
    (state) => state.booking
  );
  const { dataloading, error, data, pagination } = useSelector(
    (state) => state.properties
  );
  const router = useRouter();

  // Sync categorySlug parameter with Redux category state
  useEffect(() => {
    if (categorySlug === "all") {
      dispatch(setSelectedCategory(null));
      dispatch(setSelectedCategoryname("All Stays"));
      dispatch(clearPropertyType());
    } else if (categorySlug && categories?.length > 0) {
      const matchedCategory = categories.find(
        (cat) => cat.slug?.toLowerCase() === categorySlug.toLowerCase()
      );
      if (matchedCategory) {
        if (selectedCategoryId !== matchedCategory._id) {
          dispatch(setSelectedCategory(matchedCategory._id));
          dispatch(setSelectedCategoryname(matchedCategory.name));
          dispatch(clearPropertyType());
        }
      }
    }
  }, [categorySlug, categories, selectedCategoryId, dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllProperties({
        categoryId: selectedCategoryId,
        checkIn: checkin,
        checkOut: checkout,
        subtype: selectedPropertyTypes,
        priceMin: priceMin,
        priceMax: priceMax,
        sortBy: sortBy,
        search: searchQuery,
        page: 1,
        limit: 10,
      })
    );
  }, [
    dispatch,
    selectedCategoryId,
    checkin,
    checkout,
    priceMin,
    priceMax,
    sortBy,
    selectedPropertyTypes,
    searchQuery,
  ]);

  const propertyTypesByCategory = {
    villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
    camping: ["Single Tent", "Couple Tent", "Family Tent"],
    cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
    hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
  };

  const priceRangeOptions = [
    { id: "under-10k", label: "Under ₹10,000", min: 0, max: 10000 },
    { id: "10k-20k", label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { id: "20k-30k", label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
    { id: "30k-40k", label: "₹30,000 - ₹40,000", min: 30000, max: 40000 },
    { id: "40k-60k", label: "₹40,000 - ₹60,000", min: 40000, max: 60000 },
    {
      id: "above-60k",
      label: "Above ₹60,000",
      min: 60000,
      max: Number.POSITIVE_INFINITY,
    },
  ];

  const getAvailablePropertyTypes = () => {
    if (selectedCategories.length === 0) {
      return Object.values(propertyTypesByCategory).flat();
    }
    return selectedCategories.flatMap(
      (category) => propertyTypesByCategory[category] || []
    );
  };

  const availablePropertyTypes = getAvailablePropertyTypes();

  const handlePriceRangeChange = (rangeId) => {
    // clear previous selected range
    selectedPriceRanges.forEach((r) => dispatch(removePriceRange(r)));

    // reset price filter
    if (rangeId === "all") {
      dispatch(setPriceMin(null));
      dispatch(setPriceMax(null));
      return;
    }

    const range = priceRangeOptions.find((r) => r.id === rangeId);
    if (!range) return;

    // UI state (dropdown highlight)
    dispatch(addPriceRange(rangeId));

    // 🔑 ACTUAL FILTER VALUES
    dispatch(setPriceMin(range.min));
    dispatch(setPriceMax(range.max === Infinity ? null : range.max));
  };

  const clearAllFiltersHandler = () => {
    dispatch(clearAllFilters());
  };

  // useEffect(() => {
  //   console.log("[v0] Redux state updated:", {
  //     selectedCategories,
  //     selectedPropertyTypes,
  //     selectedPriceRanges,
  //     selectedRating,
  //     searchQuery,
  //     sortBy,
  //     showPopular,
  //     showSeasonal,
  //     currentPage,
  //     loading,
  //     propertiesCount: filteredProperties.length,
  //   });
  // }, [
  //   selectedCategories,
  //   selectedPropertyTypes,
  //   selectedPriceRanges,
  //   selectedRating,
  //   searchQuery,
  //   sortBy,
  //   showPopular,
  //   showSeasonal,
  //   currentPage,
  //   loading,
  //   filteredProperties.length,
  // ]);

  function FilterSidebar() {
    const dispatch = useDispatch();

    /* ===== REDUX STATE ===== */
    const { categories } = useSelector((state) => state.category);
    const { selectedCategoryId } = useSelector((state) => state.booking);
    const { selectedPropertyTypes } = useSelector(
      (state) => state.propertyFilter
    );

    /* ===== RESOLVE ACTIVE CATEGORY (ID → OBJECT) ===== */
    const activeCategory = useMemo(() => {
      if (!selectedCategoryId || !categories?.length) return null;
      return categories.find((c) => c._id === selectedCategoryId) || null;
    }, [selectedCategoryId, categories]);

    /* ===== SUBTYPES FROM SLUG ===== */
    const availablePropertyTypes = useMemo(() => {
      if (!activeCategory) return [];
      return PROPERTY_TYPES_BY_SLUG[activeCategory.slug] || [];
    }, [activeCategory]);

    return (
      <div className="p-4 bg-gray-50 h-screen sticky top-20 border border-gray-200">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => dispatch(clearAllFilters())}
          >
            Clear
          </Button>
        </div>

        {/* CATEGORY */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Category</h3>

          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat._id} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedCategoryId === cat._id}
                  onCheckedChange={() => {
                    dispatch(setSelectedCategory(cat?._id));
                    dispatch(setSelectedCategoryname(cat?.name));
                    dispatch(clearPropertyType());
                  }}
                />
                <Label>{cat.name}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <h3 className="font-semibold mb-3">Property Type</h3>

          {!activeCategory && (
            <p className="text-sm text-gray-500">
              Select a category to see property types
            </p>
          )}

          <div className="space-y-2">
            {availablePropertyTypes.map((type) => (
              <div key={type} className="flex items-center gap-3">
                <Checkbox
                  checked={selectedPropertyTypes === type}
                  onCheckedChange={(checked) =>
                    checked
                      ? dispatch(setPropertyType(type))
                      : dispatch(clearPropertyType())
                  }
                />
                <Label>{type}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const PriceRangeSelect = () => (
    <Select
      value={selectedPriceRanges.length > 0 ? selectedPriceRanges[0] : "all"}
      onValueChange={handlePriceRangeChange}
    >
      <SelectTrigger className="w-[160px] h-9 text-sm bg-white border-gray-300 text-gray-900">
        <SelectValue placeholder="Price Range" />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-300">
        <SelectItem value="all" className="text-gray-900 hover:bg-gray-50">
          All Prices
        </SelectItem>
        {priceRangeOptions.map((range) => (
          <SelectItem
            key={range.id}
            value={range.id}
            className="text-gray-900 hover:bg-gray-50"
          >
            {range.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div className="w-full mx-auto px-0 md:px-4  md:py-8 py-4 bg-gray-50 h-auto ">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-900 text-sm">Loading properties...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 h-auto  ">
        <div
          className={`w-full shrink-0 hidden md:block order-1 md:order-1 transition-all duration-300 ease-in-out ${
            showFilterSidebar
              ? "md:w-64 opacity-100"
              : "md:w-0 opacity-0 overflow-hidden -ml-8"
          }`}
        >
          <FilterSidebar />
        </div>

        <div className="flex-1 order-2 md:order-2 flex flex-col min-h-full ">
          <NavigationCarousel />

          <div className="md:sticky hidden md:block md:top-16 fixed w-[90%] px-2 md:w-full transform -translate-x-1/2 md:translate-0 -translate-y-1/2 md:left-0 left-1/2  -bottom-6 z-40 bg-white backdrop-blur-2xl h-13 md:h-auto  md:py-4 py-1 md:mb-6 shrink-0 md:border-b md:border-0 border border-gray-200   rounded-full md:rounded-none">
            <div className="flex md:hidden justify-around  gap-2 items-center   ">
              <SortDrawer />
              <Button
                onPress={() => router.push("/search-your-gateway")}
                className="rounded-full bg-white border border-gray-200 uppercase font-medium"
              >
                <FaMapMarkedAlt size={24} />
                map
              </Button>
            </div>

            <div className="hidden md:flex justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setShowFilterSidebar(!showFilterSidebar)}
                  className="bg-black text-white border-gray-300  hover:bg-black h-9 px-3"
                  title={showFilterSidebar ? "Hide filters" : "Show filters"}
                >
                  {showFilterSidebar ? (
                    <PanelLeftClose className="h-4 w-4 " />
                  ) : (
                    <SlidersHorizontal className="h-4 w-4" />
                  )}
                </Button>

                <div className="relative w-60">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 text-sm focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriceRangeSelect />
                <Select
                  value={sortBy}
                  onValueChange={(value) => dispatch(setSortBy(value))}
                >
                  <SelectTrigger className="w-[100px] h-9 text-sm bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    <SelectItem
                      value="popular"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Most Popular
                    </SelectItem>
                    <SelectItem
                      value="low-high"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Price: Low to High
                    </SelectItem>
                    <SelectItem
                      value="high-low"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Price: High to Low
                    </SelectItem>
                    <SelectItem
                      value="rating"
                      className="text-gray-900 hover:bg-gray-50"
                    >
                      Highest Rated
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="h-auto mt-24 md:mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-4 px-3 md:px-0 bg-gray-50">
                {dataloading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <PropertyCardSkeletonnew key={`skeleton-${index}`} />
                    ))
                  : data?.map((property) => (
                      <PropertyCardnew key={property._id} property={property} />
                    ))}
              </div>

              {totalPages > 1 && (
                <div className="space-y-2 mb-4 pr-4">
                  <div className="text-sm text-gray-600 text-center">
                    Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, totalCount)} of{" "}
                    {totalCount} properties
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    // onPageChange={(page) => dispatch(setCurrentPage(page))}
                  />
                </div>
              )}

              {!dataloading && (!data || data.length === 0) && (
                <div className="text-center py-12 pr-4">
                  <div className="text-gray-600 mb-4">
                    <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2 text-gray-900">
                      No properties found
                    </h3>
                    <p className="text-sm">
                      Try adjusting your filters or search criteria
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onPress={clearAllFiltersHandler}
                    className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
