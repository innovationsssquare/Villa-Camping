"use client";
import React, { useState, useEffect, useMemo } from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HotelDetailsDrawer from "./HotelDetailsDrawer";
import RoomSelectionDrawer from "./RoomSelectionDrawer";
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
import { useHotel } from "@/lib/context/HotelContext";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import MobileEventsSection from "../Propertyviewcomponents/MobileEventsSection";
import {
  Hotel,
  Bed,
  Sparkles,
  Clock,
  Utensils,
  Coffee,
  CookingPot,
  MapPin,
  CheckCircle2,
  Users,
  Search,
  Wine,
  Soup,
} from "lucide-react";
import { Button } from "@heroui/react";
import { useSelector, useDispatch } from "react-redux";

const defaultHotelExperiences = [
  {
    title: "LUXURY",
    subtitle: "SUITES",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    title: "ROOFTOP",
    subtitle: "DINING",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  },
  {
    title: "WELLNESS &",
    subtitle: "SPA RETREAT",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
  },
  {
    title: "PANORAMIC",
    subtitle: "CITY VIEWS",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  },
];

const AllTabsContent = ({ refs = {} }) => {
  const hotel = useHotel();
  const dispatch = useDispatch();
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAllAmenitiesDrawer, setShowAllAmenitiesDrawer] = useState(false);
  const [amenitySearchQuery, setAmenitySearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showRoomSelectionDrawer, setShowRoomSelectionDrawer] = useState(false);
  const [nearbyHotels, setNearbyHotels] = useState([]);

  const { checkin, checkout, selectedGuest } = useSelector((state) => state.booking);
  const reduxSelectedRooms = useSelector((state) => state.booking.selectedRooms);

  const amenities = hotel?.amenities || [];

  // Consolidate rooms by unique roomType
  const consolidatedRooms = useMemo(() => {
    if (!Array.isArray(hotel?.rooms)) return [];
    const map = new Map();
    hotel.rooms.forEach((r, idx) => {
      const type = (r.roomType || r.name || `Room ${idx + 1}`).trim();
      const lower = type.toLowerCase();
      if (!map.has(lower)) {
        map.set(lower, {
          ...r,
          roomType: type,
          totalRooms: Number(r.totalRooms ?? r.totaltents ?? 1),
        });
      } else {
        const existing = map.get(lower);
        existing.totalRooms = (Number(existing.totalRooms) || 0) + Number(r.totalRooms ?? r.totaltents ?? 1);
      }
    });
    return Array.from(map.values());
  }, [hotel?.rooms]);

  // Fetch nearby hotels
  useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      if (!hotel) return;
      try {
        const res = await fetch(`${BaseUrl}/Hotel/get/hotels`);
        if (res.ok) {
          const data = await res.json();
          const others = list.filter((p) => {
            const isCurrent = String(p._id) === String(hotel?._id);
            const isApproved = p.isapproved === "approved";
            const isLive = p.isLive !== false;
            return !isCurrent && isApproved && isLive;
          });
          if (isMounted) {
            setNearbyHotels(others);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch nearby hotels:", err);
      }
    }
    fetchNearby();
    return () => {
      isMounted = false;
    };
  }, [hotel?._id]);

  // Categorize amenities
  const categorizedAmenities = {
    "Room Comforts": amenities.filter((a) =>
      /bed|mattress|linen|pillow|ac|heating|tv|wardrobe|safe|desk|curtain/i.test(a)
    ),
    "Bath & Wellness": amenities.filter((a) =>
      /bath|geyser|shower|towel|toilet|hairdryer|spa|jacuzzi|clean/i.test(a)
    ),
    "Hotel Facilities": amenities.filter((a) =>
      /elevator|lift|wifi|pool|gym|fitness|lounge|bar|restaurant|reception/i.test(a)
    ),
    "Dining & Services": amenities.filter((a) =>
      /breakfast|dining|room service|kettle|coffee|tea|minibar|laundry/i.test(a)
    ),
    "Safety & Security": amenities.filter((a) =>
      /security|cctv|keycard|parking|caretaker|first aid|fire|doctor/i.test(a)
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
            Hotel Highlights
          </h3>
          <p className="text-xs text-gray-500 mb-3">
            Premium hospitality and curated stay experiences
          </p>

          {/* Signature Experience Cards Carousel */}
          <div className="overflow-x-auto scrollbar-hide -mx-3.5 px-3.5 pb-2">
            <div className="flex space-x-3 w-max">
              {defaultHotelExperiences.map((exp, idx) => {
                const displayImg =
                  (hotel?.roomimages && hotel.roomimages[idx]) ||
                  (hotel?.images && hotel.images[idx]) ||
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

          {/* About Hotel Description Card */}
          <div className="bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-2.5 mt-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              About This Hotel
            </h4>
            <div className="relative">
              <p
                className={`text-xs text-gray-600 leading-relaxed ${
                  !expandedDescription ? "line-clamp-3" : ""
                }`}
              >
                {hotel?.description ||
                  "Experience elevated luxury, sophisticated rooms, attentive 24-hour service, and prime connectivity to the best dining and local attractions."}
              </p>
              {hotel?.description && hotel.description.length > 150 && (
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
            {hotel?.highlights?.thingsToDo?.length > 0 && (
              <div className="pt-2.5 border-t border-neutral-100">
                <span className="text-[10.5px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Things to do
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {hotel.highlights.thingsToDo.map((item, idx) => (
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
      <MobileEventsSection property={hotel} propertyType="hotel" />

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
                <span className="text-xs font-bold text-gray-900">{hotel?.checkInTime || "2:00 PM"}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Check-out</span>
                <span className="text-xs font-bold text-gray-900">{hotel?.checkOutTime || "11:00 AM"}</span>
              </div>
            </div>

            {/* Hotel Rules */}
            {hotel?.HouseRules && hotel.HouseRules.length > 0 && (
              <div className="pt-2 border-t border-neutral-100">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Hotel Policies & Guidelines
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {hotel.HouseRules.map((rule, idx) => (
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

      {/* 3. SPACES & ROOMS SECTION */}
      <section
        ref={refs?.spacesRef}
        id="spaces"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Available Rooms & Suites
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Select your room category and quantity
          </p>

          {consolidatedRooms.length > 0 ? (
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {consolidatedRooms.map((roomItem, idx) => {
                  const rKey = roomItem.roomType || roomItem._id || `room-${idx}`;
                  const currentSelectedQty = reduxSelectedRooms?.[rKey]?.quantity || 0;
                  const roomPrice = Number(
                    roomItem.pricing?.weekdayPrice ||
                    roomItem.price ||
                    hotel?.pricing?.weekdayPrice ||
                    2800
                  );
                  const unitCount =
                    roomItem.totalRooms ||
                    roomItem.totaltents ||
                    1;
                  const rImages =
                    roomItem.roomimages || roomItem.images || hotel?.images || ["/placeholder.svg"];

                  return (
                    <CarouselItem
                      key={roomItem._id || idx}
                      className="pl-2.5 basis-[48%] sm:basis-1/3"
                    >
                      <div className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-xs transition-all h-full flex flex-col justify-between select-none">
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedRoom(roomItem);
                            setDrawerOpen(true);
                          }}
                        >
                          <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden">
                            <Image
                              src={rImages[0] || "/placeholder.svg"}
                              alt={roomItem.roomType || "Room"}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            <div className="absolute top-1.5 left-1.5 bg-white/95 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-bold text-gray-900 shadow-xs border border-black/5 flex items-center gap-1">
                              <Hotel className="w-2.5 h-2.5 text-[#ff6900]" />
                              <span className="truncate max-w-[75px]">{roomItem.roomType || "Room"}</span>
                            </div>
                            <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded-full text-[9px] font-semibold text-white">
                              {unitCount} Available
                            </div>
                          </div>

                          <div className="p-2 space-y-1">
                            <h4 className="text-xs font-bold text-gray-900 truncate">
                              {roomItem.roomType || "Room / Suite"}
                            </h4>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Users className="w-3 h-3 text-[#ff6900] shrink-0" />
                              <span className="truncate">Up to {roomItem.maxCapacity || 2} Guests</span>
                            </div>
                            <div className="pt-0.5 flex items-baseline gap-1">
                              <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                                ₹{roomPrice.toLocaleString()}
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
                                setSelectedRoom(roomItem);
                                setDrawerOpen(true);
                              }}
                              className="w-full py-1 text-[10px] font-semibold text-gray-700 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 rounded-lg transition-colors text-center cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowRoomSelectionDrawer(true);
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
            <p className="text-xs text-gray-400">Rooms information will be available shortly.</p>
          )}
        </div>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section
        ref={refs?.reviewsRef}
        id="reviews"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <ReviewsTab Reviews={hotel?.reviews} />
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

      {/* 6. DINING & RESTAURANT SECTION */}
      <section
        ref={refs?.diningRef}
        id="dining"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-1 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Dining & In-House Restaurant
          </h3>
          <p className="text-xs text-gray-500 mb-3 pl-3">
            Culinary excellence with multi-cuisine dining options
          </p>

          <div className="space-y-3">
            {/* When Meals are Paid */}
            {(Number(hotel?.foodOptions?.adultPrice || 0) > 0 || Number(hotel?.foodOptions?.childPrice || 0) > 0) ? (
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
                        ₹{Number(hotel.foodOptions.adultPrice || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-gray-400 block">/adult/day</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Includes multi-cuisine dining prepared by our hotel chefs with veg & non-veg culinary specialties.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-600">
                    <span>✓ Buffet Spread</span>
                    <span>•</span>
                    <span>✓ Multi-Cuisine</span>
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
                      {Number(hotel?.foodOptions?.childPrice || 0) > 0 ? (
                        <>
                          <span className="font-extrabold text-gray-900 text-base">
                            ₹{Number(hotel.foodOptions.childPrice).toLocaleString("en-IN")}
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
                    Tailored kid-friendly preparations with mild spices and freshly made comfort meals.
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
                  Wholesome culinary options and morning breakfast provided with your reservation.
                </p>
              </div>
            )}

            {/* Dynamic Available Course Schedule in Grid */}
            {Array.isArray(hotel?.foodOptions?.available) && hotel.foodOptions.available.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {hotel.foodOptions.available.includes("Breakfast") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Coffee className="w-3 h-3" /> Buffet Breakfast
                    </span>
                    <p className="text-xs font-bold text-gray-800">7:00 AM – 10:30 AM</p>
                  </div>
                )}
                {hotel.foodOptions.available.includes("Lunch") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Lunch Buffet
                    </span>
                    <p className="text-xs font-bold text-gray-800">12:30 PM – 3:30 PM</p>
                  </div>
                )}
                {hotel.foodOptions.available.includes("High Tea") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Soup className="w-3 h-3" /> Evening Tea & Bites
                    </span>
                    <p className="text-xs font-bold text-gray-800">5:00 PM – 6:30 PM</p>
                  </div>
                )}
                {hotel.foodOptions.available.includes("Dinner") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Wine className="w-3 h-3" /> Dinner Buffet
                    </span>
                    <p className="text-xs font-bold text-gray-800">7:30 PM – 10:30 PM</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-3 border border-neutral-200/80 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                  <Wine className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900">In-Room & Restaurant Dining</h4>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    Multi-cuisine fresh meals and room service available throughout the day.
                  </p>
                </div>
              </div>
            )}

            {hotel?.foodOptions?.note && (
              <p className="text-[11px] text-gray-500 bg-neutral-50 p-3 rounded-xl border border-neutral-200/70 leading-relaxed">
                ℹ {hotel.foodOptions.note}
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
              <GoogleMap coordinates={hotel?.coordinates} />
            </div>
            <div className="p-3.5 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Address</span>
                <p className="text-xs font-semibold text-gray-800 mt-0.5">
                  {hotel?.address?.addressLine}, {hotel?.address?.area}, {hotel?.address?.city}
                </p>
              </div>

              {hotel?.nearbyattractions && hotel.nearbyattractions.length > 0 && (
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Nearby Attractions
                  </span>
                  <div className="space-y-1.5">
                    {hotel.nearbyattractions.map((loc, index) => (
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
        <ExperiencesTab experiences={hotel?.experiences} />
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
            {hotel?.faqs && hotel.faqs.length > 0 ? (
              hotel.faqs.map((faq, index) => (
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
                    Check-in starts at {hotel?.checkInTime || "2:00 PM"} and check-out is by {hotel?.checkOutTime || "11:00 AM"}. Early check-in is subject to availability.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="faq-2"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    Is parking and high-speed Wi-Fi provided?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Yes, complimentary guest parking and high-speed wireless internet are provided throughout the hotel.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Explore Your Stay Accordion */}
        {hotel?.exploreStay && hotel.exploreStay.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Explore Your Stay
            </h4>
            <Accordion type="single" collapsible className="space-y-2">
              {hotel.exploreStay.map((item, index) => (
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

        {/* 10. NEARBY HOTELS CAROUSEL: 2 CARDS PER VIEW ON MOBILE */}
        {nearbyHotels.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-200/80">
            <div className="mb-3 border-l-4 border-[#ff6900] pl-2.5">
              <h3 className="text-base font-bold text-gray-900">
                Nearby Hotels in {hotel?.address?.city || "the Area"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Swipe to explore more handpicked stays
              </p>
            </div>

            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {nearbyHotels.map((hotelItem) => (
                  <CarouselItem
                    key={hotelItem._id}
                    className="pl-2.5 basis-[48%] sm:basis-1/3"
                  >
                    <div className="w-full">
                      <PropertyCard property={hotelItem} />
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

      {/* Hotel Room Details Mobile Drawer */}
      <HotelDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        room={selectedRoom}
        onSelectRoom={() => {
          setDrawerOpen(false);
          setShowRoomSelectionDrawer(true);
        }}
      />

      {/* Hotel Room Selection Mobile Drawer */}
      <RoomSelectionDrawer
        isOpen={showRoomSelectionDrawer}
        onClose={() => setShowRoomSelectionDrawer(false)}
        rooms={consolidatedRooms}
        totalGuests={selectedGuest?.totalGuests || 2}
        dateStr={checkin || new Date().toISOString()}
        id={hotel?._id}
      />
    </div>
  );
};

export default AllTabsContent;
