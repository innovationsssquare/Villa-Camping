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
  Layers,
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
import { addToast } from "@heroui/react";

// Real High-Definition Category Photography
import VillaBanner from "@/public/Aboutusasset/Villabanner.jpg";
import CampBanner from "@/public/Aboutusasset/Campbanner.jpg";
import CottageBanner from "@/public/Aboutusasset/Cottagebanner.jpg";
import HotelBanner from "@/public/Aboutusasset/Hotelbanner.jpg";
import AllStaysBanner from "@/public/Homeasset/villa-hero.jpg";

// Curated Category Metadata with Real Images
const CATEGORY_META = {
  villa: {
    name: "Villa",
    subtitle: "Private Pool & Luxury Estates",
    tag: "Most Popular",
    count: "250+ Stays",
    realImage: VillaBanner,
  },
  camp: {
    name: "Camp",
    subtitle: "Lakeside Glamping & Bonfires",
    tag: "Scenic Pawna",
    count: "80+ Camps",
    realImage: CampBanner,
  },
  cottage: {
    name: "Cottage",
    subtitle: "Cozy Wooden & Hill Retreats",
    tag: "Nature Vibe",
    count: "110+ Cottages",
    realImage: CottageBanner,
  },
  hotel: {
    name: "Hotel",
    subtitle: "Boutique Suites & Luxury Resorts",
    tag: "Top Rated",
    count: "60+ Resorts",
    realImage: HotelBanner,
  },
};

const ALL_STAYS_CARD = {
  _id: "all-stays",
  name: "All Stays",
  subtitle: "500+ Curated Properties",
  tag: "Full Catalog",
  count: "500+ Stays",
  realImage: AllStaysBanner,
};

const ShopbyCategory = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [carouselApi, setCarouselApi] = useState(null);

  const { categories, loading } = useSelector((state) => state.category);
  const { selectedCategoryId, selectedCategoryName, checkin, checkout, selectedGuest, isGuestSelected } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSelectCategory = (id, name) => {
    dispatch(setSelectedCategory(id === "all-stays" ? null : id));
    dispatch(setSelectedCategoryname(name));

    const params = new URLSearchParams();
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    if (selectedGuest?.adults) params.set("adults", selectedGuest.adults.toString());
    if (selectedGuest?.childrenn) params.set("children", selectedGuest.childrenn.toString());
    const queryStr = params.toString();

    const targetSlug = name === "All Stays" || id === "all-stays" ? "all" : name.toLowerCase();
    router.push(`/category/${targetSlug}${queryStr ? `?${queryStr}` : ""}`);
  };

  const getMeta = (name = "") => {
    const key = name.toLowerCase();
    return (
      CATEGORY_META[key] || {
        name,
        subtitle: "Handpicked Stays",
        tag: "Curated",
        count: "Verified",
        realImage: VillaBanner,
      }
    );
  };

  const isSelected = (catName) => {
    if (catName === "All Stays") {
      return !selectedCategoryId || selectedCategoryName === "All Stays";
    }
    return selectedCategoryName?.toLowerCase() === catName?.toLowerCase();
  };

  // Combine All Stays card with API categories
  const displayCategories = categories && categories.length > 0 ? categories : [];

  const scrollPrev = () => carouselApi?.scrollPrev();
  const scrollNext = () => carouselApi?.scrollNext();

  return (
    <section className="w-full relative -mt-5 sm:-mt-4 md:-mt-9 z-20 rounded-t-[1.75rem] sm:rounded-t-[2.5rem] md:rounded-t-[1.5rem] bg-white py-5 sm:py-8 md:py-12 overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">

        {/* Section Header - Centered with Mobile-App Sized Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Handpicked Getaways</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Choose Your Vibe</span>
          </div>

          {/* Heading - App-Like Compact Typography */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Explore by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Categories
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            From private pool villas to lakeside glamping, swipe through our real verified stays.
          </p>

          {/* Desktop Arrow Controls (Positioned at right on desktop, hidden on mobile) */}
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

        {/* Carousel: Small Mobile Cards (basis-[45%]), Multi-card on Tablet/Desktop */}
        {loading ? (
          <div className="flex gap-2.5 sm:gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-[145px] sm:w-1/3 lg:w-1/5 shrink-0 rounded-xl sm:rounded-2xl bg-neutral-100 h-36 sm:h-52 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              dragFree: true,
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2.5 sm:-ml-4">

              {/* 1. "All Stays" Primary Card with Real Image */}
              <CarouselItem className="pl-2.5 sm:pl-4 basis-[45%] sm:basis-[30%] md:basis-1/4 lg:basis-1/5">
                <motion.div
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectCategory("all-stays", "All Stays")}
                  className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer h-full ${isSelected("All Stays")
                    ? "border-[#ff6900] shadow-[0_6px_20px_rgba(255,105,0,0.18)] ring-2 ring-[#ff6900]/30"
                    : "border-neutral-200/90 bg-white hover:border-[#ff6900]/50 hover:shadow-lg hover:shadow-orange-500/10"
                    }`}
                >
                  {/* Real Image Container - Compact Height */}
                  <div className="relative h-28 sm:h-36 md:h-44 lg:h-48 w-full overflow-hidden">
                    <Image
                      src={ALL_STAYS_CARD.realImage}
                      alt="All Stays"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                    {/* Top Floating Badges */}
                    <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 flex items-center justify-between z-10">
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-2xs flex items-center gap-0.5">
                        <Layers className="w-2.5 h-2.5 text-[#ff6900]" />
                        <span className="hidden xs:inline">{ALL_STAYS_CARD.tag}</span>
                        <span className="xs:hidden">All</span>
                      </span>
                      <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff6900] text-white shadow-2xs">
                        {ALL_STAYS_CARD.count}
                      </span>
                    </div>

                    {/* Bottom Category Info Overlaid on Photo */}
                    <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 z-10">
                      <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors">
                        {ALL_STAYS_CARD.name}
                      </h3>
                      <p className="text-white/85 text-[9px] sm:text-[10px] md:text-xs mt-0.5 line-clamp-1 font-medium">
                        {ALL_STAYS_CARD.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="px-2.5 py-1.5 sm:py-2.5 bg-white flex items-center justify-between text-[10px] sm:text-xs font-semibold text-[#ff6900] group-hover:bg-orange-50/40 transition-colors">
                    <span className="truncate">All stays</span>
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </motion.div>
              </CarouselItem>

              {/* 2. Dynamic Categories with Real Photography */}
              {displayCategories.map((category) => {
                const meta = getMeta(category.name);
                const selected = isSelected(category.name);

                return (
                  <CarouselItem
                    key={category._id || category.name}
                    className="pl-2.5 sm:pl-4 basis-[45%] sm:basis-[30%] md:basis-1/4 lg:basis-1/5"
                  >
                    <motion.div
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        handleSelectCategory(category._id, category.name)
                      }
                      className={`group relative flex flex-col rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer h-full ${selected
                        ? "border-[#ff6900] shadow-[0_6px_20px_rgba(255,105,0,0.18)] ring-2 ring-[#ff6900]/30"
                        : "border-neutral-200/90 bg-white hover:border-[#ff6900]/50 hover:shadow-lg hover:shadow-orange-500/10"
                        }`}
                    >
                      {/* Real Image Container - Compact Height */}
                      <div className="relative h-28 sm:h-36 md:h-44 lg:h-48 w-full overflow-hidden">
                        <Image
                          src={meta.realImage}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        />

                        {/* Dark Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

                        {/* Top Floating Badges */}
                        <div className="absolute top-1.5 left-1.5 right-1.5 sm:top-2 sm:left-2 sm:right-2 flex items-center justify-between z-10">
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-2xs truncate max-w-[55%]">
                            {meta.tag}
                          </span>
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#ff6900] text-white shadow-2xs shrink-0">
                            {meta.count}
                          </span>
                        </div>

                        {/* Bottom Category Info Overlaid on Photo */}
                        <div className="absolute bottom-1.5 left-2 right-2 sm:bottom-2.5 sm:left-2.5 sm:right-2.5 z-10">
                          <h3 className="text-white font-extrabold text-xs sm:text-sm md:text-base leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-white/85 text-[9px] sm:text-[10px] md:text-xs mt-0.5 line-clamp-1 font-medium">
                            {meta.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="px-2.5 py-1.5 sm:py-2.5 bg-white flex items-center justify-between text-[10px] sm:text-xs font-semibold text-[#ff6900] group-hover:bg-orange-50/40 transition-colors">
                        <span className="truncate">Explore {category.name}</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </motion.div>
                  </CarouselItem>
                );
              })}

            </CarouselContent>
          </Carousel>
        )}

      </div>
    </section>
  );
};

export default ShopbyCategory;


