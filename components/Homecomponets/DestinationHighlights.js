"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  fetchdestination,
  setselectedLocationId,
} from "@/Redux/Slices/propertiesSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";

// Curated Airbnb-style punchy taglines for destinations
const CURATED_TAGLINES = {
  lonavala: "Misty hills & waterfalls",
  alibaug: "Pristine beach escapes",
  goa: "Tropical beaches & nightlife",
  mahabaleshwar: "Strawberry farms & valleys",
  karjat: "Riverfront retreats & trails",
  "pawna lake": "Scenic lakeside camping",
  igatpuri: "Foggy valleys & waterfalls",
  khandala: "Lush cliffs & viewpoints",
  panchgani: "Tableland & scenic views",
  mulshi: "Lakeside serenity & dams",
  kashid: "White sand shores",
  daman: "Quiet beaches & colonial charm",
  dubai: "Prime beach spot",
  "kuala lumpur": "For the Petronas Towers",
  bangkok: "Vibrant nightlife",
};

// Fallback destinations when API is empty or loading
const FALLBACK_DESTINATIONS = [
  {
    _id: "dest-1",
    name: "Lonavala",
    description: "Misty hills & waterfalls",
    coverImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
  },
  {
    _id: "dest-2",
    name: "Alibaug",
    description: "Pristine beach escapes",
    coverImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  },
  {
    _id: "dest-3",
    name: "Goa",
    description: "Tropical beaches & nightlife",
    coverImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
  },
  {
    _id: "dest-4",
    name: "Mahabaleshwar",
    description: "Strawberry farms & valleys",
    coverImage:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  },
  {
    _id: "dest-5",
    name: "Pawna Lake",
    description: "Scenic lakeside camping",
    coverImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  },
  {
    _id: "dest-6",
    name: "Karjat",
    description: "Riverfront retreats & trails",
    coverImage:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
  },
  {
    _id: "dest-7",
    name: "Igatpuri",
    description: "Foggy valleys & waterfalls",
    coverImage:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

function getSubtitle(dest) {
  const key = (dest?.name || "").toLowerCase().trim();
  if (CURATED_TAGLINES[key]) {
    return CURATED_TAGLINES[key];
  }
  if (dest?.description) {
    const cleanDesc = dest.description.split(",")[0]?.split(".")[0]?.trim();
    if (cleanDesc && cleanDesc.length <= 32) {
      return cleanDesc;
    }
    return dest.description;
  }
  const stays = dest?.properties || dest?.totalProperties;
  if (stays) {
    return `${stays} luxury stays`;
  }
  return "Popular getaway spot";
}

function DestinationCard({ destination, defaultImage }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleDestinationClick = () => {
    if (destination?._id && !destination._id.startsWith("dest-")) {
      dispatch(setselectedLocationId(destination._id));
    }
    router.push(
      `/search-your-gateway?location=${encodeURIComponent(
        destination?.name || ""
      )}`
    );
  };

  const imageSrc = destination?.coverImage || defaultImage;
  const subtitle = getSubtitle(destination);

  return (
    <div
      onClick={handleDestinationClick}
      className="group cursor-pointer select-none flex flex-col w-full"
    >
      {/* 1:1 Aspect Ratio Squircle Image Container */}
      <div className="relative aspect-square w-full rounded-[22px] sm:rounded-[26px] overflow-hidden bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <Image
          src={imageSrc}
          alt={destination?.name || "Destination"}
          fill
          unoptimized
          sizes="(max-width: 640px) 145px, (max-width: 1024px) 195px, 220px"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Typography Block Below Image (Matching Airbnb Reference UI) */}
      <div className="mt-2 sm:mt-2.5 px-0.5">
        <h3 className="font-semibold text-neutral-900 text-[14px] sm:text-[15px] md:text-base leading-snug truncate group-hover:text-[#ff6900] transition-colors">
          {destination?.name}
        </h3>
        <p className="text-[12px] sm:text-[13px] md:text-sm text-[#717171] leading-tight truncate mt-0.5">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function DestinationSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full aspect-square rounded-[22px] sm:rounded-[26px]" />
      <div className="mt-2 sm:mt-2.5 px-0.5 space-y-1">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

export function DestinationHighlights() {
  const dispatch = useDispatch();
  const { destinationLoading, destinationData } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!destinationData || destinationData.length === 0) {
      dispatch(fetchdestination());
    }
  }, [dispatch, destinationData]);

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

  const displayList =
    Array.isArray(destinationData) && destinationData.length > 0
      ? destinationData
      : FALLBACK_DESTINATIONS;

  const loading =
    destinationLoading && (!destinationData || destinationData.length === 0);

  return (
    <section className="w-full py-2 sm:py-10 md:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with Unified App Theme */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Top Getaways</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Explore Locations</span>
          </div>

          {/* Heading with Unified Brand Orange Accent */}
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

        {/* Carousel & Cards Container */}
        {loading ? (
          <div className="flex gap-3 sm:gap-3.5 overflow-hidden w-full py-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="basis-[140px] sm:basis-[175px] md:basis-[195px] lg:basis-[215px] shrink-0"
              >
                <DestinationSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative py-1">
            <Carousel
              setApi={(api) => setApi(api)}
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-3 sm:-ml-3.5">
                {displayList.map((destination, index) => {
                  const fallbackImg =
                    FALLBACK_DESTINATIONS[index % FALLBACK_DESTINATIONS.length]
                      .coverImage;

                  return (
                    <CarouselItem
                      key={destination._id || `dest-${index}`}
                      className="pl-3 sm:pl-3.5 basis-[140px] sm:basis-[175px] md:basis-[195px] lg:basis-[215px] shrink-0"
                    >
                      <DestinationCard
                        destination={destination}
                        defaultImage={fallbackImg}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Desktop Carousel Navigation Controls */}
              <CarouselPrevious className="hidden md:flex -left-4 sm:-left-5 bg-white/95 backdrop-blur-sm border border-neutral-200/90 shadow-md text-neutral-800 hover:text-black hover:scale-105 active:scale-95 transition-all" />
              <CarouselNext className="hidden md:flex -right-4 sm:-right-5 bg-white/95 backdrop-blur-sm border border-neutral-200/90 shadow-md text-neutral-800 hover:text-black hover:scale-105 active:scale-95 transition-all" />
            </Carousel>

            {/* Bottom Carousel Indicator Pills */}
            <CarouselIndicator
              current={current}
              count={count}
              variant="pills"
              onDotClick={handleDotClick}
              className="mt-3 sm:mt-4"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default DestinationHighlights;
