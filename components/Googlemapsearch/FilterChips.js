import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Bed,
  HouseWifi,
  Tent,
  House,
} from "lucide-react";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { setSelectedCategory } from "@/Redux/Slices/bookingSlice";

/**
 * Optional icon mapper by category name
 * (You can improve this later)
 */
const CATEGORY_ICON_MAP = {
  villa: <HouseWifi className="h-3 w-3 text-red-500" />,
  camping: <Tent className="h-3 w-3 text-green-500" />,
  cottage: <House className="h-3 w-3 text-yellow-500" />,
  hotel: <Bed className="h-3 w-3 text-purple-500" />,
};

export const FilterChips = ({ onFilterSelect, className = "px-2 py-3 md:py-8" }) => {
  const dispatch = useDispatch();

  const { categories = [], loading } = useSelector(
    (state) => state.category
  );

  const { selectedCategoryId } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    if (!categories.length) {
      dispatch(fetchAllCategories());
    }
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    const categoryId =
      selectedCategoryId === category._id ? null : category._id;

    // 1️⃣ Save selected category globally
    dispatch(setSelectedCategory(categoryId));

    // 2️⃣ Notify parent (Mappropertyview)
    onFilterSelect?.(categoryId);
  };

  if (loading || !categories.length) return null;

  return (
    <div className={className}>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => {
            const isActive = selectedCategoryId === category._id;

            return (
              <CarouselItem
                key={category._id}
                className="pl-2 md:pl-4 basis-auto"
              >
                <Badge
                  variant="outline"
                  onClick={() => handleCategoryClick(category)}
                  className={`villa-filter-chip cursor-pointer rounded-full px-3 py-2 shadow-md flex items-center gap-2 whitespace-nowrap
                    ${
                      isActive
                        ? "bg-orange-50 text-black border-orange-500 border-2"
                        : "bg-white border-gray-300"
                    }
                  `}
                >
                  {CATEGORY_ICON_MAP[category.slug] || null}
                  {category.name}
                </Badge>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
