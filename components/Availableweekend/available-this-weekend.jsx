"use client";

import { useEffect } from "react";
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
import { setSelectedCategory, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice";
import { fetchPropertiesByWeekend } from "@/Redux/Slices/propertiesSlice";
import { PropertySkeleton } from "./Property-skeleton";

export function AvailableThisWeekend() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId } = useSelector((state) => state.booking);
  const { weekendData, weekendLoading } = useSelector(
    (state) => state.properties
  );

  // Fetch categories once
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Fetch weekend properties when category changes
  useEffect(() => {
    if (!selectedCategoryId || selectedCategoryId === "all") return;

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
    <div className="w-full  mx-auto md:px-4 px-3 md:py-6 py-3 space-y-3 md:space-y-6 ">
      <h2 className="md:text-4xl text-center font-medium text-foreground">
        Available This Weekend
      </h2>
      {/* Category Carousel */}
      <div className="relative max-w-4xl md:hidden mx-auto">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {categories.map((category) => (
              <CarouselItem key={category._id} className="pl-2 basis-auto">
                <Button
                  size="sm"
                  onClick={() => handleSelectCategory(category)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-4 py-2 text-xs md:text-sm font-medium transition-all duration-200",
                    selectedCategoryId === category._id
                      ? "bg-black text-white hover:bg-black/90"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category.name}
                </Button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" />
        </Carousel>
      </div>
  <div className="hidden md:flex justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category._id}
            size="sm"
            onClick={() => handleSelectCategory(category)}
            className={cn(
              "whitespace-nowrap",
              selectedCategoryId === category._id
                ? "bg-black text-white"
                : "bg-gray-200"
            )}
          >
            {category.name}
          </Button>
        ))}
      </div>


      {/* Loading State */}
      {weekendLoading && (
        <div className="flex gap-4 overflow-x-hidden md:px-4 px-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className=" flex-shrink-0"
            >
              <PropertySkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Properties Carousel */}
      {!weekendLoading && weekendData.length > 0 && (
        <div className="relative">
          <Carousel className="w-full" opts={{ align: "start" }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {weekendData.map((property) => (
                <CarouselItem
                  key={property._id}
                className="pl-3 md:pl-4 basis-2/3 md:basis-1/2 lg:basis-1/4 xl:basis-1/4"
                >
                  <Weekendcard property={property} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden lg:flex -left-12" />
            <CarouselNext className="hidden lg:flex -right-12" />
          </Carousel>
        </div>
      )}

      {/* Empty State */}
      {!weekendLoading && weekendData.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg">No properties available this weekend</p>
          <p className="text-sm mt-2">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}
