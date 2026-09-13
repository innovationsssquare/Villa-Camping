"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BaseUrl } from "@/lib/API/Baseurl";
import {
  Sparkles,
  Flame,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
} from "lucide-react";

export default function OffersCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch(`${BaseUrl}/OfferEvent/active`);
        if (!res.ok) return;
        const json = await res.json();
        if (json && Array.isArray(json.data) && json.data.length > 0) {
          // Strictly property events only (no coupons on homepage)
          const eventsOnly = json.data.filter((item) => item.type === "event");
          setItems(eventsOnly);
        }
      } catch (err) {
        console.warn("Failed to load property events for carousel:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const scroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === "left" ? -380 : 380;
    scrollContainerRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const formatDateRange = (start, end) => {
    if (!start) return "";
    const s = new Date(start);
    const sStr = s.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    if (!end) return sStr;
    const e = new Date(end);
    const eStr = e.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${sStr} - ${eStr}`;
  };

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-neutral-900 text-white overflow-hidden my-12 rounded-3xl mx-3 sm:mx-6 shadow-xl relative">
      {/* Subtle Ambient Background Light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header with Nav Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Upcoming Experiences</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Upcoming Property Events &amp; Experiences
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              Discover pool parties, acoustic bonfire sessions, sunset sundowners, and curated experiences hosted directly at our stays.
            </p>
          </div>

          {/* Nav Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Previous events"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white flex items-center justify-center shadow-md transition-colors cursor-pointer"
              aria-label="Next events"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel Scroll Area */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const propertyLink =
              item.ctaLink ||
              (item.propertyType && item.propertyId
                ? `/view-${item.propertyType.toLowerCase()}/${item.propertyId}`
                : "/category/all");

            return (
              <div
                key={item._id}
                className="snap-start shrink-0 w-[300px] sm:w-[360px] bg-neutral-950 rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden flex flex-col justify-between group shadow-lg hover:border-orange-500/40 transition-all duration-300"
              >
                {/* Card Banner Image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-800">
                  <img
                    src={item.bannerImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 shadow-md">
                      <Flame className="w-3 h-3 text-[#ff6900]" />
                      Experience
                    </span>

                    {item.discountBadge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#ff6900] text-white shadow-md">
                        {item.discountBadge}
                      </span>
                    )}
                  </div>

                  {item.propertyName && (
                    <div className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-orange-300 line-clamp-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span>{item.propertyName}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    {item.startDate && (
                      <div className="flex items-center gap-1.5 text-xs text-orange-400 font-semibold mb-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formatDateRange(item.startDate, item.endDate)}</span>
                      </div>
                    )}
                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2">
                    {/* Direct Property & Event Link CTA */}
                    <Link
                      href={propertyLink}
                      className="w-full h-11 rounded-xl bg-white/10 hover:bg-[#ff6900] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/15 hover:border-transparent transition-all shadow-sm group-hover:bg-[#ff6900]"
                    >
                      <span>{item.ctaText || "View Property & Event"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
