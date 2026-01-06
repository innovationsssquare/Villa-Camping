"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Weekendcard from "./Weekendcard";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import {
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import { fetchPropertiesByWeekend } from "@/Redux/Slices/propertiesSlice";
import { PropertySkeleton } from "./Property-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselIndicator } from "./carousel-indicators";

export function AvailableThisWeekend() {
  const dispatch = useDispatch();

  const { categories, loading } = useSelector((state) => state.category);
  const { selectedCategoryId } = useSelector((state) => state.booking);
  const { weekendData, weekendLoading } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onApiChange = (api) => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  };

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  // ✅ NEW: track if weekend API was ever triggered
  const hasRequestedWeekend = useRef(false);

  // Fetch categories once
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Fetch weekend properties when category changes
  useEffect(() => {
    if (!selectedCategoryId || selectedCategoryId === "all") return;

    hasRequestedWeekend.current = true; // ✅ mark API triggered

    dispatch(
      fetchPropertiesByWeekend({
        categoryId: selectedCategoryId,
      })
    );
  }, [selectedCategoryId, dispatch]);

  const handleSelectCategory = (category) => {
    dispatch(setSelectedCategory(category._id));
    dispatch(setSelectedCategoryname(category?.name));
  };

  return (
    <div className="w-full mx-auto md:px-4 px-3 md:py-6 py-3 space-y-3 md:space-y-6">
      <h2 className="md:text-4xl text-center font-medium text-foreground">
        Available This Weekend
      </h2>

      {/* Category Carousel - Mobile */}
      <div className="relative max-w-4xl md:hidden mx-auto">
        {loading ? (
          <div className="flex gap-2 overflow-hidden px-2 justify-center">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-8 w-24 rounded-full flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <Carousel className="w-full" opts={{ align: "center", loop: false }}>
            <CarouselContent className="-ml-2 md:-ml-4 justify-center">
              {categories?.map((category) => (
                <CarouselItem key={category._id} className="pl-2 basis-auto">
                  <Button
                    size="sm"
                    onPress={() => handleSelectCategory(category)}
                    className={cn(
                      "whitespace-nowrap rounded-full px-4 py-2 text-xs md:text-sm font-medium transition-all",
                      selectedCategoryId === category._id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {category.name}
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Category Row - Desktop */}
      <div className="hidden md:flex justify-center gap-8 overflow-x-auto pb-2">
        {loading ? (
          <div className="flex gap-2">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-md" />
            ))}
          </div>
        ) : (
          categories?.map((category) => (
            <Button
              key={category._id}
              size="sm"
              onPress={() => handleSelectCategory(category)}
              className={cn(
                "whitespace-nowrap",
                selectedCategoryId === category._id
                  ? "bg-black text-white"
                  : "bg-gray-200"
              )}
            >
              {category.name}
            </Button>
          ))
        )}
      </div>

      {/* Loading Skeleton */}
      {weekendLoading && (
        <div className="flex gap-4 overflow-x-hidden md:px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex-shrink-0">
              <PropertySkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Properties Carousel */}
      {!weekendLoading && weekendData.length > 0 && (
        <div className="relative py-2">
          <Carousel
            setApi={(api) => {
              setApi(api);
              onApiChange(api);
            }}
            className="w-full"
            opts={{ align: "start" }}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {weekendData.map((property) => (
                <CarouselItem
                  key={property._id}
                  className="pl-2 md:pl-4 basis-3/5 md:basis-4/16  lg:basis-1/4"
                >
                  <Weekendcard property={property} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-12" />
            <CarouselNext className="hidden lg:flex -right-12" />
          </Carousel>

          <CarouselIndicator
            current={current}
            count={count}
            variant="pills"
            onDotClick={handleDotClick}
          />
        </div>
      )}

      {/* ✅ FIXED Empty State */}
      {!weekendLoading &&
        hasRequestedWeekend.current &&
        weekendData.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            <p className="text-lg">No properties available this weekend</p>
            <p className="text-sm mt-2">Try selecting a different category</p>
          </div>
        )}
    </div>
  );
}
