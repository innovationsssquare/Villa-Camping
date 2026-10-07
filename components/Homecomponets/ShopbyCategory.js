"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import {
  setSelectedCategory,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";

// Real High-Definition Category Photography
import VillaBanner from "@/public/Aboutusasset/Villabanner.jpg";
import CampBanner from "@/public/Aboutusasset/Campbanner.jpg";
import CottageBanner from "@/public/Aboutusasset/Cottagebanner.jpg";
import HotelBanner from "@/public/Aboutusasset/Hotelbanner.jpg";

// Curated Category Metadata with Real Images matching Thevillacamp app
const CATEGORY_META = {
  villa: {
    name: "Villa",
    displayName: "Villas &\nHomestays",
    subtitle: "Private Pool & Luxury Estates",
    tag: "Most Popular",
    badge: "250+",
    count: "250+ Stays",
    realImage: VillaBanner,
  },
  camp: {
    name: "Camp",
    displayName: "Lakeside\nCamping",
    subtitle: "Lakeside Glamping & Bonfires",
    tag: "Scenic Pawna",
    badge: "Pawna",
    count: "80+ Camps",
    realImage: CampBanner,
  },
  camping: {
    name: "Camp",
    displayName: "Lakeside\nCamping",
    subtitle: "Lakeside Glamping & Bonfires",
    tag: "Scenic Pawna",
    badge: "Pawna",
    count: "80+ Camps",
    realImage: CampBanner,
  },
  cottage: {
    name: "Cottage",
    displayName: "Wooden\nCottages",
    subtitle: "Cozy Wooden & Hill Retreats",
    tag: "Nature Vibe",
    badge: "Nature",
    count: "110+ Cottages",
    realImage: CottageBanner,
  },
  hotel: {
    name: "Hotel",
    displayName: "Luxury\nResorts",
    subtitle: "Boutique Suites & Luxury Resorts",
    tag: "Top Rated",
    badge: "Top Pick",
    count: "60+ Resorts",
    realImage: HotelBanner,
  },
};

const ShopbyCategory = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [carouselApi, setCarouselApi] = useState(null);

  const { categories, loading } = useSelector((state) => state.category);
  const {
    selectedCategoryName,
    checkin,
    checkout,
    selectedGuest,
  } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSelectCategory = (id, name) => {
    dispatch(setSelectedCategory(id));
    dispatch(setSelectedCategoryname(name));

    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (selectedGuest?.adults) params.set("adults", selectedGuest.adults.toString());
    if (selectedGuest?.childrenn) params.set("children", selectedGuest.childrenn.toString());
    const queryStr = params.toString();

    const targetSlug = name ? name.toLowerCase() : "villa";
    router.push(`/category/${targetSlug}${queryStr ? `?${queryStr}` : ""}`);
  };

  const getMeta = (name = "") => {
    const key = name.toLowerCase();
    return (
      CATEGORY_META[key] || {
        name,
        displayName: name.includes(" ") ? name.replace(" ", "\n") : `${name}\nStays`,
        subtitle: "Handpicked Stays",
        tag: "Curated",
        badge: "Popular",
        count: "Verified",
        realImage: VillaBanner,
      }
    );
  };

  const isSelected = (catName) => {
    return selectedCategoryName?.toLowerCase() === catName?.toLowerCase();
  };

  const displayCategories = categories && categories.length > 0 ? categories : [];

  const scrollPrev = () => carouselApi?.scrollPrev();
  const scrollNext = () => carouselApi?.scrollNext();

  return (
    <section className="w-full relative -mt-5 sm:-mt-4 md:-mt-9 z-20 rounded-t-[1.75rem] sm:rounded-t-[2.5rem] md:rounded-t-[1.5rem] bg-white py-5 sm:py-8 md:py-12 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Mobile Sheet Handle Indicator (App-like UX) */}
        <div className="w-10 h-1 rounded-full bg-neutral-200 mx-auto mb-2.5 sm:hidden" />

        {/* Section Header - Centered with App-Sized Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Handpicked Getaways</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Choose Your Vibe</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Explore by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Categories
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            From private pool villas to lakeside glamping, swipe through our real verified stays.
          </p>

          {/* Desktop Arrow Controls (Hidden on mobile) */}
          <div className="hidden sm:flex absolute right-0 bottom-0 items-center gap-1.5">
            <button
              type="button"
              onClick={scrollPrev}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="w-8 h-8 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 flex items-center justify-center text-neutral-700 hover:text-black transition-all hover:scale-105 active:scale-95 shadow-2xs cursor-pointer"
              aria-label="Next categories"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW ONLY: Rounded Story Circles (Matching Thevillacamp Mobile App) */}
        {/* ========================================================================= */}
        <div className="block sm:hidden w-full">
          {loading ? (
            <div className="flex items-center justify-around px-1 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center w-[78px] animate-pulse">
                  <div className="w-[74px] h-[74px] rounded-full bg-neutral-200" />
                  <div className="w-12 h-3 rounded bg-neutral-200 mt-2.5" />
                  <div className="w-8 h-2.5 rounded bg-neutral-100 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-start justify-around gap-1.5 px-1 py-1 overflow-x-auto no-scrollbar">
              {displayCategories.map((category) => {
                const meta = getMeta(category.name);
                const selected = isSelected(category.name);

                return (
                  <div
                    key={category._id || category.name}
                    onClick={() =>
                      handleSelectCategory(category._id, category.name)
                    }
                    className="flex flex-col items-center shrink-0 w-[78px] cursor-pointer select-none active:scale-95 transition-transform"
                  >
                    {/* Outer Ring Border */}
                    <div
                      className={`w-[74px] h-[74px] rounded-full p-[3px] bg-white border-[2.2px] transition-all flex items-center justify-center relative shadow-xs ${
                        selected
                          ? "border-[#ff6900] ring-2 ring-[#ff6900]/25 bg-orange-50/20"
                          : "border-[rgba(255,122,26,0.40)] hover:border-[#ff6900]"
                      }`}
                    >
                      {/* Inner Circular Image Container */}
                      <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100 relative">
                        <Image
                          src={meta.realImage || category.image}
                          alt={category.name}
                          fill
                          sizes="70px"
                          className="object-cover"
                        />
                      </div>

                      {/* Mini Tag Badge */}
                      {meta.badge && (
                        <span
                          className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold border shadow-2xs whitespace-nowrap transition-colors ${
                            selected
                              ? "bg-[#ff6900] text-white border-[#ff6900]"
                              : "bg-white text-neutral-600 border-neutral-200"
                          }`}
                        >
                          {meta.badge}
                        </span>
                      )}
                    </div>

                    {/* 2-Line Centered Label Below Circle */}
                    <span
                      className={`text-[11.5px] font-semibold text-center mt-2.5 leading-[14px] whitespace-pre-line transition-colors ${
                        selected ? "text-[#ff6900] font-bold" : "text-neutral-700"
                      }`}
                    >
                      {meta.displayName || category.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP VIEW ONLY: Card Carousel (Preserved 100% Unchanged)               */}
        {/* ========================================================================= */}
        <div className="hidden sm:block w-full">
          {loading ? (
            <div className="flex gap-2.5 sm:gap-4 overflow-hidden md:justify-center">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1/3 md:w-1/4 max-w-[280px] shrink-0 rounded-xl sm:rounded-2xl bg-neutral-100 h-36 sm:h-52 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "start",
                  dragFree: true,
                  loop: false,
                }}
                className="w-full max-w-6xl mx-auto"
              >
                <CarouselContent className="-ml-2.5 sm:-ml-4 md:justify-center">
                  {displayCategories.map((category) => {
                    const meta = getMeta(category.name);
                    const selected = isSelected(category.name);

                    return (
                      <CarouselItem
                        key={category._id || category.name}
                        className="pl-2.5 sm:pl-4 basis-[30%] md:basis-1/4 lg:basis-1/4 max-w-[280px] md:max-w-none"
                      >
                        <motion.div
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handleSelectCategory(category._id, category.name)
                          }
                          className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer h-full ${
                            selected
                              ? "border-[#ff6900] shadow-[0_6px_20px_rgba(255,105,0,0.18)] ring-2 ring-[#ff6900]/30"
                              : "border-neutral-200/90 bg-white hover:border-[#ff6900]/50 hover:shadow-lg hover:shadow-orange-500/10"
                          }`}
                        >
                          {/* Real Image Container */}
                          <div className="relative h-36 md:h-44 lg:h-48 w-full overflow-hidden">
                            <Image
                              src={meta.realImage}
                              alt={category.name}
                              fill
                              sizes="(max-width: 1024px) 25vw, 20vw"
                              className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                            />

                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                            {/* Top Floating Badges */}
                            <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-2xs truncate max-w-[55%]">
                                {meta.tag}
                              </span>
                              <span className="text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff6900] text-white shadow-2xs shrink-0">
                                {meta.count}
                              </span>
                            </div>

                            {/* Bottom Category Info Overlaid on Photo */}
                            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                              <h3 className="text-white font-extrabold text-sm md:text-base leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors">
                                {category.name}
                              </h3>
                              <p className="text-white/85 text-[10px] md:text-xs mt-0.5 line-clamp-1 font-medium">
                                {meta.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Bottom Action Footer */}
                          <div className="px-2.5 py-2 sm:py-2.5 bg-white flex items-center justify-between text-xs font-semibold text-[#ff6900] group-hover:bg-orange-50/40 transition-colors">
                            <span className="truncate">Explore {category.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </motion.div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopbyCategory;
