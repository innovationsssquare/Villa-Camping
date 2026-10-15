"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  MapPin,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  Mountain,
  Waves,
  Footprints,
  Landmark,
  Tent,
  CheckCircle2,
  PhoneCall,
  Search,
  Palmtree,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EXPERIENCES_DATA = [
  {
    id: "tiger-point",
    title: "Tiger Point & Lion's Point",
    category: "Scenic Viewpoint",
    categoryIcon: Mountain,
    location: "Kurvande, Lonavala",
    distance: "12 km from town center",
    bestTime: "Sunrise & Monsoon (July – Nov)",
    duration: "1.5 - 2.5 Hours",
    rating: "4.9",
    image: "/experiences/tiger-point.jpg",
    description:
      "Perched on a sheer 650-meter rocky precipice, Tiger Point commands unobstructed panoramas across the deep mist-shrouded Sahyadri valley, seasonal cascading waterfalls, and swirling cloud formations.",
    highlights: [
      "650m sheer cliff drop overlooking deep valley gorges",
      "Swirling monsoon clouds and scenic mountain fog",
      "Stunning golden sunrise and sunset vista points",
      "Scenic mountain drive with local tea stalls",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "pawana-lake",
    title: "Pawana Lake Kayaking & Stargazing",
    category: "Lakeside & Camping",
    categoryIcon: Waves,
    location: "Pawana Dam Reservoir",
    distance: "18 km from Lonavala",
    bestTime: "Oct – May (Cool evenings)",
    duration: "Half / Full Day",
    rating: "4.9",
    image: "/experiences/pawana-lake.jpg",
    description:
      "A serene freshwater reservoir framed by the historic silhouettes of Tung, Tikona, and Lohagad forts. Enjoy evening kayaking, waterside bonfires, and clear dark-sky stargazing away from urban lights.",
    highlights: [
      "Calm freshwater kayaking and paddle boating",
      "Scenic backdrop of Tikona and Tung fort peaks",
      "Lakeside campfire evenings under unpolluted skies",
      "Minutes away from private Pawana lakefront villas",
    ],
    stayLink: "/category/all?location=pawana",
  },
  {
    id: "lohagad-fort",
    title: "Lohagad Fort (The Iron Citadel)",
    category: "Heritage & Hillforts",
    categoryIcon: Landmark,
    location: "Malavli, Lonavala",
    distance: "11 km from Lonavala",
    bestTime: "Monsoon & Winter (June – Feb)",
    duration: "3 - 4 Hours",
    rating: "4.8",
    image: "/experiences/lohagad-fort.jpg",
    description:
      "An imposing Maratha hilltop fortress featuring four grand preserved stone gateways and the dramatic 'Vinchu Kata' (Scorpion's Tail) knife-edge ridge extending high above the Pawana reservoir valley.",
    highlights: [
      "Walk the exhilarating Vinchu Kata knife-edge ridge",
      "Four monumental carved stone entrance gates",
      "360° panoramic views over Pawana reservoir",
      "Family-friendly stone staircase trail through greenery",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "karla-bhaja-caves",
    title: "Karla Caves (Great Chaitya Hall)",
    category: "Heritage & Hillforts",
    categoryIcon: Landmark,
    location: "Karli, Lonavala",
    distance: "12 km on Old Pune Highway",
    bestTime: "Year-Round (Morning Hours)",
    duration: "2 - 3 Hours",
    rating: "4.8",
    image: "/experiences/karla-caves.jpg",
    description:
      "Carved in the 2nd century BCE, Karla features India's largest rock-cut Buddhist Chaitya hall. Marvel at 37 towering stone pillars carved with elephant capitals, 2,000-year-old teakwood arched vaulting, and ancient rock inscriptions.",
    highlights: [
      "India's largest ancient rock-cut Buddhist Chaitya hall",
      "Intact 2,000-year-old curved teakwood roof rafters",
      "Intricate elephant capital sculptures & Ashokan pillar",
      "Panoramic views of the Indrayani river valley",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "bhushi-dam",
    title: "Bhushi Dam Cascading Waterfalls",
    category: "Monsoon Waterfalls",
    categoryIcon: Waves,
    location: "Bhushi, Lonavala",
    distance: "6 km from Lonavala Station",
    bestTime: "Peak Monsoon (July – Sept)",
    duration: "1.5 - 2 Hours",
    rating: "4.7",
    image: "/experiences/bhushi-dam.jpg",
    description:
      "Built over the Indrayani River, Bhushi Dam is famous for its stepped masonry terraces where seasonal overflowing waters cascade gently down stone steps amidst lush forested hills and misty mountain air.",
    highlights: [
      "Step-style natural rock waterfall cascade",
      "Lush Western Ghats hillside vegetation and cool breezes",
      "Refreshing shallow water splash areas",
      "Paved road access with nearby refreshments and parking",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "dukes-nose",
    title: "Duke's Nose (Nagphani Cliff Walk)",
    category: "Adventure & Treks",
    categoryIcon: Footprints,
    location: "Kurvande, Khandala",
    distance: "7 km from Khandala",
    bestTime: "Oct – May (Clear Weather)",
    duration: "3 - 4 Hours",
    rating: "4.9",
    image: "/experiences/dukes-nose.jpg",
    description:
      "Named for its distinctive pointed profile resembling the Duke of Wellington, this monolithic rock wedge offers exhilarating trekking, valley rappelling, and unobstructed views of the winding Khandala Ghat expressway.",
    highlights: [
      "Iconic pointed cliff overhang vantage point",
      "Unrivaled aerial view of the Mumbai-Pune expressway",
      "Popular for rock climbing and valley rappelling",
      "Refreshing forest trail through dense Khandala woods",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "kune-falls",
    title: "Kune Waterfalls",
    category: "Monsoon Waterfalls",
    categoryIcon: Waves,
    location: "Khandala, Western Ghats",
    distance: "4 km from Lonavala / Khandala",
    bestTime: "Peak Monsoon (July – Sept)",
    duration: "1 - 2 Hours",
    rating: "4.8",
    image: "/experiences/kune-falls.jpg",
    description:
      "Plunging 200 meters in three majestic tiers against a sheer emerald cliff backdrop, Kune Falls is the 14th highest natural waterfall in India, framed by the verdant mountain slopes of Khandala.",
    highlights: [
      "200-meter three-tiered waterfall cascade",
      "Emerald green cliffs and mist-covered valleys",
      "Spectacular photography vantage point from highway ridge",
      "Serene natural pocket away from crowded tourist centers",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "alibaug-beach",
    title: "Alibaug Beaches & Kolaba Sea Fort",
    category: "Coastal Getaway",
    categoryIcon: Palmtree,
    location: "Alibaug Coastal Belt",
    distance: "Coastal Raigad (Ferry from Mumbai)",
    bestTime: "Nov – May (Pleasant coastal breezes)",
    duration: "Half / Full Day",
    rating: "4.8",
    image: "/experiences/alibaug-beach.jpg",
    description:
      "Golden sand beaches fringed by towering coconut palms along the Arabian Sea. Enjoy thrilling water sports, beachside coconut groves, and walking across to the historic 17th-century island fort of Kolaba at low tide.",
    highlights: [
      "Jet-skiing, banana rides & coastal water sports",
      "Walk to historic Kolaba Sea Fort during low tide",
      "Tranquil coconut palm groves and golden sunset walks",
      "Short scenic catamaran ride from Gateway of India",
    ],
    stayLink: "/category/all?location=alibaug",
  },
];

const CATEGORIES = [
  "All",
  "Scenic Viewpoint",
  "Lakeside & Camping",
  "Heritage & Hillforts",
  "Monsoon Waterfalls",
  "Adventure & Treks",
  "Coastal Getaway",
];

const POPULAR_LOCATIONS = [
  { name: "All Destinations", count: 8 },
  { name: "Lonavala", count: 4 },
  { name: "Pawana Lake", count: 1 },
  { name: "Khandala", count: 2 },
  { name: "Alibaug", count: 1 },
];

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Destinations");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExperiences = EXPERIENCES_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesLocation =
      selectedLocation === "All Destinations" ||
      item.location.toLowerCase().includes(selectedLocation.toLowerCase()) ||
      item.stayLink.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#FDFDFD] pt-20 md:pt-24 pb-16">
      {/* Hero Banner with Authentic Location Image & Proportional Typography */}
      <section className="relative overflow-hidden mx-3 sm:mx-6 rounded-2xl md:rounded-3xl mb-8 md:mb-12 shadow-md">
        {/* Authentic Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/experiences/hero-banner.jpg"
            alt="Lonavala and Pawana Lake Western Ghats Luxury Getaway"
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 1280px"
            className="object-cover object-center"
          />
          {/* Dual Vignette & Dark Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/40 sm:to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25" />
        </div>

        {/* Content Container Aligned with Place and Description */}
        <div className="relative z-10 max-w-4xl py-12 sm:py-16 md:py-20 px-5 sm:px-8 lg:px-12 space-y-4 sm:space-y-5 text-left">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] sm:text-xs font-semibold text-orange-300">
            <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Lonavala • Pawana Lake • Khandala • Alibaug</span>
          </div>

          {/* Sleek, Balanced Heading (Proportional, Not Oversized) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight text-white leading-tight">
            Curated Local Experiences &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] via-amber-400 to-orange-300">
              Scenic Spots
            </span>
          </h1>

          {/* Authentic Destination Description */}
          <p className="text-xs sm:text-sm md:text-[15px] text-neutral-200 leading-relaxed max-w-2xl font-normal">
            Immerse yourself in Western India's most breathtaking hill country — from calm sunset kayaking at Pawana Lake and 2,000-year-old rock-cut Buddhist caves to panoramic cliff treks and cascading waterfalls, all within easy reach of your private luxury villa.
          </p>

          {/* Quick Destination Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-300 mr-1 hidden sm:inline">
              Explore by Area:
            </span>
            {POPULAR_LOCATIONS.map((loc) => {
              const isSelected = selectedLocation === loc.name;
              return (
                <button
                  key={loc.name}
                  onClick={() => setSelectedLocation(loc.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#ff6900] text-white shadow-xs"
                      : "bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/15 backdrop-blur-sm"
                  }`}
                >
                  {loc.name}
                  <span className="ml-1.5 opacity-70 text-[10px]">
                    ({loc.count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-2xs mb-8 space-y-3.5">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Tiger Point, Pawana Lake, Lohagad Fort, Caves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-neutral-500 font-medium">
              Showing{" "}
              <span className="text-neutral-900 font-bold">
                {filteredExperiences.length}
              </span>{" "}
              handpicked spots
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ff6900] text-white shadow-xs font-semibold"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Experience Cards Grid */}
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/80 p-8 space-y-3">
            <Compass className="w-10 h-10 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-800">
              No matching spots found
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              Try adjusting your search query or reset the location and category filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
                setSelectedLocation("All Destinations");
              }}
              className="mt-2 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredExperiences.map((spot) => {
              const CategoryIcon = spot.categoryIcon;

              return (
                <div
                  key={spot.id}
                  className="group flex flex-col bg-white rounded-2xl border border-neutral-200/80 overflow-hidden shadow-2xs hover:shadow-lg hover:border-orange-200 transition-all duration-300"
                >
                  {/* Image Container with Real Photograph */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                    <Image
                      src={spot.image}
                      alt={spot.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-neutral-900 backdrop-blur-md shadow-2xs">
                      <CategoryIcon className="w-3 h-3 text-[#ff6900]" />
                      <span>{spot.category}</span>
                    </div>

                    {/* Rating Pill */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-950/80 text-white backdrop-blur-md">
                        ★ {spot.rating}
                      </span>
                    </div>

                    {/* Bottom Title Overlay */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h2 className="text-base sm:text-lg font-bold text-white leading-snug drop-shadow-sm group-hover:text-orange-200 transition-colors">
                        {spot.title}
                      </h2>
                      <p className="text-[11px] text-neutral-200 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                        <span className="truncate">{spot.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Card Body with Balanced Proportions */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
                      {spot.description}
                    </p>

                    {/* Meta Info Grid */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50/80 p-2.5 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Calendar className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                        <span className="truncate font-medium">{spot.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-700">
                        <Clock className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                        <span className="truncate font-medium">{spot.duration}</span>
                      </div>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-1.5 pt-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        Key Highlights
                      </p>
                      <ul className="space-y-1">
                        {spot.highlights.slice(0, 3).map((hl, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-neutral-700"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] shrink-0" />
                            <span className="truncate">{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Link */}
                    <div className="pt-2">
                      <Link
                        href={spot.stayLink}
                        className="inline-flex w-full items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#ff6900] text-white text-xs font-semibold shadow-2xs transition-colors group/btn"
                      >
                        <span>Find Stays Nearby</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Local Concierge Assistance Callout */}
        <section className="mt-12 md:mt-16 rounded-2xl md:rounded-3xl bg-neutral-950 text-white p-6 sm:p-10 relative overflow-hidden border border-neutral-800 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Villa Concierge & Local Guides</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
              Need custom guided treks or private transfers?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              Our local Villa Concierge team can organize certified guides for Lohagad & Rajmachi fort hikes, private SUV transfers between Mumbai or Pune, and sunset boat rentals at Pawana Lake for your stay.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                href="/category/all"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold shadow-xs transition-all"
              >
                Browse Stays Near These Spots
              </Link>
              <Link
                href="/account/support"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-md transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Contact Concierge
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
