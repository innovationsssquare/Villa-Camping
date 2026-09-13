"use client";
import React, { useState, useEffect, useMemo } from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CottageDetailsDrawer from "./CottageDetailsDrawer";
import CottageSelectionDrawer from "./cottage-selection-drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
import { useCottage } from "@/lib/context/CottageContext";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import MobileEventsSection from "../Propertyviewcomponents/MobileEventsSection";
import {
  Trees,
  Home,
  Waves,
  Sparkles,
  Clock,
  Utensils,
  Coffee,
  CookingPot,
  MapPin,
  CheckCircle2,
  Users,
  Search,
  Flame,
  Soup,
} from "lucide-react";
import { Button } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";

const defaultCottageExperiences = [
  {
    title: "PRIVATE",
    subtitle: "VERANDA",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  },
  {
    title: "NATURE",
    subtitle: "RETREAT",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80",
  },
  {
    title: "BONFIRE &",
    subtitle: "BARBECUE",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    title: "SERENE",
    subtitle: "PANORAMA",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
];

const AllTabsContent = ({ refs = {} }) => {
  const cottage = useCottage();
  const dispatch = useDispatch();
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAllAmenitiesDrawer, setShowAllAmenitiesDrawer] = useState(false);
  const [amenitySearchQuery, setAmenitySearchQuery] = useState("");
  const [selectedCottage, setSelectedCottage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCottageSelectionDrawer, setShowCottageSelectionDrawer] = useState(false);
  const [nearbyCottages, setNearbyCottages] = useState([]);

  const { checkin, checkout, selectedGuest } = useSelector((state) => state.booking);
  const reduxSelectedCottages = useSelector((state) => state.booking.selectedCottages);

  const amenities = cottage?.amenities || [];

  // Fetch nearby cottages
  useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      if (!cottage) return;
      try {
        const res = await fetch(`${BaseUrl}/Cottage/get/cottages`);
        if (res.ok) {
          const data = await res.json();
          const list = data?.data || data?.properties || (Array.isArray(data) ? data : []);
          const others = list.filter((p) => String(p._id) !== String(cottage?._id));
          if (isMounted) {
            setNearbyCottages(others);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch nearby cottages:", err);
      }
    }
    fetchNearby();
    return () => {
      isMounted = false;
    };
  }, [cottage?._id]);

  // Categorize amenities
  const categorizedAmenities = {
    "Cottage Essentials": amenities.filter((a) =>
      /bed|mattress|blanket|pillow|linen|ac|heating|water|power|light|wardrobe/i.test(a)
    ),
    "Comfort & Living": amenities.filter((a) =>
      /veranda|balcony|patio|couch|sofa|table|chair|tv|wifi|geyser|washroom|bath/i.test(a)
    ),
    "Outdoor & Leisure": amenities.filter((a) =>
      /lawn|garden|bonfire|barbeque|bbq|hammock|pool|swing|nature|view|outdoor/i.test(a)
    ),
    "Dining & Kitchen": amenities.filter((a) =>
      /kitchen|fridge|refrigerator|microwave|cook|dining|tea|coffee|kettle|breakfast/i.test(a)
    ),
    "Safety & Hygiene": amenities.filter((a) =>
      /security|cctv|parking|caretaker|first aid|fire|clean|housekeeping/i.test(a)
    ),
  };

  const allCategorizedFlat = Object.values(categorizedAmenities).flat();
  const uncategorized = amenities.filter((a) => !allCategorizedFlat.includes(a));
  if (uncategorized.length > 0) {
    categorizedAmenities["More Inclusions"] = uncategorized;
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

  // Consolidate cottages by unique cottageType
  const consolidatedCottages = useMemo(() => {
    if (!Array.isArray(cottage?.cottages)) return [];
    const map = new Map();
    cottage.cottages.forEach((c, idx) => {
      const type = (c.cottageType || c.tentType || c.name || `Cottage ${idx + 1}`).trim();
      const lower = type.toLowerCase();
      if (!map.has(lower)) {
        map.set(lower, {
          ...c,
          cottageType: type,
          unitCount: Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? 1),
        });
      } else {
        const existing = map.get(lower);
        existing.unitCount += Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? 1);
      }
    });
    return Array.from(map.values());
  }, [cottage?.cottages]);

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
            Cottage Highlights
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Peaceful rustic cottages with modern comforts
          </p>

          {/* Signature Experience Cards Carousel */}
          <div className="overflow-x-auto scrollbar-hide -mx-3.5 px-3.5 pb-2">
            <div className="flex space-x-3 w-max">
              {defaultCottageExperiences.map((exp, idx) => {
                const displayImg =
                  (cottage?.cottageimages && cottage.cottageimages[idx]) ||
                  (cottage?.images && cottage.images[idx]) ||
                  exp.image;
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

          {/* About Cottage Description Card */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-2.5 mt-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              About This Cottage
            </h4>
            <div className="relative">
              <p
                className={`text-xs text-gray-600 leading-relaxed ${
                  !expandedDescription ? "line-clamp-3" : ""
                }`}
              >
                {cottage?.description ||
                  "Unwind in cozy, private cottages immersed in lush green surroundings. Featuring serene verandas, bonfire sit-outs, modern en-suite washrooms, and comforting home-style hospitality."}
              </p>
              {cottage?.description && cottage.description.length > 150 && (
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
            {cottage?.highlights?.thingsToDo?.length > 0 && (
              <div className="pt-2.5 border-t border-neutral-100">
                <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Things to do
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cottage.highlights.thingsToDo.map((item, idx) => (
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
      <MobileEventsSection property={cottage} propertyType="cottage" />

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
                <span className="text-xs font-bold text-gray-900">{cottage?.checkInTime || "1:00 PM"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-out</span>
                <span className="text-xs font-bold text-gray-900">{cottage?.checkOutTime || "11:00 AM"}</span>
              </div>
            </div>

            {/* House Rules */}
            {cottage?.HouseRules && cottage.HouseRules.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Cottage Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {cottage.HouseRules.map((rule, idx) => (
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

      {/* 3. SPACES & COTTAGES SECTION */}
      <section
        ref={refs?.spacesRef}
        id="spaces"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Available Cottages
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Select your preferred cottage type and units
          </p>

          {consolidatedCottages.length > 0 ? (
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {consolidatedCottages.map((cotItem, idx) => {
                  const cKey = cotItem.cottageType || cotItem.tentType || cotItem._id || `cottage-${idx}`;
                  const currentSelectedQty = reduxSelectedCottages?.[cKey]?.quantity || 0;
                  const cotPrice = Number(
                    cotItem.pricing?.weekdayPrice ||
                    cotItem.price ||
                    cottage?.pricing?.weekdayPrice ||
                    2500
                  );
                  const unitCount =
                    cotItem.unitCount ||
                    cotItem.totalcottage ||
                    cotItem.totaltents ||
                    cotItem.totalCottages ||
                    1;
                  const cotImages =
                    cotItem.cottageimages || cotItem.images || cottage?.images || ["/placeholder.svg"];

                  return (
                    <CarouselItem
                      key={cotItem._id || idx}
                      className="pl-2.5 basis-[48%] sm:basis-1/3"
                    >
                      <div className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all h-full flex flex-col justify-between select-none">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedCottage(cotItem);
                            setDrawerOpen(true);
                          }}
                        >
                          <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                            <Image
                              src={cotImages[0] || "/placeholder.svg"}
                              alt={cotItem.cottageType || "Cottage"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-bold text-gray-900 shadow-xs border border-black/5 flex items-center gap-1">
                              <Home className="w-2.5 h-2.5 text-[#ff6900]" />
                              <span className="truncate max-w-[75px]">{cotItem.cottageType || "Cottage"}</span>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white">
                              {unitCount} Available
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {cotItem.cottageType || "Cottage Unit"}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Users className="w-3 h-3 text-[#ff6900] shrink-0" />
                              <span className="truncate">Up to {cotItem.maxCapacity || 2} Guests</span>
                            </div>
                            <div className="pt-0.5 flex items-baseline gap-1">
                              <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                                ₹{cotPrice.toLocaleString()}
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
                                setSelectedCottage(cotItem);
                                setDrawerOpen(true);
                              }}
                              className="w-full py-1 text-[10px] font-semibold text-gray-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors text-center cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCottageSelectionDrawer(true);
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
            <p className="text-xs text-gray-400">Cottage units information will be available shortly.</p>
          )}
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section
        ref={refs?.reviewsRef}
        id="reviews"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <ReviewsTab Reviews={cottage?.reviews} />
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

      {/* 6. DINING & MEALS SECTION */}
      <section
        ref={refs?.mealsRef}
        id="meals"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Meals & Dining
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Authentic home-cooked meals prepared with local ingredients
          </p>

          <div className="space-y-3">
            {/* When Meals are Paid */}
            {(Number(cottage?.foodOptions?.adultPrice || 0) > 0 || Number(cottage?.foodOptions?.childPrice || 0) > 0) ? (
              <>
                {/* Adult Meal Plan */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-orange-50/40 border border-orange-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6900]">
                        Gourmet Dining
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        Adult Meal Package
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#ff6900] text-base">
                        ₹{Number(cottage.foodOptions.adultPrice || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-gray-400 block">/adult/day</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Freshly cooked home-style meals with seasonal vegetables, rotis, and curries tailored to your taste.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-600">
                    <span>✓ Veg & Non-Veg</span>
                    <span>•</span>
                    <span>✓ Freshly Cooked</span>
                    <span>•</span>
                    <span>✓ Unlimited</span>
                  </div>
                </div>

                {/* Child Meal Plan */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        5 - 10 Years
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        Child Meal Package
                      </h4>
                    </div>
                    <div className="text-right">
                      {Number(cottage?.foodOptions?.childPrice || 0) > 0 ? (
                        <>
                          <span className="font-extrabold text-gray-900 text-base">
                            ₹{Number(cottage.foodOptions.childPrice).toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-gray-400 block">/child/day</span>
                        </>
                      ) : (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Free for Kids Under 5
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Mild, wholesome preparations for little ones with warm milk and freshly made snacks.
                  </p>
                </div>
              </>
            ) : (
              /* Complimentary Meals */
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-900">Complimentary Meals Package</h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Included in Stay
                  </span>
                </div>
                <p className="text-[11px] text-gray-600">
                  Wholesome home-style vegetarian & non-vegetarian culinary options prepared fresh on-site.
                </p>
              </div>
            )}

            {/* Dynamic Available Course Schedule in Grid */}
            {Array.isArray(cottage?.foodOptions?.available) && cottage.foodOptions.available.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {cottage.foodOptions.available.includes("Breakfast") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Coffee className="w-3 h-3" /> Breakfast
                    </span>
                    <p className="text-xs font-bold text-gray-800">8:30 AM – 10:30 AM</p>
                  </div>
                )}
                {cottage.foodOptions.available.includes("Lunch") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Lunch
                    </span>
                    <p className="text-xs font-bold text-gray-800">1:00 PM – 3:00 PM</p>
                  </div>
                )}
                {cottage.foodOptions.available.includes("High Tea") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Soup className="w-3 h-3" /> High Tea
                    </span>
                    <p className="text-xs font-bold text-gray-800">5:00 PM – 6:30 PM</p>
                  </div>
                )}
                {cottage.foodOptions.available.includes("Dinner") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Dinner
                    </span>
                    <p className="text-xs font-bold text-gray-800">8:30 PM – 10:30 PM</p>
                  </div>
                )}
              </div>
            )}

            {cottage?.foodOptions?.note && (
              <p className="text-[11px] text-gray-500 bg-neutral-50 p-3 rounded-xl border border-neutral-200/70 leading-relaxed">
                ℹ {cottage.foodOptions.note}
              </p>
            )}
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
              <GoogleMap coordinates={cottage?.coordinates} />
            </div>
            <div className="p-3.5 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {cottage?.address?.addressLine}, {cottage?.address?.area}, {cottage?.address?.city}
                </p>
              </div>

              {cottage?.nearbyattractions && cottage.nearbyattractions.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Nearby Attractions
                  </span>
                  <div className="space-y-1.5">
                    {cottage.nearbyattractions.map((loc, index) => (
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
        <ExperiencesTab experiences={cottage?.experiences} />
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
            {cottage?.faqs && cottage.faqs.length > 0 ? (
              cottage.faqs.map((faq, index) => (
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
                    Check-in starts at {cottage?.checkInTime || "1:00 PM"} and check-out is by {cottage?.checkOutTime || "11:00 AM"}.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="faq-2"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    Are the cottages private with attached washrooms?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Yes, each cottage unit has a private entrance, veranda, and private hygienic attached washroom with running water.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Explore Your Stay Accordion */}
        {cottage?.exploreStay && cottage.exploreStay.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Explore Your Stay
            </h4>
            <Accordion type="single" collapsible className="space-y-2">
              {cottage.exploreStay.map((item, index) => (
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

        {/* 10. NEARBY COTTAGES CAROUSEL: 2 CARDS PER VIEW ON MOBILE */}
        {nearbyCottages.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-200/80">
            <div className="mb-3 border-l-4 border-[#ff6900] pl-2.5">
              <h3 className="text-base font-bold text-gray-900">
                Nearby Cottages in {cottage?.address?.city || "the Area"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Swipe to explore more handpicked stays
              </p>
            </div>

            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {nearbyCottages.map((cotItem) => (
                  <CarouselItem
                    key={cotItem._id}
                    className="pl-2.5 basis-[48%] sm:basis-1/3"
                  >
                    <div className="w-full">
                      <PropertyCard property={cotItem} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </section>

      {/* ALL AMENITIES DRAWER FOR MOBILE */}
      <Drawer
        open={showAllAmenitiesDrawer}
        onOpenChange={setShowAllAmenitiesDrawer}
      >
        <DrawerContent className="max-h-[85vh] h-[85vh] bg-white rounded-t-[28px] p-5 flex flex-col focus:outline-none">
          <DrawerTitle className="sr-only">All Amenities</DrawerTitle>
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mb-3 shrink-0" />
          <DrawerHeader className="p-0 border-b border-neutral-150 pb-3">
            <div className="text-base font-bold text-gray-900">
              All Amenities ({amenities.length})
            </div>
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

      {/* Cottage Details Mobile Drawer */}
      <CottageDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        cottage={selectedCottage}
        onSelectCottage={() => {
          setDrawerOpen(false);
          setShowCottageSelectionDrawer(true);
        }}
      />

      {/* Cottage Selection Mobile Drawer */}
      <CottageSelectionDrawer
        isOpen={showCottageSelectionDrawer}
        onClose={() => setShowCottageSelectionDrawer(false)}
        cottages={consolidatedCottages}
        totalGuests={selectedGuest?.totalGuests || 2}
        dateStr={checkin || new Date().toISOString()}
        id={cottage?._id}
      />
    </div>
  );
};

export default AllTabsContent;
