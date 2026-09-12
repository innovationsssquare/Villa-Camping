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
  Camera,
  Footprints,
  Landmark,
  Tent,
  CheckCircle2,
  PhoneCall,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const EXPERIENCES_DATA = [
  {
    id: "tiger-point",
    title: "Tiger Point & Lion's Point",
    category: "Scenic Viewpoint",
    categoryIcon: Mountain,
    distance: "12 km from Lonavala",
    bestTime: "Sunrise & Monsoon (July – Oct)",
    duration: "2 - 3 Hours",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    description:
      "Perched on a sheer 650-meter cliff, Tiger Point offers panoramic views of the Sahyadri valleys often enveloped in swirling clouds. Famous for hot charcoal-roasted sweet corn (bhutta) and masala chai.",
    highlights: [
      "Spectacular 650m vertical cliff drop",
      "Swirling monsoon clouds & valley mist",
      "Authentic local street snacks & chai stalls",
      "Stunning sunrise & sunset vista points",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "pawana-lake",
    title: "Pawana Lake Sunset & Stargazing",
    category: "Lakeside & Camp",
    categoryIcon: Waves,
    distance: "18 km from Lonavala",
    bestTime: "Oct – May (Cool evenings)",
    duration: "Half / Full Day",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
    description:
      "A sparkling artificial reservoir surrounded by three historic forts: Tung, Tikona, and Lohagad. Enjoy quiet evening kayaking, lakeside barbecues, and clear dark-sky stargazing by a crackling bonfire.",
    highlights: [
      "Calm freshwater kayaking & boating",
      "Lakeside bonfires under unpolluted starry skies",
      "Scenic views of Tikona & Tung fort peaks",
      "Peaceful retreat away from city noise",
    ],
    stayLink: "/category/all?location=pawana",
  },
  {
    id: "lohagad-fort",
    title: "Lohagad Fort (The Iron Citadel)",
    category: "Historical Trek",
    categoryIcon: Landmark,
    distance: "11 km from Lonavala",
    bestTime: "Monsoons & Winter (June – Feb)",
    duration: "3 - 4 Hours",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&auto=format&fit=crop&q=80",
    description:
      "A formidable hilltop fortress with over two millennia of history, Lohagad boasts grand stone gateways and the famous 'Vinchu Kata' (Scorpion's Tail) ridge protruding dramatically into the valley.",
    highlights: [
      "Walk the exhilarating Vinchu Kata ridge",
      "Well-preserved four grand entrance gates",
      "Panoramic 360° views over Pawana reservoir",
      "Easy-to-moderate trek suitable for families",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "bhushi-dam",
    title: "Bhushi Dam Cascading Waterfalls",
    category: "Waterfalls & Splash",
    categoryIcon: Waves,
    distance: "6 km from Lonavala",
    bestTime: "Peak Monsoon (July – Sept)",
    duration: "2 Hours",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&auto=format&fit=crop&q=80",
    description:
      "When the Indrayani River overflows during the rains, Bhushi Dam transforms into a vibrant cascade of water over stepped masonry rocks. A favorite monsoon gathering spot for cool splashes.",
    highlights: [
      "Step-style natural rock water cascade",
      "Lush forest greenery and misty breeze",
      "Local pakoda and hot cutting chai nearby",
      "Direct road access with easy parking",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "karla-bhaja-caves",
    title: "Karla & Bhaja Buddhist Caves",
    category: "Heritage & History",
    categoryIcon: Landmark,
    distance: "12 km from Lonavala",
    bestTime: "Year-Round (Morning Hours)",
    duration: "2 - 3 Hours",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1590059390046-24e5443a6d09?w=800&auto=format&fit=crop&q=80",
    description:
      "Dating back to the 2nd century BCE, Karla features India's largest and most intact rock-cut Buddhist prayer hall (Chaityagriha) with 2,000-year-old teak wood beams and intricate elephant sculptures.",
    highlights: [
      "India's largest ancient rock-cut Chaitya hall",
      "Original 2,000-year-old wooden arched roof",
      "Intricate Buddhist sculptures & monastery cells",
      "Scenic hillside steps with panoramic valley views",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "dukes-nose",
    title: "Duke's Nose (Nagphani Cliff)",
    category: "Adventure & Treks",
    categoryIcon: Footprints,
    distance: "7 km from Lonavala",
    bestTime: "Oct – April (Mild weather)",
    duration: "3 - 5 Hours",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&auto=format&fit=crop&q=80",
    description:
      "Named after the Duke of Wellington's distinctive profile, this monolithic cliff overhang is famous for high-thrill valley rappelling, rock climbing, slacklining, and jaw-dropping views of Khandala Ghat.",
    highlights: [
      "Premier rappelling & rock climbing rock face",
      "Unobstructed views of Mumbai-Pune expressway ghats",
      "Mahadeva temple sanctuary at cliff summit",
      "Invigorating forest trail through Khandala woods",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "rajmachi-fort",
    title: "Rajmachi Fort & Fireflies Trail",
    category: "Adventure & Treks",
    categoryIcon: Tent,
    distance: "15 km from Lonavala",
    bestTime: "May – June (Fireflies) / July – Sept (Monsoon)",
    duration: "Full Day",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop&q=80",
    description:
      "A legendary pair of fortified peaks — Shrivardhan and Manaranjan — rising high above deep canyons. During May-June, the surrounding forests become illuminated by millions of glowing synchronized fireflies.",
    highlights: [
      "Bioluminescent pre-monsoon firefly phenomenon",
      "Twin citadel exploration with ancient water cisterns",
      "Scenic trail passing waterfalls and tribal hamlets",
      "Incredible viewpoint overlooking the Konkan plains",
    ],
    stayLink: "/category/all?location=lonavala",
  },
  {
    id: "kune-falls",
    title: "Kune Waterfalls",
    category: "Waterfalls & Splash",
    categoryIcon: Waves,
    distance: "4 km from Lonavala",
    bestTime: "Peak Monsoon (July – Sept)",
    duration: "1 - 2 Hours",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    description:
      "Ranked as the 14th highest waterfall in India with a 200-meter drop, Kune Falls is a majestic three-tiered spectacle nestled between the twin hill towns of Lonavala and Khandala.",
    highlights: [
      "200-meter three-tiered waterfall cascade",
      "Surrounded by emerald green forested hills",
      "Spectacular photography point from Old Highway",
      "Quiet natural pocket with refreshing mist",
    ],
    stayLink: "/category/all?location=lonavala",
  },
];

const CATEGORIES = [
  "All",
  "Scenic Viewpoint",
  "Lakeside & Camp",
  "Historical Trek",
  "Waterfalls & Splash",
  "Heritage & History",
  "Adventure & Treks",
];

export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExperiences = EXPERIENCES_DATA.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.distance.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-24 md:pt-28 pb-16">
      <section className="relative overflow-hidden bg-neutral-950 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 mx-3 sm:mx-6 rounded-3xl mb-12 shadow-xl">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-orange-400 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Curated Lonavala & Pawana Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Iconic Experiences & Spots in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] via-amber-400 to-orange-300">
              Lonavala
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed">
            From mist-shrouded cliff points and ancient Buddhist caves to tranquil lakeside bonfires at Pawana — explore the finest attractions around your private luxury villa.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs sm:text-sm text-neutral-300">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#ff6900]" />
              <span className="font-semibold text-white">8 Famous Spots</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#ff6900]" />
              <span className="font-semibold text-white">100+ Luxury Stays Nearby</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:block" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-white">Verified Local Recommendations</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/80 shadow-xs mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search input */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search Tiger Point, Pawana, Lohagad, Caves..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
              />
            </div>

            <p className="text-xs text-neutral-500 font-medium">
              Showing{" "}
              <span className="text-neutral-900 font-bold">
                {filteredExperiences.length}
              </span>{" "}
              handpicked destinations
            </p>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-[#ff6900] text-white shadow-xs"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredExperiences.map((spot) => {
            const CategoryIcon = spot.categoryIcon;

            return (
              <div
                key={spot.id}
                className="group flex flex-col bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-neutral-900 backdrop-blur-md shadow-xs">
                      <CategoryIcon className="w-3 h-3 text-[#ff6900]" />
                      {spot.category}
                    </span>
                  </div>

                  <div className="absolute top-3.5 right-3.5">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-neutral-950/80 text-white backdrop-blur-md">
                      ★ {spot.rating}
                    </span>
                  </div>

                  {/* Title overlay in image */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5">
                    <h2 className="text-lg font-bold text-white leading-snug drop-shadow-sm">
                      {spot.title}
                    </h2>
                    <p className="text-xs text-neutral-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      {spot.distance}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed line-clamp-3">
                    {spot.description}
                  </p>

                  {/* Meta Pills */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                      <span className="truncate">{spot.bestTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-700">
                      <Clock className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                      <span className="truncate">{spot.duration}</span>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      Spot Highlights
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
                      className="inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#ff6900] text-white text-xs font-semibold shadow-xs transition-colors group/btn"
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

        {/* Custom Experience Inquiry Callout */}
        <section className="mt-16 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white p-8 md:p-12 relative overflow-hidden border border-neutral-800">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Itineraries</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">
              Want a customized guided tour or private transport?
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Our local Villa Concierge can organize private SUV transfers, certified trekking guides for Rajmachi and Lohagad, and sunset boating at Pawana Lake for your group.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/category/all"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
              >
                Browse Available Stays
              </Link>
              <Link
                href="/account/support"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                Contact Concierge
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
