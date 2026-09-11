"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Wifi,
  Snowflake,
  AirVent,
  BatteryCharging,
  GlassWater,
  ShieldCheck,
  Bed,
  Droplet,
  Table,
  Bath,
  Waves,
  Coffee,
  Trees,
  Home,
  Flame,
  Star,
  MapPin,
  Users,
  Heart,
  Share2,
  FlameKindling,
  Camera,
  Mountain,
  Building2,
  Sun,
  Utensils,
  Play,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
  Sparkles,
} from "lucide-react";
import {
  FaSquareParking,
  FaTv,
  FaPeopleGroup,
  FaChild,
  FaUmbrellaBeach,
  FaFire,
} from "react-icons/fa6";
import {
  MdKitchen,
  MdOutlineLocalDining,
  MdOutlineFreeBreakfast,
  MdOutlineSpeaker,
  MdPool,
  MdOutlineLocalDrink,
  MdKayaking,
  MdOutlineLocalLaundryService,
} from "react-icons/md";
import { TbKayak } from "react-icons/tb";
import { Tent, Backpack, Footprints } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import { clearSelectedTents, removeCoupon } from "@/Redux/Slices/bookingSlice";
import {
  toggleWishlist,
  optimisticToggle,
  fetchWishlistIds,
} from "@/Redux/Slices/wishlistSlice";
import VideoModal from "./VideoModal";
import { addToast } from "@heroui/react";

export default function PropertyCardnew({ property }) {
  const dispatch = useDispatch();
  const router = useRouter();

  // Desktop carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mobile carousel state (embla api from @/components/ui/carousel)
  const [mobileApi, setMobileApi] = useState(null);
  const [currentMobileSlide, setCurrentMobileSlide] = useState(0);

  const { selectedCategoryName, checkin, checkout } = useSelector(
    (state) => state.booking
  );

  const checkInDate = useMemo(
    () => (checkin ? new Date(checkin) : new Date()),
    [checkin]
  );
  const checkOutDate = useMemo(
    () =>
      checkout
        ? new Date(checkout)
        : new Date(Date.now() + 24 * 60 * 60 * 1000),
    [checkout]
  );

  // Sync mobile carousel slide snap
  useEffect(() => {
    if (!mobileApi) return;
    setCurrentMobileSlide(mobileApi.selectedScrollSnap());
    const onSelect = () => {
      setCurrentMobileSlide(mobileApi.selectedScrollSnap());
    };
    mobileApi.on("select", onSelect);
    return () => {
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi]);

  // Wishlist Redux integration
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
  const wishlistSet = useMemo(() => new Set(wishlistIds), [wishlistIds]);
  const wishlistKey = `Villa:${property?._id}`;
  const isLiked = wishlistSet.has(wishlistKey);

  useEffect(() => {
    dispatch(fetchWishlistIds({ id: "6833656360ed0e90157dd2e1" }));
  }, [dispatch]);

  // Extract display images safely
  const displayImages = useMemo(() => {
    if (property?.images && property.images.length > 0) return property.images;
    if (property?.image) return [property.image];
    if (property?.coverImage) return [property.coverImage];
    return ["/placeholder.svg"];
  }, [property]);

  const nextImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex < displayImages.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(
      optimisticToggle({
        propertyId: property?._id,
        propertyType: "villa",
        userId: "6833656360ed0e90157dd2e1",
      })
    );
    dispatch(
      toggleWishlist({
        propertyId: property?._id,
        propertyType: "Villa",
        userId: "6833656360ed0e90157dd2e1",
      })
    );
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (typeof window !== "undefined") {
        const url = `${window.location.origin}/view-${getCategoryName()}/${property?._id}`;
        await navigator.clipboard.writeText(url);
        addToast({
          title: "Link copied to clipboard!",
          color: "success",
        });
      }
    } catch {
      // Fallback ignore
    }
  };

  // Category routing helper
  const getCategoryName = () => {
    const raw =
      property?.category?.name ||
      property?.category ||
      selectedCategoryName ||
      "Villa";
    const str = String(raw).toLowerCase();
    if (str.includes("camp")) return "Camping";
    if (str.includes("cottage")) return "Cottage";
    if (str.includes("hotel")) return "Hotel";
    return "Villa";
  };

  const handleCardClick = () => {
    dispatch(removeCoupon());
    dispatch(clearSelectedTents());
    router.push(`/view-${getCategoryName()}/${property?._id}`);
  };

  // Format currency
  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  // Price calculations
  const basePrice = useMemo(() => {
    return calculateBasePriceForRange(
      checkInDate?.toISOString(),
      checkOutDate?.toISOString(),
      property?.pricing ?? {}
    );
  }, [checkInDate, checkOutDate, property?.pricing]);

  const nights = useMemo(() => {
    const diff = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    return Math.max(1, diff);
  }, [checkInDate, checkOutDate]);

  const weekdayPrice = property?.pricing?.weekdayPrice || 0;
  const weekendPrice = property?.pricing?.weekendPrice || 0;

  // Rating calculations
  const rating = property?.averageRating || property?.rating || "4.9";
  const formattedRating = Number(rating).toFixed(1);
  const reviewCount = property?.reviewCount || 24;

  // Amenity icon mapping
  const amenitiesIcons = {
    WiFi: <Wifi className="w-5 h-5 text-neutral-600" />,
    Heating: <Snowflake className="w-5 h-5 text-neutral-600" />,
    AC: <AirVent className="w-5 h-5 text-neutral-600" />,
    "Power Backup": <BatteryCharging className="w-5 h-5 text-neutral-600" />,
    "Water Supply": <GlassWater className="w-5 h-5 text-neutral-600" />,
    Security: <ShieldCheck className="w-5 h-5 text-neutral-600" />,
    CCTV: <Camera className="w-5 h-5 text-neutral-600" />,
    Parking: <FaSquareParking className="w-5 h-5 text-neutral-600" />,
    "AC Bedrooms/Hall": <AirVent className="w-5 h-5 text-neutral-600" />,
    "Aquagaurd for drinking water": <Droplet className="w-5 h-5 text-neutral-600" />,
    "Extra mattresses": <Bed className="w-5 h-5 text-neutral-600" />,
    "LED TV Mobile Connect": <FaTv className="w-5 h-5 text-neutral-600" />,
    "Board Games": <Star className="w-5 h-5 text-neutral-600" />,
    "Sunset Point": <Sparkles className="w-5 h-5 text-neutral-600" />,
    "Table & Chairs": <Table className="w-5 h-5 text-neutral-600" />,
    "Geyser in all Bathrooms": <Bath className="w-5 h-5 text-neutral-600" />,
    "Swimming Pool": <MdPool className="w-5 h-5 text-neutral-600" />,
    "Sound System": <MdOutlineSpeaker className="w-5 h-5 text-neutral-600" />,
    Refrigerator: <MdKitchen className="w-5 h-5 text-neutral-600" />,
    Kitchen: <MdKitchen className="w-5 h-5 text-neutral-600" />,
    "Coffee Maker": <Coffee className="w-5 h-5 text-neutral-600" />,
    Microwave: <MdKitchen className="w-5 h-5 text-neutral-600" />,
    Oven: <MdKitchen className="w-5 h-5 text-neutral-600" />,
    "Outdoor Dining Area": <Trees className="w-5 h-5 text-neutral-600" />,
    "Dining Area": <MdOutlineLocalDining className="w-5 h-5 text-neutral-600" />,
    "BBQ Grill": <FlameKindling className="w-5 h-5 text-neutral-600" />,
    Balcony: <Home className="w-5 h-5 text-neutral-600" />,
    Garden: <Trees className="w-5 h-5 text-neutral-600" />,
    "Terrace / Patio": <Home className="w-5 h-5 text-neutral-600" />,
    "Fire Extinguisher": <Flame className="w-5 h-5 text-neutral-600" />,
    "Daily Breakfast": <MdOutlineFreeBreakfast className="w-5 h-5 text-neutral-600" />,
    "Tent Stay": <Tent className="w-5 h-5 text-neutral-600" />,
    "Sleeping Bags": <Backpack className="w-5 h-5 text-neutral-600" />,
    Blankets: <Bed className="w-5 h-5 text-neutral-600" />,
    Mattresses: <Bed className="w-5 h-5 text-neutral-600" />,
    "Drinking Water": <MdOutlineLocalDrink className="w-5 h-5 text-neutral-600" />,
    "Charging Point": <BatteryCharging className="w-5 h-5 text-neutral-600" />,
    "Private Parking": <FaSquareParking className="w-5 h-5 text-neutral-600" />,
    Barbeque: <FlameKindling className="w-5 h-5 text-neutral-600" />,
    Bonfire: <FaFire className="w-5 h-5 text-neutral-600" />,
    Trekking: <Footprints className="w-5 h-5 text-neutral-600" />,
    "Mountain View": <Mountain className="w-5 h-5 text-neutral-600" />,
    "Lake View": <Waves className="w-5 h-5 text-neutral-600" />,
    "Outdoor Seating": <Table className="w-5 h-5 text-neutral-600" />,
    "Garden Area": <Trees className="w-5 h-5 text-neutral-600" />,
    "Play Area": <FaChild className="w-5 h-5 text-neutral-600" />,
    "Music System": <MdOutlineSpeaker className="w-5 h-5 text-neutral-600" />,
    "Rain Dance Area": <Droplet className="w-5 h-5 text-neutral-600" />,
    "River Rafting": <MdKayaking className="w-5 h-5 text-neutral-600" />,
    Kayaking: <TbKayak className="w-5 h-5 text-neutral-600" />,
    Restaurant: <Utensils className="w-5 h-5 text-neutral-600" />,
    "Laundry Service": <MdOutlineLocalLaundryService className="w-5 h-5 text-neutral-600" />,
  };

  const greatForIcons = {
    "Mountain View": <Mountain className="w-3.5 h-3.5 text-[#ff6900]" />,
    "Ideal for Families": <FaChild className="w-3.5 h-3.5 text-[#ff6900]" />,
    "Ideal for Groups": <FaPeopleGroup className="w-3.5 h-3.5 text-[#ff6900]" />,
    Beachfront: <FaUmbrellaBeach className="w-3.5 h-3.5 text-[#ff6900]" />,
    "Nature Retreat": <Trees className="w-3.5 h-3.5 text-[#ff6900]" />,
    "Romantic Getaway": <Heart className="w-3.5 h-3.5 text-[#ff6900]" />,
  };

  const isGuestFavourite =
    Number(formattedRating) >= 4.8 ||
    property?.tags?.includes("Best Rated") ||
    property?.tags?.includes("Guest favourite");

  const displayAmenities = property?.topamenities?.slice(0, 5) || [];
  const extraAmenitiesCount = Math.max(
    0,
    (property?.topamenities?.length || 0) - 5
  );

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl md:rounded-3xl border border-neutral-200/90 hover:border-[#ff6900]/40 shadow-xs hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden cursor-pointer select-none"
    >
      {/* ========================================================================= */}
      {/* DESKTOP LAYOUT (Horizontal Flex)                                          */}
      {/* ========================================================================= */}
      <div className="hidden md:flex md:h-80 lg:h-84">
        {/* 1. Left Image Section (~36-38%) */}
        <div className="relative w-[38%] lg:w-[36%] h-full bg-neutral-100 shrink-0 overflow-hidden">
          <Image
            src={displayImages[currentImageIndex] || "/placeholder.svg"}
            alt={property?.name || "Stay"}
            fill
            unoptimized
            sizes="36vw"
            className="object-cover group-hover:scale-105 transition-transform duration-600 ease-out"
          />

          {/* Top-Left: Guest Favourite / Best Rated Badge */}
          {isGuestFavourite && (
            <div className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full shadow-xs border border-black/5 flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
              <span className="text-[11px] font-bold text-neutral-900 tracking-tight">
                {property?.tags?.[0] || "Guest favourite"}
              </span>
            </div>
          )}

          {/* Top-Right: Wishlist Heart & Share Action */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Save to Wishlist"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer border border-black/5"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked
                    ? "fill-[#ff6900] text-[#ff6900]"
                    : "text-neutral-700 group-hover:text-black"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share Stay"
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-90 cursor-pointer border border-black/5"
            >
              <Share2 className="w-3.5 h-3.5 text-neutral-700" />
            </button>
          </div>

          {/* Bottom-Left: Video Reel Button */}
          {property?.reelVideo && (
            <div
              className="absolute bottom-3 left-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoModal
                thumbnailSrc={displayImages[0]}
                videoUrl={property?.reelVideo}
                trigger={
                  <button
                    type="button"
                    className="bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/20 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-white text-white" />
                    <span>Video Reel</span>
                  </button>
                }
              />
            </div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <div>
              {currentImageIndex > 0 && (
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {currentImageIndex < displayImages.length - 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Carousel Dot Indicators */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-black/35 backdrop-blur-xs px-2 py-1 rounded-full">
              {displayImages.slice(0, 5).map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? "bg-white scale-125"
                      : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Middle Content Section */}
        <div className="flex-1 p-5 lg:p-6 flex flex-col justify-between min-w-0">
          <div>
            {/* Header: Title, Verified Badge, Rating */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-neutral-900 group-hover:text-[#ff6900] transition-colors truncate leading-tight">
                    {property?.name}
                  </h3>
                  {property?.isapproved && (
                    <CheckCircle2
                      className="w-4 h-4 text-emerald-600 shrink-0"
                      title="100% Verified Inspection"
                    />
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                  <span className="truncate">
                    {property?.address?.addressLine || ""}{" "}
                    {property?.address?.city ? `• ${property?.address?.city}` : ""}
                  </span>
                </div>
              </div>

              {/* Rating Box */}
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200/80 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-neutral-900 leading-none">
                  {formattedRating}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">
                  ({reviewCount})
                </span>
              </div>
            </div>

            {/* Key Specs / Capacity Badge Strip */}
            <div className="flex flex-wrap items-center gap-2 my-3">
              {property?.maxCapacity && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100/90 text-neutral-700 text-xs font-medium">
                  <Users className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Upto {property.maxCapacity} Guests</span>
                </div>
              )}
              {property?.baths != null && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100/90 text-neutral-700 text-xs font-medium">
                  <Bath className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>{property.baths} {property.baths === 1 ? "Bath" : "Baths"}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100/90 text-neutral-700 text-xs font-medium">
                <Home className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>
                  {property?.subtype || (property?.rooms ? `${property.rooms} Rooms` : "Entire Villa")}
                </span>
              </div>
            </div>

            {/* "Great for" Tags */}
            {property?.greatFor && property.greatFor.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-3">
                <span className="text-[11px] font-semibold text-neutral-400 mr-0.5 uppercase tracking-wider">
                  Vibe:
                </span>
                {property.greatFor.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50/80 border border-orange-200/70 text-neutral-800 text-[11px] font-semibold"
                  >
                    {greatForIcons[item] || <Sun className="w-3 h-3 text-[#ff6900]" />}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Top Amenities Strip */}
            {displayAmenities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-150/80">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {displayAmenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 text-xs text-neutral-600 shrink-0"
                      title={amenity}
                    >
                      <span className="p-1 rounded-md bg-neutral-100 text-neutral-700">
                        {amenitiesIcons[amenity] || (
                          <Building2 className="w-3.5 h-3.5 text-neutral-600" />
                        )}
                      </span>
                      <span className="text-[11px] font-medium text-neutral-700 truncate max-w-[90px]">
                        {amenity}
                      </span>
                    </div>
                  ))}
                  {extraAmenitiesCount > 0 && (
                    <span className="text-[10px] font-bold text-[#ff6900] bg-orange-50 border border-orange-200/70 px-2 py-0.5 rounded-full shrink-0">
                      +{extraAmenitiesCount} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Right Price & CTA Section */}
        <div className="w-[26%] lg:w-[24%] p-5 lg:p-6 bg-neutral-50/70 border-l border-neutral-200/80 flex flex-col justify-between shrink-0">
          <div>
            <div className="text-right">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                {nights === 1 ? "1 Night Stay" : `${nights} Nights Total`}
              </span>
              <div className="text-2xl lg:text-3xl font-black text-neutral-900 tracking-tight mt-0.5">
                {formatRupee(basePrice)}
              </div>
              <span className="text-[11px] text-neutral-500 font-medium block mt-0.5">
                incl. all taxes & fees
              </span>

              {weekendPrice > weekdayPrice && (
                <div className="mt-2">
                  <span className="text-[10px] font-semibold text-neutral-600 bg-white border border-neutral-200/80 px-2 py-0.5 rounded-md inline-block">
                    Weekend: {formatRupee(weekendPrice)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={handleCardClick}
              className="w-full h-11 bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Stay</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-700 text-center">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE LAYOUT (Vertical) - Original Structure with Web Theme Applied      */}
      {/* ========================================================================= */}
      <div className="md:hidden">
        {/* 1. Image Carousel Section */}
        <div className="relative h-auto bg-neutral-100">
          <Carousel className="w-full h-64" setApi={setMobileApi}>
            <CarouselContent>
              {displayImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative w-full h-64">
                    <Image
                      fill
                      unoptimized
                      src={image}
                      alt={`${property?.name} - Image ${index + 1}`}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots Indicator */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {displayImages.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    mobileApi?.scrollTo(index);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    index === currentMobileSlide ? "bg-white scale-125" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Tags (Top Left) */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            {property?.tags &&
              property.tags.slice(0, 2).map((tag, index) => (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-md text-neutral-900 px-2.5 py-1 rounded-full font-bold text-[11px] shadow-xs flex items-center gap-1 border border-black/5"
                >
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{tag}</span>
                </div>
              ))}
          </div>

          {/* Action Buttons (Top Right) */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={handleWishlist}
              aria-label="Save to Wishlist"
              className="bg-white/90 hover:bg-white text-neutral-800 rounded-full h-8 w-8 flex items-center justify-center backdrop-blur-md shadow-xs transition-all active:scale-90 cursor-pointer border border-black/5"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isLiked ? "fill-[#ff6900] text-[#ff6900]" : "text-neutral-700"
                }`}
              />
            </button>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share Stay"
              className="bg-white/90 hover:bg-white text-neutral-800 rounded-full h-8 w-8 flex items-center justify-center backdrop-blur-md shadow-xs transition-all active:scale-90 cursor-pointer border border-black/5"
            >
              <Share2 className="w-4 h-4 text-neutral-700" />
            </button>
          </div>

          {/* Video Reel Button (Bottom Left) */}
          {property?.reelVideo && (
            <div
              className="absolute bottom-3 left-3 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoModal
                thumbnailSrc={displayImages[0]}
                videoUrl={property?.reelVideo}
              />
            </div>
          )}
        </div>

        {/* 2. Content Section */}
        <div className="p-4">
          {/* Title, Rating and Location */}
          <div className="flex items-start justify-between mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-[#ff6900] transition-colors truncate">
                  {property?.name}
                </h3>
                {property?.isapproved && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-600 shrink-0"
                    title="100% Verified Inspection"
                  />
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500 truncate">
                <MapPin className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                <span className="truncate">
                  {property?.address?.addressLine || ""}
                  {property?.address?.city ? `, ${property?.address?.city}` : ""}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-xs text-neutral-900">
                  {formattedRating} of 5
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-3 text-xs text-neutral-600 font-medium">
            {property?.maxCapacity && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Upto {property.maxCapacity} Guests</span>
              </span>
            )}
            {property?.baths != null && (
              <span className="flex items-center gap-1.5">
                <Bath className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>{property.baths} {property.baths === 1 ? "Bath" : "Baths"}</span>
              </span>
            )}
          </div>

          {/* Great For Tags */}
          {property?.greatFor && property.greatFor.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-neutral-500 mr-1">
                  Great for:
                </span>
                {property.greatFor.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className="bg-orange-50 text-neutral-800 border border-orange-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 text-xs font-semibold"
                  >
                    {greatForIcons[item] || (
                      <Sun className="w-3 h-3 text-[#ff6900]" />
                    )}
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities (Original 5-column grid with theme styling) */}
          {displayAmenities.length > 0 && (
            <div className="grid grid-cols-5 gap-2.5 mb-4 overflow-hidden pt-2 border-t border-neutral-100">
              {displayAmenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 text-neutral-600 w-full"
                >
                  <div className="p-1.5 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                    {amenitiesIcons[amenity] || (
                      <Building2 className="w-4 h-4 text-neutral-600" />
                    )}
                  </div>
                  <p className="text-[10px] text-center w-full truncate font-medium">
                    {amenity}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Price and Booking Section */}
          <div className="border-t border-neutral-200/90 pt-3.5">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-xs text-neutral-500 font-medium">Price start</div>
                <div className="text-[11px] text-neutral-400">
                  for 1 Nights
                </div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <div className="text-lg font-black text-neutral-900">
                  {formatRupee(property?.pricing?.weekdayPrice || basePrice)}
                </div>
                {property?.pricing?.weekendPrice > (property?.pricing?.weekdayPrice || 0) && (
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Weekend {formatRupee(property.pricing.weekendPrice)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
                className="w-full h-11 bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-bold text-sm rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Now →</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
