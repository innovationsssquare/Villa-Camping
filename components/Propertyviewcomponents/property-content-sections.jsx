"use client";

import { useState, useMemo, useEffect } from "react";
import {
  FaStar,
  FaMapMarkerAlt,
  FaAward,
  FaUtensils,
  FaClock,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import GoogleMap from "./google-map";
import { useVilla } from "@/lib/context/VillaContext";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import Image from "next/image";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import {
  Trees,
  Bed,
  Sofa,
  Waves,
  UtensilsCrossed,
  Sparkles,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Compass,
  Star,
  Check,
  ExternalLink,
  Clock,
  ShieldCheck,
  FileText,
  Utensils,
  Coffee,
  Soup,
  HeartHandshake,
  MapPin,
  Car,
  Info,
  Calendar,
  DollarSign,
  AlertCircle,
  ThumbsUp,
  HelpCircle,
  Share2,
  Search,
  Flame,
  Wine,
  Shield,
  Download,
  CheckCircle2,
  ChevronDown,
  Sparkle,
  CookingPot,
  Receipt,
  Heart,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Helper to determine icon & category label based on space name or description
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
      defaultFeatures: ["Swimming Area", "Sun Loungers", "Poolside Vibe"],
    };
  }
  if (
    text.includes("bed") ||
    text.includes("bedroom") ||
    text.includes("suite") ||
    text.includes("room")
  ) {
    return {
      category: "Bedrooms & Suites",
      icon: Bed,
      defaultFeatures: ["Plush Bedding", "Air Conditioning", "Quiet Ambiance"],
    };
  }
  if (
    text.includes("living") ||
    text.includes("lounge") ||
    text.includes("hall") ||
    text.includes("drawing")
  ) {
    return {
      category: "Living & Lounge",
      icon: Sofa,
      defaultFeatures: ["Spacious Seating", "Entertainment", "Cozy Ambience"],
    };
  }
  if (
    text.includes("dining") ||
    text.includes("kitchen") ||
    text.includes("cook") ||
    text.includes("food")
  ) {
    return {
      category: "Dining & Kitchen",
      icon: UtensilsCrossed,
      defaultFeatures: ["Dining Table", "Serving Essentials", "Warm Hospitality"],
    };
  }
  return {
    category: "Featured Space",
    icon: Sparkles,
    defaultFeatures: ["Well-Appointed", "Private Access", "Scenic Surroundings"],
  };
}

const REVIEW_FILTER_CATEGORIES = [
  "All",
  "Amenities",
  "Stay",
  "Food",
  "Service",
  "View",
];
const REVIEW_SORT_OPTIONS = ["Most Popular", "Most Recent"];

export default function PropertyContentSections() {
  const villa = useVilla();

  // State for Highlights
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [brochureOpen, setBrochureOpen] = useState(false);

  // State for Spaces
  const [selectedSpaceIndex, setSelectedSpaceIndex] = useState(null);

  // State for Reviews (incorporating mobile ReviewsTab logic)
  const [activeReviewFilter, setActiveReviewFilter] = useState("All");
  const [activeReviewSort, setActiveReviewSort] = useState("Most Popular");
  const [allReviewsOpen, setAllReviewsOpen] = useState(false);
  const [previewReviewImage, setPreviewReviewImage] = useState(null);

  // State for Amenities
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [allAmenitiesDialogOpen, setAllAmenitiesDialogOpen] = useState(false);

  // State for Nearby Villas (in FAQ section)
  const [nearbyVillas, setNearbyVillas] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchNearbyVillas() {
      if (!villa) return;
      setLoadingNearby(true);
      try {
        const queryCity = (villa?.address?.city || "").trim().toLowerCase();
        const villaLocationId = String(villa?.location?._id || villa?.location || "");

        // 1. Fetch available villas from backend API
        const res = await fetch(`${BaseUrl}/Villa/get/villas`);
        if (res.ok) {
          const data = await res.json();
          const list =
            data?.data ||
            data?.properties ||
            (Array.isArray(data) ? data : []);

          // Filter out current villa
          const otherVillas = list.filter(
            (p) => String(p._id) !== String(villa?._id)
          );

          if (otherVillas.length > 0) {
            // Prioritize matching by location ObjectId or city
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

            // Use matched stays, or supplement with other villas if few
            const candidates =
              matched.length >= 3
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
              setLoadingNearby(false);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error fetching nearby villas:", err);
      }

      // High quality fallback nearby villas matching location
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
              villa?.images?.[0] ||
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
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
            name: `Mist & Meadows Estate - ${villa?.address?.city || "Lonavala"}`,
            address: { city: villa?.address?.city || "Lonavala" },
            images: [
              villa?.images?.[2] ||
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
              villa?.images?.[3] ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
              villa?.images?.[1] ||
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
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
          {
            _id: "nearby-villa-3",
            name: `The Whispering Pines - ${villa?.address?.city || "Lonavala"}`,
            address: { city: villa?.address?.city || "Lonavala" },
            images: [
              villa?.images?.[3] ||
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
              villa?.images?.[0] ||
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
              villa?.images?.[2] ||
                "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80",
            ],
            pricing: {
              weekendPrice: Math.round(
                (Number(villa?.pricing?.weekendPrice) || 16000) * 0.9
              ),
              weekdayPrice: Math.round(
                (Number(villa?.pricing?.weekdayPrice) || 14000) * 0.9
              ),
            },
            rating: 4.95,
            tags: ["Guest favourite", "Scenic View"],
          },
        ]);
        setLoadingNearby(false);
      }
    }

    fetchNearbyVillas();
    return () => {
      isMounted = false;
    };
  }, [villa]);

  const amenities = villa?.amenities || [];
  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 8);

  const rawReviews = villa?.reviews || [];

  // Filter & sort reviews
  const filteredReviews = useMemo(() => {
    return rawReviews.filter((review) => {
      if (activeReviewFilter === "All") return true;
      const cats = review.categories || [];
      return cats.some(
        (cat) => cat.toLowerCase() === activeReviewFilter.toLowerCase()
      );
    });
  }, [rawReviews, activeReviewFilter]);

  const sortedReviews = useMemo(() => {
    return [...filteredReviews].sort((a, b) => {
      if (activeReviewSort === "Most Recent") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
      return (b.rating || 0) - (a.rating || 0);
    });
  }, [filteredReviews, activeReviewSort]);

  // Fallback experiences if villa has none in DB
  const displayExperiences = useMemo(() => {
    if (villa?.experiences && villa.experiences.length > 0) {
      return villa.experiences;
    }
    return [
      {
        _id: "exp-1",
        title: "Private Poolside Barbecue",
        category: "Dining",
        description:
          "Relish succulent freshly grilled delicacies under a starlit sky with your loved ones by the pool.",
        image: villa?.images?.[1] || "/placeholder.svg",
      },
      {
        _id: "exp-2",
        title: "Bonfire & Acoustic Evenings",
        category: "Entertainment",
        description:
          "Gather around the crackling lawn bonfire for warm conversations, music, and roasted marshmallows.",
        image: villa?.images?.[2] || "/placeholder.svg",
      },
      {
        _id: "exp-3",
        title: "Nature Plantation Walk",
        category: "Outdoor",
        description:
          "Breathe in crisp mountain air while exploring scenic trails and lush green estate surroundings.",
        image: villa?.images?.[3] || "/placeholder.svg",
      },
      {
        _id: "exp-4",
        title: "Indoor Games & Karaoke Lounge",
        category: "Leisure",
        description:
          "Unwind with a vibrant selection of board games, table tennis, and a party sound system for lively fun.",
        image: villa?.images?.[0] || "/placeholder.svg",
      },
    ];
  }, [villa]);

  return (
    <div className="w-full space-y-14">
      {/* 1. HIGHLIGHTS SECTION */}
      <section
        id="highlightss"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-1">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Property Highlights
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-xl">
              Signature experiences and standout features that make your stay at {villa?.name || "this villa"} extraordinary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBrochureOpen(true)}
              className="rounded-full border-gray-200 text-gray-800 hover:border-[#ff6900] hover:text-[#ff6900] hover:bg-orange-50/50 text-xs font-semibold px-4 py-2 flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>View Brochure</span>
            </Button>
          </div>
        </div>

        {/* The StayVista/VillaCamp Experience Cards */}
        <div className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(villa?.images?.slice(0, 4) || []).map((img, index) => {
              const experienceThemes = [
                { title: "FULLY-SERVICED VILLAS", subtitle: "Dedicated Caretaker" },
                { title: "CURATED DINING", subtitle: "Fresh Home Cooked Meals" },
                { title: "SCENIC PANORAMA", subtitle: "Serene Private Estate" },
                { title: "PREMIUM INTERIORS", subtitle: "Bespoke Design & Comfort" },
              ];
              const theme = experienceThemes[index] || {
                title: "LUXURY RETREAT",
                subtitle: "Curated Stays",
              };
              return (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-neutral-900"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={theme.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      unoptimized
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent flex flex-col justify-end p-4 transition-all group-hover:from-black/95">
                    <span className="text-[10px] font-bold text-[#ff994d] uppercase tracking-wider mb-0.5">
                      {theme.subtitle}
                    </span>
                    <h4 className="text-white text-xs font-bold tracking-wide">
                      {theme.title}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Highlights from Villa Schema (if provided) */}
        {villa?.highlights && villa.highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {villa.highlights.map((hl, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-150 shadow-2xs hover:shadow-sm transition-all"
              >
                {hl.image && (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                    <Image
                      src={hl.image}
                      alt={hl.title || "Highlight"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    {hl.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {hl.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Villa Description with Read More & Great For Badges */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-150 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-bold text-gray-900">
              About {villa?.name || "The Property"}
            </h3>
            {villa?.bhkType && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#ff6900] border border-orange-200">
                {villa.bhkType} • Up to {villa?.maxCapacity || 10} Guests
              </span>
            )}
          </div>

          <p
            className={`text-sm text-gray-600 leading-relaxed ${
              !expandedDescription ? "line-clamp-3" : ""
            }`}
          >
            {villa?.description ||
              "Set amidst picturesque natural vistas, this private luxury home provides expansive indoor and outdoor spaces, lavish comfort, personalized caretaker hospitality, and panoramic views crafted for rejuvenation."}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="text-[#ff6900] hover:text-[#e05d00] font-bold text-xs underline underline-offset-4 cursor-pointer"
            >
              {expandedDescription ? "Read Less ↑" : "Read More ↓"}
            </button>

            {/* Great For Badges from Schema */}
            {villa?.greatFor && villa.greatFor.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {villa.greatFor.map((item, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100/90 text-neutral-800 border border-neutral-200/80"
                  >
                    <span className="text-[#ff6900] text-[10px]">✦</span>
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Brochure Dialog */}
        <Dialog open={brochureOpen} onOpenChange={setBrochureOpen}>
          <DialogContent className="max-w-xl bg-white rounded-3xl p-6 sm:p-8">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#ff6900]" />
                {villa?.name} Brochure
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-600 mt-2">
              <div className="bg-orange-50/60 border border-orange-100 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-gray-900 text-sm">
                  Quick Property Snapshot
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                  <div>• Configuration: {villa?.bhkType || "Luxury Villa"}</div>
                  <div>• Max Guests: {villa?.maxCapacity || 10} Guests</div>
                  <div>• Bedrooms: {villa?.rooms || 4} Rooms</div>
                  <div>• Bathrooms: {villa?.baths || 4} Baths</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                {villa?.description}
              </p>
              {villa?.brochure && (
                <div className="pt-2">
                  <a
                    href={villa.brochure}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Official PDF Brochure
                  </a>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* 2. REFUND POLICY & RULES SECTION */}
      <section
        id="refund-policyy"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Rules and Refund Policy
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Transparent check-in timings, cancellation guidelines, and home policies for your stay.
            </p>
          </div>
        </div>

        {/* Quick Specs Cards: Check-in, Check-out, Deposit, Late Checkout */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Check-In
            </span>
            <span className="text-sm font-bold text-gray-900">
              {villa?.checkInTime || "1:00 PM"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center mx-auto mb-1.5">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Check-Out
            </span>
            <span className="text-sm font-bold text-gray-900">
              {villa?.checkOutTime || "11:00 AM"}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Security Deposit
            </span>
            <span className="text-sm font-bold text-gray-900">
              ₹{(villa?.securityDeposit || 3000).toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-emerald-600 block font-medium">
              Refundable
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1.5">
              <Receipt className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
              Late Checkout
            </span>
            <span className="text-sm font-bold text-gray-900">
              ₹{(villa?.lateCheckoutCharge || 1000).toLocaleString("en-IN")}/hr
            </span>
            <span className="text-[10px] text-gray-400 block">
              On availability
            </span>
          </div>
        </div>

        {/* Detailed Policy Cards */}
        <Card className="border border-neutral-200/80 bg-white rounded-3xl shadow-xs overflow-hidden">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* Cancellation Policy */}
            <div className="bg-neutral-50/70 border border-neutral-150 rounded-2xl p-5">
              <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                Cancellation Policy
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm pl-2">
                {villa?.cancellationPolicy && villa.cancellationPolicy.length > 0 ? (
                  villa.cancellationPolicy.map((policy, index) => (
                    <li key={index} className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>{policy}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>100% refund if cancelled up to 14 days prior to check-in.</span>
                    </li>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>50% refund if cancelled between 7 and 14 days before check-in.</span>
                    </li>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>Non-refundable for cancellations made less than 7 days before arrival.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* House Rules */}
            <div className="bg-neutral-50/70 border border-neutral-150 rounded-2xl p-5">
              <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                House Rules & Home Truths
              </h3>
              <ul className="space-y-2 text-gray-700 text-sm pl-2">
                {villa?.houseRules && villa.houseRules.length > 0 ? (
                  villa.houseRules.map((rule, index) => (
                    <li key={index} className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>{rule}</span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>Quiet hours observed after 10:00 PM to respect peaceful surroundings.</span>
                    </li>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>Smoking is permitted only in designated outdoor balconies and lawn areas.</span>
                    </li>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>Loud outdoor music is strictly prohibited after 10:00 PM.</span>
                    </li>
                    <li className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>Valid government photo ID required for all adult guests at check-in.</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Payment Terms */}
            {villa?.paymentTerms && villa.paymentTerms.length > 0 && (
              <div className="bg-neutral-50/70 border border-neutral-150 rounded-2xl p-5">
                <h3 className="font-bold text-base mb-3 text-gray-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                  Payment Terms
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm pl-2">
                  {villa.paymentTerms.map((term, index) => (
                    <li key={index} className="leading-relaxed flex items-start gap-2">
                      <span className="text-[#ff6900] font-bold mt-0.5">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Kitchen & Relocation Policy if available */}
            {(villa?.kitchenPolicy?.length > 0 || villa?.kitchenCharge > 0) && (
              <div className="bg-neutral-50/70 border border-neutral-150 rounded-2xl p-5">
                <h3 className="font-bold text-base mb-2 text-gray-900 flex items-center gap-2">
                  <CookingPot className="w-4 h-4 text-[#ff6900]" />
                  Kitchen & Self-Cooking Policy
                </h3>
                {villa?.kitchenCharge > 0 && (
                  <p className="text-xs font-semibold text-gray-800 mb-2">
                    Kitchen usage charge: ₹{villa.kitchenCharge.toLocaleString("en-IN")} per day for gas & cleaning supplies.
                  </p>
                )}
                {villa?.kitchenPolicy?.length > 0 && (
                  <ul className="space-y-1.5 text-gray-700 text-xs pl-2">
                    {villa.kitchenPolicy.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#ff6900] font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 3. SPACES & LIVING AREAS SECTION */}
      {(() => {
        const spaces = villa?.spaces || [];
        const currentModalSpace =
          selectedSpaceIndex !== null ? spaces[selectedSpaceIndex] : null;
        const modalMeta = currentModalSpace
          ? getSpaceCategory(currentModalSpace.name, currentModalSpace.description)
          : null;

        const handleNextSpace = () => {
          if (selectedSpaceIndex !== null && spaces.length > 0) {
            setSelectedSpaceIndex((prev) => (prev + 1) % spaces.length);
          }
        };

        const handlePrevSpace = () => {
          if (selectedSpaceIndex !== null && spaces.length > 0) {
            setSelectedSpaceIndex(
              (prev) => (prev - 1 + spaces.length) % spaces.length
            );
          }
        };

        return (
          <section
            id="spacess"
            className="scroll-mt-32 transition-all duration-500 ease-out"
          >
            {/* Section Header */}
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-1" />
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Spaces & Living Areas
                  </h2>
                  {spaces.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 text-[#ff6900] border border-orange-200/80">
                      {spaces.length} {spaces.length === 1 ? "Space" : "Spaces"}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Take a visual tour through thoughtfully crafted indoor and outdoor retreats designed for shared moments and relaxation.
                </p>
              </div>
            </div>

            {spaces.length > 0 ? (
              <div
                className={`grid gap-6 ${
                  spaces.length === 1
                    ? "grid-cols-1 max-w-xl"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {spaces.map((space, index) => {
                  const { category, icon: CategoryIcon, defaultFeatures } =
                    getSpaceCategory(space.name, space.description);
                  const features =
                    space.details && space.details.length > 0
                      ? space.details
                      : defaultFeatures;

                  return (
                    <div
                      key={space._id || index}
                      onClick={() => setSelectedSpaceIndex(index)}
                      className="group relative rounded-3xl border border-gray-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:shadow-orange-500/10 hover:border-orange-200 transition-all duration-300 flex flex-col cursor-pointer"
                    >
                      {/* Image Container with Luxury Overlays */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                        {space.image ? (
                          <Image
                            src={space.image}
                            alt={space.name || `Space ${index + 1}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400">
                            <Compass className="w-8 h-8 opacity-40" />
                          </div>
                        )}

                        {/* Subtle Cinematic Vignette Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />

                        {/* Top-Left Category Badge */}
                        <div className="absolute top-3.5 left-3.5 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-gray-800 shadow-sm border border-white/50">
                            <CategoryIcon className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>{category}</span>
                          </span>
                        </div>

                        {/* Top-Right Expand Button */}
                        <div className="absolute top-3.5 right-3.5 z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSpaceIndex(index);
                            }}
                            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-sm cursor-pointer"
                            title="View fullscreen photo"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Bottom Index Pill on Image */}
                        <div className="absolute bottom-3 left-4 z-10">
                          <span className="text-white font-semibold text-xs tracking-wide drop-shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
                            Space 0{index + 1}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#ff6900] transition-colors line-clamp-1">
                            {space.name || "Living Area"}
                          </h3>

                          {space.description && (
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2">
                              {space.description}
                            </p>
                          )}
                        </div>

                        {/* Space Feature Tags */}
                        {features && features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {features.slice(0, 3).map((feat, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-neutral-50 text-neutral-700 border border-neutral-200/80"
                              >
                                <span className="text-[#ff6900] text-[10px]">✦</span>
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Card Action Footer */}
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#ff6900] group-hover:text-[#e05d00]">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>View space details</span>
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-gray-200 text-center bg-gray-50/50">
                <p className="text-sm text-gray-400">No spaces information available.</p>
              </div>
            )}

            {/* Fullscreen Photo Lightbox Dialog */}
            <Dialog
              open={selectedSpaceIndex !== null}
              onOpenChange={(open) => {
                if (!open) setSelectedSpaceIndex(null);
              }}
            >
              <DialogContent className="max-w-3xl p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
                <DialogHeader className="sr-only">
                  <DialogTitle>
                    {currentModalSpace?.name || "Space Details"}
                  </DialogTitle>
                </DialogHeader>

                {currentModalSpace && (
                  <div className="flex flex-col">
                    {/* Photo Area */}
                    <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-neutral-900 overflow-hidden">
                      {currentModalSpace.image && (
                        <Image
                          src={currentModalSpace.image}
                          alt={currentModalSpace.name || "Space"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}

                      {/* Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                      {/* Top Badge */}
                      {modalMeta && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-md">
                            <modalMeta.icon className="w-3.5 h-3.5 text-[#ff6900]" />
                            <span>{modalMeta.category}</span>
                          </span>
                        </div>
                      )}

                      {/* Next / Prev Navigation if more than 1 space */}
                      {spaces.length > 1 && (
                        <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none z-20">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrevSpace();
                            }}
                            className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                            title="Previous space"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNextSpace();
                            }}
                            className="pointer-events-auto w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
                            title="Next space"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {/* Bottom Overlay Title */}
                      <div className="absolute bottom-4 left-5 right-5 text-white">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                          <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                            Space {selectedSpaceIndex + 1} of {spaces.length}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white drop-shadow-md">
                          {currentModalSpace.name}
                        </h3>
                      </div>
                    </div>

                    {/* Details Area */}
                    <div className="p-6 space-y-4 bg-white">
                      {currentModalSpace.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {currentModalSpace.description}
                        </p>
                      )}

                      {/* Features in Modal */}
                      {modalMeta && (
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Key Highlights & Amenities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {(
                              currentModalSpace.details?.length > 0
                                ? currentModalSpace.details
                                : modalMeta.defaultFeatures
                            ).map((feat, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200/80"
                              >
                                <span className="text-[#ff6900]">✦</span>
                                <span>{feat}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </section>
        );
      })()}

      {/* 4. REVIEWS SECTION (Incorporating mobile ReviewsTab.js logic) */}
      <section
        id="reviewss"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-1">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Guest Reviews
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Authentic verified ratings and experiences shared by fellow travelers.
            </p>
          </div>

          {/* Rating Badge */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-neutral-200 shadow-2xs">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-extrabold text-lg text-gray-900">
                {villa?.averageRating || "4.8"}
              </span>
              <span className="text-gray-400 text-xs font-semibold">/5</span>
            </div>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-bold text-[#ff6900] bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200/60">
              Guest Favourite
            </span>
          </div>
        </div>

        {/* Rating Hero Card */}
        <div className="bg-gradient-to-br from-neutral-50 via-orange-50/20 to-white rounded-3xl p-6 sm:p-7 border border-neutral-200/80 shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white border border-orange-200 flex flex-col items-center justify-center shadow-xs">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">
                {villa?.averageRating || "4.8"}
              </span>
              <span className="text-[11px] font-bold text-gray-400 mt-1">
                OUT OF 5
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <h4 className="font-bold text-base text-gray-900">
                Exceptional Guest Hospitality
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Based on {villa?.totalReviews || rawReviews.length} genuine guest stays
              </p>
            </div>
          </div>

          {rawReviews.length > 3 && (
            <Button
              variant="outline"
              onClick={() => setAllReviewsOpen(true)}
              className="rounded-full border-gray-300 text-gray-800 hover:border-[#ff6900] hover:text-[#ff6900] hover:bg-orange-50/60 text-xs font-bold px-5 py-2.5 shadow-2xs cursor-pointer"
            >
              View All {rawReviews.length} Reviews
            </Button>
          )}
        </div>

        {/* Category Filter Chips & Sort Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Filter Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {REVIEW_FILTER_CATEGORIES.map((category) => {
                const isActive = activeReviewFilter === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveReviewFilter(category)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#ff6900] text-white shadow-xs shadow-orange-500/20"
                        : "bg-white text-gray-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
                    }`}
                  >
                    {isActive ? "✓ " : ""}
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <span>Sort:</span>
              {REVIEW_SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setActiveReviewSort(opt)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                    activeReviewSort === opt
                      ? "bg-neutral-900 text-white font-bold"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Review Cards List */}
        {sortedReviews.length > 0 ? (
          <div className="space-y-4">
            {sortedReviews.slice(0, 4).map((review, index) => {
              const reviewerName =
                review.name || review.userName || review?.userId?.fullName || "Verified Guest";
              const initialLetter = (reviewerName || "G").charAt(0).toUpperCase();

              return (
                <Card
                  key={review._id || index}
                  className="border border-neutral-200/80 bg-white rounded-3xl shadow-2xs hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff8533] to-[#ff6900] text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                          {initialLetter}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-gray-900 text-sm">
                              {reviewerName}
                            </h4>
                            {review.isTopReview && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Top Review
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400">
                            {review.createdAt
                              ? dayjs(review.createdAt).fromNow()
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1 bg-amber-50/80 px-2.5 py-1 rounded-full border border-amber-200/60">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-amber-900">
                          {review.rating || 5}
                        </span>
                        <span className="text-[10px] text-amber-700/60">/5</span>
                      </div>
                    </div>

                    {/* Category Tags */}
                    {review.categories && review.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {review.categories.map((cat, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70"
                          >
                            ✓ {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comment */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment || review.text || "Wonderful stay with amazing views and top hospitality!"}
                    </p>

                    {/* Attached Photo Gallery */}
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2.5 pt-2 flex-wrap">
                        {review.images.map((imgUrl, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={() => setPreviewReviewImage(imgUrl)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 hover:scale-105 transition-transform cursor-pointer"
                          >
                            <Image
                              src={imgUrl}
                              alt="Review attachment"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-3xl border border-dashed border-gray-200 text-center bg-gray-50/50">
            <p className="text-sm text-gray-400">
              No reviews found matching category &quot;{activeReviewFilter}&quot;.
            </p>
          </div>
        )}

        {/* View All Reviews Dialog */}
        <Dialog open={allReviewsOpen} onOpenChange={setAllReviewsOpen}>
          <DialogContent className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center justify-between">
                <span>All Reviews ({rawReviews.length})</span>
                <span className="text-sm font-semibold text-[#ff6900] bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  ★ {villa?.averageRating || "4.8"} / 5
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {rawReviews.map((rev, idx) => (
                <div
                  key={rev._id || idx}
                  className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-150 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-gray-900">
                      {rev.name || rev?.userId?.fullName || "Guest"}
                    </h5>
                    <span className="text-xs text-amber-500 font-bold">
                      ★ {rev.rating || 5} / 5
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Lightbox for Review Photo Preview */}
        <Dialog
          open={!!previewReviewImage}
          onOpenChange={() => setPreviewReviewImage(null)}
        >
          <DialogContent className="max-w-3xl p-0 overflow-hidden bg-black/95 rounded-3xl border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>Review Photo</DialogTitle>
            </DialogHeader>
            {previewReviewImage && (
              <div className="relative aspect-video w-full">
                <Image
                  src={previewReviewImage}
                  alt="Review photo"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </section>

      {/* 5. AMENITIES SECTION */}
      <section
        id="amenitiess"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center mb-1">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Villa Amenities
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              Modern conveniences, leisure luxuries, and safety essentials provided for your stay.
            </p>
          </div>

          {amenities.length > 8 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAllAmenitiesDialogOpen(true)}
              className="rounded-full border-gray-200 text-gray-800 hover:border-[#ff6900] hover:text-[#ff6900] hover:bg-orange-50/50 text-xs font-semibold px-4 py-2 cursor-pointer"
            >
              View All ({amenities.length})
            </Button>
          )}
        </div>

        {/* Top Amenities Highlight Pill Bar */}
        {villa?.topamenities && villa.topamenities.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Top Amenities:
            </span>
            <div className="flex flex-wrap gap-2">
              {villa.topamenities.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-800 border border-orange-200 shadow-2xs"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
          {displayedAmenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-3.5 bg-white border border-neutral-200/80 rounded-2xl transition-all duration-300 hover:bg-orange-50/30 hover:border-orange-200 hover:shadow-xs group"
            >
              <div className="w-9 h-9 bg-neutral-50 border border-neutral-200/70 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-white shadow-2xs flex-shrink-0">
                <CustomAmenityIcon
                  name={amenity}
                  className="w-4 h-4 text-[#ff6900]"
                />
              </div>
              <span className="font-semibold text-xs text-gray-800 truncate">
                {amenity}
              </span>
            </div>
          ))}
        </div>

        {amenities.length > 8 && (
          <div className="mt-5 flex justify-start">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-800 hover:border-[#ff6900] hover:text-[#ff6900] hover:bg-orange-50/40 rounded-xl px-5 py-2 transition-all font-medium text-xs cursor-pointer"
              onClick={() => setShowAllAmenities(!showAllAmenities)}
            >
              {showAllAmenities ? "Show Less" : `Show all ${amenities.length} amenities`}
            </Button>
          </div>
        )}

        {/* All Amenities Dialog */}
        <Dialog open={allAmenitiesDialogOpen} onOpenChange={setAllAmenitiesDialogOpen}>
          <DialogContent className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                All Property Amenities ({amenities.length})
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-150"
                >
                  <CustomAmenityIcon name={item} className="w-4 h-4 text-[#ff6900]" />
                  <span className="text-xs font-semibold text-gray-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* 6. MEALS & DINING EXPERIENCE SECTION (From Schema: foodOptions) */}
      <section
        id="mealss"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Meals & Dining Experience
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Freshly prepared home-cooked regional meals lovingly crafted by our in-house chef.
            </p>
          </div>
        </div>

        {/* Meal Package Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Adult Meal Plan */}
          <div className="relative rounded-3xl p-6 bg-gradient-to-br from-white to-orange-50/30 border border-orange-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6900]">
                  Gourmet All-Day Dining
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Adult Meal Package
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{(villa?.foodOptions?.adultPrice || 1200).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-500 block">
                  / adult / day + taxes
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Includes full course breakfast, lunch, evening high-tea with snacks, and elaborate dinner. Fresh seasonal produce customized to your palate.
            </p>

            <div className="pt-2 border-t border-orange-100 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Veg & Non-Veg
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Jain on Request
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Unlimited Servings
              </span>
            </div>
          </div>

          {/* Child Meal Plan */}
          <div className="relative rounded-3xl p-6 bg-white border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  For Little Ones (5 - 10 Yrs)
                </span>
                <h3 className="text-lg font-bold text-gray-900">
                  Child Meal Package
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-extrabold text-gray-900">
                  ₹{(villa?.foodOptions?.childPrice || 800).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-gray-500 block">
                  / child / day + taxes
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Tailored kid-friendly preparations with mild spices, freshly made rotis, comfort meals, warm milk, and snacks throughout the stay.
            </p>

            <div className="pt-2 border-t border-neutral-150 flex flex-wrap gap-2 text-xs font-semibold text-gray-700">
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Mild Spice Options
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Kid Favourites
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <Check className="w-3.5 h-3.5" /> Under 5 Free
              </span>
            </div>
          </div>
        </div>

        {/* 4-Course Meal Timings Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Breakfast</h4>
            <span className="text-[11px] text-gray-500 block">
              8:30 AM – 10:30 AM
            </span>
            <p className="text-[11px] text-gray-400">
              Hot breakfast, eggs, fruits, tea & coffee
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Lunch</h4>
            <span className="text-[11px] text-gray-500 block">
              1:00 PM – 3:00 PM
            </span>
            <p className="text-[11px] text-gray-400">
              Traditional regional curries, rotis, rice & salad
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Soup className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">High Tea</h4>
            <span className="text-[11px] text-gray-500 block">
              5:00 PM – 6:30 PM
            </span>
            <p className="text-[11px] text-gray-400">
              Fresh chai, filter coffee & hot savoury pakoras
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-2xs space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Dinner</h4>
            <span className="text-[11px] text-gray-500 block">
              8:30 PM – 10:30 PM
            </span>
            <p className="text-[11px] text-gray-400">
              Elaborate gourmet spread and dessert
            </p>
          </div>
        </div>

        {/* Chef Policy & Special Note */}
        <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Info className="w-4 h-4 text-[#ff6900]" />
            <span>Important Dining Notes & Kitchen Guidelines</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">
            {villa?.foodOptions?.note ||
              "All meals are prepared fresh on-site using local farm produce. Barbecue nights and celebration cakes can be arranged with prior notice. Outside food ordering is subject to local availability."}
          </p>
        </div>
      </section>

      {/* 7. LOCATION SECTION */}
      <section
        id="locationn"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Location & Surroundings
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Explore your route, peaceful neighborhood highlights, and nearby scenic attractions.
            </p>
          </div>
        </div>

        <Card className="border border-neutral-200/80 bg-white rounded-3xl shadow-xs overflow-hidden">
          <CardContent className="p-6 sm:p-7">
            {/* Address Banner */}
            <div className="flex items-start space-x-3.5 mb-5">
              <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="w-5 h-5 text-[#ff6900]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-base text-gray-900">
                  {villa?.name || "The Villa"}
                </h3>
                <p className="text-sm text-gray-600">
                  {villa?.address?.addressLine ? `${villa.address.addressLine}, ` : ""}
                  {villa?.address?.area ? `${villa.address.area}, ` : ""}
                  {villa?.address?.city || "Destination"}
                </p>
              </div>
            </div>

            {/* Google Map */}
            {villa?.coordinates && (
              <GoogleMap
                coordinates={villa.coordinates}
                zoom={14}
                className="w-full h-72 rounded-2xl mb-6 border border-neutral-200 overflow-hidden shadow-2xs"
              />
            )}

            {/* Nearby Attractions */}
            {villa?.nearbyattractions && villa.nearbyattractions.length > 0 && (
              <div className="bg-neutral-50/70 p-5 rounded-2xl border border-neutral-200/70 space-y-3">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#ff6900]" />
                  Getting Around & Key Sightseeing Distances
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {villa.nearbyattractions.map((loc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-neutral-200/70 text-xs font-semibold text-gray-800"
                    >
                      <span className="truncate pr-2">
                        • {loc?.nearbylocation}
                      </span>
                      <span className="text-[#ff6900] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60 flex-shrink-0">
                        {loc?.distance} km
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 8. EXPERIENCES SECTION (From Schema: experiences) */}
      <section
        id="experiencess"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Curated Experiences
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Handpicked moments, outdoor adventures, and memory-making activities crafted for your stay.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayExperiences.map((exp, index) => (
            <div
              key={exp._id || index}
              className="group rounded-3xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={exp.image || "/placeholder.svg"}
                  alt={exp.title || "Experience"}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge */}
                {exp.category && (
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                      <span>{exp.category}</span>
                    </span>
                  </div>
                )}

                {/* Index Pill */}
                <div className="absolute bottom-3 left-4 z-10">
                  <span className="text-white text-xs font-semibold tracking-wider">
                    Experience 0{index + 1}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-[#ff6900] transition-colors">
                    {exp.title}
                  </h3>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed line-clamp-3">
                      {exp.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#ff6900]">
                  <span>Exclusive to this villa</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS SECTION (From Schema: faqs & exploreStay) */}
      <section
        id="faqss"
        className="scroll-mt-32 transition-all duration-500 ease-out"
      >
        <div className="flex items-center mb-6">
          <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Everything you need to know about booking, amenities, policies, and your upcoming stay.
            </p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4 mb-8">
          <Accordion type="single" collapsible className="space-y-3">
            {/* Custom FAQs from Schema */}
            {villa?.faqs && villa.faqs.length > 0 ? (
              villa.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white border border-neutral-200/80 rounded-2xl px-5 hover:border-orange-200 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-gray-900 text-sm py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              <>
                <AccordionItem
                  value="faq-1"
                  className="bg-white border border-neutral-200/80 rounded-2xl px-5 hover:border-orange-200 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-gray-900 text-sm py-4">
                    What are the standard check-in and check-out timings?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    Standard check-in is at {villa?.checkInTime || "1:00 PM"} and check-out is at {villa?.checkOutTime || "11:00 AM"}. Early check-in or late checkout is subject to villa availability and may incur a nominal charge of ₹{(villa?.lateCheckoutCharge || 1000).toLocaleString("en-IN")}/hr.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-2"
                  className="bg-white border border-neutral-200/80 rounded-2xl px-5 hover:border-orange-200 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-gray-900 text-sm py-4">
                    Is the swimming pool private or shared?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    The swimming pool and all outdoor spaces are completely private and exclusive to your group during your reservation.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-3"
                  className="bg-white border border-neutral-200/80 rounded-2xl px-5 hover:border-orange-200 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-gray-900 text-sm py-4">
                    Are meals provided, and can we request customized food?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    Yes! Our in-house chef prepares wholesome home-cooked meals tailored to your taste (including Veg, Non-Veg, and Jain options). An all-day meal package is available at ₹{(villa?.foodOptions?.adultPrice || 1200).toLocaleString("en-IN")}/adult/day.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="faq-4"
                  className="bg-white border border-neutral-200/80 rounded-2xl px-5 hover:border-orange-200 transition-colors shadow-2xs"
                >
                  <AccordionTrigger className="font-bold hover:no-underline text-gray-900 text-sm py-4">
                    Is power backup and high-speed Wi-Fi available?
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    Yes, high-speed Wi-Fi is accessible across the villa. In addition, an on-site generator / inverter provides reliable backup for essential lights, fans, and charging points during power disruptions.
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>

        {/* Explore Your Stay Accordion from Schema */}
        {villa?.exploreStay && villa.exploreStay.length > 0 && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Explore Your Stay
            </h3>
            <Accordion type="single" collapsible className="space-y-3">
              {villa.exploreStay.map((item, index) => (
                <AccordionItem
                  key={item._id || index}
                  value={`explore-${index}`}
                  className="bg-neutral-50/80 border border-neutral-200/70 rounded-2xl px-5 hover:border-orange-200 transition-colors"
                >
                  <AccordionTrigger className="font-semibold hover:no-underline text-gray-900 text-sm">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-gray-700 leading-relaxed">
                    {item.description}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Nearby Villas in Location (Using Airbnb card from Available Weekend Card) */}
        {nearbyVillas.length > 0 && (
          <div className="mt-12 pt-8 border-t border-neutral-200/80">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <div className="flex items-center mb-1">
                  <div className="w-1.5 h-6 bg-gradient-to-b from-[#ff6900] to-[#e05d00] rounded-full mr-3" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    Nearby Stays in {villa?.location?.name || villa?.address?.city || "Lonavala"}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Discover more handpicked luxury villas and retreats in and around{" "}
                  {villa?.address?.area ? `${villa.address.area}, ` : ""}
                  {villa?.location?.name || villa?.address?.city || "this destination"}.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {nearbyVillas.map((item) => (
                <div
                  key={item._id}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <PropertyCard property={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
