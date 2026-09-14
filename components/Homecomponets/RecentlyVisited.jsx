"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Weekendcard from "../Availableweekend/Weekendcard";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";
import {
  getRecentlyVisited,
  RECENTLY_VISITED_EVENT,
} from "@/lib/recentlyVisited";

export default function RecentlyVisited() {
  const [visitedProperties, setVisitedProperties] = useState([]);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage and listen to updates
  useEffect(() => {
    setMounted(true);
    const loadProperties = () => {
      const items = getRecentlyVisited();
      setVisitedProperties(items);
    };

    loadProperties();

    window.addEventListener(RECENTLY_VISITED_EVENT, loadProperties);
    window.addEventListener("storage", loadProperties);

    return () => {
      window.removeEventListener(RECENTLY_VISITED_EVENT, loadProperties);
      window.removeEventListener("storage", loadProperties);
    };
  }, []);

  // Carousel snapshot listener
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
  }, [api, visitedProperties]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  // Do not render if not mounted or if user has no recently viewed stays
  if (!mounted || visitedProperties.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-4 sm:py-8 md:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with AvailableThisWeekend Styling */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <History className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Browsing History</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Pick Up Where You Left Off</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Recently Visited{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Properties
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Quickly revisit the handpicked stays you recently explored.
          </p>
        </div>

        {/* Carousel Multi-Card Layout (Combined recent stays: Villa, Camping, Cottage, Hotel) */}
        <div className="relative py-2">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{ align: "start", dragFree: true }}
          >
            <CarouselContent className="-ml-2.5 sm:-ml-3.5">
              {visitedProperties.map((property) => (
                <CarouselItem
                  key={property._id || property.id}
                  className="pl-2.5 sm:pl-3.5 basis-[48%] sm:basis-[30%] md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                >
                  <Weekendcard property={property} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
            <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
          </Carousel>

          {/* Bottom Indicator */}
          {count > 1 && (
            <CarouselIndicator
              current={current}
              count={count}
              variant="pills"
              onDotClick={handleDotClick}
              className="mt-3"
            />
          )}
        </div>
      </div>
    </section>
  );
}
