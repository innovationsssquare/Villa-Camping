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
} from "lucide-react";
import Banner1 from "@/public/Aboutusasset/Villabanner.jpg";
import { setSelectedCategory, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice";
import { addToast } from "@heroui/react";

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
    categorySlug: "all",
    categoryName: "All Stays",
    highlight: "Group Estates",
  },
];

const POPULAR_DESTINATIONS = [
  { name: "Lonavala", emoji: "📍", slug: "villa" },
  { name: "Pawna Lake", emoji: "🌊", slug: "camp" },
  { name: "Alibaug", emoji: "🏖️", slug: "all" },
  { name: "Cottages", emoji: "🏡", slug: "cottage" },
  { name: "Private Pool", emoji: "🏊", slug: "villa" },
  { name: "Pet Friendly", emoji: "🐾", slug: "all" },
];

export default function Hero() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { checkin, checkout, selectedGuest, isGuestSelected } = useSelector(
    (state) => state.booking
  );

  const [activeSlide, setActiveSlide] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  // Auto-advance slides smoothly every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

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
    if (selectedGuest?.adults) params.set("adults", selectedGuest.adults.toString());
    if (selectedGuest?.childrenn) params.set("children", selectedGuest.childrenn.toString());
    const queryStr = params.toString();

    router.push(`/category/${slug.toLowerCase()}${queryStr ? `?${queryStr}` : ""}`);
  };

  return (
    <section className="relative w-full pt-[70px] md:pt-[136px] overflow-hidden bg-neutral-950">
      {/* Background Container - Dynamic Content-Driven Height with No Clipping */}
      <div className="relative w-full min-h-[360px] sm:min-h-[420px] md:min-h-[560px] lg:min-h-[620px] h-auto flex flex-col justify-between rounded-b-[1.75rem] sm:rounded-b-[2.5rem] md:rounded-b-[3.5rem] overflow-hidden shadow-xl">
        
        {/* HTML5 Video: Always Muted, Loop, Autoplay, PlaysInline */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-1000"
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

        {/* Fallback Poster Background if video is buffering */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            videoLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <Image
            src={Banner1}
            alt="TheVillaCamp Luxury Stays"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Cinematic Multi-Layer Gradient Overlays */}
        {/* Ambient Top Shade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none z-[1]" />

        {/* Core Cinematic Vignette & Bottom Depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-[1]" />

        {/* Subtle Orange Ambient Glow */}
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#ff6900]/20 rounded-full blur-3xl pointer-events-none z-[1]" />

        {/* Hero Content Overlay with Generous Spacing so Content Breathes Naturally */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-9 md:pt-12 pb-8 sm:pb-12 md:pb-16 flex flex-col justify-between flex-1">
          
          {/* Main Messaging & Action Area */}
          <div className="max-w-3xl flex flex-col">
            
            {/* Eyebrow Badge with increased breathing room */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center self-start gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[11px] sm:text-xs font-medium mb-3.5 sm:mb-5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse shrink-0" />
              <span>{HERO_SLIDES[activeSlide].tag}</span>
              <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
              <span className="text-white/80 font-normal">Maharashtra</span>
            </motion.div>

            {/* Dynamic Animated Headline & Subtitle with Enhanced Spacing */}
            <div className="min-h-[64px] sm:min-h-[88px] md:min-h-[110px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2] sm:leading-[1.18]">
                    Escape to Extraordinary.
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-[#ff7a1a]">
                      {HERO_SLIDES[activeSlide].title}
                    </span>
                  </h1>
                  <p className="text-white/85 text-xs sm:text-sm md:text-base max-w-xl mt-2.5 sm:mt-3.5 font-normal leading-relaxed line-clamp-1 sm:line-clamp-2">
                    {HERO_SLIDES[activeSlide].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Action Buttons: Enhanced spacing between text and CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mt-5 sm:mt-7">
              <button
                type="button"
                onClick={() =>
                  handleExplore(HERO_SLIDES[activeSlide].categorySlug)
                }
                className="group inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Book {HERO_SLIDES[activeSlide].highlight}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                type="button"
                onClick={() => handleExplore("all")}
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium text-xs sm:text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Explore All</span>
              </button>
            </div>

            {/* Quick Interactive Destination Chips - Wrapped & Compact on Mobile */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-4 sm:mt-7 py-0.5">
              <span className="text-white/70 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mr-0.5 flex items-center gap-1 shrink-0">
                <Compass className="w-3 h-3 text-[#ff6900]" />
                Top:
              </span>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  type="button"
                  onClick={() => handleExplore(dest.slug)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-medium transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
                >
                  <span className="text-[11px] sm:text-xs leading-none">{dest.emoji}</span>
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Area: Social Proof Trust Badges & Slide Dots with Enhanced Top Spacing */}
          <div className="mt-6 sm:mt-10 pt-4 sm:pt-5 border-t border-white/15 flex items-center justify-between gap-4">
            
            {/* Desktop / Tablet Trust Badges Strip */}
            <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ff6900]/20 border border-[#ff6900]/40 flex items-center justify-center text-[#ff6900] shrink-0">
                  <Home className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">500+ Stays</div>
                  <div className="text-white/60 text-[10px]">Villas, camps & cottages</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shrink-0">
                  <Star className="w-3 h-3 fill-yellow-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">4.9 / 5 Rating</div>
                  <div className="text-white/60 text-[10px]">2,400+ verified guests</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">100% Verified</div>
                  <div className="text-white/60 text-[10px]">Cleanliness guaranteed</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Instant Booking</div>
                  <div className="text-white/60 text-[10px]">24/7 support</div>
                </div>
              </div>
            </div>

            {/* Mobile-Only Compact Trust Badge Pill (1-line) */}
            <div className="flex sm:hidden items-center gap-2 text-[10px] text-white/80 font-medium">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>4.9★ Rated</span>
              </div>
              <span>•</span>
              <span>500+ Stays</span>
              <span>•</span>
              <span className="text-emerald-400">100% Verified</span>
            </div>

            {/* Slide Navigation Dots (Subtle & Compact) */}
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
    </section>
  );
}
