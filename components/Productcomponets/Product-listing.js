"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Search, Star, Filter, X } from "lucide-react"
import { Button } from "@heroui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PropertyCard } from "@/components/Availableweekend/property-card"
import { Pagination } from "@/components/ui/pagination"
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
  setCurrentPage,
  setFilteredProperties,
  setTotalCount,
  setTotalPages,
  setLoading,
  setShowMobileFilters,
  clearAllFilters,
} from "@/Redux/Slices/propertyFilterSlice"

const fetchProperties = async (filters, page = 1, limit = 6) => {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/properties', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ filters, page, limit })
  // })
  // return response.json()

  // Mock implementation for now
  return {
    properties: [
      {
        id: 1,
        name: "The Ganga House",
        location: "Varanasi, Uttar Pradesh",
        category: "villa",
        propertyType: "3BHK",
        rating: 4.8,
        guests: 10,
        rooms: 4,
        baths: 2,
        price: 20847,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: true,
        popular: true,
        seasonal: false,
      },
      {
        id: 2,
        name: "Barkat Villa - Ramgarh",
        location: "Nainital, Uttarakhand",
        category: "villa",
        propertyType: "5BHK",
        rating: 4.8,
        guests: 15,
        rooms: 5,
        baths: 5,
        price: 50523,
        originalPrice: 54948,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: true,
        popular: true,
        seasonal: true,
      },
      {
        id: 3,
        name: "Mountain Camp Retreat",
        location: "Manali, Himachal Pradesh",
        category: "camping",
        propertyType: "Family Tent",
        rating: 4.5,
        guests: 6,
        rooms: 1,
        baths: 1,
        price: 8500,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: false,
        popular: true,
        seasonal: true,
      },
      {
        id: 4,
        name: "Cozy Mountain Cottage",
        location: "Shimla, Himachal Pradesh",
        category: "cottage",
        propertyType: "Family Cottage",
        rating: 4.6,
        guests: 8,
        rooms: 3,
        baths: 2,
        price: 15000,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: false,
        popular: false,
        seasonal: true,
      },
      {
        id: 5,
        name: "Grand Palace Hotel",
        location: "Jaipur, Rajasthan",
        category: "hotel",
        propertyType: "Deluxe Room",
        rating: 4.9,
        guests: 2,
        rooms: 1,
        baths: 1,
        price: 12000,
        originalPrice: 15000,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: true,
        popular: true,
        seasonal: false,
      },
      {
        id: 6,
        name: "Riverside Camping",
        location: "Rishikesh, Uttarakhand",
        category: "camping",
        propertyType: "Single Tent",
        rating: 4.2,
        guests: 2,
        rooms: 1,
        baths: 1,
        price: 3500,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: false,
        popular: false,
        seasonal: false,
      },
      {
        id: 7,
        name: "Luxury Beach Villa",
        location: "Goa, India",
        category: "villa",
        propertyType: "4BHK",
        rating: 4.7,
        guests: 12,
        rooms: 4,
        baths: 3,
        price: 35000,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: true,
        popular: true,
        seasonal: true,
      },
      {
        id: 8,
        name: "Heritage Hotel Suite",
        location: "Udaipur, Rajasthan",
        category: "hotel",
        propertyType: "Suite",
        rating: 4.8,
        guests: 4,
        rooms: 2,
        baths: 2,
        price: 25000,
        originalPrice: 28000,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: true,
        popular: true,
        seasonal: false,
      },
      {
        id: 9,
        name: "Forest Cottage Retreat",
        location: "Coorg, Karnataka",
        category: "cottage",
        propertyType: "Couple Cottage",
        rating: 4.4,
        guests: 4,
        rooms: 2,
        baths: 1,
        price: 9500,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: false,
        popular: true,
        seasonal: true,
      },
      {
        id: 10,
        name: "Adventure Base Camp",
        location: "Leh, Ladakh",
        category: "camping",
        propertyType: "Couple Tent",
        rating: 4.3,
        guests: 4,
        rooms: 1,
        baths: 1,
        price: 6500,
        originalPrice: null,
 images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],        bestRated: false,
        popular: false,
        seasonal: true,
      },
    ],
    totalCount: 10,
    currentPage: page,
    totalPages: Math.ceil(10 / limit),
  }
}

export default function PropertyFilterListing() {
  const dispatch = useDispatch()
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
  } = useSelector((state) => state.propertyFilter)

  const propertyTypesByCategory = {
    villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
    camping: ["Single Tent", "Couple Tent", "Family Tent"],
    cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
    hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
  }

  const priceRangeOptions = [
    { id: "under-10k", label: "Under ₹10,000", min: 0, max: 10000 },
    { id: "10k-20k", label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
    { id: "20k-30k", label: "₹20,000 - ₹30,000", min: 20000, max: 30000 },
    { id: "30k-40k", label: "₹30,000 - ₹40,000", min: 30000, max: 40000 },
    { id: "40k-60k", label: "₹40,000 - ₹60,000", min: 40000, max: 60000 },
    { id: "above-60k", label: "Above ₹60,000", min: 60000, max: Number.POSITIVE_INFINITY },
  ]

  const getAvailablePropertyTypes = () => {
    if (selectedCategories.length === 0) {
      return Object.values(propertyTypesByCategory).flat()
    }
    return selectedCategories.flatMap((category) => propertyTypesByCategory[category] || [])
  }

  const availablePropertyTypes = getAvailablePropertyTypes()

  const applyFilters = async () => {
    dispatch(setLoading(true))

    try {
      const filters = {
        search: searchQuery,
        categories: selectedCategories,
        propertyTypes: selectedPropertyTypes,
        priceRanges: selectedPriceRanges,
        rating: selectedRating,
        popular: showPopular,
        seasonal: showSeasonal,
        sortBy: sortBy,
      }

      const result = await fetchProperties(filters, currentPage, itemsPerPage)

      dispatch(setFilteredProperties(result.properties))
      dispatch(setTotalCount(result.totalCount))
      dispatch(setTotalPages(result.totalPages))
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      dispatch(setLoading(false))
    }
  }

  useEffect(() => {
    applyFilters()
  }, [
    selectedCategories,
    selectedPropertyTypes,
    selectedPriceRanges,
    selectedRating,
    searchQuery,
    sortBy,
    showPopular,
    showSeasonal,
    currentPage,
  ])

  const handleCategoryChange = (category, checked) => {
    console.log("[v0] Category change:", { category, checked, currentCategories: selectedCategories })
    if (checked) {
      dispatch(addCategory(category))
    } else {
      dispatch(removeCategory(category))
    }
  }

  const handlePropertyTypeChange = (type, checked) => {
    console.log("[v0] Property type change:", { type, checked, currentTypes: selectedPropertyTypes })
    if (checked) {
      dispatch(addPropertyType(type))
    } else {
      dispatch(removePropertyType(type))
    }
  }

  const handlePriceRangeChange = (rangeId, checked) => {
    console.log("[v0] Price range change:", { rangeId, checked, currentRanges: selectedPriceRanges })
    if (checked) {
      dispatch(addPriceRange(rangeId))
    } else {
      dispatch(removePriceRange(rangeId))
    }
  }

  const clearAllFiltersHandler = () => {
    console.log("[v0] Clearing all filters")
    dispatch(clearAllFilters())
  }

  useEffect(() => {
    console.log("[v0] Redux state updated:", {
      selectedCategories,
      selectedPropertyTypes,
      selectedPriceRanges,
      selectedRating,
      searchQuery,
      sortBy,
      showPopular,
      showSeasonal,
      currentPage,
      loading,
      propertiesCount: filteredProperties.length,
    })
  }, [
    selectedCategories,
    selectedPropertyTypes,
    selectedPriceRanges,
    selectedRating,
    searchQuery,
    sortBy,
    showPopular,
    showSeasonal,
    currentPage,
    loading,
    filteredProperties.length,
  ])

  const FilterSidebar = ({ isMobile = false }) => (
    <div
      className={`${isMobile ? "p-6" : "p-4"} ${isMobile ? "bg-white" : "bg-gray-50"} ${isMobile ? "text-gray-900" : "text-gray-900"} rounded-lg border border-gray-200`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
          <Filter className="h-5 w-5" />
          Filters
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onPress={clearAllFiltersHandler}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Clear All
          </Button>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onPress={() => dispatch(setShowMobileFilters(false))}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Categories</h3>
          <div className="space-y-3">
            {["villa", "camping", "cottage", "hotel"].map((category) => (
              <div key={category} className="flex items-center space-x-3">
                <Checkbox
                  id={`${isMobile ? "mobile-" : ""}${category}`}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={`${isMobile ? "mobile-" : ""}${category}`}
                  className="text-sm flex justify-between w-full capitalize cursor-pointer text-gray-700 hover:text-gray-900"
                >
                  <span>{category}</span>
                  <span className="text-gray-500">
                    ({["villa", "camping", "cottage", "hotel"].filter((c) => c === category).length})
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Property Type</h3>
          <ScrollArea className="h-48">
            <div className="space-y-3 pr-4">
              {availablePropertyTypes.map((type) => (
                <div key={type} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${isMobile ? "mobile-" : ""}${type}`}
                    checked={selectedPropertyTypes.includes(type)}
                    onCheckedChange={(checked) => handlePropertyTypeChange(type, checked)}
                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor={`${isMobile ? "mobile-" : ""}${type}`}
                    className="text-sm flex justify-between w-full cursor-pointer text-gray-700 hover:text-gray-900"
                  >
                    <span>{type}</span>
                    <span className="text-gray-500">({availablePropertyTypes.filter((p) => p === type).length})</span>
                  </label>
                </div>
              ))}
            </div>
          </ScrollArea>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">Showing types for: {selectedCategories.join(", ")}</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Price Range</h3>
          <div className="space-y-3">
            {priceRangeOptions.map((range) => (
              <div key={range.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`${isMobile ? "mobile-" : ""}${range.id}`}
                  checked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={(checked) => handlePriceRangeChange(range.id, checked)}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={`${isMobile ? "mobile-" : ""}${range.id}`}
                  className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4 text-gray-900">Special Filters</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`${isMobile ? "mobile-" : ""}popular`}
                checked={showPopular}
                onCheckedChange={(checked) => dispatch(setShowPopular(checked))}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor={`${isMobile ? "mobile-" : ""}popular`}
                className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
              >
                Popular Properties
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id={`${isMobile ? "mobile-" : ""}seasonal`}
                checked={showSeasonal}
                onCheckedChange={(checked) => dispatch(setShowSeasonal(checked))}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label
                htmlFor={`${isMobile ? "mobile-" : ""}seasonal`}
                className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
              >
                Seasonal Trends
              </label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Rating</h3>
          <RadioGroup value={selectedRating} onValueChange={(value) => dispatch(setRating(value))}>
            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem
                value="4-5"
                id={`${isMobile ? "mobile-" : ""}r1`}
                className="border-gray-300 text-blue-600"
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}r1`}
                className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900"
              >
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">4.0 - 5.0 Star</span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem
                value="3-4"
                id={`${isMobile ? "mobile-" : ""}r2`}
                className="border-gray-300 text-blue-600"
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}r2`}
                className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900"
              >
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  {[...Array(2)].map((_, i) => (
                    <Star key={i + 3} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm">3.0 - 4.0 Star</span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem
                value="2-3"
                id={`${isMobile ? "mobile-" : ""}r3`}
                className="border-gray-300 text-blue-600"
              />
              <Label
                htmlFor={`${isMobile ? "mobile-" : ""}r3`}
                className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900"
              >
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(2)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  {[...Array(3)].map((_, i) => (
                    <Star key={i + 2} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm">2.0 - 3.0 Star</span>
              </Label>
            </div>
          </RadioGroup>
        </div>
      </ScrollArea>
    </div>
  )

  const MobileFilterDrawer = () => (
    <div className="p-4">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-3 text-gray-900">Price Range</h3>
          <div className="space-y-3">
            {priceRangeOptions.map((range) => (
              <div key={range.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`mobile-${range.id}`}
                  checked={selectedPriceRanges.includes(range.id)}
                  onCheckedChange={(checked) => handlePriceRangeChange(range.id, checked)}
                  className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={`mobile-${range.id}`}
                  className="text-sm cursor-pointer text-gray-700 hover:text-gray-900"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Rating</h3>
          <RadioGroup value={selectedRating} onValueChange={(value) => dispatch(setRating(value))}>
            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="4-5" id="mobile-r1" className="border-gray-300 text-blue-600" />
              <Label htmlFor="mobile-r1" className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm">4.0 - 5.0 Star</span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="3-4" id="mobile-r2" className="border-gray-300 text-blue-600" />
              <Label htmlFor="mobile-r2" className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(3)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  {[...Array(2)].map((_, i) => (
                    <Star key={i + 3} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm">3.0 - 4.0 Star</span>
              </Label>
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <RadioGroupItem value="2-3" id="mobile-r3" className="border-gray-300 text-blue-600" />
              <Label htmlFor="mobile-r3" className="flex items-center cursor-pointer text-gray-700 hover:text-gray-900">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(2)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  {[...Array(3)].map((_, i) => (
                    <Star key={i + 2} className="h-4 w-4 text-gray-300" />
                  ))}
                </div>
                <span className="text-sm">2.0 - 3.0 Star</span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-gray-900">Special Filters</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="mobile-seasonal"
                checked={showSeasonal}
                onCheckedChange={(checked) => dispatch(setShowSeasonal(checked))}
                className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <label htmlFor="mobile-seasonal" className="text-sm cursor-pointer text-gray-700 hover:text-gray-900">
                Seasonal Trends
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full mx-auto md:px-8 px-3 md:py-8 py-4 bg-gray-50 min-h-screen">
     

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-900 text-sm">Loading properties...</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-80 shrink-0 hidden md:block order-1 md:order-1">
          <div className="sticky top-8">
            <FilterSidebar />
          </div>
        </div>

        <div className="flex-1 order-2 md:order-2">
          <div className="flex md:hidden justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => dispatch(setSortBy(value))}>
                <SelectTrigger className="w-[140px] h-9 text-sm bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="popular" className="text-gray-900 hover:bg-gray-50">
                    Most Popular
                  </SelectItem>
                  <SelectItem value="low-high" className="text-gray-900 hover:bg-gray-50">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-low" className="text-gray-900 hover:bg-gray-50">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating" className="text-gray-900 hover:bg-gray-50">
                    Highest Rated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="bg-white border-gray-300 text-gray-900 hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Filter Properties</DrawerTitle>
                  <DrawerDescription>Adjust filters to find your perfect property</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="h-[60vh] px-4">
                  <MobileFilterDrawer />
                </ScrollArea>
                <DrawerFooter>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onPress={() => {
                        dispatch(setRating(""))
                        dispatch(addPriceRange([])) // Updated line
                        dispatch(setShowSeasonal(false))
                      }}
                      className="flex-1 bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
                    >
                      Clear Filters
                    </Button>
                    <DrawerClose asChild>
                      <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">Apply Filters</Button>
                    </DrawerClose>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          <div className="flex md:hidden mb-4">
            <div className="relative w-full">
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

          <div className="hidden md:flex justify-between mb-6 gap-4">
            <div className="relative w-80">
              <Input
                type="text"
                placeholder="Search properties..."
                className="w-full bg-white border-gray-300 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2 text-sm focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={(value) => dispatch(setSortBy(value))}>
                <SelectTrigger className="w-[150px] h-9 text-sm bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-300">
                  <SelectItem value="popular" className="text-gray-900 hover:bg-gray-50">
                    Most Popular
                  </SelectItem>
                  <SelectItem value="low-high" className="text-gray-900 hover:bg-gray-50">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="high-low" className="text-gray-900 hover:bg-gray-50">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating" className="text-gray-900 hover:bg-gray-50">
                    Highest Rated
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="space-y-4 mb-8">
              <div className="text-sm text-gray-600 text-center">
                Showing {currentPage * itemsPerPage - itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} properties
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

          {!loading && filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-600 mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">No properties found</h3>
                <p className="text-sm">Try adjusting your filters or search criteria</p>
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
  )
}
