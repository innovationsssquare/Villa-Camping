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
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, Check, RotateCcw, ArrowUpDown, Sparkles } from "lucide-react";
import {
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import {
  clearAllFilters,
  clearPropertyType,
  setPriceMax,
  setPriceMin,
  setPropertyType,
  setSortBy,
} from "@/Redux/Slices/propertyFilterSlice";
import { normalizeCategoryStem } from "@/lib/categoryUtils";

export const PROPERTY_TYPES_BY_SLUG = {
  villa: ["2BHK", "3BHK", "4BHK", "5BHK", "6BHK"],
  camping: ["Single Tent", "Couple Tent", "Family Tent"],
  cottage: ["Single Cottage", "Couple Cottage", "Family Cottage"],
  hotel: ["Standard Room", "Deluxe Room", "Suite", "Presidential Suite"],
};

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular", desc: "Highest bookings & views" },
  { value: "low-high", label: "Price: Low to High", desc: "Budget friendly stays first" },
  { value: "high-low", label: "Price: High to Low", desc: "Luxury and premium stays" },
  { value: "rating", label: "Highest Rated", desc: "Top guest rated properties" },
];

const QUICK_PRICES = [
  { label: "All", min: null, max: null },
  { label: "< ₹10k", min: 0, max: 10000 },
  { label: "₹10k–20k", min: 10000, max: 20000 },
  { label: "₹20k–35k", min: 20000, max: 35000 },
  { label: "₹35k+", min: 35000, max: null },
];

export function SortDrawer({ trigger }) {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId, selectedCategoryName } = useSelector(
    (state) => state.booking
  );
  const { selectedPropertyTypes, sortBy, priceMin, priceMax } = useSelector(
    (state) => state.propertyFilter
  );

  const [localSort, setLocalSort] = useState(sortBy);

  const activeCategory = useMemo(() => {
    if (!categories?.length) return null;
    return (
      categories.find((c) => c._id === selectedCategoryId) ||
      (selectedCategoryName
        ? categories.find(
            (c) =>
              normalizeCategoryStem(c.name) ===
              normalizeCategoryStem(selectedCategoryName)
          )
        : null) ||
      null
    );
  }, [selectedCategoryId, selectedCategoryName, categories]);

  const availableSubtypes = useMemo(() => {
    if (!activeCategory) return [];
    return PROPERTY_TYPES_BY_SLUG[activeCategory.slug] || [];
  }, [activeCategory]);

  const formatPrice = (val) => {
    if (val == null) return "0";
    return Number(val).toLocaleString("en-IN");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {trigger || (
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200/90 shadow-2xs font-semibold text-xs cursor-pointer transition-all hover:border-neutral-400"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Filters</span>
          </button>
        )}
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh] bg-white rounded-t-3xl">
        <DrawerHeader className="border-b border-neutral-150 pb-3 text-left px-5">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-base font-bold text-neutral-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#ff6900]" />
                <span>Filters & Sorting</span>
              </DrawerTitle>
              <DrawerDescription className="text-xs text-neutral-500 mt-0.5">
                Personalize stays by price, category & style
              </DrawerDescription>
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch(clearAllFilters());
                setLocalSort("popular");
              }}
              className="text-xs font-bold text-neutral-500 hover:text-[#ff6900] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </DrawerHeader>

        <ScrollArea className="h-[60vh] px-5 py-4 space-y-6">
          {/* 1. SORT BY */}
          <section className="mb-6">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Sort By</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((opt) => {
                const isSelected = localSort === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setLocalSort(opt.value);
                      dispatch(setSortBy(opt.value));
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${isSelected
                        ? "bg-orange-50/70 border-[#ff6900] shadow-2xs"
                        : "bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200/80"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-[#ff6900]" : "text-neutral-800"
                          }`}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#ff6900] stroke-[3]" />
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                      {opt.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. CATEGORY */}
          <section className="mb-6">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Stay Category</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected =
                  selectedCategoryId === cat._id ||
                  (selectedCategoryName &&
                    normalizeCategoryStem(selectedCategoryName) ===
                      normalizeCategoryStem(cat.name));
                return (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => {
                      dispatch(setSelectedCategory(cat._id));
                      dispatch(setSelectedCategoryname(cat.name));
                      dispatch(clearPropertyType());
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${isSelected
                        ? "bg-[#ff6900] text-white border-[#ff6900] shadow-xs"
                        : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200/80"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. PROPERTY TYPE (SUBTYPE) */}
          {availableSubtypes.length > 0 && (
            <section className="mb-6">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider mb-2.5">
                {activeCategory?.name || "Stay"} Type
              </h4>
              <div className="flex flex-wrap gap-2">
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
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${isSelected
                          ? "bg-orange-50 border-[#ff6900] text-[#ff6900] font-bold"
                          : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
                        }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 4. PRICE RANGE */}
          <section className="mb-4">
            <div className="flex items-baseline justify-between mb-2">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                Price Range
              </h4>
              <span className="text-xs font-bold text-[#ff6900]">
                ₹{formatPrice(priceMin ?? 0)} – ₹{formatPrice(priceMax ?? 60000)}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {QUICK_PRICES.map((qp, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    dispatch(setPriceMin(qp.min));
                    dispatch(setPriceMax(qp.max));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-medium border border-neutral-200 cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            <div className="px-1 py-2">
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
            </div>
          </section>
        </ScrollArea>

        <DrawerFooter className="border-t border-neutral-150 pt-3 px-5">
          <DrawerClose asChild>
            <button
              type="button"
              className="w-full h-11 bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Show Results
            </button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
