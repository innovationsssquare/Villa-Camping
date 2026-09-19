"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
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
import GoogleMap from "../google-map";
import { useCamping } from "@/lib/context/CampingContext";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import TentDetailsDrawer from "@/components/Tentscreen/TentDetailsDrawer";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import Image from "next/image";
import PropertyCard from "@/components/Availableweekend/Weekendcard";
import { BaseUrl } from "@/lib/API/Baseurl";
import {
  Trees,
  Tent,
  Waves,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Eye,
  Star,
  Check,
  ExternalLink,
  Clock,
  ShieldCheck,
  FileText,
  Utensils,
  Coffee,
  Soup,
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
  Shield,
  Download,
  CheckCircle2,
  ChevronDown,
  CookingPot,
  Receipt,
  Heart,
  Footprints,
  Compass,
  Music,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { setSelectedTents } from "@/Redux/Slices/bookingSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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

export default function PropertyContentSections() {
  const camping = useCamping();
  const dispatch = useDispatch();
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showAllAmenitiesDialog, setShowAllAmenitiesDialog] = useState(false);
  const [amenitySearchQuery, setAmenitySearchQuery] = useState("");
  const [selectedTent, setSelectedTent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [nearbyCampings, setNearbyCampings] = useState([]);

  const { checkin, checkout } = useSelector((state) => state.booking);
  const reduxSelectedTents = useSelector((state) => state.booking.selectedTents);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const amenities = camping?.amenities || [];
  const reviews = camping?.reviews || [];

  // Fetch nearby campings from backend
  useEffect(() => {
    let isMounted = true;
    async function fetchNearby() {
      if (!camping) return;
      try {
        const res = await fetch(`${BaseUrl}/Camping/get/campings`);
        if (res.ok) {
          const data = await res.json();
          const others = list.filter((p) => {
            const isCurrent = String(p._id) === String(camping?._id);
            const isApproved = p.isapproved === "approved";
            const isLive = p.isLive !== false;
            return !isCurrent && isApproved && isLive;
          });
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
    "Views & Surroundings": amenities.filter((a) =>
      /lake|mountain|sunset|nature|view|outdoor/i.test(a)
    ),
    "Safety & Security": amenities.filter((a) =>
      /security|cctv|parking|caretaker|first aid|fire/i.test(a)
    ),
  };

  // Add uncategorized
  const allCategorizedFlat = Object.values(categorizedAmenities).flat();
  const uncategorized = amenities.filter((a) => !allCategorizedFlat.includes(a));
  if (uncategorized.length > 0) {
    categorizedAmenities["More Facilities"] = uncategorized;
  }

  // Filtered amenities for dialog
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
    <div className="w-full space-y-12">
      {/* 1. HIGHLIGHTS SECTION */}
      <section id="highlightss" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Campsite Highlights
          </h2>
          <p className="text-sm text-gray-500">
            Handcrafted experiences & signature outdoor luxury
          </p>
        </div>

        {/* Signature Experience Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {defaultSignatureExperiences.map((exp, idx) => {
            const displayImg = (camping?.images && camping.images[idx]) || exp.image;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-xs hover:shadow-md transition-all duration-300"
              >
                <Image
                  src={displayImg}
                  alt={`${exp.title} ${exp.subtitle}`}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-white">
                  <span className="text-[10px] font-extrabold tracking-wider uppercase opacity-90 text-orange-400">
                    {exp.title}
                  </span>
                  <span className="text-sm font-black tracking-tight leading-tight">
                    {exp.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* About This Campsite Description */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-150 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-lg font-bold text-gray-900">
              About {camping?.name || "This Campsite"}
            </h3>
            {camping?.brochure && (
              <a
                href={camping.brochure}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff6900] hover:text-[#e05d00] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200/60 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Brochure</span>
              </a>
            )}
          </div>

          <div className="relative">
            <p
              className={`text-sm text-gray-700 leading-relaxed ${
                !expandedDescription ? "line-clamp-4" : ""
              }`}
            >
              {camping?.description ||
                "Escape into nature at this serene lakeside campsite. Enjoy bonfire nights, curated barbecue meals, clean tents under the open starlit sky, and refreshing morning breezes."}
            </p>
            {camping?.description && camping.description.length > 250 && (
              <button
                type="button"
                onClick={() => setExpandedDescription(!expandedDescription)}
                className="mt-2 text-xs font-bold text-[#ff6900] hover:text-[#e05d00] transition-colors cursor-pointer"
              >
                {expandedDescription ? "Show less" : "Read more..."}
              </button>
            )}
          </div>

          {/* Highlights Chips */}
          {camping?.highlights?.thingsToDo?.length > 0 && (
            <div className="pt-3 border-t border-neutral-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Things To Do
              </span>
              <div className="flex flex-wrap gap-2">
                {camping.highlights.thingsToDo.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/70 border border-orange-200/80 text-orange-950 font-medium text-xs shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#ff6900]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. MEALS & CAMPFIRE DINING SECTION */}
      <section id="mealss" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Meals & Campfire Dining
          </h2>
          <p className="text-sm text-gray-500">
            Freshly prepared meals, live barbecue, and morning breakfast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Evening Snacks */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-150 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">Evening Snacks & Tea</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  5:00 PM – 6:30 PM
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {camping?.meals?.eveningSnacks || "Hot tea, coffee, and freshly made snacks (Pakoras / Misal Pav)"}
              </p>
            </div>
          </div>

          {/* Live Barbecue */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-150 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">Live Campfire Barbecue</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  7:30 PM – 9:00 PM
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-semibold text-gray-800">Veg:</span> {camping?.meals?.bbq?.veg || "Paneer tikka, marinated veggies"}
                <br />
                <span className="font-semibold text-gray-800">Non-Veg:</span> {camping?.meals?.bbq?.nonVeg || "Chicken tikka, skewers"}
              </p>
            </div>
          </div>

          {/* Dinner */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-150 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">Unlimited Dinner Buffet</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  9:00 PM – 10:30 PM
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <span className="font-semibold text-gray-800">Veg:</span> {camping?.meals?.dinner?.veg || "Paneer sabzi, dal tadka, jeera rice, chapati, salad & sweet"}
                <br />
                <span className="font-semibold text-gray-800">Non-Veg:</span> {camping?.meals?.dinner?.nonVeg || "Chicken curry / gravy, rice, chapati, salad"}
              </p>
            </div>
          </div>

          {/* Breakfast */}
          <div className="bg-white rounded-2xl p-5 border border-neutral-150 shadow-xs flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
              <CookingPot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-gray-900">Next Day Breakfast</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                  8:30 AM – 10:00 AM
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {camping?.meals?.nextDayBreakfast || "Poha / Upma, boiled eggs / omlette, hot tea & coffee"}
              </p>
            </div>
          </div>
        </div>

        {/* Things to Carry Checklist */}
        <div className="bg-neutral-50/80 rounded-2xl p-5 border border-neutral-200/80">
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recommended Things to Carry
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Torch / Flashlight</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Personal Medicines</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Comfortable Footwear</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Extra Warm Clothes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Portable Power Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              <span>Valid Government Photo ID</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. AMENITIES SECTION */}
      <section id="amenitiess" className="scroll-mt-32 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Amenities & Facilities
            </h2>
            <p className="text-sm text-gray-500">
              Everything you need for a comfortable campsite stay
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAllAmenitiesDialog(true)}
            className="rounded-xl border-neutral-300 font-semibold text-xs hover:border-[#ff6900] hover:text-[#ff6900] transition-colors"
          >
            View All ({amenities.length})
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenities.slice(0, 12).map((amenity, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-neutral-150 shadow-2xs hover:border-orange-200 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-50/80 text-[#ff6900] flex items-center justify-center shrink-0">
                <CustomAmenityIcon name={amenity} className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-semibold text-gray-800 truncate">
                {amenity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. SPACES & AVAILABLE TENTS SECTION */}
      <section id="spacess" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Available Tents & Accommodations
          </h2>
          <p className="text-sm text-gray-500">
            Select your preferred tent type with customized capacity and comforts
          </p>
        </div>

        {Array.isArray(camping?.tents) && camping.tents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {camping.tents.map((tent) => {
              const currentSelectedQty = reduxSelectedTents?.[tent.tentType]?.quantity || 0;
              const tentPrice = Number(
                tent.pricing?.weekdayPrice || tent.pricing?.weekendPrice || camping?.pricing?.weekdayPrice || 1200
              );

              return (
                <div
                  key={tent._id}
                  className="bg-white rounded-3xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Tent Image Preview */}
                    <div className="relative aspect-video w-full bg-neutral-100">
                      <Image
                        src={tent?.tentimages?.[0] || camping?.images?.[0] || "/placeholder.svg"}
                        alt={tent.tentType}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-900 shadow-xs border border-black/5 flex items-center gap-1.5">
                        <Tent className="w-3.5 h-3.5 text-[#ff6900]" />
                        <span>{tent.tentType}</span>
                      </div>
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-white shadow-xs">
                        {tent.totaltents || 10} Units Available
                      </div>
                    </div>

                    {/* Tent Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">
                            {tent.tentType} Tent
                          </h3>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Users className="w-3 h-3 text-[#ff6900]" />
                            <span>Up to {tent.maxCapacity} Guests</span>
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-gray-900 block">
                            ₹{tentPrice.toLocaleString()}
                          </span>
                          <span className="text-[10.5px] text-gray-500">
                            Per night / tent
                          </span>
                        </div>
                      </div>

                      {/* Amenities Chips */}
                      {tent.amenities && tent.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-neutral-100">
                          {tent.amenities.slice(0, 4).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] font-medium bg-neutral-100 text-gray-700 px-2.5 py-1 rounded-lg"
                            >
                              {amenity}
                            </span>
                          ))}
                          {tent.amenities.length > 4 && (
                            <span className="text-[11px] font-semibold text-[#ff6900] px-1 py-1">
                              +{tent.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedTent(tent);
                        setDrawerOpen(true);
                      }}
                      className="flex-1 rounded-xl text-xs font-semibold hover:border-[#ff6900] hover:text-[#ff6900]"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {
                        const targetWidget = document.getElementById("booking-widget");
                        if (targetWidget) {
                          targetWidget.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="flex-1 bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl text-xs font-bold shadow-xs shadow-orange-500/20"
                    >
                      {currentSelectedQty > 0 ? `${currentSelectedQty} Selected` : "Select Tent"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 text-center">
            <p className="text-sm text-gray-500">Tents information will be available shortly.</p>
          </div>
        )}
      </section>

      {/* 5. LOCATION SECTION */}
      <section id="locationn" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Location & Getting There
          </h2>
          <p className="text-sm text-gray-500">
            Discover the serene surroundings and easy access routes
          </p>
        </div>

        {/* Google Map */}
        <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs">
          <div className="h-72 w-full">
            <GoogleMap coordinates={camping?.coordinates} />
          </div>
          <div className="p-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                Campsite Address
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {camping?.address?.addressLine}, {camping?.address?.area}, {camping?.address?.city}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const query = `${camping?.name || "Camping"}, ${camping?.address?.city || ""}`;
                window.open(`https://maps.google.com/?q=${encodeURIComponent(query)}`, "_blank");
              }}
              className="rounded-xl text-xs font-bold border-neutral-300 hover:border-[#ff6900] hover:text-[#ff6900] shrink-0"
            >
              Open in Google Maps
            </Button>
          </div>
        </div>

        {/* Nearby Attractions */}
        {camping?.nearbyattractions && camping.nearbyattractions.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-neutral-150 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Nearby Attractions & Points of Interest
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {camping.nearbyattractions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200/70"
                >
                  <MapPin className="w-4 h-4 text-[#ff6900] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-gray-800 truncate block">
                      {item.nearbylocation}
                    </span>
                    <span className="text-[11px] text-gray-500">
                      {item.distance} km away
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. REVIEWS SECTION */}
      <section id="reviewss" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Guest Reviews & Ratings
          </h2>
          <p className="text-sm text-gray-500">
            Real feedback from verified guests who stayed here
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-150 shadow-xs flex flex-col sm:flex-row items-center gap-6">
          <div className="text-center sm:text-left shrink-0">
            <div className="flex items-baseline justify-center sm:justify-start gap-1">
              <span className="text-4xl font-extrabold text-gray-900">
                {camping?.averageRating || "4.8"}
              </span>
              <span className="text-gray-400 text-lg font-medium">/ 5</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs text-gray-500 font-medium block">
              Based on {camping?.totalReviews || reviews.length || 1} verified ratings
            </span>
          </div>

          <div className="h-12 w-[1px] bg-neutral-200 hidden sm:block shrink-0" />

          <div className="flex-1 grid grid-cols-2 gap-3 text-xs text-gray-700 w-full">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between">
              <span className="font-medium">Cleanliness & Hygiene</span>
              <span className="font-bold text-gray-900">4.9 ★</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between">
              <span className="font-medium">Food & Barbecue</span>
              <span className="font-bold text-gray-900">4.8 ★</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between">
              <span className="font-medium">Hospitality & Staff</span>
              <span className="font-bold text-gray-900">4.9 ★</span>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between">
              <span className="font-medium">Campsite Ambience</span>
              <span className="font-bold text-gray-900">5.0 ★</span>
            </div>
          </div>
        </div>

        {/* Review Cards List */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.slice(0, 4).map((rev, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-neutral-150 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-[#ff6900] font-bold text-xs flex items-center justify-center">
                      {(rev?.name || rev?.user?.name || "G")[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">
                        {rev?.name || rev?.user?.name || "Verified Camper"}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {rev?.createdAt ? dayjs(rev.createdAt).fromNow() : "Recent stay"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-gray-900 ml-1">
                      {rev?.rating || 5}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  "{rev?.comment || rev?.review || "Amazing experience! The campfire and lake view were breathtaking."}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 text-center">
            <p className="text-sm text-gray-500">No reviews published yet for this campsite.</p>
          </div>
        )}
      </section>

      {/* 7. EXPERIENCES SECTION */}
      <section id="experiencess" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Outdoor Experiences & Activities
          </h2>
          <p className="text-sm text-gray-500">
            Unforgettable moments curated right at the campsite
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Evening Bonfire</h4>
            <p className="text-xs text-gray-500">
              Gather around the warm fire with acoustic tunes under starry skies.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Waves className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Kayaking & Boating</h4>
            <p className="text-xs text-gray-500">
              Paddle through serene waters with safety jackets and instructors.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Nature Trekking</h4>
            <p className="text-xs text-gray-500">
              Guided morning hike across scenic ridgelines and sunrise viewpoints.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Night Stargazing</h4>
            <p className="text-xs text-gray-500">
              Crystal-clear rural skies perfect for constellation and star observation.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Music className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Music & Board Games</h4>
            <p className="text-xs text-gray-500">
              Carrom, chess, badminton, and chill outdoor seating zones.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-neutral-150 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">DIY Barbecue Grill</h4>
            <p className="text-xs text-gray-500">
              Try your hand at grilling marinated skewers over charcoal embers.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FAQs SECTION */}
      <section id="faqss" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-500">
            Clear answers to common questions about your campsite stay
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {camping?.faqs && camping.faqs.length > 0 ? (
            camping.faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="bg-white border border-neutral-200/80 rounded-2xl px-5 shadow-2xs"
              >
                <AccordionTrigger className="font-bold hover:no-underline text-xs sm:text-sm text-gray-900 py-3.5 text-left">
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
                className="bg-white border border-neutral-200/80 rounded-2xl px-5 shadow-2xs"
              >
                <AccordionTrigger className="font-bold hover:no-underline text-xs sm:text-sm text-gray-900 py-3.5 text-left">
                  What are the check-in and check-out timings?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                  Check-in starts at {camping?.checkInTime || "4:00 PM"} and check-out is by {camping?.checkOutTime || "11:00 AM"} the next morning.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="faq-2"
                className="bg-white border border-neutral-200/80 rounded-2xl px-5 shadow-2xs"
              >
                <AccordionTrigger className="font-bold hover:no-underline text-xs sm:text-sm text-gray-900 py-3.5 text-left">
                  Are washrooms and charging points clean & available?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                  Yes, clean western & Indian washrooms with hot water are maintained on-site. Charging points are located in the common dining pavilion.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value="faq-3"
                className="bg-white border border-neutral-200/80 rounded-2xl px-5 shadow-2xs"
              >
                <AccordionTrigger className="font-bold hover:no-underline text-xs sm:text-sm text-gray-900 py-3.5 text-left">
                  Is it safe for families and couples?
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                  Absolutely. The campsite has 24/7 security guards, dedicated staff on premises, and a family-friendly atmosphere.
                </AccordionContent>
              </AccordionItem>
            </>
          )}
        </Accordion>
      </section>

      {/* 9. REFUND POLICY & HOUSE RULES SECTION */}
      <section id="refund-policyy" className="scroll-mt-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Cancellation & Campsite Policies
          </h2>
          <p className="text-sm text-gray-500">
            Important guidelines and cancellation terms
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-150 shadow-xs space-y-6">
          {/* Visual Step-by-Step Cancellation Timeline */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ff6900]" />
              Cancellation Policy Timeline
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                <span className="text-xs font-black block">100% Refund</span>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Up to 7 days before check-in time
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                <span className="text-xs font-black block">50% Refund</span>
                <p className="text-[11px] text-amber-800 mt-1">
                  Between 7 days and 48 hours before check-in
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <span className="text-xs font-black block">No Refund</span>
                <p className="text-[11px] text-rose-800 mt-1">
                  Within 48 hours of check-in or no-show
                </p>
              </div>
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center font-bold text-xs">
                IN
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase font-bold block">
                  Check-in Time
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {camping?.checkInTime || "4:00 PM"} onwards
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-150">
              <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center font-bold text-xs">
                OUT
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase font-bold block">
                  Check-out Time
                </span>
                <span className="text-xs font-bold text-gray-900">
                  By {camping?.checkOutTime || "11:00 AM"}
                </span>
              </div>
            </div>
          </div>

          {/* Rules List */}
          {camping?.CampingRules && camping.CampingRules.length > 0 && (
            <div className="pt-4 border-t border-neutral-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                Campsite Rules
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-600">
                {camping.CampingRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#ff6900] font-bold">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 10. NEARBY CAMPING SITES */}
      {nearbyCampings.length > 0 && (
        <section className="pt-8 border-t border-neutral-200/80 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Similar Camping Stays in {camping?.address?.city || "Pawana"}
            </h3>
            <p className="text-xs text-gray-500">
              Explore more top-rated campsites in this region
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyCampings.slice(0, 3).map((item) => (
              <div key={item._id} className="w-full">
                <PropertyCard property={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TENT DETAILS DIALOG */}
      <TentDetailsDrawer
        tent={selectedTent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* FULL AMENITIES MODAL DIALOG */}
      <Dialog
        open={showAllAmenitiesDialog}
        onOpenChange={setShowAllAmenitiesDialog}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] bg-white rounded-3xl p-6 overflow-hidden flex flex-col">
          <DialogHeader className="border-b border-neutral-100 pb-3">
            <DialogTitle className="text-lg font-bold text-gray-900">
              All Amenities & Inclusions ({amenities.length})
            </DialogTitle>
            <div className="relative mt-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search amenities..."
                value={amenitySearchQuery}
                onChange={(e) => setAmenitySearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-100 border-none focus:outline-none focus:ring-2 focus:ring-[#ff6900]"
              />
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0 pr-2 py-4">
            <div className="space-y-6">
              {Object.keys(filteredCategorized).length > 0 ? (
                Object.entries(filteredCategorized).map(([category, items]) => (
                  <div key={category} className="space-y-3">
                    <h4 className="text-xs font-bold text-[#ff6900] uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="grid grid-cols-2 gap-2.5">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-neutral-50 border border-neutral-150"
                        >
                          <CustomAmenityIcon name={item} className="w-4 h-4 text-[#ff6900] shrink-0" />
                          <span className="text-xs text-gray-800 font-medium truncate">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-xs text-gray-400 py-8">
                  No matching amenities found.
                </p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
