"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
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
import { fetchPropertiesByWeekend } from "@/Redux/Slices/propertiesSlice";
import { PropertySkeleton } from "./Property-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselIndicator } from "./carousel-indicators";

export function AvailableThisWeekend() {
  const dispatch = useDispatch();

  const { categories, loading, isLoaded } = useSelector((state) => state.category);
  const { weekendData, weekendLoading } = useSelector(
    (state) => state.properties
  );

  const [activeWeekendCategory, setActiveWeekendCategory] = useState(null);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateSnapshot = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateSnapshot();
    api.on("select", updateSnapshot);
    api.on("reInit", updateSnapshot);

    return () => {
      api.off("select", updateSnapshot);
      api.off("reInit", updateSnapshot);
    };
  }, [api, weekendData]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  // Track if weekend API was ever triggered
  const hasRequestedWeekend = useRef(false);

  // Fetch categories once
  useEffect(() => {
    if (!isLoaded && !loading) {
      dispatch(fetchAllCategories());
    }
  }, [isLoaded, loading, dispatch]);

  // When categories load, initially default to the Villa category
  useEffect(() => {
    if (!categories || categories.length === 0 || activeWeekendCategory) return;

    // Initially activate the Villa category
    const villaCategory =
      categories.find(
        (cat) =>
          cat.name?.trim().toLowerCase() === "villa" ||
          cat.slug?.trim().toLowerCase() === "villa"
      ) || categories[0];

    if (villaCategory) {
      setActiveWeekendCategory(villaCategory._id);
      setActiveCategoryName(villaCategory.name);
      hasRequestedWeekend.current = true;
      dispatch(fetchPropertiesByWeekend({ categoryId: villaCategory._id }));
    }
  }, [categories, activeWeekendCategory, dispatch]);

  const handleSelectCategory = (categoryId, categoryName = "") => {
    setActiveWeekendCategory(categoryId);
    setActiveCategoryName(categoryName);
    hasRequestedWeekend.current = true;
    dispatch(
      fetchPropertiesByWeekend({
        categoryId,
      })
    );
  };

  return (
    <section className="w-full py-2 sm:py-10 md:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Header - Centered with App-style Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Weekend Escapes</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Instant Confirmation</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Available This{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Weekend
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Handpicked verified stays ready for your upcoming spontaneous getaway.
          </p>
        </div>

        {/* Category Tabs - Centered with #ff6900 Theme */}
        <div className="flex justify-center sm:justify-center items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 mb-4 sm:mb-6">
          {loading ? (
            <div className="flex gap-2 justify-center mx-auto">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 sm:w-24 rounded-full" />
              ))}
            </div>
          ) : (
            categories?.map((category) => {
              const isVilla =
                category.name?.trim().toLowerCase() === "villa" ||
                category.slug?.trim().toLowerCase() === "villa";
              const isActive = activeWeekendCategory
                ? activeWeekendCategory === category._id
                : isVilla;
              return (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => handleSelectCategory(category._id, category.name)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200 shrink-0 cursor-pointer",
                    isActive
                      ? "bg-[#ff6900] text-white shadow-sm shadow-orange-500/20 scale-[1.02]"
                      : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/60"
                  )}
                >
                  {category.name}
                </button>
              );
            })
          )}
        </div>

        {/* Loading Skeleton (Horizontal Carousel Layout for both Mobile and Desktop) */}
        {weekendLoading && (
          <div className="flex gap-3 sm:gap-3.5 overflow-hidden w-full py-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="basis-[42%] sm:basis-[185px] md:basis-[205px] lg:basis-[225px] shrink-0"
              >
                <PropertySkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Properties Carousel (Shows 2 full cards + 3rd card horizontal scroll indicator on mobile) */}
        {!weekendLoading && weekendData.length > 0 && (
          <div className="relative py-2">
            <Carousel
              setApi={(api) => {
                setApi(api);
              }}
              className="w-full"
              opts={{ align: "start", dragFree: true }}
            >
              <CarouselContent className="-ml-3 sm:-ml-3.5">
                {weekendData.map((property) => (
                  <CarouselItem
                    key={property._id}
                    className="pl-3 sm:pl-3.5 basis-[42%] sm:basis-[185px] md:basis-[205px] lg:basis-[225px] shrink-0"
                  >
                    <Weekendcard property={property} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
              <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
            </Carousel>

            {/* Bottom Indicator for both Mobile and Desktop */}
            <CarouselIndicator
              current={current}
              count={count}
              variant="pills"
              onDotClick={handleDotClick}
              className="mt-3"
            />
          </div>
        )}

        {/* Empty State */}
        {!weekendLoading &&
          hasRequestedWeekend.current &&
          weekendData.length === 0 && (
            <div className="text-center text-neutral-500 py-10 px-4">
              <p className="text-base font-semibold text-neutral-800">
                Fully Booked This Weekend
              </p>
              <p className="text-xs sm:text-sm mt-1 text-neutral-500 max-w-sm mx-auto">
                All properties {activeCategoryName ? `in ${activeCategoryName}` : ""} are currently booked for this weekend. Try selecting a different category above.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}

export default AvailableThisWeekend;

