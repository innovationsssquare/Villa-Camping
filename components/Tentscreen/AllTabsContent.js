"use client";
import React, { useState, useEffect, useMemo } from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TentDetailsDrawer from "./tent-details-drawer";
import TentSelectionDrawer from "./tent-selection-drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import Image from "next/image";
import GoogleMap from "../Propertyviewcomponents/google-map";
import ReviewsTab from "./ReviewsTab";
import ExperiencesTab from "./ExperiencesTab";
import { useCamping } from "@/lib/context/CampingContext";
import { Card, CardContent } from "@/components/ui/card";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import MobileEventsSection from "../Propertyviewcomponents/MobileEventsSection";
import {
  Trees,
  Tent,
  Waves,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Check,
  Clock,
  ShieldCheck,
  FileText,
  Utensils,
  Coffee,
  Soup,
  MapPin,
  Car,
  Info,
  DollarSign,
  AlertCircle,
  Download,
  CookingPot,
  Receipt,
  Heart,
  Calendar,
  Footprints,
  Music,
  Flame,
  CheckCircle2,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@heroui/react";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import { useSelector, useDispatch } from "react-redux";

// Signature experience cards matching desktop
const defaultSignatureExperiences = [
  {
    title: "FULLY-SERVICED",
    subtitle: "TENTS",
    image:
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800&q=80",
  },
  {
    title: "CAMPFIRE",
    subtitle: "BARBECUE",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    title: "LAKESIDE",
    subtitle: "PANORAMA",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    title: "NATURE",
    subtitle: "ACTIVITIES",
    image:
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80",
  },
];

const AllTabsContent = ({ refs = {} }) => {
  const camping = useCamping();
  const dispatch = useDispatch();
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAllAmenitiesDrawer, setShowAllAmenitiesDrawer] = useState(false);
  const [amenitySearchQuery, setAmenitySearchQuery] = useState("");
  const [selectedTent, setSelectedTent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showTentSelectionDrawer, setShowTentSelectionDrawer] = useState(false);
  const [nearbyCampings, setNearbyCampings] = useState([]);

  const { checkin, checkout, selectedGuest } = useSelector((state) => state.booking);
  const reduxSelectedTents = useSelector((state) => state.booking.selectedTents);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const amenities = camping?.amenities || [];

  // Fetch nearby campings
  useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      if (!camping) return;
      try {
        const res = await fetch(`${BaseUrl}/Camping/get/campings`);
        if (res.ok) {
          const data = await res.json();
          const list = data?.data || (Array.isArray(data) ? data : []);
          const others = list.filter((p) => String(p._id) !== String(camping?._id));
          if (isMounted) {
            setNearbyCampings(others);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch nearby campings:", err);
      }
    }
    fetchNearby();
    return () => {
      isMounted = false;
    };
  }, [camping?._id]);

  // Categorize amenities
  const categorizedAmenities = {
    "Camping Essentials": amenities.filter((a) =>
      /tent|mattress|blanket|pillow|bedsheet|charging|water|lantern|light/i.test(a)
    ),
    "Outdoor & Activities": amenities.filter((a) =>
      /bonfire|barbeque|bbq|trekking|kayaking|rafting|game|music|dance|lawn|garden/i.test(a)
    ),
    "Comfort & Hygiene": amenities.filter((a) =>
      /washroom|bath|geyser|fan|dustbin|toilet|towel|soap|clean/i.test(a)
    ),
    "Views & Nature": amenities.filter((a) =>
      /lake|mountain|sunset|nature|view|outdoor/i.test(a)
    ),
    "Safety & Security": amenities.filter((a) =>
      /security|cctv|parking|caretaker|first aid|fire/i.test(a)
    ),
  };

  const allCategorizedFlat = Object.values(categorizedAmenities).flat();
  const uncategorized = amenities.filter((a) => !allCategorizedFlat.includes(a));
  if (uncategorized.length > 0) {
    categorizedAmenities["More Facilities"] = uncategorized;
  }

  const filteredCategorized = Object.entries(categorizedAmenities).reduce(
    (acc, [category, items]) => {
      const filtered = items.filter((item) =>
        item.toLowerCase().includes(amenitySearchQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        acc[category] = filtered;
      }
      return acc;
    },
    {}
  );

  // Consolidate tents by unique tentType
  const consolidatedTents = useMemo(() => {
    if (!Array.isArray(camping?.tents)) return [];
    const map = new Map();
    camping.tents.forEach((t, idx) => {
      const type = (t.tentType || t.name || `Tent ${idx + 1}`).trim();
      const lower = type.toLowerCase();
      if (!map.has(lower)) {
        map.set(lower, {
          ...t,
          tentType: type,
          totalUnits: Number(t.totaltents ?? t.totalUnits ?? 1),
        });
      } else {
        const existing = map.get(lower);
        existing.totalUnits += Number(t.totaltents ?? t.totalUnits ?? 1);
      }
    });
    return Array.from(map.values());
  }, [camping?.tents]);

  return (
    <div className="pb-24">
      {/* 1. HIGHLIGHTS SECTION */}
      <section
        ref={refs?.highlightsRef}
        id="highlights"
        className="p-3.5 space-y-4 scroll-mt-16"
      >
        <div>
          <h3 className="text-base font-bold mb-2 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Campsite Highlights
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Handcrafted experiences & signature outdoor luxury
          </p>

          {/* Signature Experience Cards Carousel */}
          <div className="overflow-x-auto scrollbar-hide -mx-3.5 px-3.5 pb-2">
            <div className="flex space-x-3 w-max">
              {defaultSignatureExperiences.map((exp, idx) => {
                const displayImg = (camping?.images && camping.images[idx]) || exp.image;
                return (
                  <div
                    key={idx}
                    className="relative w-44 aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 shadow-2xs shrink-0"
                  >
                    <Image
                      src={displayImg}
                      alt={`${exp.title} ${exp.subtitle}`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-2.5 text-white">
                      <span className="text-[9px] font-extrabold tracking-wider uppercase text-orange-400">
                        {exp.title}
                      </span>
                      <span className="text-xs font-black tracking-tight leading-tight">
                        {exp.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* About Campsite Description Card */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-2.5 mt-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              About This Campsite
            </h4>
            <div className="relative">
              <p
                className={`text-xs text-gray-600 leading-relaxed ${
                  !expandedDescription ? "line-clamp-3" : ""
                }`}
              >
                {camping?.description ||
                  "Escape into nature at this serene lakeside campsite. Enjoy bonfire nights, curated barbecue meals, clean tents under the open starlit sky, and refreshing morning breezes."}
              </p>
              {camping?.description && camping.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="mt-1 text-xs font-bold text-[#ff6900] hover:text-[#e05d00] cursor-pointer"
                >
                  {expandedDescription ? "Show less" : "Read more..."}
                </button>
              )}
            </div>

            {/* Things to do chips */}
            {camping?.highlights?.thingsToDo?.length > 0 && (
              <div className="pt-2.5 border-t border-neutral-100">
                <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Things to do
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {camping.highlights.thingsToDo.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-950 font-medium text-[11px] border border-orange-200/60"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#ff6900]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <MobileEventsSection property={camping} propertyType="camping" />

      {/* 2. REFUND POLICY SECTION */}
      <section
        ref={refs?.refundRef}
        id="refund-policy"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Rules & Refund Policy
          </h3>

          <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-4">
            {/* Visual Step-by-Step Cancellation Timeline */}
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ff6900]" />
                Cancellation Timeline
              </h4>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                  <span className="font-bold">100% Refund</span>
                  <span className="text-[11px] text-emerald-800">Up to 7 days before check-in</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                  <span className="font-bold">50% Refund</span>
                  <span className="text-[11px] text-amber-800">7 days to 48 hrs before check-in</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between text-xs text-rose-950">
                  <span className="font-bold">No Refund</span>
                  <span className="text-[11px] text-rose-800">Within 48 hrs of check-in</span>
                </div>
              </div>
            </div>

            {/* Check-in / Out Timings */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-in</span>
                <span className="text-xs font-bold text-gray-900">{camping?.checkInTime || "4:00 PM"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-out</span>
                <span className="text-xs font-bold text-gray-900">{camping?.checkOutTime || "11:00 AM"}</span>
              </div>
            </div>

            {/* Camping Rules */}
            {camping?.CampingRules && camping.CampingRules.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Campsite Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {camping.CampingRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#ff6900] font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. SPACES & TENTS SECTION */}
      <section
        ref={refs?.spacesRef}
        id="spaces"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Available Tents
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Choose from cozy couple tents, spacious family units, and glamping tents
          </p>

          {consolidatedTents.length > 0 ? (
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {consolidatedTents.map((tent) => {
                  const currentSelectedQty = reduxSelectedTents?.[tent.tentType]?.quantity || 0;
                  const tentPrice = Number(
                    tent.pricing?.weekdayPrice || tent.pricing?.weekendPrice || camping?.pricing?.weekdayPrice || 1200
                  );

                  return (
                    <CarouselItem
                      key={tent._id}
                      className="pl-2.5 basis-[48%] sm:basis-1/3"
                    >
                      <div className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all h-full flex flex-col justify-between select-none">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedTent(tent);
                            setDrawerOpen(true);
                          }}
                        >
                          <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                            <Image
                              src={tent?.tentimages?.[0] || camping?.images?.[0] || "/placeholder.svg"}
                              alt={tent.tentType}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-bold text-gray-900 shadow-xs border border-black/5 flex items-center gap-1">
                              <Tent className="w-2.5 h-2.5 text-[#ff6900]" />
                              <span className="truncate max-w-[75px]">{tent.tentType}</span>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white">
                              {tent.totaltents || 10} Available
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {tent.tentType} Tent
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Users className="w-3 h-3 text-[#ff6900] shrink-0" />
                              <span className="truncate">Up to {tent.maxCapacity || 2} Guests</span>
                            </div>
                            <div className="pt-0.5 flex items-baseline gap-1">
                              <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                                ₹{tentPrice.toLocaleString()}
                              </span>
                              <span className="text-[9px] text-gray-400 font-normal">/ night</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-2 pt-0">
                          <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-neutral-100">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedTent(tent);
                                setDrawerOpen(true);
                              }}
                              className="w-full py-1 text-[10px] font-semibold text-gray-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors text-center cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowTentSelectionDrawer(true);
                              }}
                              className="w-full py-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] active:scale-95 rounded-lg shadow-xs transition-all text-center truncate px-0.5 cursor-pointer"
                            >
                              {currentSelectedQty > 0 ? `${currentSelectedQty} Selected` : "Select"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>
          ) : (
            <p className="text-xs text-gray-400">Tents information will be available shortly.</p>
          )}
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section
        ref={refs?.reviewsRef}
        id="reviews"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <ReviewsTab Reviews={camping?.reviews} />
      </section>

      {/* 5. AMENITIES SECTION */}
      <section
        ref={refs?.amenitiesRef}
        id="amenities"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
              Amenities & Inclusions
            </h3>
            <button
              type="button"
              onClick={() => setShowAllAmenitiesDrawer(true)}
              className="text-xs font-bold text-[#ff6900] hover:text-[#e05d00] cursor-pointer"
            >
              View All ({amenities.length})
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {amenities.slice(0, 8).map((amenity, index) => (
              <div
                key={index}
                className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-neutral-200/80 shadow-2xs"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                  <CustomAmenityIcon name={amenity} className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {amenity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MEALS & CAMPFIRE DINING SECTION */}
      <section
        ref={refs?.mealsRef}
        id="meals"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Meals & Campfire Dining
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Delicious home-style food cooked fresh at the campsite
          </p>

          <div className="space-y-2.5">
            {/* Evening Snacks */}
            <div className="bg-white rounded-xl p-3 border border-neutral-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Evening Snacks & Tea</h4>
                  <span className="text-[9.5px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    5:00 PM – 6:30 PM
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {camping?.meals?.eveningSnacks || "Hot tea, coffee, and freshly made snacks"}
                </p>
              </div>
            </div>

            {/* Barbecue */}
            <div className="bg-white rounded-xl p-3 border border-neutral-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Live Campfire Barbecue</h4>
                  <span className="text-[9.5px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    7:30 PM – 9:00 PM
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  <span className="font-semibold">Veg:</span> {camping?.meals?.bbq?.veg || "Paneer tikka, veggies"} • <span className="font-semibold">Non-Veg:</span> {camping?.meals?.bbq?.nonVeg || "Chicken tikka"}
                </p>
              </div>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-xl p-3 border border-neutral-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Unlimited Dinner Buffet</h4>
                  <span className="text-[9.5px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    9:00 PM – 10:30 PM
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  <span className="font-semibold">Veg:</span> {camping?.meals?.dinner?.veg || "Paneer, dal, rice, chapati, salad"} • <span className="font-semibold">Non-Veg:</span> {camping?.meals?.dinner?.nonVeg || "Chicken curry, rice, chapati"}
                </p>
              </div>
            </div>

            {/* Breakfast */}
            <div className="bg-white rounded-xl p-3 border border-neutral-200/80 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                <CookingPot className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Next Day Breakfast</h4>
                  <span className="text-[9.5px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded-full">
                    8:30 AM – 10:00 AM
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  {camping?.meals?.nextDayBreakfast || "Poha / Upma, boiled eggs / omlette, hot tea & coffee"}
                </p>
              </div>
            </div>
          </div>

          {/* Things to Carry Checklist */}
          <div className="bg-neutral-50 rounded-2xl p-3.5 border border-neutral-200/80 mt-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Things to Carry
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-700">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Torch / Flashlight</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Personal Medicines</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Comfortable Footwear</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Warm Clothes (Winter)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Power Bank</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                <span>Government ID</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LOCATION SECTION */}
      <section
        ref={refs?.locationRef}
        id="location"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Location & Getting There
          </h3>

          <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs">
            <div className="h-48 w-full">
              <GoogleMap coordinates={camping?.coordinates} />
            </div>
            <div className="p-3.5 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {camping?.address?.addressLine}, {camping?.address?.area}, {camping?.address?.city}
                </p>
              </div>

              {camping?.nearbyattractions && camping.nearbyattractions.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Nearby Attractions
                  </span>
                  <div className="space-y-1.5">
                    {camping.nearbyattractions.map((loc, index) => (
                      <div key={index} className="flex items-center justify-between text-xs text-gray-700">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-[#ff6900]" />
                          <span>{loc?.nearbylocation}</span>
                        </span>
                        <span className="text-gray-400 font-medium">{loc?.distance} km</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. EXPERIENCES SECTION */}
      <section
        ref={refs?.experiencesRef}
        id="experiences"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <ExperiencesTab experiences={camping?.experiences} />
      </section>

      {/* 9. FAQs SECTION */}
      <section
        ref={refs?.faqsRef}
        id="faqs"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Frequently Asked Questions
          </h3>

          <Accordion type="single" collapsible className="space-y-2">
            {camping?.faqs && camping.faqs.length > 0 ? (
              camping.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 py-0 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <>
                <AccordionItem
                  value="faq-1"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    What are the check-in and check-out timings?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Check-in starts at {camping?.checkInTime || "4:00 PM"} and check-out is by {camping?.checkOutTime || "11:00 AM"}.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="faq-2"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    Are clean washrooms available?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Yes, separate, hygienic western & Indian washrooms with running water are maintained.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Explore Your Stay Accordion */}
        {camping?.exploreStay && camping.exploreStay.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Explore Your Stay
            </h4>
            <Accordion type="single" collapsible className="space-y-2">
              {camping.exploreStay.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`explore-${index}`}
                  className="bg-neutral-50 rounded-xl px-4 border border-neutral-200/70"
                >
                  <AccordionTrigger className="font-semibold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* 10. NEARBY CAMPINGS CAROUSEL: 2 CARDS PER VIEW ON MOBILE */}
        {nearbyCampings.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-200/80">
            <div className="mb-3 border-l-4 border-[#ff6900] pl-2.5">
              <h3 className="text-base font-bold text-gray-900">
                Nearby Stays in {camping?.address?.city || "Pawana"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Swipe to explore more handpicked campsites
              </p>
            </div>

            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {nearbyCampings.map((campItem) => (
                  <CarouselItem
                    key={campItem._id}
                    className="pl-2.5 basis-[48%] sm:basis-1/3"
                  >
                    <div className="w-full">
                      <PropertyCard property={campItem} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </section>

      {/* TENT DETAILS DRAWER */}
      <TentDetailsDrawer
        tent={selectedTent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSelectTent={() => {
          setDrawerOpen(false);
          setShowTentSelectionDrawer(true);
        }}
      />

      {/* ALL AMENITIES DRAWER FOR MOBILE */}
      <Drawer
        open={showAllAmenitiesDrawer}
        onOpenChange={setShowAllAmenitiesDrawer}
      >
        <DrawerContent className="max-h-[85vh] h-[85vh] bg-white rounded-t-[28px] p-5 flex flex-col focus:outline-none">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3 shrink-0" />
          <DrawerHeader className="p-0 border-b border-neutral-150 pb-3">
            <DrawerTitle className="text-base font-bold text-gray-900">
              All Amenities ({amenities.length})
            </DrawerTitle>
            <div className="relative mt-2.5">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search amenities..."
                value={amenitySearchQuery}
                onChange={(e) => setAmenitySearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-100 border-none focus:outline-none focus:ring-1 focus:ring-[#ff6900]"
              />
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto py-3 space-y-4">
            {Object.keys(filteredCategorized).length > 0 ? (
              Object.entries(filteredCategorized).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-[11px] font-bold text-[#ff6900] uppercase tracking-wider">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-xl bg-neutral-50 border border-neutral-150"
                      >
                        <CustomAmenityIcon name={item} className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                        <span className="text-[11px] text-gray-800 font-medium truncate">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-gray-400 py-6">
                No matching amenities found.
              </p>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Tent Details Mobile Drawer */}
      <TentDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tent={selectedTent}
        onSelectTent={() => {
          setDrawerOpen(false);
          setShowTentSelectionDrawer(true);
        }}
      />

      {/* Tent Selection Mobile Drawer */}
      <TentSelectionDrawer
        isOpen={showTentSelectionDrawer}
        onClose={() => setShowTentSelectionDrawer(false)}
        tents={consolidatedTents}
        totalGuests={selectedGuest?.totalGuests || 2}
        dateStr={checkin || new Date().toISOString()}
        id={camping?._id}
      />
    </div>
  );
};

export default AllTabsContent;
