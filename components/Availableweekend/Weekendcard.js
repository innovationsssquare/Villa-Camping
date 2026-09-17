import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { clearSelectedTents, removeCoupon } from "@/Redux/Slices/bookingSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist,
  optimisticToggle,
  fetchWishlistIds,
} from "@/Redux/Slices/wishlistSlice";
import { buildPropertyViewUrl, getCleanPropertyType } from "@/lib/categoryUtils";
import { saveRecentlyVisited } from "@/lib/recentlyVisited";
import { useAuthModal } from "@/context/AuthModalContext";
import { getStoredUser } from "@/lib/auth";

export function PropertyCard({ property }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const router = useRouter();
  const { selectedCategoryName, checkin, checkout } = useSelector(
    (state) => state.booking || {}
  );
  const categories = useSelector((state) => state.category?.categories || []);
  const dispatch = useDispatch();
  const { openAuthModal } = useAuthModal();

  // Extract display images
  const displayImages =
    property.images && property.images.length > 0
      ? property.images
      : property.image
      ? [property.image]
      : property.coverImage
      ? [property.coverImage]
      : ["/placeholder.svg"];

  // Wishlist state
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
  const propertyId = property?._id || property?.id;
  const propertyType = getCleanPropertyType(property, [], selectedCategoryName);

  const isLiked = useMemo(() => {
    if (!wishlistIds || !Array.isArray(wishlistIds) || !propertyId) return false;
    const key = `${propertyType?.toLowerCase()}:${propertyId}`;
    const rawId = String(propertyId);
    return (
      wishlistIds.includes(rawId) ||
      wishlistIds.includes(key) ||
      wishlistIds.some((item) => item?.propertyId === rawId || item?.propertyId === propertyId)
    );
  }, [wishlistIds, propertyId, propertyType]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [property._id]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleWishlist = (e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    const currentUser = getStoredUser();
    if (!currentUser?._id) {
      openAuthModal();
      return;
    }

    dispatch(
      optimisticToggle({
        propertyId,
        propertyType,
      })
    );

    dispatch(
      toggleWishlist({
        propertyId,
        propertyType,
        userId: currentUser._id,
      })
    );
  };

  const handleCardClick = () => {
    saveRecentlyVisited(property, selectedCategoryName);
    const url = buildPropertyViewUrl(
      property,
      categories,
      selectedCategoryName,
      checkin,
      checkout
    );
    router.push(url);
    dispatch(removeCoupon());
    dispatch(clearSelectedTents());
  };

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  // Pricing & Rating calculations
  const nightPrice = Number(
    property.pricing?.weekendPrice || property.pricing?.weekdayPrice || 0
  );
  const twoNightsPrice = nightPrice * 2;
  const rating = property.rating
    ? Number(property.rating).toFixed(property.rating % 1 === 0 ? 1 : 2)
    : "5.0";

  // Guest favourite badge check
  const isGuestFavourite =
    Number(rating) >= 4.8 ||
    property.tags?.includes("Guest favourite") ||
    property.tags?.includes("Best Rated");

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col w-full cursor-pointer select-none transition-all duration-200"
    >
      {/* 1. Airbnb Square Rounded Image Container */}
      <div
        className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 shadow-2xs"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={displayImages[currentImageIndex] || "/placeholder.svg"}
          alt={property.name || "Stay"}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 18vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Left: "Guest favourite" badge (matches Airbnb screenshot) */}
        {isGuestFavourite && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 bg-white/95 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm flex items-center border border-black/5">
            <span className="text-[9px] sm:text-xs font-semibold text-neutral-900 tracking-tight">
              Guest favourite
            </span>
          </div>
        )}

        {/* Top Right: Wishlist Heart Icon (Airbnb style with translucent fill & drop shadow) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
          className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 z-10 p-1 sm:p-1.5 rounded-full hover:scale-115 active:scale-90 transition-transform cursor-pointer"
          aria-label="Save to wishlist"
        >
          <Heart
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]",
              isLiked
                ? "fill-[#ff6900] text-[#ff6900] stroke-[#ff6900]"
                : "fill-black/30 text-white stroke-[2]"
            )}
          />
        </button>

        {/* Image Previous / Next Arrows (Desktop Hover) */}
        {displayImages.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-800 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
            {currentImageIndex < displayImages.length - 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-neutral-800 opacity-0 group-hover:opacity-100 transition-all hover:scale-105"
                aria-label="Next image"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </>
        )}

        {/* Image Pagination Dots (Airbnb style) */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 pointer-events-none">
            {displayImages.slice(0, 5).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "rounded-full transition-all duration-200",
                  index === currentImageIndex
                    ? "w-1.5 h-1.5 bg-white shadow-xs"
                    : "w-1 h-1 bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Text Details below image - Exactly as in the user's Airbnb screenshot */}
      <div className="mt-1.5 sm:mt-2 px-0.5">
        {/* Line 1: Property Name / Stay in Location */}
        <h3
          className="font-semibold text-[11px] sm:text-xs md:text-sm text-neutral-900 truncate leading-tight group-hover:text-[#ff6900] transition-colors"
          title={property.name}
        >
          {property.name ||
            `${selectedCategoryName || "Stay"} in ${
              property.address?.city || "Lonavala"
            }`}
        </h3>

        {/* Line 2: Price for 2 nights · Star Rating */}
        <div className="text-[10px] sm:text-[11px] md:text-xs text-neutral-600 mt-0.5 flex items-center justify-between gap-1 leading-tight">
          <div className="flex items-baseline gap-1 truncate">
            <span className="font-semibold text-neutral-900">
              {twoNightsPrice > 0
                ? formatRupee(twoNightsPrice)
                : formatRupee(nightPrice)}
            </span>
            <span className="text-neutral-500 font-normal text-[9px] sm:text-[10px]">
              {twoNightsPrice > 0 ? "2 nights" : "night"}
            </span>
          </div>
          <span className="inline-flex items-center gap-0.5 text-neutral-900 font-medium flex-shrink-0">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-neutral-900 text-neutral-900 -mt-0.5" />
            <span>{rating}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;

