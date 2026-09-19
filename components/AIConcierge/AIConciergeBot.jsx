"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Sparkles,
  Waves,
  PawPrint,
  Star,
  Gift,
  Heart,
  Mountain,
  MapPin,
  Mic,
  MicOff,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Minus,
  Plus,
  Calendar as CalendarIcon,
  Home,
  Tent,
  Trees,
  Hotel,
  Building2,
  Compass,
  MessageCircle,
  RotateCcw,
  Bed,
  Utensils,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { format, isBefore, isSameDay, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isWithinInterval } from "date-fns";
import { useIndianHolidays } from "@/hooks/useIndianHolidays";

// Supported Indian languages matching the StayVista reference
const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "mr", name: "मराठी" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "ta", name: "தமிழ்" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "ml", name: "മലയാളം" },
];

// Stay Categories
const CATEGORIES = [
  { id: "Villa", name: "Villa", label: "Villas", icon: Home, desc: "Private pool estates" },
  { id: "Camping", name: "Camping Tent", label: "Camping Tents", icon: Tent, desc: "Lakeside & stars" },
  { id: "Cottage", name: "Cottages", label: "Cottages", icon: Trees, desc: "Cozy hillside stays" },
  { id: "Hotel", name: "Hotel", label: "Hotels", icon: Hotel, desc: "Resorts & suites" },
];

// Quick discovery vibe chips
const VIBE_CHIPS = [
  { id: "lake_view", label: "Lake view", icon: Waves },
  { id: "pet_friendly", label: "Pet friendly", icon: PawPrint },
  { id: "best_rated", label: "Best rated", icon: Star },
  { id: "celebration", label: "Celebration homes", icon: Gift },
  { id: "romantic", label: "Romantic getaways", icon: Heart },
  { id: "scenic", label: "Impeccable views", icon: Mountain },
  { id: "explore", label: "Explore destinations", icon: MapPin },
];

/**
 * Luxury Horizontal Property Cards Carousel with Left/Right Navigation and Smooth Scroll
 */
function ChatPropertyCarousel({ properties, onSelectProperty }) {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(properties?.length > 1);

  // Mouse drag-to-scroll state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [hasMoved, setHasMoved] = useState(false);

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      const idx = Math.round(scrollLeft / 180);
      setCurrentIndex(Math.min(Math.max(0, idx), (properties?.length || 1) - 1));
    }
  }, [properties]);

  useEffect(() => {
    updateScrollState();
  }, [properties, updateScrollState]);

  // Native non-passive wheel listener for smooth horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        updateScrollState();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [updateScrollState]);

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 180, behavior: "smooth" });
      setTimeout(updateScrollState, 250);
    }
  };

  const scrollByAmount = (offset) => {
    if (scrollRef.current) {
      const target = scrollRef.current.scrollLeft + offset;
      scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
      setTimeout(updateScrollState, 250);
    }
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    setHasMoved(false);
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 5) {
      setHasMoved(true);
    }
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollState();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="relative mt-2 -mx-1 group/carousel">
      {/* Floating Left Arrow Button */}
      {showLeft && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            scrollByAmount(-185);
          }}
          className="absolute -left-1.5 top-[38%] -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label="Previous stays"
        >
          <ChevronLeft className="w-4 h-4 pointer-events-none" />
        </button>
      )}

      {/* Floating Right Arrow Button */}
      {showRight && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            scrollByAmount(185);
          }}
          className="absolute -right-1.5 top-[38%] -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
          aria-label="Next stays"
        >
          <ChevronRight className="w-4 h-4 pointer-events-none" />
        </button>
      )}

      {/* Horizontally Scrollable Cards Container with Mouse Drag */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex gap-2.5 overflow-x-auto pb-1 px-1 scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {properties.map((property) => (
          <Link
            key={property.id}
            href={property.link}
            onClick={(e) => {
              if (hasMoved) {
                e.preventDefault();
                return;
              }
              onSelectProperty?.();
            }}
            draggable={false}
            className="w-[172px] shrink-0 bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
          >
            {/* Property Cover Image */}
            <div className="relative aspect-[16/10] w-full bg-neutral-100 overflow-hidden">
              <Image
                src={property.image}
                alt={property.name}
                fill
                unoptimized
                draggable={false}
                className="object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider pointer-events-none">
                {property.category}
              </span>
            </div>

            {/* Card Details */}
            <div className="p-2 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-1 mb-0.5">
                <h4 className="font-serif font-bold text-neutral-900 text-xs truncate flex-1">
                  {property.name}
                </h4>
                <span className="text-[10px] font-bold text-neutral-800 flex items-center gap-0.5 shrink-0">
                  ★ {property.rating}
                </span>
              </div>

              {/* Location Pin */}
              <p className="text-[9px] font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-0.5 mb-1 truncate">
                <MapPin className="w-2.5 h-2.5 text-[#ff6900] shrink-0 pointer-events-none" />
                {property.location}
              </p>

              {/* Specs */}
              <div className="flex items-center gap-1 text-[9px] text-neutral-500 mb-1.5">
                <span>{property.guests} guests</span>
                <span>•</span>
                <span>{property.rooms} rooms</span>
              </div>

              {/* Pricing & CTA */}
              <div className="mt-auto pt-1.5 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900">
                  ₹{Number(property.price).toLocaleString("en-IN")}
                  <span className="text-[8px] font-normal text-neutral-400"> /nt</span>
                </span>
                <span className="text-[10px] font-bold text-[#ff6900] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View <ArrowRight className="w-2.5 h-2.5 pointer-events-none" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Interactive Pagination Dot Indicators */}
      {properties && properties.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {properties.map((p, idx) => (
            <button
              key={p.id || idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToCard(idx);
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${currentIndex === idx ? "w-4 bg-neutral-900" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                }`}
              aria-label={`Go to stay ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * StayVista-Style Spaces & Amenities Carousel Component
 * Allows guests to toggle between "The spaces" and "What this villa offers"
 */
function PropertySpacesCarousel({ spaces, amenities = [], propertyCategory = "Villa", initialTab = "spaces" }) {
  const [activeTab, setActiveTab] = useState(initialTab || "spaces");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(spaces?.length > 1);

  // Mouse drag-to-scroll
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const updateScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
      const idx = Math.round(scrollLeft / 210);
      setCurrentIndex(Math.min(Math.max(0, idx), (spaces?.length || 1) - 1));
    }
  }, [spaces]);

  useEffect(() => {
    updateScrollState();
  }, [spaces, activeTab, updateScrollState]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
        updateScrollState();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [updateScrollState]);

  const scrollToCard = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: index * 210, behavior: "smooth" });
      setTimeout(updateScrollState, 250);
    }
  };

  const scrollByAmount = (offset) => {
    if (scrollRef.current) {
      const target = scrollRef.current.scrollLeft + offset;
      scrollRef.current.scrollTo({ left: target, behavior: "smooth" });
      setTimeout(updateScrollState, 250);
    }
  };

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftRef.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
    updateScrollState();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="mt-2.5 space-y-2.5">
      {/* Top Toggle Pills Ribbon (Matching StayVista Image) */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("spaces")}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === "spaces"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
        >
          The spaces
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("amenities")}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${activeTab === "amenities"
              ? "bg-neutral-900 text-white shadow-2xs"
              : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
            }`}
        >
          What this {propertyCategory.toLowerCase()} offers
        </button>
      </div>

      {/* Tab 1: Spaces Cards Carousel (Matching Reference Screenshot) */}
      {activeTab === "spaces" && (
        <div className="relative -mx-1 group/carousel">
          {showLeft && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                scrollByAmount(-210);
              }}
              className="absolute -left-1.5 top-[38%] -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Previous space"
            >
              <ChevronLeft className="w-4 h-4 pointer-events-none" />
            </button>
          )}

          {showRight && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                scrollByAmount(210);
              }}
              className="absolute -right-1.5 top-[38%] -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-white text-neutral-800 shadow-md border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
              aria-label="Next space"
            >
              <ChevronRight className="w-4 h-4 pointer-events-none" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex gap-2.5 overflow-x-auto pb-1 px-1 scroll-smooth no-scrollbar select-none cursor-grab active:cursor-grabbing"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {spaces.map((space, idx) => (
              <div
                key={space.id || idx}
                className="w-[200px] shrink-0 bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs flex flex-col"
              >
                {/* Photo with Bed Type Badge */}
                <div className="relative aspect-[16/11] w-full bg-neutral-100 overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    unoptimized
                    draggable={false}
                    className="object-cover pointer-events-none"
                  />
                  {/* Floating Bed Badge - exact StayVista styling */}
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-white/95 backdrop-blur-md text-neutral-900 font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-2xs border border-neutral-200/60">
                      {space.badge}
                    </span>
                  </div>
                </div>

                {/* Space Body with Diamond Bullet Points */}
                <div className="p-2.5 flex flex-col flex-1">
                  <h4 className="font-serif font-bold text-neutral-900 text-xs mb-1.5 truncate">
                    {space.name}
                  </h4>
                  <div className="space-y-1 text-[11px] text-neutral-600 leading-snug">
                    {space.details.map((detail, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-1.5">
                        <span className="text-[#ff8566] text-[10px] mt-0.5 shrink-0">◆</span>
                        <span className="line-clamp-2">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dot Indicators */}
          {spaces && spaces.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {spaces.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToCard(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${currentIndex === idx ? "w-4 bg-neutral-900" : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                    }`}
                  aria-label={`Go to space ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Amenities Grid */}
      {activeTab === "amenities" && (
        <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-200/70 space-y-2">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Verified Amenities & Inclusions
          </p>
          <div className="grid grid-cols-2 gap-1.5 max-h-[220px] overflow-y-auto no-scrollbar pr-0.5">
            {amenities.slice(0, 16).map((amenity, aIdx) => (
              <div
                key={aIdx}
                className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-neutral-200/60 shadow-2xs text-xs text-neutral-800"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Property House Rules View
 */
function PropertyRulesView({ rules = [], timings = null }) {
  return (
    <div className="mt-2.5 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ff6900] shrink-0" />
          <div>
            <p className="text-[9px] text-neutral-400 uppercase font-semibold">Check-in</p>
            <p className="text-xs font-bold text-neutral-900">{timings?.checkIn || "1:00 PM"}</p>
          </div>
        </div>
        <div className="p-2 bg-neutral-50 rounded-xl border border-neutral-200/70 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#ff6900] shrink-0" />
          <div>
            <p className="text-[9px] text-neutral-400 uppercase font-semibold">Check-out</p>
            <p className="text-xs font-bold text-neutral-900">{timings?.checkOut || "11:00 AM"}</p>
          </div>
        </div>
      </div>

      <div className="p-3 bg-neutral-50/80 rounded-2xl border border-neutral-200/70 space-y-1.5">
        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
          House Rules & Policies
        </p>
        <div className="space-y-1.5 text-xs text-neutral-700">
          {rules.map((r, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-[#ff8566] text-[10px] mt-0.5 shrink-0">◆</span>
              <span className="leading-relaxed">{r}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Property Meals & Dining View
 */
function PropertyMealsView({ meals = null }) {
  return (
    <div className="mt-2.5 p-3 bg-neutral-50/80 rounded-2xl border border-neutral-200/70 space-y-2">
      <div className="flex items-center gap-1.5">
        <Utensils className="w-4 h-4 text-[#ff6900] shrink-0" />
        <p className="text-[10px] font-bold text-neutral-700 uppercase tracking-wider">
          Dining & Meal Options
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(meals?.available || ["Breakfast", "Lunch", "Dinner"]).map((m, idx) => (
          <span key={idx} className="px-2.5 py-1 rounded-full bg-orange-100/70 text-[#ea580c] font-bold text-[10px]">
            🍽️ {m}
          </span>
        ))}
      </div>
      {meals?.adultPrice > 0 && (
        <p className="text-xs text-neutral-800 font-semibold">
          Package rate: ₹{meals.adultPrice.toLocaleString("en-IN")} per adult / day
          {meals.childPrice > 0 && ` (₹${meals.childPrice.toLocaleString("en-IN")} per child)`}
        </p>
      )}
      <p className="text-xs text-neutral-600 leading-relaxed">
        {meals?.note || "Freshly cooked meals can be prepared by in-house cooks with prior notice."}
      </p>
    </div>
  );
}

export default function AIConciergeBot() {
  const pathname = usePathname() || "";

  // 1. Detect if browsing a specific property view page
  const isVillaPage = pathname.toLowerCase().includes("/view-villa");
  const isCampingPage = pathname.toLowerCase().includes("/view-camping");
  const isCottagePage = pathname.toLowerCase().includes("/view-cottage");
  const isHotelPage = pathname.toLowerCase().includes("/view-hotel");
  const isPropertyPage = isVillaPage || isCampingPage || isCottagePage || isHotelPage;

  const propertyCategory = isVillaPage
    ? "Villa"
    : isCampingPage
      ? "Camping"
      : isCottagePage
        ? "Cottage"
        : isHotelPage
          ? "Hotel"
          : "Stay";

  const propertyId = isPropertyPage ? pathname.split("/").filter(Boolean)[1] : null;

  // Retrieve active property from Redux store
  const villaData = useSelector((state) => state.villa?.villa);
  const campingData = useSelector((state) => state.camping?.camping);
  const cottageData = useSelector((state) => state.cottage?.cottage);
  const hotelData = useSelector((state) => state.hotel?.hotel);

  const activeProperty = isVillaPage
    ? villaData
    : isCampingPage
      ? campingData
      : isCottagePage
        ? cottageData
        : isHotelPage
          ? hotelData
          : null;

  const propertyQuickPills = [
    { id: "spaces", label: "The spaces", query: `What are the spaces in this ${propertyCategory.toLowerCase()}?` },
    { id: "amenities", label: `What this ${propertyCategory.toLowerCase()} offers`, query: `What does this ${propertyCategory.toLowerCase()} offer?` },
    { id: "rules", label: "House rules", query: "What are the house rules and check-in time?" },
    { id: "meals", label: "Meals & dining", query: "Is food available and what are the meal options?" },
    { id: "pricing", label: "Check pricing", query: "How much does it cost to book this stay?" },
  ];

  // Modal & Navigation States
  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState("welcome"); // "welcome" | "filter" | "chat"
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");
  const [selectedCategory, setSelectedCategory] = useState("Villa");

  // Chat conversation state
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Structured Form States
  const [destination, setDestination] = useState("");
  const [budgetMax, setBudgetMax] = useState(35000);
  const [isAnyBudget, setIsAnyBudget] = useState(false);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [infantsCount, setInfantsCount] = useState(0);

  // Custom Luxury Calendar States (Replaces native browser datepicker)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [selectedCheckOut, setSelectedCheckOut] = useState(null);

  // Indian Holidays & Long Weekends Integration
  const currentYear = currentCalendarMonth ? currentCalendarMonth.getFullYear() : new Date().getFullYear();
  const { isHoliday, getHolidayName, isLongWeekend, allHolidays } = useIndianHolidays(currentYear);

  // Available locations for autocomplete (dynamically fetched from backend)
  const [knownLocations, setKnownLocations] = useState([
    "Gold Vally",
    "Karla-Lonavala",
    "Malavli",
    "Lonavala",
  ]);

  // When browsing a specific property view page, automatically switch to chat and greet the guest
  useEffect(() => {
    if (isPropertyPage) {
      setActiveScreen("chat");
      const propTitle =
        activeProperty?.basicInfo?.title ||
        activeProperty?.title ||
        activeProperty?.name ||
        `${propertyCategory} Stay`;
      const propLocation =
        activeProperty?.location?.city ||
        activeProperty?.location?.address ||
        activeProperty?.city ||
        "our scenic location";

      setMessages((prev) => {
        if (prev.length === 0 || prev[0]?.propertyId !== propertyId) {
          return [
            {
              id: "prop-welcome",
              propertyId: propertyId,
              sender: "bot",
              text: `Welcome! I am your personal concierge for ${propTitle} in ${propLocation}. How can I assist you with this ${propertyCategory.toLowerCase()}? Ask me about the spaces, amenities, house rules, dining, or pricing!`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ];
        }
        return prev;
      });
    }
  }, [isPropertyPage, propertyId, activeProperty, propertyCategory]);

  useEffect(() => {
    fetch("/api/concierge/chat")
      .then((r) => r.json())
      .then((data) => {
        if (data?.locations && Array.isArray(data.locations) && data.locations.length > 0) {
          setKnownLocations(data.locations);
        }
      })
      .catch((err) => console.warn("Could not load dynamic locations:", err));
  }, []);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeScreen === "chat") {
      scrollToBottom();
    }
  }, [messages, activeScreen, isLoading]);

  // Initialize Web Speech API for voice queries
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputValue(transcript);
          setIsListening(false);
          handleSendMessage(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please type your query!");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Calendar Day Selection Logic
  const handleDateClick = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date, today)) return;

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      setSelectedCheckIn(date);
      setSelectedCheckOut(null);
    } else if (selectedCheckIn && !selectedCheckOut) {
      if (isBefore(date, selectedCheckIn)) {
        setSelectedCheckIn(date);
      } else if (isSameDay(date, selectedCheckIn)) {
        // Same day: set check-out as next day
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedCheckOut(nextDay);
      } else {
        setSelectedCheckOut(date);
      }
    }
  };

  // Trigger search to backend concierge API
  const handleSendMessage = async (textToSend, customFilters = null) => {
    const queryText = (textToSend || inputValue || "").trim();
    if (!queryText && !customFilters) return;

    setActiveScreen("chat");
    setInputValue("");

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text:
        queryText ||
        `Looking for ${selectedCategory.toLowerCase()}s in ${customFilters?.location || destination || "Lonavala"
        } for ${customFilters?.guests || adults} guests`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    const checkInStr = selectedCheckIn ? format(selectedCheckIn, "yyyy-MM-dd") : undefined;
    const checkOutStr = selectedCheckOut ? format(selectedCheckOut, "yyyy-MM-dd") : undefined;

    try {
      if (isPropertyPage) {
        const res = await fetch("/api/concierge/property-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyId: propertyId || activeProperty?._id,
            category: propertyCategory,
            message: queryText,
            propertyData: activeProperty,
            language: selectedLang,
          }),
        });

        const data = await res.json();

        const botMsg = {
          id: Date.now() + 1,
          sender: "bot",
          text:
            data.replyText ||
            `Here are the details for this ${propertyCategory.toLowerCase()}. Let me know if you have any questions!`,
          activeTab: data.activeTab || null,
          spaces: data.spaces || [],
          amenities: data.amenities || [],
          rules: data.rules || [],
          timings: data.timings || null,
          meals: data.meals || null,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);
        return;
      }

      const res = await fetch("/api/concierge/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          filters: customFilters || {},
          language: selectedLang,
        }),
      });

      const data = await res.json();

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text:
          data.replyText ||
          "Here are our verified stays matching your preferences. Let me know if you need specific amenities or custom dates!",
        hasMatches: data.hasMatches,
        properties: data.properties || [],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: isPropertyPage
          ? `I ran into a quick issue fetching details for this ${propertyCategory.toLowerCase()}. Please explore the property highlights or contact our concierge directly!`
          : "I ran into a quick hiccup searching the live catalog. You can explore all our stays or chat directly with our concierge on WhatsApp!",
        properties: [],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick vibe chip click handler
  const handleChipClick = (chip) => {
    if (chip.id === "explore") {
      setActiveScreen("filter");
      return;
    }
    const query = `Show me ${selectedCategory.toLowerCase()}s with ${chip.label.toLowerCase()} in Lonavala`;
    handleSendMessage(query, {
      vibe: chip.id,
      category: selectedCategory,
      location: "Lonavala",
    });
  };

  // Structured form submission
  const handleStructuredSubmit = () => {
    const loc = destination || "Lonavala";
    const totalGuests = adults + childrenCount;
    const dateStr =
      selectedCheckIn && selectedCheckOut
        ? ` from ${format(selectedCheckIn, "dd MMM")} to ${format(selectedCheckOut, "dd MMM")}`
        : "";
    const budgetStr = !isAnyBudget
      ? ` under ₹${budgetMax.toLocaleString("en-IN")} per night`
      : "";

    const syntheticQuery = `Show me ${selectedCategory.toLowerCase()}s in ${loc}${dateStr} for ${totalGuests} guests${budgetStr}`;

    handleSendMessage(syntheticQuery, {
      location: loc,
      category: selectedCategory,
      budgetMax: isAnyBudget ? undefined : budgetMax,
      guests: totalGuests,
      checkIn: selectedCheckIn ? format(selectedCheckIn, "yyyy-MM-dd") : undefined,
      checkOut: selectedCheckOut ? format(selectedCheckOut, "yyyy-MM-dd") : undefined,
    });
  };

  // Calendar Month Days Calculation
  const monthStart = startOfMonth(currentCalendarMonth);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDayIndex = getDay(monthStart); // 0 = Sunday

  return (
    <>
      {/* =========================================================================
          1. FLOATING MASCOT TRIGGER BUTTON (Placed on RIGHT side)
         ========================================================================= */}
      {!isOpen && (
        <div className="fixed md:bottom-6 md:right-6 bottom-24 right-6 z-[9990]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="relative group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Open AI Concierge"
          >
            {/* Outer Breathing Glow Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400/30 to-amber-300/30 blur-md group-hover:blur-lg transition-all animate-pulse" />

            {/* Circular Mascot Avatar Container */}
            <div className="relative w-14 h-14 rounded-full bg-white border-2 border-orange-200/80 shadow-xl overflow-hidden p-0.5">
              <Image
                src="/assets/ai-concierge-mascot.png"
                alt="VillaCamp AI Concierge"
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
              />
            </div>

            {/* Active Online Indicator Badge */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>

            {/* Hover Tooltip (Desktop - Anchored to Left) */}
            <span className="hidden sm:group-hover:flex absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-medium whitespace-nowrap shadow-xl items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Plan your stay with AI
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          2. MAIN AI CONCIERGE MODAL / DRAWER (Anchored on RIGHT side)
         ========================================================================= */}
      {isOpen && (
        <>
          {/* Subtle click-outside backdrop */}
          <div
            className="fixed inset-0 z-[9998] bg-black/20 backdrop-blur-[0.5px]"
            onClick={() => {
              setIsOpen(false);
              setIsCalendarOpen(false);
            }}
          />

          <div
            className="fixed bottom-3 sm:bottom-6 right-2 sm:right-6 z-[9999] w-[calc(100vw-1rem)] sm:w-[355px] h-[630px] max-h-[92vh] bg-[#fbfaf6] rounded-[28px] shadow-2xl border border-neutral-200/90 flex flex-col overflow-hidden no-scrollbar animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Mascot Anchor Bar */}
            <div className="relative pt-3.5 pb-2.5 px-4 flex items-center justify-between border-b border-neutral-200/60 bg-[#fbfaf6]/95 backdrop-blur-xs shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-2xs overflow-hidden shrink-0">
                  <Image
                    src="/assets/ai-concierge-mascot.png"
                    alt="Mascot"
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm flex items-center gap-1">
                    VillaCamp AI
                    <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    {isPropertyPage ? `Your Personal ${propertyCategory} Concierge` : "Your Personal Stay Concierge"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 z-30">
                {!isPropertyPage && activeScreen !== "welcome" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveScreen("welcome");
                      setIsCalendarOpen(false);
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-neutral-200/80 text-neutral-700 flex items-center justify-center transition-all shadow-2xs border border-neutral-200/60 cursor-pointer active:scale-95"
                    title="Back to start"
                    aria-label="Back to start"
                  >
                    <ArrowLeft className="w-4 h-4 pointer-events-none" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                    setIsCalendarOpen(false);
                  }}
                  className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-all shadow-2xs border border-neutral-200/60 cursor-pointer active:scale-95"
                  title="Close concierge"
                  aria-label="Close concierge"
                >
                  <X className="w-4 h-4 pointer-events-none" />
                </button>
              </div>
            </div>

            {/* =========================================================================
              SCREEN 1: WELCOME & QUICK DISCOVERY
             ========================================================================= */}
            {activeScreen === "welcome" && (
              <div className="flex-1 overflow-y-auto px-3.5 py-3 flex flex-col items-center text-center no-scrollbar">
                {/* Heading */}
                <h2 className="text-xl sm:text-2xl font-serif text-neutral-900 font-normal tracking-tight mb-1">
                  Welcome to The Villa Camp ✨
                </h2>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-2 w-full my-1.5 text-neutral-300">
                  <div className="h-px bg-neutral-200 w-12" />
                  <span className="text-[9px] text-[#ff8566]">◆</span>
                  <div className="h-px bg-neutral-200 w-12" />
                </div>

                {/* Language Selector Dropdown */}
                <div className="relative my-1.5">
                  <button
                    onClick={() => setIsLangOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-neutral-200 text-neutral-800 text-xs font-medium shadow-2xs hover:bg-neutral-50 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-neutral-600" />
                    <span>{selectedLang}</span>
                    {isLangOpen ? (
                      <ChevronUp className="w-3 h-3 text-[#ff8566]" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-[#ff8566]" />
                    )}
                  </button>

                  {/* Collapsible Languages Grid */}
                  {isLangOpen && (
                    <div className="absolute left-1/2 -translate-x-1/2 mt-1.5 w-[310px] p-2 bg-white rounded-2xl border border-neutral-200 shadow-xl z-30 grid grid-cols-4 gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setSelectedLang(lang.name);
                            setIsLangOpen(false);
                          }}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-medium transition-all ${selectedLang === lang.name
                              ? "bg-neutral-900 text-white"
                              : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-100"
                            }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* CATEGORY SELECTOR TABS (Villa, Camping, Cottage, Hotel) */}
                <div className="w-full my-2.5">
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-200/50 rounded-2xl border border-neutral-200/80">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-2 px-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${isSelected
                              ? "bg-white text-neutral-900 shadow-xs font-bold"
                              : "text-neutral-600 hover:text-neutral-900 font-medium"
                            }`}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#ff6900]" : "text-neutral-500"}`} />
                          <span className="text-[10px] leading-tight truncate w-full text-center">
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Main CTA: Help me Find a Stay */}
                <button
                  onClick={() => setActiveScreen("filter")}
                  className="w-full my-2 py-3 px-4 rounded-2xl bg-neutral-900 hover:bg-black text-white flex items-center justify-between group transition-all duration-200 shadow-md active:scale-98"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-sm">
                      Help me Find a {selectedCategory}
                    </span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </button>

                {/* What are you looking for section */}
                <div className="w-full mt-1.5">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-2.5">
                    WHAT ARE YOU LOOKING FOR?
                  </p>

                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {VIBE_CHIPS.map((chip) => {
                      const Icon = chip.icon;
                      return (
                        <button
                          key={chip.id}
                          onClick={() => handleChipClick(chip)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-orange-50/80 border border-neutral-200/90 hover:border-orange-300 text-neutral-700 hover:text-[#ff6900] text-xs font-medium shadow-2xs transition-all active:scale-95"
                        >
                          <Icon className="w-3 h-3 text-[#ff8566]" />
                          <span>{chip.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
              SCREEN 2: STRUCTURED FILTER DRAWER (With Modern Calendar & Category Tabs)
             ========================================================================= */}
            {activeScreen === "filter" && (
              <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 text-neutral-800 no-scrollbar">
                {/* CATEGORY SELECTOR CARDS */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    STAY TYPE
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${isSelected
                              ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                              : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                            }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-[#ff6900]" : "text-neutral-500"}`} />
                          <div className="text-left min-w-0 flex-1">
                            <p className="text-xs font-bold truncate leading-tight">{cat.name}</p>
                            <p className={`text-[9px] truncate leading-tight ${isSelected ? "text-neutral-300" : "text-neutral-400"}`}>
                              {cat.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Where to Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    WHERE TO?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Goa, Lonavala, Udaipur..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900 shadow-2xs"
                    />
                    {/* Autocomplete quick chips */}
                    <div className="flex gap-1.5 overflow-x-auto py-1 mt-1 scrollbar-none">
                      {knownLocations.map((loc) => (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => setDestination(loc)}
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border transition-colors shrink-0 ${destination === loc
                              ? "bg-neutral-900 text-white border-neutral-900"
                              : "bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50"
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Budget Per Night Slider */}
                <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-[10px] uppercase tracking-wider text-neutral-500">
                      BUDGET PER NIGHT
                    </span>
                    <span className="font-semibold text-neutral-900 text-xs">
                      {isAnyBudget ? "Any budget" : `Up to ₹${budgetMax.toLocaleString("en-IN")}`}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5000"
                    max="60000"
                    step="2500"
                    value={budgetMax}
                    disabled={isAnyBudget}
                    onChange={(e) => {
                      setBudgetMax(Number(e.target.value));
                      setIsAnyBudget(false);
                    }}
                    className="w-full accent-[#ff8566] cursor-pointer"
                  />

                  <div className="flex items-center justify-between mt-1 text-[10px] text-neutral-400">
                    <span>₹5,000</span>
                    <button
                      type="button"
                      onClick={() => setIsAnyBudget((prev) => !prev)}
                      className={`font-semibold underline ${isAnyBudget ? "text-[#ff6900]" : "text-neutral-500"
                        }`}
                    >
                      Any budget
                    </button>
                    <span>₹60,000+</span>
                  </div>
                </div>

                {/* =========================================================================
                  MODERN LUXURY CALENDAR PICKER (Replaces ugly native browser datepicker)
                 ========================================================================= */}
                <div>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Check-In Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen((prev) => !prev)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${isCalendarOpen
                          ? "border-neutral-900 bg-white ring-1 ring-neutral-900"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                        }`}
                    >
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                        CHECK-IN
                      </span>
                      <span className="text-xs font-semibold text-neutral-900 flex items-center justify-between mt-0.5">
                        {selectedCheckIn ? format(selectedCheckIn, "dd MMM, yyyy") : "Add date"}
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </span>
                    </button>

                    {/* Check-Out Trigger */}
                    <button
                      type="button"
                      onClick={() => setIsCalendarOpen((prev) => !prev)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${isCalendarOpen
                          ? "border-neutral-900 bg-white ring-1 ring-neutral-900"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                        }`}
                    >
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                        CHECK-OUT
                      </span>
                      <span className="text-xs font-semibold text-neutral-900 flex items-center justify-between mt-0.5">
                        {selectedCheckOut ? format(selectedCheckOut, "dd MMM, yyyy") : "Add date"}
                        <ChevronDown className="w-3 h-3 text-neutral-400" />
                      </span>
                    </button>
                  </div>

                  {/* Inline Luxury Calendar Dropdown */}
                  {isCalendarOpen && (
                    <div className="mt-2 p-3 bg-white rounded-2xl border border-neutral-200 shadow-md animate-in fade-in zoom-in-95 duration-150">
                      {/* Month Navigator Header */}
                      <div className="flex items-center justify-between mb-2 px-1">
                        <button
                          type="button"
                          onClick={() => setCurrentCalendarMonth((prev) => subMonths(prev, 1))}
                          className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <h4 className="font-bold text-xs text-neutral-900">
                          {format(currentCalendarMonth, "MMMM yyyy")}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setCurrentCalendarMonth((prev) => addMonths(prev, 1))}
                          className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Weekday Names */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-bold text-neutral-400">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      {/* Day Cells Grid */}
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Empty padding days before the 1st */}
                        {Array.from({ length: startingDayIndex }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="h-7 w-7" />
                        ))}

                        {/* Month Days */}
                        {daysInMonth.map((day) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const isPast = isBefore(day, today);
                          const isStart = selectedCheckIn && isSameDay(day, selectedCheckIn);
                          const isEnd = selectedCheckOut && isSameDay(day, selectedCheckOut);
                          const isInRange =
                            selectedCheckIn &&
                            selectedCheckOut &&
                            isWithinInterval(day, { start: selectedCheckIn, end: selectedCheckOut });

                          const dateStr = format(day, "yyyy-MM-dd");
                          const isHol = isHoliday ? isHoliday(dateStr) : false;
                          const holName = isHol && getHolidayName ? getHolidayName(dateStr) : null;
                          const isLW = isLongWeekend ? isLongWeekend(dateStr) : false;

                          let dayStyle = "text-neutral-700 hover:bg-neutral-100";
                          if (isPast) {
                            dayStyle = "text-neutral-300 pointer-events-none";
                          } else if (isStart || isEnd) {
                            dayStyle = "bg-neutral-900 text-white font-bold shadow-xs";
                          } else if (isInRange) {
                            dayStyle = "bg-orange-100/70 text-[#ff6900] font-semibold";
                          }

                          return (
                            <button
                              key={day.toISOString()}
                              type="button"
                              disabled={isPast}
                              onClick={() => handleDateClick(day)}
                              title={holName ? `🎉 ${holName}` : isLW ? "Long Weekend" : undefined}
                              className={`h-8 w-7 rounded-full mx-auto flex flex-col items-center justify-center text-xs relative transition-colors ${dayStyle}`}
                            >
                              <span className="leading-none">{format(day, "d")}</span>
                              {isHol && (
                                <span
                                  className={`w-1 h-1 rounded-full shrink-0 mt-0.5 ${isStart || isEnd ? "bg-amber-300" : "bg-[#ff6900]"
                                    }`}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Quick Pick: Upcoming Indian Holidays & Long Weekends */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100">
                        <div className="flex items-center justify-between text-[10px] text-neutral-500 font-semibold mb-1">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#ff6900]" />
                            Upcoming Indian Holidays
                          </span>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {allHolidays?.slice(0, 8).map((h) => {
                            const hDate = new Date(h.date);
                            const isPastH = isBefore(hDate, new Date());
                            if (isPastH) return null;
                            return (
                              <button
                                key={h.date}
                                type="button"
                                onClick={() => {
                                  const startDate = new Date(h.date);
                                  const endDate = new Date(h.date);
                                  endDate.setDate(endDate.getDate() + 2); // 2-night holiday trip
                                  setSelectedCheckIn(startDate);
                                  setSelectedCheckOut(endDate);
                                  setCurrentCalendarMonth(startDate);
                                }}
                                className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-[#ea580c] hover:bg-orange-100 whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
                              >
                                <span>🎉</span>
                                <span>{h.name}</span>
                                <span className="text-neutral-400 font-normal">({format(hDate, "d MMM")})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bottom Action Footer */}
                      <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCheckIn(null);
                            setSelectedCheckOut(null);
                          }}
                          className="text-[10px] text-neutral-500 hover:text-neutral-800 underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-2.5 h-2.5" /> Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsCalendarOpen(false)}
                          className="px-3 py-1 rounded-lg bg-neutral-900 text-white text-[11px] font-bold"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Counters */}
                <div className="bg-white p-3 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-2.5">
                  {/* Adults */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Adults</p>
                      <p className="text-[10px] text-neutral-400">Age 13 years and more</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-xs w-4 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Children</p>
                      <p className="text-[10px] text-neutral-400">Age 3-12 years</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-xs w-4 text-center">
                        {childrenCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildrenCount((prev) => prev + 1)}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Infants</p>
                      <p className="text-[10px] text-neutral-400">Age 0-2 years</p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setInfantsCount((prev) => Math.max(0, prev - 1))}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold text-xs w-4 text-center">
                        {infantsCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setInfantsCount((prev) => prev + 1)}
                        className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Button: Find Stays */}
                <button
                  type="button"
                  onClick={handleStructuredSubmit}
                  className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all shadow-md active:scale-98"
                >
                  Find Available {selectedCategory}s
                </button>
              </div>
            )}

            {/* =========================================================================
              SCREEN 3: CONVERSATIONAL THREAD & PROPERTY CAROUSEL
             ========================================================================= */}
            {activeScreen === "chat" && (
              <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 flex flex-col no-scrollbar">
                {/* Category / Property Mode Ribbon in Chat Header */}
                {isPropertyPage ? (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
                    {propertyQuickPills.map((pill) => (
                      <button
                        key={pill.id}
                        type="button"
                        onClick={() => handleSendMessage(pill.query)}
                        className="text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap bg-white border border-neutral-200/90 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          handleSendMessage(`Show me ${cat.name.toLowerCase()}s in Lonavala`, {
                            category: cat.id,
                            location: destination || "Lonavala",
                          });
                        }}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap transition-all ${selectedCategory === cat.id
                            ? "bg-neutral-900 text-white shadow-2xs"
                            : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
                          }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Message History */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"
                      }`}
                  >
                    {/* User Speech Bubble (Sky-Blue - User Image 1) */}
                    {msg.sender === "user" ? (
                      <div className="flex flex-col items-end">
                        <div className="bg-[#a5c9f3]/85 text-neutral-900 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed max-w-[85%] shadow-2xs">
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-neutral-400 mt-1 mr-1">
                          {msg.time}
                        </span>
                      </div>
                    ) : (
                      /* AI Concierge Card (Clean Luxury White) */
                      <div className="w-full max-w-[96%] bg-white rounded-2xl rounded-tl-xs p-3.5 border border-neutral-200/80 shadow-2xs">
                        {/* Decorative diamond accent */}
                        <div className="flex items-center gap-1 text-[10px] text-neutral-400 mb-1.5">
                          <span className="text-[#ff8566]">◆</span>
                          <div className="h-px bg-neutral-100 flex-1" />
                        </div>

                        {/* Bot Message Narrative */}
                        <p className="text-xs sm:text-[13px] text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
                          {msg.text}
                        </p>

                        {/* Spaces & Amenities Carousel (StayVista Reference UI) */}
                        {msg.spaces && msg.spaces.length > 0 && (
                          <PropertySpacesCarousel
                            spaces={msg.spaces}
                            amenities={msg.amenities || []}
                            propertyCategory={propertyCategory}
                            initialTab={msg.activeTab || "spaces"}
                          />
                        )}

                        {/* Property House Rules & Timings View */}
                        {msg.activeTab === "rules" && (
                          <PropertyRulesView rules={msg.rules} timings={msg.timings} />
                        )}

                        {/* Property Meals & Dining View */}
                        {msg.activeTab === "meals" && (
                          <PropertyMealsView meals={msg.meals} />
                        )}

                        {/* Properties Carousel with smooth scroll buttons and mouse wheel support */}
                        {msg.properties && msg.properties.length > 0 && (
                          <ChatPropertyCarousel
                            properties={msg.properties}
                            onSelectProperty={() => setIsOpen(false)}
                          />
                        )}

                        {/* WhatsApp Concierge Hotline Button if no direct matches */}
                        {!isPropertyPage && (!msg.properties || msg.properties.length === 0) && (
                          <div className="mt-3 pt-2 border-t border-neutral-100">
                            <a
                              href="https://wa.me/918669186483?text=Hi%2C%20I%20am%20looking%20for%20villa%20recommendations%20on%20TheVillaCamp!"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-2xs transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat with Concierge on WhatsApp</span>
                            </a>
                          </div>
                        )}

                        <span className="block text-[9px] text-neutral-400 text-right mt-1.5">
                          {msg.time}
                        </span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Modern AI Thinking State (Matching User Image 1: ✨ Just a moment...) */}
                {isLoading && (
                  <div className="self-start w-[240px] bg-white rounded-2xl rounded-tl-xs p-3.5 border border-neutral-200/80 shadow-2xs space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#ff6900] animate-spin" />
                      <span className="text-xs font-semibold text-[#ff6900]">
                        Just a moment...
                      </span>
                    </div>
                    <div className="space-y-1.5 pt-0.5">
                      <div className="h-2 bg-neutral-200/60 rounded-full w-4/5 animate-pulse" />
                      <div className="h-2 bg-neutral-200/60 rounded-full w-full animate-pulse delay-75" />
                      <div className="h-2 bg-neutral-200/60 rounded-full w-3/5 animate-pulse delay-150" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            {/* =========================================================================
              PERSISTENT BOTTOM INPUT BAR
             ========================================================================= */}
            <div className="p-3 bg-[#fbfaf6] border-t border-neutral-200/70 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 px-3 py-1.5 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isPropertyPage
                      ? `Ask about this ${propertyCategory.toLowerCase()}...`
                      : activeScreen === "chat"
                        ? "Where would you like to go next?"
                        : "Find your escape..."
                  }
                  className="flex-1 text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 bg-transparent focus:outline-none"
                />

                {/* Speech-to-text mic icon */}
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isListening
                      ? "bg-red-500 text-white animate-pulse"
                      : "text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                    }`}
                  title={isListening ? "Listening... click to stop" : "Voice search"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Coral send button */}
                <button
                  type="submit"
                  disabled={!inputValue.trim() && !isLoading}
                  className="w-8 h-8 rounded-full bg-[#f68282] hover:bg-[#ea6d6d] disabled:opacity-50 text-white flex items-center justify-center transition-transform active:scale-95 shadow-2xs"
                  title="Send query"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
