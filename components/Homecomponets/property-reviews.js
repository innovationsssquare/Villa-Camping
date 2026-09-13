"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import {
  Star,
  Home,
  CheckCircle2,
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
import { PropertyReviewSkeleton } from "./PropertyReviewSkeleton";
import { fetchReviewHighlights } from "@/Redux/Slices/propertiesSlice";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";
import { cn } from "@/lib/utils";

const AVATAR_COLORS = [
  "bg-gradient-to-tr from-[#ff6900] to-amber-500 text-white",
  "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white",
  "bg-gradient-to-tr from-emerald-600 to-teal-500 text-white",
  "bg-gradient-to-tr from-purple-600 to-pink-500 text-white",
  "bg-gradient-to-tr from-amber-600 to-orange-500 text-white",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "Guest") => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0]?.toUpperCase() || "G";
  return (
    (words[0][0]?.toUpperCase() || "") +
    (words[words.length - 1][0]?.toUpperCase() || "")
  );
};

function GuestReviewCard({
  username = "Guest",
  location = "India",
  rating = 5,
  review = "",
  reviewImage,
  propertyName = "Featured Stay",
}) {
  const initials = getInitials(username);
  const avatarBg = getAvatarColor(username);
  const cleanRating = Number(rating) || 5;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-3.5 sm:p-4 hover:border-[#ff6900]/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 h-[215px] sm:h-[230px] select-none">
      <div>
        {/* Top Row: User Avatar + Name/Location + Verified Badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={cn(
                "w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-2xs shrink-0 border border-white/40",
                avatarBg
              )}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate leading-tight">
                {username}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-neutral-500 truncate flex items-center gap-1 mt-0.5">
                <span>{location || "India"}</span>
                <span className="text-neutral-300">•</span>
                <span className="text-[#ff6900] font-medium">Verified Guest</span>
              </p>
            </div>
          </div>

          {/* Verified Stay Badge */}
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[10px] font-semibold shrink-0">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified</span>
          </div>
        </div>

        {/* Star Rating + Score */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 sm:w-3.5 sm:h-3.5",
                  i < cleanRating
                    ? "fill-amber-400 text-amber-400"
                    : "fill-neutral-200 text-neutral-200"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] sm:text-[11px] text-neutral-500 font-semibold ml-0.5">
            {cleanRating.toFixed(1)}
          </span>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 font-normal">
            • Verified Stay
          </span>
        </div>

        {/* Review Quote Body */}
        <p className="text-neutral-700 text-[11px] sm:text-xs md:text-[13px] line-clamp-3 leading-relaxed font-normal">
          {review ||
            "A truly memorable getaway! The property was spotless, the host was very welcoming, and the views were breathtaking."}
        </p>
      </div>

      {/* Bottom Bar: Stay Name + Photo Attachment */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 mt-2">
        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-600 bg-neutral-50 px-2.5 py-1 rounded-xl border border-neutral-100 flex-1 min-w-0">
          <Home className="w-3 h-3 text-[#ff6900] shrink-0" />
          <span className="font-semibold text-neutral-900 truncate">
            {propertyName}
          </span>
        </div>

        {reviewImage && (
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden border border-neutral-200 shrink-0 group-hover:scale-105 transition-transform bg-neutral-100">
            <Image
              src={reviewImage}
              alt={propertyName || "Guest photo"}
              fill
              unoptimized
              sizes="40px"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertyReviews() {
  const dispatch = useDispatch();
  const { reviewsdata, reviewloading, reviewerror } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch(fetchReviewHighlights());
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
  }, [api, reviewsdata]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  return (
    <section className="w-full py-2 sm:py-10 md:py-4 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with Verified Reviews Badge & App-style Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge - Verified Reviews Summary */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Verified Guest Reviews</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-700 font-bold">★ 4.9 Rating</span>
            <span className="text-neutral-500 font-normal hidden xs:inline">
              • Real Stays
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Our Guests
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Authentic feedback and ratings from travelers who booked and stayed with us.
          </p>
        </div>

        {/* Loading Skeleton (Horizontal Carousel Layout for both Mobile and Desktop) */}
        {reviewloading && (
          <div className="flex gap-2.5 sm:gap-3.5 overflow-hidden w-full py-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="basis-[82%] sm:basis-[48%] md:basis-[36%] lg:basis-[30%] xl:basis-[26%] shrink-0"
              >
                <PropertyReviewSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {reviewerror && (
          <div className="py-10 text-center">
            <p className="text-sm text-neutral-500">
              Unable to load guest reviews right now.
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchReviewHighlights())}
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#ff6900] font-semibold hover:underline"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Reviews Carousel */}
        {!reviewloading && reviewsdata && reviewsdata.length > 0 && (
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
                {reviewsdata.map((review, index) => (
                  <CarouselItem
                    key={review.id || index}
                    className="pl-2.5 sm:pl-3.5 basis-[82%] sm:basis-[48%] md:basis-[36%] lg:basis-[30%] xl:basis-[26%]"
                  >
                    <GuestReviewCard {...review} />
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
