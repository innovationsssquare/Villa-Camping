"use client";

import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

import { Button } from "@heroui/react";
import { SlidersHorizontal } from "lucide-react";

import {
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";

import {
  addPropertyType,
  clearPropertyType,
  removePropertyType,
  setPriceMax,
  setPriceMin,
  setPropertyType,
  setSortBy,
} from "@/Redux/Slices/propertyFilterSlice";

/* ===== PROPERTY TYPES BY CATEGORY SLUG ===== */
export const PROPERTY_TYPES_BY_SLUG = {
  villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
  camping: ["Single Tent", "Couple Tent", "Family Tent"],
  cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
  hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
};

/* ===== SORT OPTIONS ===== */
const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "low-high", label: "Price: Low → High" },
  { value: "high-low", label: "Price: High → Low" },
  { value: "rating", label: "Highest Rated" },
];

export function SortDrawer() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId } = useSelector((state) => state.booking);
  const { selectedPropertyTypes, sortBy, priceMin, priceMax } = useSelector(
    (state) => state.propertyFilter
  );

  const [localSort, setLocalSort] = useState(sortBy);

  /* ===== ACTIVE CATEGORY (ID → OBJECT) ===== */
  const activeCategory = useMemo(() => {
    if (!selectedCategoryId || !categories?.length) return null;
    return categories.find((c) => c._id === selectedCategoryId) || null;
  }, [selectedCategoryId, categories]);

  /* ===== PROPERTY TYPES FROM SLUG ===== */
  const availableSubtypes = useMemo(() => {
    if (!activeCategory) return [];
    return PROPERTY_TYPES_BY_SLUG[activeCategory.slug] || [];
  }, [activeCategory]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button size="sm" className="bg-black text-white">
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filters & Sort</DrawerTitle>
          <DrawerDescription>
            Refine results by price, category and type
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="h-[75vh] px-4 space-y-8">
          {/* PRICE RANGE */}
          <section>
            <h4 className="font-semibold mb-2">Price Range</h4>
            <p className="text-sm text-gray-600 mb-3">
              ₹{priceMin ?? 0} – ₹{priceMax ?? 60000}
            </p>
            <Slider
              min={0}
              max={60000}
              step={1000}
              value={[priceMin ?? 0, priceMax ?? 60000]}
              onValueChange={([min, max]) => {
                dispatch(setPriceMin(min));
                dispatch(setPriceMax(max));
              }}
            />
          </section>

          {/* SORT */}
          <section>
            <h4 className="font-semibold mb-3">Sort By</h4>
            <RadioGroup
              value={localSort}
              onValueChange={(value) => {
                setLocalSort(value);
                dispatch(setSortBy(value)); // 🔑 APPLY IMMEDIATELY
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-3 mb-2">
                  <RadioGroupItem value={opt.value} />
                  <Label>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </section>

          {/* CATEGORY */}
          <section>
            <h4 className="font-semibold mb-3">Category</h4>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedCategoryId === cat._id}
                    onCheckedChange={() => {
                      dispatch(setSelectedCategory(cat._id));
                      dispatch(setSelectedCategoryname(cat.name));
                    }}
                  />
                  <Label>{cat.name}</Label>
                </div>
              ))}
            </div>
          </section>

          {/* PROPERTY TYPE */}
          <section>
            <h4 className="font-semibold mb-3">Property Type</h4>

            {!activeCategory && (
              <p className="text-sm text-gray-500">
                Select a category to see property types
              </p>
            )}

            <div className="space-y-2">
              {availableSubtypes.map((type) => (
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
          </section>
        </ScrollArea>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              className="bg-black text-white"
              onPress={() => dispatch(setSortBy(localSort))}
            >
              Apply Filters
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
