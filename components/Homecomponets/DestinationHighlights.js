"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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

/**
 * Builds dynamic Schema.org JSON-LD structured data for search engine bots
 */
function buildDestinationJsonLd(destinations) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thevillacamp.com";

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Top Holiday Destinations & Weekend Getaways in Maharashtra",
    "description":
      "Browse handpicked vacation destinations featuring luxury private pool villas, lakeside camping, wooden cottages, and boutique resorts in Maharashtra.",
    "numberOfItems": destinations.length,
    "itemListElement": destinations.map((dest, index) => {
      const subtitle = getSubtitle(dest);
      const targetUrl = `${siteUrl}/search-your-gateway?location=${encodeURIComponent(
        dest.name || ""
      )}`;

      const item = {
        "@type": "TouristDestination",
        "name": `${dest.name}, Maharashtra`,
        "description": dest.description || subtitle,
        "url": targetUrl,
        "touristType": [
          "Weekend Getaways",
          "Family Vacations",
          "Luxury Villas",
          "Nature Camping",
          "Hill Station Retreats",
        ],
      };

      if (dest.coverImage) {
        item.image = dest.coverImage;
      }

      if (Array.isArray(dest.coordinates) && dest.coordinates.length >= 2) {
        item.geo = {
          "@type": "GeoCoordinates",
          "longitude": dest.coordinates[0],
          "latitude": dest.coordinates[1],
        };
      }

      return {
        "@type": "ListItem",
        "position": index + 1,
        "name": dest.name,
        "url": targetUrl,
        "item": item,
      };
    }),
  };
}

function DestinationCard({ destination, defaultImage, priority = false }) {
  const dispatch = useDispatch();

  const handleDestinationClick = () => {
    if (destination?._id && !destination._id.startsWith("dest-")) {
      dispatch(setselectedLocationId(destination._id));
    }
  };

  const imageSrc = destination?.coverImage || defaultImage;
  const subtitle = getSubtitle(destination);
  const targetUrl =
    destination?._id && !destination._id.startsWith("dest-")
      ? `/search-your-gateway?location=${encodeURIComponent(
          destination?.name || ""
        )}&locationId=${destination._id}`
      : `/search-your-gateway?location=${encodeURIComponent(
          destination?.name || ""
        )}`;

  const propertyCount = Number(destination?.properties ?? 0);
  const badgeText =
    propertyCount > 0
      ? `${propertyCount} ${propertyCount === 1 ? "Stay" : "Stays"}`
      : destination?.isPopular
      ? "Popular"
      : "Explore";

  return (
    <Link
      href={targetUrl}
      onClick={handleDestinationClick}
      title={`Book luxury villas and stays in ${destination?.name || "Maharashtra"}`}
      aria-label={`Explore stays in ${destination?.name || "Maharashtra"} - ${subtitle}`}
      className="group cursor-pointer select-none flex flex-col w-full focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#ff6900] rounded-[24px]"
    >
      <article
        itemScope
        itemType="https://schema.org/TouristDestination"
        className="flex flex-col w-full"
      >
        <meta itemProp="name" content={`${destination?.name}, Maharashtra`} />
        <meta itemProp="description" content={subtitle} />
        <meta itemProp="url" content={targetUrl} />
        {imageSrc && <meta itemProp="image" content={imageSrc} />}

        {/* 1:1 Aspect Ratio Squircle Image Container */}
        <div className="relative aspect-square w-full rounded-[20px] sm:rounded-[24px] overflow-hidden bg-neutral-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <Image
            src={imageSrc}
            alt={`Luxury villas, homestays, and camping retreats in ${destination?.name || "Maharashtra"} - ${subtitle}`}
            title={`Explore accommodations in ${destination?.name}`}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 210px, 230px"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Floating Frosted-Glass Property Count Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-semibold tracking-wide shadow-xs transition-transform duration-300 group-hover:scale-105">
              {propertyCount > 0 ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <Sparkles className="w-2.5 h-2.5 text-orange-300" />
              )}
              <span>{badgeText}</span>
            </span>
          </div>
        </div>

        {/* Typography Block Below Image */}
        <div className="mt-2 sm:mt-2.5 px-0.5">
          <h3
            itemProp="name"
            className="font-semibold text-neutral-900 text-[13px] sm:text-[14px] md:text-base leading-snug truncate group-hover:text-[#ff6900] transition-colors"
          >
            {destination?.name}
          </h3>
          <p
            itemProp="description"
            className="text-[11px] sm:text-xs md:text-sm text-[#717171] leading-tight truncate mt-0.5"
          >
            {subtitle}
          </p>
        </div>
      </article>
    </Link>
  );
}

function DestinationSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-full aspect-square rounded-[20px] sm:rounded-[24px]" />
      <div className="mt-2 sm:mt-2.5 px-0.5 space-y-1">
        <Skeleton className="h-4 w-3/4 rounded-md" />
        <Skeleton className="h-3.5 w-1/2 rounded-md" />
      </div>
    </div>
  );
}

export function DestinationHighlights() {
  const dispatch = useDispatch();
  const { destinationLoading, destinationData, destinationFetched } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!destinationFetched && !destinationLoading) {
      dispatch(fetchdestination());
    }
  }, [dispatch, destinationFetched, destinationLoading]);

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

  const displayList = useMemo(() => {
    return Array.isArray(destinationData) && destinationData.length > 0
      ? destinationData
      : FALLBACK_DESTINATIONS;
  }, [destinationData]);

  // Dynamic SEO JSON-LD Structured Data based on current dynamic destinations
  const jsonLdData = useMemo(() => {
    return buildDestinationJsonLd(displayList);
  }, [displayList]);

  // Dynamic dynamic keyword snippet for SEO header
  const dynamicLocationsSnippet = useMemo(() => {
    if (Array.isArray(destinationData) && destinationData.length > 0) {
      const topNames = destinationData.slice(0, 3).map((d) => d.name);
      return `${topNames.join(", ")}, and scenic Maharashtra hill stations.`;
    }
    return "Lonavala, Pawna Lake, and scenic Maharashtra hill stations.";
  }, [destinationData]);

  const loading =
    destinationLoading && (!destinationData || destinationData.length === 0);

  return (
    <section
      aria-labelledby="destination-highlights-heading"
      className="w-full py-2 sm:py-10 md:py-4 bg-white"
    >
      {/* 🚀 Dynamic SEO Structured Data (JSON-LD ItemList & TouristDestination Schema) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
      />

      {/* 🤖 Visually Hidden Crawlable Semantic Content for Search Engines */}
      <div className="sr-only">
        <h2>Popular Vacation Spots, Villas & Stays in Maharashtra</h2>
        <p>
          Discover verified accommodations across Maharashtra&apos;s most popular
          destinations:{" "}
          {displayList.map((d) => d.name).join(", ")}. Book private pool
          villas, lakeside camping, wooden cottages, and luxury stays with
          ThevillaCamp.
        </p>
      </div>

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
          <h2
            id="destination-highlights-heading"
            className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug"
          >
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Destination
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Discover the perfect escape across {dynamicLocationsSnippet}
          </p>
        </div>

        {/* Carousel & Cards Container */}
        {loading ? (
          <div className="flex gap-3 sm:gap-3.5 overflow-hidden w-full py-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="basis-[42%] sm:basis-[185px] md:basis-[205px] lg:basis-[225px] shrink-0"
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
                      className="pl-3 sm:pl-3.5 basis-[42%] sm:basis-[185px] md:basis-[205px] lg:basis-[225px] shrink-0"
                    >
                      <DestinationCard
                        destination={destination}
                        defaultImage={fallbackImg}
                        priority={index < 2}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              {/* Desktop Carousel Navigation Controls with Accessible Labels */}
              <CarouselPrevious
                aria-label="Previous holiday destinations"
                className="hidden md:flex -left-4 sm:-left-5 bg-white/95 backdrop-blur-xs border border-neutral-200/90 shadow-md text-neutral-800 hover:text-black hover:scale-105 active:scale-95 transition-all"
              />
              <CarouselNext
                aria-label="Next holiday destinations"
                className="hidden md:flex -right-4 sm:-right-5 bg-white/95 backdrop-blur-xs border border-neutral-200/90 shadow-md text-neutral-800 hover:text-black hover:scale-105 active:scale-95 transition-all"
              />
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
