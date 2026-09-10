"use client";

import Image from "next/image";
import {
  MapPin,
  Star,
  HomeIcon,
  ArrowRight,
  Sparkles,
  RefreshCcw,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdestination,
  setselectedLocationId,
} from "@/Redux/Slices/propertiesSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";
import { cn } from "@/lib/utils";

function DestinationCard({ destination }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDestinationClick = () => {
    dispatch(setselectedLocationId(destination._id));
    router.push("/search-your-gateway");
  };

  const propertyCount =
    destination?.properties || destination?.totalProperties || 0;
  const rating = destination?.rating || "4.8";

  return (
    <div
      onClick={handleDestinationClick}
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-neutral-200/90 bg-white hover:border-[#ff6900]/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full"
    >
      {/* Scenic Photo Container */}
      <div className="relative aspect-[4/3] sm:h-44 md:h-48 w-full overflow-hidden bg-neutral-100">
        <Image
          src={destination?.coverImage || "/placeholder.svg"}
          alt={destination.name || "Destination"}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 30vw, 20vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />

        {/* Top Floating Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          {/* Rating Pill */}
          <div className="bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1 border border-black/5">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
            <span className="text-[10px] sm:text-xs font-bold text-neutral-900">
              {rating}
            </span>
          </div>

          {/* Property Count Badge */}
          <div className="bg-[#ff6900] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
            <HomeIcon className="w-2.5 h-2.5" />
            <span>{propertyCount} stays</span>
          </div>
        </div>

        {/* Bottom Destination Info Overlaid on Photo */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10">
          <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors flex items-center gap-1">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900] shrink-0" />
            <span className="truncate">{destination.name}</span>
          </h3>
          {destination.description && (
            <p className="text-white/80 text-[9px] sm:text-[10px] md:text-xs mt-0.5 line-clamp-1 font-medium">
              {destination.description}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="px-2.5 py-1.5 sm:py-2 bg-white flex items-center justify-between text-[10px] sm:text-xs font-semibold text-[#ff6900] group-hover:bg-orange-50/40 transition-colors">
        <span className="truncate">View on map</span>
        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}

function DestinationSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-neutral-200/80 bg-white w-full">
      <Skeleton className="w-full aspect-[4/3] rounded-none" />
      <div className="p-2.5 space-y-1.5 bg-white">
        <Skeleton className="h-3.5 w-3/4 rounded-md" />
        <Skeleton className="h-3 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

export function DestinationHighlights() {
  const dispatch = useDispatch();
  const { destinationLoading, destinationData, destinationError } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(fetchdestination());
  }, [dispatch]);

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
  }, [api, destinationData]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  return (
    <section className="w-full py-6 sm:py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with App-style Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Top Getaways</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Explore Locations</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Destination
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Discover the perfect escape across Lonavala, Pawna Lake, and scenic Maharashtra hill stations.
          </p>
        </div>

        {/* Loading Skeleton (Horizontal Carousel Layout for both Mobile and Desktop) */}
        {destinationLoading && (
          <div className="flex gap-2.5 sm:gap-3.5 overflow-hidden w-full py-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="basis-[48%] sm:basis-[30%] md:basis-1/4 lg:basis-1/5 shrink-0"
              >
                <DestinationSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {destinationError && (
          <div className="py-12 text-center">
            <p className="text-sm text-neutral-500">
              Unable to load destinations right now.
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchdestination())}
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#ff6900] font-semibold hover:underline"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Destinations Carousel */}
        {!destinationLoading &&
          destinationData &&
          destinationData.length > 0 && (
            <div className="relative py-2">
              <Carousel
                setApi={(api) => setApi(api)}
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2.5 sm:-ml-3.5">
                  {destinationData.map((destination) => (
                    <CarouselItem
                      key={destination._id || destination.name}
                      className="pl-2.5 sm:pl-3.5 basis-[48%] sm:basis-[30%] md:basis-1/4 lg:basis-1/5"
                    >
                      <DestinationCard destination={destination} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
                <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
              </Carousel>

              {/* Bottom Carousel Indicator for both Mobile and Desktop */}
              <CarouselIndicator
                current={current}
                count={count}
                variant="pills"
                onDotClick={handleDotClick}
                className="mt-3"
              />
            </div>
          )}
      </div>
    </section>
  );
}

export default DestinationHighlights;
