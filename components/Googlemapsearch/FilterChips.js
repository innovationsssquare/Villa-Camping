"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bed,
  HouseWifi,
  Tent,
  House,
  Sparkles,
} from "lucide-react";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { setSelectedCategory } from "@/Redux/Slices/bookingSlice";

const getCategoryIcon = (slug, isActive) => {
  const iconClass = `h-3.5 w-3.5 transition-colors ${isActive ? "text-white" : "text-[#ff6900]"
    }`;

  switch (slug?.toLowerCase()) {
    case "villa":
      return <HouseWifi className={iconClass} />;
    case "camping":
      return <Tent className={iconClass} />;
    case "cottage":
      return <House className={iconClass} />;
    case "hotel":
      return <Bed className={iconClass} />;
    default:
      return <Sparkles className={iconClass} />;
  }
};

export const FilterChips = ({
  onFilterSelect,
  className = "px-2 py-2",
}) => {
  const dispatch = useDispatch();

  const { categories = [], loading } = useSelector(
    (state) => state.category
  );

  const { selectedCategoryId, selectedCategoryName } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    const isCurrent = selectedCategoryId === category._id;
    const nextId = isCurrent ? null : category._id;
    const nextName = isCurrent ? null : category.name;
    dispatch(setSelectedCategory(nextId));
    dispatch(setSelectedCategoryname(nextName));
    onFilterSelect?.(nextId);
  };

  if (loading || !categories.length) return null;

  return (
    <div className={className}>
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1">
        {/* Dynamic Category Pills */}
        {categories.map((category) => {
          const isActive =
            selectedCategoryId === category._id ||
            (selectedCategoryName &&
              selectedCategoryName.toLowerCase().startsWith(category.name.toLowerCase().slice(0, 4)));

          return (
            <button
              key={category._id}
              type="button"
              onClick={() => handleCategoryClick(category)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${isActive
                  ? "bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white shadow-xs scale-[1.02]"
                  : "bg-white text-neutral-700 border border-neutral-200/90 hover:border-[#ff6900]/40 hover:bg-neutral-50 shadow-xs"
                }`}
            >
              {getCategoryIcon(category.slug || category.name, isActive)}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

