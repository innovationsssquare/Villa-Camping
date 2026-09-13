"use client";
import React, { useState, useEffect } from "react";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import GoogleMap from "../Propertyviewcomponents/google-map";
import ReviewsTab from "./ReviewsTab";
import ExperiencesTab from "./ExperiencesTab";
import { useVilla } from "@/lib/context/VillaContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import MobileEventsSection from "../Propertyviewcomponents/MobileEventsSection";
import {
  Trees,
  Bed,
  Sofa,
  Waves,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Compass,
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
} from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@heroui/react";

// Signature experience cards matching desktop
const defaultSignatureExperiences = [
  {
    title: "FULLY-SERVICED",
    subtitle: "VILLAS",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    title: "CURATED",
    subtitle: "DINING",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    title: "SCENIC",
    subtitle: "PANORAMA",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
  {
    title: "PREMIUM",
    subtitle: "INTERIORS",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
];

// Helper to determine icon & category label for spaces
function getSpaceCategory(name = "", desc = "") {
  const text = `${name} ${desc}`.toLowerCase();
  if (
    text.includes("outdoor") ||
    text.includes("terrace") ||
    text.includes("garden") ||
    text.includes("lawn") ||
    text.includes("balcony") ||
    text.includes("patio")
  ) {
    return {
      category: "Outdoor & Nature",
      icon: Trees,
      defaultFeatures: ["Open-Air Setting", "Scenic Views", "Relaxation Seating"],
    };
  }
  if (
    text.includes("pool") ||
    text.includes("swim") ||
    text.includes("water") ||
    text.includes("deck")
  ) {
    return {
      category: "Pool & Deck",
      icon: Waves,
      defaultFeatures: ["Private Swimming Pool", "Sun Loungers", "Deck Area"],
    };
  }
  if (
    text.includes("bed") ||
    text.includes("room") ||
    text.includes("suite") ||
    text.includes("master")
  ) {
    return {
      category: "Bedrooms & Suites",
      icon: Bed,
      defaultFeatures: ["Air Conditioned", "Attached Ensuite Bath", "Plush Linens"],
    };
  }
  if (
    text.includes("living") ||
    text.includes("lounge") ||
    text.includes("hall") ||
    text.includes("sitting")
  ) {
    return {
      category: "Living & Lounge",
      icon: Sofa,
      defaultFeatures: ["Spacious Lounge", "Smart TV & Sound", "Cozy Ambience"],
    };
  }
  if (
    text.includes("kitchen") ||
    text.includes("dining") ||
    text.includes("bar")
  ) {
    return {
      category: "Kitchen & Dining",
      icon: UtensilsCrossed,
      defaultFeatures: ["Dining Table", "Cookware & Cutlery", "Chef Service Access"],
    };
  }
  return {
    category: "Living Area",
    icon: Sparkles,
    defaultFeatures: ["Well-Maintained", "Natural Light", "Modern Furnishings"],
  };
}

const AllTabsContent = ({ refs }) => {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const villa = useVilla();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [spacesApi, setSpacesApi] = useState();
  const [spacesCurrent, setSpacesCurrent] = useState(1);
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(null);
  const [nearbyVillas, setNearbyVillas] = useState([]);

  // Fetch nearby villas from backend with location/city matching
  useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      if (!villa) return;
      try {
        const queryCity = (villa?.address?.city || "").trim().toLowerCase();
        const villaLocationId = String(villa?.location?._id || villa?.location || "");

        const res = await fetch(`${BaseUrl}/Villa/get/villas`);
        if (res.ok) {
          const data = await res.json();
          const list =
            data?.data ||
            data?.properties ||
            (Array.isArray(data) ? data : []);

          const otherVillas = list.filter(
            (p) => String(p._id) !== String(villa?._id)
          );

          if (otherVillas.length > 0) {
            const matched = otherVillas.filter((p) => {
              const pCity = (p?.address?.city || "").trim().toLowerCase();
              const pLoc = String(p?.location?._id || p?.location || "");
              const isCityMatch =
                queryCity &&
                pCity &&
                (pCity.includes(queryCity.slice(0, 4)) ||
                  queryCity.includes(pCity.slice(0, 4)));
              const isLocMatch =
                villaLocationId && pLoc && pLoc === villaLocationId;
              return isCityMatch || isLocMatch;
            });

            const candidates =
              matched.length >= 2
                ? matched
                : [
                    ...matched,
                    ...otherVillas.filter(
                      (ov) => !matched.some((m) => String(m._id) === String(ov._id))
                    ),
                  ];

            const formatted = candidates.map((p) => ({
              ...p,
              rating: p.averageRating && p.averageRating > 0 ? p.averageRating : 4.9,
              tags:
                p.tags && p.tags.length > 0
                  ? p.tags
                  : ["Guest favourite", "Trending"],
              category: p.category || { name: "Villa" },
            }));

            if (isMounted && formatted.length > 0) {
              setNearbyVillas(formatted.slice(0, 6));
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching nearby in mobile:", err);
      }

      // High quality fallback matching destination
      if (isMounted) {
        setNearbyVillas([
          {
            _id: "nearby-villa-1",
            name: `Panorama @ Golden Bliss - ${villa?.address?.city || "Lonavala"}`,
            address: { city: villa?.address?.city || "Lonavala" },
            images: [
              villa?.images?.[1] ||
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
              villa?.images?.[2] ||
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
            ],
            pricing: {
              weekendPrice: Math.round(
                (Number(villa?.pricing?.weekendPrice) || 16000) * 0.95
              ),
              weekdayPrice: Math.round(
                (Number(villa?.pricing?.weekdayPrice) || 14000) * 0.95
              ),
            },
            rating: 4.9,
            tags: ["Guest favourite", "Trending"],
          },
          {
            _id: "nearby-villa-2",
            name: `Mist & Meadows Retreat - ${villa?.address?.city || "Lonavala"}`,
            address: { city: villa?.address?.city || "Lonavala" },
            images: [
              villa?.images?.[2] ||
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
              villa?.images?.[3] ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
            ],
            pricing: {
              weekendPrice: Math.round(
                (Number(villa?.pricing?.weekendPrice) || 16000) * 1.08
              ),
              weekdayPrice: Math.round(
                (Number(villa?.pricing?.weekdayPrice) || 14000) * 1.08
              ),
            },
            rating: 4.85,
            tags: ["Guest favourite", "Pool Villa"],
          },
        ]);
      }
    }
    fetchNearby();
    return () => {
      isMounted = false;
    };
  }, [villa]);

  // Track active space in carousel
  useEffect(() => {
    if (!spacesApi) return;
    setSpacesCurrent(spacesApi.selectedScrollSnap() + 1);
    spacesApi.on("select", () => {
      setSpacesCurrent(spacesApi.selectedScrollSnap() + 1);
    });
  }, [spacesApi]);

  const amenities = villa?.amenities || [];
  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 8);

  const spaces = villa?.spaces || [];
  const currentModalSpace =
    selectedSpaceIndex !== null ? spaces[selectedSpaceIndex] : null;

  return (
    <div className="pb-28">
      {/* 1. HIGHLIGHTS SECTION */}
      <section
        ref={refs.highlightsRef}
        id="highlights"
        className="p-3.5 space-y-6 scroll-mt-16"
      >
        {/* The Villacamp Signature Experience Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
              The Villacamp Experience
            </h3>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-3">
              {defaultSignatureExperiences.map((exp, idx) => (
                <CarouselItem key={idx} className="pl-3 basis-[58%] sm:basis-1/3">
                  <div className="relative rounded-2xl overflow-hidden shadow-xs border border-neutral-200/80">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      width={320}
                      height={200}
                      className="w-full h-32 object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end justify-center pb-3">
                      <div className="text-center text-white">
                        <h4 className="text-xs font-black tracking-wider">
                          {exp.title}
                        </h4>
                        <p className="text-[10px] text-gray-200 font-medium tracking-widest">
                          {exp.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Custom Highlights from Schema */}
        {villa?.highlights && villa.highlights.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ff6900]" />
              Special Villa Highlights
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {villa.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-neutral-50/80 border border-neutral-200/70 rounded-xl"
                >
                  {item.image && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title || "Highlight"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-gray-900 truncate">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-gray-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Villa Description & Story */}
        <div className="space-y-2">
          <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            {villa?.name}
          </h3>
          <p className="text-gray-600 text-xs leading-relaxed">
            {expandedDescription
              ? villa?.description
              : `${(villa?.description || "").slice(0, 190)}...`}
          </p>
          <button
            onClick={() => setExpandedDescription(!expandedDescription)}
            className="text-[#ff6900] font-bold text-xs underline cursor-pointer inline-block"
          >
            {expandedDescription ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Great For Feature Chips from Schema */}
        {villa?.greatFor && villa.greatFor.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {villa.greatFor.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-50/80 text-[#ff6900] border border-orange-200/80"
              >
                ✦ {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons: View Brochure Drawer */}
        <div className="flex space-x-3 pt-1">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-transform cursor-pointer">
                View Brochure
              </button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle className="text-base font-bold text-gray-900">
                  {villa?.name} — Property Factsheet
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4 overflow-y-auto">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/70 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#ff6900]">
                    Property Snapshot
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                    <div>
                      • <strong>BHK:</strong> {villa?.bhkType || "4BHK"}
                    </div>
                    <div>
                      • <strong>Capacity:</strong> Up to {villa?.maxCapacity || 10} Guests
                    </div>
                    <div>
                      • <strong>Bedrooms:</strong> {Array.isArray(villa?.rooms) ? villa.rooms.length : (typeof villa?.rooms === "number" || typeof villa?.rooms === "string" ? villa.rooms : 4)} Rooms
                    </div>
                    <div>
                      • <strong>Bathrooms:</strong> {typeof villa?.baths === "number" || typeof villa?.baths === "string" ? villa.baths : 4} Baths
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200/70 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900">
                    Key Features
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Private Swimming Pool with Sun Deck</li>
                    <li>• Dedicated In-House Chef & Butler</li>
                    <li>• Lush Garden with Outdoor Seating</li>
                    <li>• Full Power Generator Backup & High-Speed Wi-Fi</li>
                  </ul>
                </div>

                {villa?.brochure && (
                  <a
                    href={villa.brochure}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#ff6900] text-white py-2.5 rounded-xl font-bold text-xs shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Official PDF
                  </a>
                )}
              </div>
            </DrawerContent>
          </Drawer>

          <a
            href="#faqs"
            className="bg-neutral-100 hover:bg-neutral-200 text-gray-800 border border-neutral-200/80 px-5 py-2 rounded-xl text-xs font-semibold transition-colors inline-flex items-center"
          >
            FAQ&apos;s
          </a>
        </div>
      </section>

      {/* EVENTS SECTION */}
      <MobileEventsSection property={villa} propertyType="villa" />

      {/* 2. RULES & REFUND POLICY SECTION */}
      <section
        ref={refs.refundRef}
        id="refund-policy"
        className="p-3.5 space-y-6 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Rules and Refund Policy
          </h3>

          {/* 4 Quick Specs Cards (2x2 Grid on Mobile) */}
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <div className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#ff6900]" /> Check-In
              </span>
              <p className="text-sm font-extrabold text-gray-900">
                {villa?.checkInTime || "1:00 PM"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#ff6900]" /> Check-Out
              </span>
              <p className="text-sm font-extrabold text-gray-900">
                {villa?.checkOutTime || "11:00 AM"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#ff6900]" /> Security Deposit
              </span>
              <p className="text-sm font-extrabold text-gray-900">
                ₹{(villa?.securityDeposit || 3000).toLocaleString("en-IN")}
              </p>
              <span className="text-[9px] text-gray-400 block">100% Refundable</span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-neutral-200/80 shadow-2xs space-y-0.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Receipt className="w-3 h-3 text-[#ff6900]" /> Late Checkout
              </span>
              <p className="text-sm font-extrabold text-gray-900">
                ₹{(villa?.lateCheckoutCharge || 1000).toLocaleString("en-IN")}/hr
              </p>
              <span className="text-[9px] text-gray-400 block">Subject to slot</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Cancellation Policy */}
            <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200/70">
              <h4 className="font-bold mb-2 text-gray-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]"></span>
                Cancellation Policy
              </h4>
              <ul className="space-y-1.5 text-gray-600">
                {villa?.cancellationPolicy && villa.cancellationPolicy.length > 0 ? (
                  villa.cancellationPolicy.map((policy, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-[#ff6900] font-bold">•</span>
                      <span>{policy}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li>• Free cancellation up to 7 days before check-in.</li>
                    <li>• 50% refund for cancellations between 7 and 2 days before check-in.</li>
                    <li>• Non-refundable within 48 hours of scheduled arrival.</li>
                  </>
                )}
              </ul>
            </div>

            {/* House Rules */}
            <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200/70">
              <h4 className="font-bold mb-2 text-gray-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]"></span>
                House Rules
              </h4>
              <ul className="space-y-1.5 text-gray-600">
                {villa?.houseRules && villa.houseRules.length > 0 ? (
                  villa.houseRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-[#ff6900] font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li>• Smoking allowed only in outdoor patio/lawn areas.</li>
                    <li>• Quiet hours observed between 10:00 PM and 8:00 AM.</li>
                    <li>• Valid government photo ID required for all adult guests at check-in.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Payment Terms */}
            <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200/70">
              <h4 className="font-bold mb-2 text-gray-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]"></span>
                Payment Terms
              </h4>
              <ul className="space-y-1.5 text-gray-600">
                {villa?.paymentTerms && villa.paymentTerms.length > 0 ? (
                  villa.paymentTerms.map((term, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                      <span className="text-[#ff6900] font-bold">•</span>
                      <span>{term}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li>• 50% advance to confirm your dates.</li>
                    <li>• Remaining balance due 2 days prior to check-in.</li>
                    <li>• Security deposit collected upon arrival.</li>
                  </>
                )}
              </ul>
            </div>

            {/* Kitchen Policy */}
            <div className="bg-neutral-50/80 p-3.5 rounded-xl border border-neutral-200/70">
              <h4 className="font-bold mb-2 text-gray-900 flex items-center gap-1.5">
                <CookingPot className="w-3.5 h-3.5 text-[#ff6900]" />
                Kitchen & Self-Cooking Guidelines
              </h4>
              <p className="text-gray-600 leading-relaxed">
                Self-cooking kitchen access is available at ₹{(villa?.kitchenCharge || 1000).toLocaleString("en-IN")}/day. In-house chef preparation is also available for authentic hot regional meals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SPACES SECTION */}
      <section
        ref={refs.spacesRef}
        id="spaces"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Spaces & Living Areas
          </h3>
          {spaces.length > 0 && (
            <span className="text-xs text-gray-400 font-semibold">
              {spacesCurrent} of {spaces.length}
            </span>
          )}
        </div>

        {spaces.length > 0 ? (
          <Carousel className="w-full" setApi={setSpacesApi}>
            <CarouselContent className="-ml-3">
              {spaces.map((space, idx) => {
                const { category, icon: IconComponent, defaultFeatures } =
                  getSpaceCategory(space.name, space.description);
                const features =
                  space.details && space.details.length > 0
                    ? space.details
                    : defaultFeatures;

                return (
                  <CarouselItem
                    key={space._id || idx}
                    className="pl-3 basis-[85%] sm:basis-1/2"
                  >
                    <div className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs flex flex-col h-full">
                      {/* Image container */}
                      <div
                        onClick={() => setSelectedSpaceIndex(idx)}
                        className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 cursor-pointer group"
                      >
                        <Image
                          src={space.image || "/placeholder.svg"}
                          alt={space.name || "Space"}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-2xs">
                            <IconComponent className="w-3 h-3 text-[#ff6900]" />
                            <span>{category}</span>
                          </span>
                        </div>

                        {/* View Photo Prompt */}
                        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[10px] font-bold flex items-center gap-1">
                          <span>View Photo</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">
                            {space.name}
                          </h4>
                          {space.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {space.description}
                            </p>
                          )}
                        </div>

                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {features.slice(0, 3).map((f, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-700"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        ) : (
          <p className="text-xs text-gray-400">No space layouts available.</p>
        )}

        {/* Space Lightbox Dialog */}
        <Dialog
          open={selectedSpaceIndex !== null}
          onOpenChange={(open) => !open && setSelectedSpaceIndex(null)}
        >
          <DialogContent className="max-w-md p-0 overflow-hidden bg-white rounded-2xl border-0">
            <DialogHeader className="p-4 pb-2">
              <DialogTitle className="text-sm font-bold text-gray-900 flex items-center justify-between">
                <span>{currentModalSpace?.name || "Space Photo"}</span>
                <span className="text-xs text-gray-400">
                  {selectedSpaceIndex !== null ? selectedSpaceIndex + 1 : 1} of{" "}
                  {spaces.length}
                </span>
              </DialogTitle>
            </DialogHeader>

            {currentModalSpace && (
              <div>
                <div className="relative aspect-[4/3] w-full bg-neutral-900">
                  <Image
                    src={currentModalSpace.image || "/placeholder.svg"}
                    alt={currentModalSpace.name || "Space"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {currentModalSpace.description}
                  </p>
                  <div className="flex justify-between items-center pt-2">
                    <button
                      type="button"
                      disabled={selectedSpaceIndex === 0}
                      onClick={() =>
                        setSelectedSpaceIndex((prev) => Math.max(0, prev - 1))
                      }
                      className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold disabled:opacity-30 cursor-pointer"
                    >
                      ← Previous
                    </button>
                    <button
                      type="button"
                      disabled={selectedSpaceIndex === spaces.length - 1}
                      onClick={() =>
                        setSelectedSpaceIndex((prev) =>
                          Math.min(spaces.length - 1, prev + 1)
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-[#ff6900] text-white text-xs font-semibold disabled:opacity-30 cursor-pointer"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* 4. REVIEWS SECTION */}
      <section
        ref={refs.reviewsRef}
        id="reviews"
        className="scroll-mt-16 border-t border-neutral-100"
      >
        <ReviewsTab Reviews={villa?.reviews || []} />
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
              Villa Amenities
            </h3>
            {amenities.length > 8 && (
              <span className="text-xs font-bold text-[#ff6900]">
                {amenities.length} Total
              </span>
            )}
          </div>

          {/* Top Amenities Highlight Pill Bar */}
          {villa?.topamenities && villa.topamenities.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6900] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Top Amenities:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {villa.topamenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-gray-800 border border-orange-200"
                  >
                    ✓ {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 2-Column Amenities Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {displayedAmenities.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-2.5 p-2.5 bg-neutral-50 border border-neutral-200/70 rounded-xl"
              >
                <div className="w-8 h-8 bg-white rounded-lg border border-neutral-200/80 flex items-center justify-center flex-shrink-0 text-[#ff6900] shadow-2xs">
                  <CustomAmenityIcon
                    name={amenity}
                    className="w-4 h-4 text-[#ff6900]"
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {amenity}
                </span>
              </div>
            ))}
          </div>

          {/* Toggle All Amenities */}
          {amenities.length > 8 && (
            <div className="flex justify-center mt-3.5">
              <button
                type="button"
                onClick={() => setShowAllAmenities(!showAllAmenities)}
                className="bg-orange-50 text-[#ff6900] border border-orange-200 font-bold text-xs px-5 py-2 rounded-xl cursor-pointer"
              >
                {showAllAmenities
                  ? "Show Less"
                  : `Show all ${amenities.length} amenities`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 6. MEALS SECTION */}
      <section
        ref={refs?.mealsRef}
        id="meals"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Meals & Dining Experience
          </h3>

          <div className="space-y-3">
            {/* When Meals are Paid */}
            {(Number(villa?.foodOptions?.adultPrice || 0) > 0 || Number(villa?.foodOptions?.childPrice || 0) > 0) ? (
              <>
                {/* Adult Meal Plan */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-white to-orange-50/40 border border-orange-200 shadow-2xs space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6900]">
                        Gourmet Spread
                      </span>
                      <h4 className="font-bold text-sm text-gray-900">
                        Adult Meal Package
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-[#ff6900] text-base">
                        ₹{Number(villa.foodOptions.adultPrice || 0).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-gray-400 block">/adult/day</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Includes full course breakfast, regional lunch, evening high-tea & snacks, and gourmet dinner prepared by our chef.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-semibold text-emerald-600">
                    <span>✓ Veg & Non-Veg</span>
                    <span>•</span>
                    <span>✓ Jain Available</span>
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
                      {Number(villa?.foodOptions?.childPrice || 0) > 0 ? (
                        <>
                          <span className="font-extrabold text-gray-900 text-base">
                            ₹{Number(villa.foodOptions.childPrice).toLocaleString("en-IN")}
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
                    Mild, kid-friendly comfort preparations, fresh rotis, warm milk, and snacks.
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
                  Delicious home-style vegetarian & non-vegetarian culinary options prepared fresh on-site.
                </p>
              </div>
            )}

            {/* Dynamic Available Course Schedule in Grid */}
            {Array.isArray(villa?.foodOptions?.available) && villa.foodOptions.available.length > 0 && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {villa.foodOptions.available.includes("Breakfast") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Coffee className="w-3 h-3" /> Breakfast
                    </span>
                    <p className="text-xs font-bold text-gray-800">8:30 AM – 10:30 AM</p>
                  </div>
                )}
                {villa.foodOptions.available.includes("Lunch") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Utensils className="w-3 h-3" /> Lunch
                    </span>
                    <p className="text-xs font-bold text-gray-800">1:00 PM – 3:00 PM</p>
                  </div>
                )}
                {villa.foodOptions.available.includes("High Tea") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Soup className="w-3 h-3" /> High Tea
                    </span>
                    <p className="text-xs font-bold text-gray-800">5:00 PM – 6:30 PM</p>
                  </div>
                )}
                {villa.foodOptions.available.includes("Dinner") && (
                  <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#ff6900] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Dinner
                    </span>
                    <p className="text-xs font-bold text-gray-800">8:30 PM – 10:30 PM</p>
                  </div>
                )}
              </div>
            )}

            {villa?.foodOptions?.note && (
              <p className="text-[11px] text-gray-500 bg-neutral-50 p-3 rounded-xl border border-neutral-200/70 leading-relaxed">
                ℹ {villa.foodOptions.note}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 7. LOCATION SECTION */}
      <section
        ref={refs.locationRef}
        id="location"
        className="p-3.5 space-y-4 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Location & Surroundings
          </h3>

          <div className="bg-white border border-neutral-200/80 p-2 rounded-2xl shadow-2xs mb-4">
            <GoogleMap coordinates={villa?.coordinates} className="w-full h-52 rounded-xl" />
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <FaMapMarkerAlt className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Full Property Address</span>
              </div>
              <p className="text-xs text-gray-600 pl-5">
                {villa?.address?.addressLine ? `${villa.address.addressLine}, ` : ""}
                {villa?.address?.area ? `${villa.address.area}, ` : ""}
                {villa?.address?.city || "Destination"}
              </p>
            </div>

            {villa?.nearbyattractions && villa.nearbyattractions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#ff6900]" />
                  Nearby Sightseeing Distances
                </h4>
                <div className="grid grid-cols-1 gap-1.5">
                  {villa.nearbyattractions.map((loc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200/70 text-xs text-gray-800"
                    >
                      <span className="truncate">• {loc?.nearbylocation}</span>
                      <span className="text-[#ff6900] font-bold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 flex-shrink-0 text-[11px]">
                        {loc?.distance} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 8. EXPERIENCES SECTION */}
      <section
        ref={refs.experiencesRef}
        id="experiences"
        className="scroll-mt-16 border-t border-neutral-100"
      >
        <ExperiencesTab experiences={villa?.experiences || []} />
      </section>

      {/* 9. FAQS & NEARBY VILLAS SECTION */}
      <section
        ref={refs.faqsRef}
        id="faqs"
        className="p-3.5 space-y-6 scroll-mt-16 border-t border-neutral-100"
      >
        <div>
          <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
            Frequently Asked Questions
          </h3>

          <Accordion type="single" collapsible className="space-y-2.5">
            {villa?.faqs && villa.faqs.length > 0 ? (
              villa.faqs.map((faq, index) => (
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
                    Check-in is from {villa?.checkInTime || "1:00 PM"} and check-out is by {villa?.checkOutTime || "11:00 AM"}. Early check-in or late checkout is subject to villa availability.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-2"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    Is the swimming pool private?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Yes, the pool and outdoor grounds are completely private and exclusive to your group.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-3"
                  className="bg-white border border-neutral-200/80 rounded-xl px-4 shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-xs text-gray-900 py-3 text-left">
                    Are meals provided on-site?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-600 leading-relaxed pb-3">
                    Yes! Our in-house chef prepares customized home-cooked meals (Veg, Non-Veg, Jain). Gourmet all-day meal plans are available at ₹{(villa?.foodOptions?.adultPrice || 1200).toLocaleString("en-IN")}/adult/day.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Explore Your Stay Accordion */}
        {villa?.exploreStay && villa.exploreStay.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
              Explore Your Stay
            </h3>
            <Accordion type="single" collapsible className="space-y-2">
              {villa.exploreStay.map((item, index) => (
                <AccordionItem
                  key={item._id || index}
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

        {/* NEARBY VILLAS: SWIPEABLE CAROUSEL WITH 2 CARDS PER VIEW */}
        {nearbyVillas.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200/80">
            <div className="mb-3.5 border-l-4 border-[#ff6900] pl-2.5">
              <h3 className="text-base font-bold text-gray-900">
                Nearby Stays in {villa?.location?.name || villa?.address?.city || "Lonavala"}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Swipe to explore more handpicked stays in this area
              </p>
            </div>

            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2.5">
                {nearbyVillas.map((villaItem) => (
                  <CarouselItem
                    key={villaItem._id}
                    className="pl-2.5 basis-[48%] sm:basis-1/3"
                  >
                    <div className="w-full">
                      <PropertyCard property={villaItem} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        )}
      </section>
    </div>
  );
};

export default AllTabsContent;
