"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Home,
  Star,
  ShieldCheck,
  CheckCircle2,
  Compass,
  MapPin,
  Calendar,
  Users,
  Search,
  ChevronRight,
} from "lucide-react";
import Banner1 from "@/public/Loginasset/villa_banner.jpg";
import { setSelectedCategory, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice";
import { GuestSelectionDrawer } from "@/components/Searchdatescomponents/guest-selection-drawer";

// High-aesthetic festive defaults (matches StayVista reference)
const DEFAULT_SLIDES = [
  {
    tag: "Festive Escape",
    title: "Script Your Diwali Getaway",
    description:
      "Celebrate the festival of lights in exclusive private pool villas, scenic lakeside camps and hillside chalets.",
    categorySlug: "villa",
    categoryName: "Villa",
    highlight: "Diwali Villas",
    image: Banner1,
    badgeText: "Diwali Special",
  },
  {
    tag: "Luxury Private Stays",
    title: "Private Pool Villas in Lonavala",
    description:
      "Indulge in secluded luxury with panoramic valley views, private pools, and bespoke concierge service.",
    categorySlug: "villa",
    categoryName: "Villa",
    highlight: "Villas with Pool",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
    badgeText: "Private Pool",
  },
  {
    tag: "Lakeside Adventures",
    title: "Scenic Lakeside Camping in Pawna",
    description:
      "Stargaze beside crystal waters with premium tent stays, evening live music, and bonfires.",
    categorySlug: "camp",
    categoryName: "Camp",
    highlight: "Lakeside Glamping",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=2000&q=80",
    badgeText: "Lakeside Pawna",
  },
  {
    tag: "Nature Retreats",
    title: "Heritage Cottages & Hill Chalets",
    description:
      "Recharge in nature-embraced wooden cottages, lush estates, and serene forest escapes near Kamshet.",
    categorySlug: "cottage",
    categoryName: "Cottage",
    highlight: "Cozy Cottages",
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=2000&q=80",
    badgeText: "Hill Chalets",
  },
];

const POPULAR_DESTINATIONS = [
  { name: "Lonavala", emoji: "📍", slug: "villa" },
  { name: "Pawna Lake", emoji: "🌊", slug: "camp" },
  { name: "Alibaug", emoji: "🏖️", slug: "villa" },
  { name: "Cottages", emoji: "🏡", slug: "cottage" },
  { name: "Private Pool", emoji: "🏊", slug: "villa" },
  { name: "Hotels", emoji: "🏨", slug: "hotel" },
];

export default function Hero() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { checkin, checkout, selectedGuest, selectedCategoryName } = useSelector(
    (state) => state.booking
  );

  const [slides, setSlides] = useState(DEFAULT_SLIDES);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);

  // Set SHOW_HERO_VIDEO to true to re-enable the desktop background video
  const SHOW_HERO_VIDEO = false;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Dynamic backend hero banners fetch
  useEffect(() => {
    let isMounted = true;
    const fetchBanners = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8086";
        const res = await fetch(`${apiUrl}/api/v1/hero-banner/active`);
        if (res.ok) {
          const data = await res.json();
          if (
            isMounted &&
            data &&
            data.success &&
            Array.isArray(data.data) &&
            data.data.length > 0
          ) {
            const mapped = data.data.map((b) => ({
              tag: b.tagline || "Festive Escape",
              title: b.title || "Script Your Diwali Getaway",
              description:
                b.description ||
                "Celebrate the festive season in secluded luxury pool villas & private estates.",
              categorySlug: b.categorySlug || "villa",
              categoryName: b.categorySlug ? b.categorySlug.toUpperCase() : "Villa",
              highlight: b.badgeText || "Festive Escape",
              image: b.bannerImage,
              ctaText: b.ctaText || "Explore Festive Stays",
              ctaLink: b.ctaLink || "/category/all",
            }));
            setSlides(mapped);
          }
        }
      } catch {
        // Silently use DEFAULT_SLIDES
      }
    };
    fetchBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-advance slides smoothly every 5.5 seconds
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Format date range for mobile pill display (e.g., "18 - 19 May")
  const formatDateRange = () => {
    if (checkin && checkout) {
      try {
        const d1 = new Date(checkin);
        const d2 = new Date(checkout);
        const opts = { month: "short", day: "numeric" };
        return `${d1.toLocaleDateString("en-US", opts)} – ${d2.toLocaleDateString(
          "en-US",
          opts
        )}`;
      } catch {
        return "18 – 19 May";
      }
    }
    return "18 – 19 May";
  };

  // Format guest count for mobile pill display (WITHOUT ROOMS)
  const totalGuests =
    (selectedGuest?.adults || 2) + (selectedGuest?.childrenn || 0);
  const formattedGuests = `${totalGuests} ${
    totalGuests === 1 ? "Guest" : "Guests"
  }${selectedGuest?.pets ? `, ${selectedGuest.pets} Pet${selectedGuest.pets > 1 ? "s" : ""}` : ""}`;

  // Quick navigation handler
  const handleExplore = (slug = "all") => {
    if (slug !== "all" && categories && categories.length > 0) {
      const match = categories.find(
        (c) =>
          c.slug?.toLowerCase() === slug.toLowerCase() ||
          c.categoryname?.toLowerCase() === slug.toLowerCase() ||
          c.name?.toLowerCase() === slug.toLowerCase()
      );
      if (match) {
        dispatch(setSelectedCategory(match._id));
        dispatch(setSelectedCategoryname(match.categoryname || match.name));
      }
    }

    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (selectedGuest?.adults)
      params.set("adults", selectedGuest.adults.toString());
    if (selectedGuest?.childrenn)
      params.set("children", selectedGuest.childrenn.toString());
    const queryStr = params.toString();

    router.push(`/category/${slug.toLowerCase()}${queryStr ? `?${queryStr}` : ""}`);
  };

  // Mobile "Search Now" button click handler
  const handleSearchNow = () => {
    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (selectedGuest?.adults)
      params.set("adults", selectedGuest.adults.toString());
    if (selectedGuest?.childrenn)
      params.set("children", selectedGuest.childrenn.toString());
    const queryStr = params.toString();

    router.push(`/category/all${queryStr ? `?${queryStr}` : ""}`);
  };

  const currentSlide = slides[activeSlide] || DEFAULT_SLIDES[0];

  return (
    <section className="relative w-full">
      {/* ============================================================== */}
      {/* 📱 MOBILE VIEW ONLY (md:hidden): StayVista Festive Hero Theme */}
      {/* Transparent header sits above, bold white centered headline   */}
      {/* in the middle, with floating search card over background       */}
      {/* ============================================================== */}
      <div className="block md:hidden bg-white relative">
        {/* Banner with Centered Typography & Smooth Auto-Slide */}
        <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden flex flex-col justify-between">
          {/* Background Image / Slide (Seamless Crossfade Transition) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {typeof currentSlide?.image === "string" ? (
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title || "TheVillaCamp"}
                  className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.03]"
                />
              ) : (
                <Image
                  src={currentSlide?.image || Banner1}
                  alt={currentSlide?.title || "TheVillaCamp"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center brightness-[0.88] contrast-[1.03]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none z-[1]" />

          {/* Center: StayVista Bold White Headline & Festive Tag */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-14 pb-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col items-center max-w-sm"
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.22] drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                  {currentSlide?.title || "Script Your Diwali Getaway"}
                </h1>

                {currentSlide?.tag && (
                  <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/70 bg-black/30 backdrop-blur-md text-white text-xs font-semibold tracking-wide shadow-sm">
                    <span>{currentSlide.tag}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Search Card */}
        <div className="relative z-30 px-3.5 -mt-16 sm:-mt-20 pb-3">
          <div className="bg-white rounded-[24px] p-3.5 sm:p-4 shadow-[0_14px_36px_rgba(0,0,0,0.12)] border border-neutral-100">
            {/* Row 1: Destination */}
            <div
              onClick={() => router.push("/search-stay")}
              className="w-full bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3.5 py-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-[#ff6900] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-neutral-800 truncate">
                  {selectedCategoryName
                    ? `${selectedCategoryName} in Lonavala & nearby`
                    : "Where are you going?"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>

            {/* Row 2: Dates & Guests Side-by-Side Pills */}
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              {/* Left Pill: Dates (Clickable -> Opens /date-selection) */}
              <div
                onClick={() => router.push("/date-selection")}
                className="bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99] min-w-0 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100/80 flex items-center justify-center text-[#ff6900] shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-neutral-900 truncate">
                    {formatDateRange()}
                  </span>
                </div>
              </div>

              {/* Right Pill: Guests (Clickable -> Opens GuestSelectionDrawer with NO Rooms) */}
              <div
                onClick={() => setIsGuestDrawerOpen(true)}
                className="bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99] min-w-0 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-orange-100/80 flex items-center justify-center text-[#ff6900] shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-neutral-900 truncate">
                    {formattedGuests}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: "Search Now" Vibrant Button */}
            <button
              type="button"
              onClick={handleSearchNow}
              className="mt-3.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6900] via-[#ff7a1a] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] active:scale-[0.98] text-white font-bold text-sm shadow-[0_8px_24px_rgba(255,105,0,0.36)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Now</span>
            </button>
          </div>
        </div>

        {/* Interactive Guest Selection Drawer */}
        <GuestSelectionDrawer
          isOpen={isGuestDrawerOpen}
          onClose={() => setIsGuestDrawerOpen(false)}
        />
      </div>

      {/* ============================================================== */}
      {/* 💻 DESKTOP VIEW ONLY (hidden md:block): StayVista Hero Banner  */}
      {/* Transparent header sits above photo, bold white center text,   */}
      {/* dynamic festival campaigns, action buttons & trust badges       */}
      {/* ============================================================== */}
      <div className="hidden md:block">
        {/* Background Container - Full bleed behind transparent top navbar */}
        <div className="relative w-full min-h-[600px] lg:min-h-[660px] h-auto flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Hero Background Banner Image (Seamless Crossfade Transition) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {typeof currentSlide?.image === "string" ? (
                <img
                  src={currentSlide.image}
                  alt={currentSlide?.title || "TheVillaCamp"}
                  className="w-full h-full object-cover object-center brightness-[0.92] contrast-[1.03]"
                />
              ) : (
                <Image
                  src={currentSlide?.image || Banner1}
                  alt={currentSlide?.title || "TheVillaCamp"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center brightness-[0.92] contrast-[1.03]"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* HTML5 Video: Set SHOW_HERO_VIDEO to true to re-enable video later */}
          {SHOW_HERO_VIDEO && (
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${
                videoLoaded ? "opacity-100" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              poster={Banner1.src}
              onLoadedData={() => setVideoLoaded(true)}
            >
              <source
                src="https://res.cloudinary.com/dznqbnzzd/video/upload/v1781779851/Video_Project_ohyotj.mp4"
                type="video/mp4"
              />
            </video>
          )}

          {/* Subtle Overlays for Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/65 pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-[1]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none z-[1]" />

          {/* Hero Content Overlay (pt-32 accounts for transparent header) */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-14 flex flex-col justify-between flex-1">
            {/* Main Messaging & Action Area */}
            <div className="max-w-3xl flex flex-col">
              {/* Eyebrow Badge (Festive Tag) */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center self-start gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-4 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse shrink-0" />
                <span>{currentSlide?.tag || "Festive Escape"}</span>
                <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
                <span className="text-white/80 font-normal">Lonavala & Maharashtra</span>
              </motion.div>

              {/* Dynamic Animated Headline & Subtitle */}
              <div className="min-h-[110px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.14] drop-shadow-lg">
                      {currentSlide?.title || "Script Your Diwali Getaway"}
                    </h1>
                    <p className="text-white/90 text-sm md:text-base max-w-xl mt-4 font-normal leading-relaxed line-clamp-2 drop-shadow-md">
                      {currentSlide?.description ||
                        "Celebrate the festive season in secluded luxury pool villas & private estates."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-7">
                <button
                  type="button"
                  onClick={() =>
                    handleExplore(currentSlide?.categorySlug || "villa")
                  }
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Book {currentSlide?.highlight || "Stays"}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleExplore("all")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Explore All Stays</span>
                </button>
              </div>

              {/* Quick Interactive Destination Chips */}
              <div className="flex flex-wrap items-center gap-2 mt-7 py-0.5">
                <span className="text-white/70 text-xs font-semibold uppercase tracking-wider mr-0.5 flex items-center gap-1 shrink-0">
                  <Compass className="w-3 h-3 text-[#ff6900]" />
                  Top:
                </span>
                {POPULAR_DESTINATIONS.map((dest) => (
                  <button
                    key={dest.name}
                    type="button"
                    onClick={() => handleExplore(dest.slug)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                  >
                    <span className="text-xs leading-none">{dest.emoji}</span>
                    <span>{dest.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Area: Social Proof Trust Badges & Slide Dots */}
            <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
              {/* Trust Badges Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#ff6900]/20 border border-[#ff6900]/40 flex items-center justify-center text-[#ff6900] shrink-0">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">
                      500+ Stays
                    </div>
                    <div className="text-white/60 text-[10px]">
                      Villas, camps & cottages
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shrink-0">
                    <Star className="w-3 h-3 fill-yellow-400" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">
                      4.9 / 5 Rating
                    </div>
                    <div className="text-white/60 text-[10px]">
                      2,400+ verified guests
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">
                      100% Verified
                    </div>
                    <div className="text-white/60 text-[10px]">
                      Cleanliness guaranteed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold leading-tight">
                      Instant Booking
                    </div>
                    <div className="text-white/60 text-[10px]">24/7 support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
