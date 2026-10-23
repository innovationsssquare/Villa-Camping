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
  BedDouble,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import Banner1 from "@/public/Loginasset/villa_banner.jpg";
import { setSelectedCategory, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice";
import { getStoredUser } from "@/lib/auth";

const HERO_SLIDES = [
  {
    tag: "Luxury Private Stays",
    title: "Private Pool Villas in Lonavala",
    description:
      "Indulge in secluded luxury with panoramic valley views, private pools, and bespoke concierge service.",
    categorySlug: "villa",
    categoryName: "Villa",
    highlight: "Villas with Pool",
  },
  {
    tag: "Lakeside Adventures",
    title: "Scenic Lakeside Camping in Pawna",
    description:
      "Stargaze beside crystal waters with premium tent stays, evening live music, and bonfires.",
    categorySlug: "camp",
    categoryName: "Camp",
    highlight: "Lakeside Glamping",
  },
  {
    tag: "Nature Retreats",
    title: "Heritage Cottages & Hill Chalets",
    description:
      "Recharge in nature-embraced wooden cottages, lush estates, and serene forest escapes near Kamshet.",
    categorySlug: "cottage",
    categoryName: "Cottage",
    highlight: "Cozy Cottages",
  },
  {
    tag: "Weekend Celebrations",
    title: "Unforgettable Getaways with Loved Ones",
    description:
      "Handpicked 3 to 7 BHK estates perfect for family reunions, celebrations, and friend trips.",
    categorySlug: "villa",
    categoryName: "Villas",
    highlight: "Group Estates",
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

// App-style Nearby Destinations for Mobile View (Reference Image 3)
const NEARBY_LOCATIONS = [
  {
    name: "Lonavala",
    tag: "Pool Villas",
    distance: "1.5h drive",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    slug: "villa",
    location: "Lonavala",
  },
  {
    name: "Pawna Lake",
    tag: "Camping",
    distance: "2h drive",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
    slug: "camp",
    location: "Pawna Lake",
  },
  {
    name: "Alibaug",
    tag: "Beach Stays",
    distance: "2.5h drive",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    slug: "villa",
    location: "Alibaug",
  },
  {
    name: "Karjat",
    tag: "Cottages",
    distance: "1h drive",
    image:
      "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800&q=80",
    slug: "cottage",
    location: "Karjat",
  },
  {
    name: "Igatpuri",
    tag: "Waterfalls",
    distance: "2.5h drive",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    slug: "villa",
    location: "Igatpuri",
  },
  {
    name: "Mahabaleshwar",
    tag: "Hill Escapes",
    distance: "3.5h drive",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    slug: "villa",
    location: "Mahabaleshwar",
  },
];

// Quick Category Filters for Mobile View
const QUICK_CATEGORIES = [
  { name: "Pool Villas", emoji: "🏊", slug: "villa" },
  { name: "Lakeside Camp", emoji: "⛺", slug: "camp" },
  { name: "Cozy Cottages", emoji: "🏡", slug: "cottage" },
  { name: "Hotels & Resorts", emoji: "🏨", slug: "hotel" },
];

export default function Hero() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { checkin, checkout, selectedGuest, selectedCategoryName } = useSelector(
    (state) => state.booking
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);

  // Set SHOW_HERO_VIDEO to true to re-enable the desktop background video
  const SHOW_HERO_VIDEO = false;
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Synchronize authenticated user for personalized greeting ("Hi, Saksham!" / "Hi, Suzuki!")
  useEffect(() => {
    try {
      const user = getStoredUser();
      if (user) {
        const name =
          user.fullName ||
          user.name ||
          (user.email ? user.email.split("@")[0] : "");
        if (name) {
          setUserName(name.split(" ")[0]);
        }
        if (user.avatar || user.profilePicture) {
          setUserAvatar(user.avatar || user.profilePicture);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-advance desktop slides smoothly every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Format date range for mobile pill display (e.g., "18 - 19 May 2026")
  const formatDateRange = () => {
    if (checkin && checkout) {
      try {
        const d1 = new Date(checkin);
        const d2 = new Date(checkout);
        const opts = { month: "short", day: "numeric" };
        const yearStr = d2.getFullYear();
        return `${d1.toLocaleDateString("en-US", opts)} - ${d2.toLocaleDateString(
          "en-US",
          opts
        )} ${yearStr}`;
      } catch {
        return "18 - 19 May 2026";
      }
    }
    return "18 - 19 May 2026";
  };

  // Format guest count for mobile pill display (e.g., "2 Guest, 1 Room")
  const totalGuests =
    (selectedGuest?.adults || 2) + (selectedGuest?.childrenn || 0);
  const roomsCount = Math.max(1, Math.ceil(totalGuests / 4));
  const formattedGuests = `${totalGuests} ${
    totalGuests === 1 ? "Guest" : "Guests"
  }, ${roomsCount} ${roomsCount === 1 ? "Room" : "Rooms"}`;

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

  // Handle Nearby Location click
  const handleNearbyLocationClick = (loc) => {
    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (selectedGuest?.adults)
      params.set("adults", selectedGuest.adults.toString());
    params.set("location", loc.location);
    const queryStr = params.toString();

    router.push(`/search-your-gateway?${queryStr}`);
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* ============================================================== */}
      {/* 📱 MOBILE VIEW ONLY (md:hidden): Native App Experience        */}
      {/* Designed based on user reference: Greeting + Floating Search   */}
      {/* Card + Nearby Locations Carousel + Quick Stay Category Chips  */}
      {/* ============================================================== */}
      <div className="block md:hidden pt-[92px] pb-5 bg-gradient-to-b from-[#fcfcfd] via-white to-white">
        {/* Curved App Header Hero Background */}
        <div className="relative mx-3 rounded-[28px] overflow-hidden bg-gradient-to-br from-[#0f4bb8] via-[#1a64ea] to-[#2575fc] shadow-[0_12px_36px_rgba(26,100,234,0.22)] pt-5 pb-6 px-4">
          {/* Subtle Ambient Decorative Circles */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#ff6900]/25 blur-3xl pointer-events-none" />

          {/* Top Greeting Row: Avatar + "Hi, Suzuki!" / "Ready for your next trip?" + Bell */}
          <div className="relative z-10 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* User Avatar / App Mascot Illustration */}
              <div className="w-11 h-11 rounded-full p-0.5 bg-white/30 backdrop-blur-md shadow-sm shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName || "User"}
                      width={44}
                      height={44}
                      className="w-full h-full object-cover"
                    />
                  ) : userName ? (
                    <div className="w-full h-full bg-gradient-to-tr from-[#ff6900] to-[#ea580c] text-white font-bold text-sm flex items-center justify-center">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    /* High-definition 3D Traveler Avatar Mascot (matching reference design) */
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="50" r="50" fill="#FFE5D9" />
                      <circle cx="50" cy="42" r="24" fill="#FFB703" />
                      <circle cx="50" cy="45" r="20" fill="#FFDDD2" />
                      {/* Hair */}
                      <path
                        d="M28 38C28 26 38 18 50 18C62 18 72 26 72 38C72 40 68 34 50 34C32 34 28 40 28 38Z"
                        fill="#D9480F"
                      />
                      {/* Eyes */}
                      <circle cx="43" cy="45" r="2.5" fill="#212529" />
                      <circle cx="57" cy="45" r="2.5" fill="#212529" />
                      <circle cx="44" cy="44" r="0.8" fill="white" />
                      <circle cx="58" cy="44" r="0.8" fill="white" />
                      {/* Smile */}
                      <path
                        d="M45 52C47 55 53 55 55 52"
                        stroke="#D9480F"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      {/* Cheeks */}
                      <circle cx="39" cy="49" r="2.5" fill="#FF8787" opacity="0.6" />
                      <circle cx="61" cy="49" r="2.5" fill="#FF8787" opacity="0.6" />
                      {/* Collar / Clothes */}
                      <path
                        d="M30 84C30 70 38 68 50 68C62 68 70 70 70 84H30Z"
                        fill="#1A64EA"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Greeting Text */}
              <div className="flex flex-col">
                <span className="text-white text-base font-extrabold tracking-tight leading-tight">
                  Hi, {userName || "Explorer"}!
                </span>
                <span className="text-white/85 text-xs font-normal mt-0.5">
                  Ready for your next trip?
                </span>
              </div>
            </div>

            {/* Notification Bell Button */}
            <button
              type="button"
              onClick={() => router.push("/notifications")}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white cursor-pointer active:scale-95 transition-all shadow-xs"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4 fill-white/20" />
            </button>
          </div>

          {/* Floating Search Card (Exact Match to Reference Image 1) */}
          <div className="relative z-10 bg-white rounded-[22px] p-3.5 sm:p-4 shadow-[0_16px_36px_rgba(0,0,0,0.12)] border border-neutral-100">
            {/* Row 1: Destination ("Where are you going?") */}
            <div
              onClick={() => router.push("/search-stay")}
              className="w-full bg-[#f4f6fa] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3.5 py-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-neutral-400 shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-neutral-600 truncate">
                  {selectedCategoryName
                    ? `${selectedCategoryName} in Lonavala & nearby`
                    : "Where are you going?"}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
            </div>

            {/* Row 2: Dates & Guests Side-by-Side Pills */}
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              {/* Left Pill: Dates */}
              <div
                onClick={() => router.push("/search-stay?focus=dates")}
                className="bg-[#f4f6fa] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99] min-w-0"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100/70 flex items-center justify-center text-[#1a64ea] shrink-0">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-neutral-900 truncate">
                    {formatDateRange()}
                  </span>
                </div>
              </div>

              {/* Right Pill: Guests */}
              <div
                onClick={() => router.push("/search-stay?focus=guests")}
                className="bg-[#f4f6fa] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.99] min-w-0"
              >
                <div className="w-6 h-6 rounded-full bg-blue-100/70 flex items-center justify-center text-[#1a64ea] shrink-0">
                  <BedDouble className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] font-bold text-neutral-900 truncate">
                    {formattedGuests}
                  </span>
                </div>
              </div>
            </div>

            {/* Row 3: "Search Now" Vibrant Pill Button */}
            <button
              type="button"
              onClick={handleSearchNow}
              className="mt-3.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#1a64ea] via-[#2575fc] to-[#1a64ea] hover:brightness-105 active:scale-[0.98] text-white font-bold text-sm shadow-[0_8px_24px_rgba(26,100,234,0.38)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Now</span>
            </button>
          </div>
        </div>

        {/* Quick Category Chips Strip */}
        <div className="mt-4 px-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {QUICK_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => handleExplore(cat.slug)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-neutral-200/80 shadow-2xs hover:border-[#1a64ea] hover:text-[#1a64ea] text-neutral-700 text-xs font-semibold shrink-0 cursor-pointer active:scale-95 transition-all"
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* "Nearby Locations" Section (Exact Recreation of Reference Image 3: OYO style) */}
        <div className="mt-5 px-3">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#1a64ea]" />
              <h2 className="text-xs sm:text-sm font-bold text-neutral-900 tracking-tight">
                Nearby Locations
              </h2>
            </div>
            <button
              type="button"
              onClick={() => router.push("/search-your-gateway")}
              className="text-[11px] font-semibold text-[#1a64ea] hover:underline cursor-pointer"
            >
              View all
            </button>
          </div>

          {/* Horizontal Snap Scroll Cards */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory -mx-3 px-3">
            {NEARBY_LOCATIONS.map((loc) => (
              <div
                key={loc.name}
                onClick={() => handleNearbyLocationClick(loc)}
                className="flex flex-col items-center gap-1 shrink-0 snap-start cursor-pointer group w-[74px]"
              >
                {/* 1:1 Rounded Image Thumbnail */}
                <div className="w-[70px] h-[70px] rounded-2xl overflow-hidden relative border border-neutral-200/80 shadow-xs group-hover:scale-105 group-active:scale-95 transition-transform bg-neutral-100">
                  <Image
                    src={loc.image}
                    alt={loc.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
                {/* Destination Name */}
                <span className="text-[11px] font-bold text-neutral-800 text-center truncate w-full mt-0.5">
                  {loc.name}
                </span>
                {/* Subtitle / Distance */}
                <span className="text-[9px] text-neutral-500 font-medium truncate w-full text-center -mt-0.5">
                  {loc.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* App Trust & Social Proof Strip */}
        <div className="mt-3.5 mx-3 py-2 px-3.5 rounded-full bg-neutral-100/80 border border-neutral-200/50 flex items-center justify-between text-[10px] text-neutral-600 font-medium">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-neutral-800">4.9★ Rated</span>
          </div>
          <span className="text-neutral-300">•</span>
          <span>500+ Stays</span>
          <span className="text-neutral-300">•</span>
          <div className="flex items-center gap-1 text-emerald-600 font-semibold">
            <ShieldCheck className="w-3 h-3" />
            <span>100% Verified</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 💻 DESKTOP VIEW ONLY (hidden md:block): Preserved Rich Banner   */}
      {/* Maintains all existing animations, typography, and controls    */}
      {/* ============================================================== */}
      <div className="hidden md:block pt-[136px]">
        {/* Background Container - Dynamic Content-Driven Height with No Clipping */}
        <div className="relative w-full min-h-[560px] lg:min-h-[620px] h-auto flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Hero Background Banner Image - Bright & Vibrant */}
          <div className="absolute inset-0">
            <Image
              src={Banner1}
              alt="TheVillaCamp Luxury Stays"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-105 contrast-[1.02]"
            />
          </div>

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

          {/* Lighter Gradient Overlays - Keeps Banner Image Bright while ensuring text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-[1]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none z-[1]" />

          {/* Hero Content Overlay */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-16 flex flex-col justify-between flex-1">
            {/* Main Messaging & Action Area */}
            <div className="max-w-3xl flex flex-col">
              {/* Eyebrow Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center self-start gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-medium mb-5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse shrink-0" />
                <span>{HERO_SLIDES[activeSlide].tag}</span>
                <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
                <span className="text-white/80 font-normal">Lonavala</span>
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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-md">
                      Escape to Extraordinary.
                      <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#ff7a1a]">
                        {HERO_SLIDES[activeSlide].title}
                      </span>
                    </h1>
                    <p className="text-white/90 text-sm md:text-base max-w-xl mt-3.5 font-normal leading-relaxed line-clamp-2 drop-shadow-sm">
                      {HERO_SLIDES[activeSlide].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-7">
                <button
                  type="button"
                  onClick={() =>
                    handleExplore(HERO_SLIDES[activeSlide].categorySlug)
                  }
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Book {HERO_SLIDES[activeSlide].highlight}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleExplore("all")}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Explore All</span>
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
            <div className="mt-10 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
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

              {/* Slide Navigation Dots */}
              <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shrink-0 ml-auto">
                {HERO_SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className={`transition-all duration-300 rounded-full h-1 cursor-pointer ${
                      activeSlide === idx
                        ? "w-4 bg-[#ff6900]"
                        : "w-1.5 bg-white/40 hover:bg-white/70"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

