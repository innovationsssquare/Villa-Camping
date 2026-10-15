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
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
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

const formatTimeAgo = (date) => {
  if (!date) return "Recently";
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? "mo" : "mos"} ago`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? "yr" : "yrs"} ago`;
};

/**
 * Minimal Google-style Review Card (Compact for 2 cards per view on mobile)
 */
function MinimalGuestReviewCard({
  username = "Guest",
  userAvatar,
  location = "India",
  rating = 5,
  review = "",
  reviewImage,
  images = [],
  propertyName = "Featured Stay",
  createdAt,
  onClick,
}) {
  const initials = getInitials(username);
  const avatarBg = getAvatarColor(username);
  const cleanRating = Number(rating) || 5;
  const timeAgo = formatTimeAgo(createdAt);

  const imagesList =
    Array.isArray(images) && images.length > 0
      ? images.filter(Boolean)
      : reviewImage
      ? [reviewImage]
      : [];

  const maxThumbnails = 3;
  const visibleImages = imagesList.slice(0, maxThumbnails);
  const remainingCount = imagesList.length - maxThumbnails;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-2.5 sm:p-4 hover:border-[#ff6900]/40 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200 h-[205px] sm:h-[240px] select-none cursor-pointer"
    >
      <div>
        {/* Top Row: User Avatar + Name + Subtitle (photos count / verified) */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            {userAvatar ? (
              <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-neutral-200 shrink-0">
                <Image
                  src={userAvatar}
                  alt={username}
                  fill
                  unoptimized
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={cn(
                  "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-sm shadow-2xs shrink-0 border border-white/40",
                  avatarBg
                )}
              >
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] sm:text-sm text-neutral-900 truncate leading-tight">
                {username}
              </h4>
              <p className="text-[9px] sm:text-[11px] text-neutral-500 truncate mt-0.5">
                {imagesList.length > 0 && (
                  <span className="font-semibold text-neutral-700">
                    {imagesList.length} {imagesList.length === 1 ? "photo" : "photos"} •{" "}
                  </span>
                )}
                <span>{location || "India"}</span>
              </p>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-700 text-[9px] sm:text-[10px] font-semibold shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />
            <span className="hidden xs:inline">Verified</span>
          </div>
        </div>

        {/* Rating Line: 5 Gold Stars + Relative Time */}
        <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-[9px] sm:text-[11px] text-neutral-400 font-medium ml-0.5">
            {timeAgo}
          </span>
        </div>

        {/* Review Comment (Clean 2 lines with "... More") */}
        <p className="text-neutral-700 text-[10.5px] sm:text-xs leading-relaxed line-clamp-2 font-normal">
          {review || "A truly memorable getaway! The property was spotless and hospitality was exceptional."}
          <span className="text-[#ff6900] font-semibold ml-1 inline-block">
            ... More
          </span>
        </p>

        {/* Minimal Image Stack / Thumbnail Strip (Google Style) */}
        {visibleImages.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2">
            {visibleImages.map((img, idx) => {
              const isLast = idx === maxThumbnails - 1 && remainingCount > 0;
              return (
                <div
                  key={idx}
                  className="relative w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl overflow-hidden border border-neutral-200/90 bg-neutral-100 shrink-0 group/thumb hover:scale-105 transition-transform duration-200 shadow-2xs"
                >
                  <Image
                    src={img}
                    alt={`Review thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="55px"
                    className="object-cover"
                  />
                  {isLast && (
                    <div className="absolute inset-0 bg-black/65 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-[9px] sm:text-[11px]">
                      +{remainingCount}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Row: Property Name */}
      <div className="flex items-center justify-between gap-1.5 pt-1.5 sm:pt-2 border-t border-neutral-100 mt-1.5">
        <div className="flex items-center gap-1 sm:gap-1.5 text-[9.5px] sm:text-xs text-neutral-600 bg-neutral-50 px-2 py-1 rounded-lg sm:rounded-xl border border-neutral-100 flex-1 min-w-0">
          <Home className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff6900] shrink-0" />
          <span className="font-semibold text-neutral-900 truncate">
            {propertyName}
          </span>
        </div>

        <div className="text-[9px] sm:text-[10px] font-bold text-emerald-600 shrink-0">
          ★ 5.0
        </div>
      </div>
    </div>
  );
}

/**
 * Shared Review Detail Content (Used inside Desktop Modal & Mobile Drawer)
 */
function ReviewDetailContent({ review, activePhotoIndex, setActivePhotoIndex, onClose }) {
  if (!review) return null;

  const initials = getInitials(review.username);
  const avatarBg = getAvatarColor(review.username);
  const timeAgo = formatTimeAgo(review.createdAt);

  const imagesList =
    Array.isArray(review.images) && review.images.length > 0
      ? review.images.filter(Boolean)
      : review.reviewImage
      ? [review.reviewImage]
      : [];

  const handlePrevPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  };

  const handleNextPhoto = (e) => {
    e?.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % imagesList.length);
  };

  return (
    <div className="flex flex-col h-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 no-scrollbar">
      {/* Header Row: User Info + Rating + Close Button */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          {review.userAvatar ? (
            <div className="relative w-11 h-11 rounded-full overflow-hidden border border-neutral-200 shrink-0">
              <Image
                src={review.userAvatar}
                alt={review.username}
                fill
                unoptimized
                sizes="48px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={cn(
                "w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm shrink-0 border border-white/40",
                avatarBg
              )}
            >
              {initials}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-tight">
                {review.username}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Stay
              </span>
            </div>

            {/* Stars + Time Ago */}
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex items-center gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-neutral-400 font-medium ml-1">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Stay Name Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 shrink-0">
          <Home className="w-3.5 h-3.5 text-[#ff6900]" />
          <span className="font-bold text-neutral-900">{review.propertyName}</span>
        </div>
      </div>

      {/* Mobile Stay Name Badge */}
      <div className="sm:hidden flex items-center gap-1.5 text-xs text-neutral-700 bg-neutral-100 px-2.5 py-1.5 rounded-xl border border-neutral-200 mt-2.5 shrink-0 self-start">
        <Home className="w-3 h-3 text-[#ff6900]" />
        <span className="font-bold text-neutral-900">{review.propertyName}</span>
      </div>

      {/* Review Text Body */}
      <div className="my-3.5">
        <p className="text-neutral-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
          {review.review || "A truly memorable getaway! The property was spotless and the hospitality was exceptional."}
        </p>
      </div>

      {/* Photo Gallery (If images exist) */}
      {imagesList.length > 0 && (
        <div className="mt-1 flex flex-col gap-2.5">
          {/* Main Hero Photo Viewer */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 shadow-md">
            <Image
              src={imagesList[activePhotoIndex]}
              alt={`Guest photo ${activePhotoIndex + 1}`}
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 650px"
              className="object-contain"
            />

            {/* Photo Counter Pill */}
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-semibold border border-white/20">
              <Camera className="w-3 h-3 text-[#ff6900]" />
              <span>
                {activePhotoIndex + 1} / {imagesList.length}
              </span>
            </div>

            {/* Next / Prev Controls */}
            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition backdrop-blur-md"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition backdrop-blur-md"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Stack / Selector Row */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
              {imagesList.map((photo, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIndex(idx)}
                  className={cn(
                    "relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer",
                    activePhotoIndex === idx
                      ? "border-[#ff6900] ring-2 ring-orange-200 scale-102"
                      : "border-neutral-200 opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={photo}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    unoptimized
                    sizes="60px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PropertyReviews() {
  const dispatch = useDispatch();
  const { reviewsdata, reviewloading, reviewerror } = useSelector(
    (state) => state.properties
  );

  const isMobile = useIsMobile();
  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Selected review for Modal (desktop) / Drawer (mobile)
  const [selectedReview, setSelectedReview] = useState(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchReviewHighlights());
  }, [dispatch]);

  // Filter 5-star reviews on the frontend
  const rawReviews = Array.isArray(reviewsdata) ? reviewsdata : [];
  const fiveStarReviews = rawReviews.filter(
    (r) => Number(r.rating) >= 5
  );
  const displayReviews =
    fiveStarReviews.length > 0 ? fiveStarReviews : rawReviews;

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
  }, [api, displayReviews]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  const handleOpenReview = (review) => {
    setSelectedReview(review);
    setActivePhotoIndex(0);
  };

  return (
    <section className="w-full py-3 sm:py-10 md:py-6 bg-white">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="relative text-center max-w-2xl mx-auto mb-3 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Verified Guest Reviews</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-700 font-bold">★ 5.0 Rating</span>
            <span className="text-neutral-500 font-normal hidden xs:inline">
              • Real Guest Photos
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Loved by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Our Guests
            </span>
          </h2>
          <p className="text-[10px] sm:text-xs md:text-sm text-neutral-500 mt-0.5 sm:mt-1 leading-relaxed max-w-md mx-auto">
            Real guest photos and authentic 5-star feedback from travelers who booked and stayed with us.
          </p>
        </div>

        {/* Loading Skeleton (shows 2 cards on mobile) */}
        {reviewloading && (
          <div className="flex gap-2 sm:gap-3.5 overflow-hidden w-full py-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="basis-[47.5%] xs:basis-[48%] sm:basis-[48%] md:basis-[36%] lg:basis-[30%] xl:basis-[26%] shrink-0"
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

        {/* Reviews Carousel (shows 2 cards on mobile) */}
        {!reviewloading && displayReviews && displayReviews.length > 0 && (
          <div className="relative py-1.5">
            <Carousel
              setApi={(api) => setApi(api)}
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 sm:-ml-3.5">
                {displayReviews.map((review, index) => (
                  <CarouselItem
                    key={review.id || index}
                    className="pl-2 sm:pl-3.5 basis-[47.5%] xs:basis-[48%] sm:basis-[48%] md:basis-[36%] lg:basis-[30%] xl:basis-[26%]"
                  >
                    <MinimalGuestReviewCard
                      {...review}
                      onClick={() => handleOpenReview(review)}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
              <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
            </Carousel>

            {/* Bottom Carousel Indicator */}
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

      {/* ============================================================== */}
      {/* DESKTOP MODAL (Dialog for md: and larger screens)               */}
      {/* ============================================================== */}
      {!isMobile && (
        <Dialog
          open={!!selectedReview}
          onOpenChange={(open) => !open && setSelectedReview(null)}
        >
          <DialogContent className="sm:max-w-xl max-h-[90vh] p-0 overflow-hidden rounded-2xl border-none shadow-2xl bg-white">
            <DialogHeader className="sr-only">
              <DialogTitle>Guest Review Details</DialogTitle>
            </DialogHeader>
            <ReviewDetailContent
              review={selectedReview}
              activePhotoIndex={activePhotoIndex}
              setActivePhotoIndex={setActivePhotoIndex}
              onClose={() => setSelectedReview(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* ============================================================== */}
      {/* MOBILE DRAWER (Bottom Sheet Drawer for < md screens)            */}
      {/* ============================================================== */}
      {isMobile && (
        <Drawer
          open={!!selectedReview}
          onOpenChange={(open) => !open && setSelectedReview(null)}
        >
          <DrawerContent className="max-h-[88vh] rounded-t-[28px] p-0 bg-white border-t border-neutral-100 overflow-hidden">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Guest Review Details</DrawerTitle>
            </DrawerHeader>
            <ReviewDetailContent
              review={selectedReview}
              activePhotoIndex={activePhotoIndex}
              setActivePhotoIndex={setActivePhotoIndex}
              onClose={() => setSelectedReview(null)}
            />
          </DrawerContent>
        </Drawer>
      )}
    </section>
  );
}
