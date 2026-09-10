"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  BadgePercent,
  Sparkles,
  Headphones,
  Zap,
  MapPin,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NumberTicker } from "../magicui/number-ticker";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "item-0",
    index: "01",
    icon: ShieldCheck,
    tag: "Safety & Quality",
    title: "100% Verified Stays",
    description:
      "Every villa and campsite undergoes rigorous physical audits for hygiene, clean private pools, electrical safety, and verified working amenities before being listed.",
    highlights: [
      "30+ point physical quality audit",
      "Sanitized private pools & fresh linens",
      "100% real, verified photography",
    ],
    image: "/Aboutusasset/Villabanner.jpg",
    visualBadge: "Audited & Certified",
  },
  {
    id: "item-1",
    index: "02",
    icon: BadgePercent,
    tag: "Zero Markup",
    title: "Best Rate Guarantee",
    description:
      "Book with direct-from-host transparent pricing. You get verified best available rates with zero hidden convenience fees, surprise taxes, or booking markups.",
    highlights: [
      "Direct host contracted tariffs",
      "No hidden checkout fees or markups",
      "Exclusive long-weekend discounts",
    ],
    image: "/Homeasset/nearby-villa.jpg",
    visualBadge: "Guaranteed Lowest Price",
  },
  {
    id: "item-2",
    index: "03",
    icon: Sparkles,
    tag: "Handpicked Luxury",
    title: "Curated Scenic Escapes",
    description:
      "We handpick only top-tier stays — private infinity pool villas, serene lakefront glamping tents, and secluded mountain chalets designed for unforgettable group getaways.",
    highlights: [
      "Private infinity pool estates",
      "Lakeside glamping with stargazing",
      "Scenic mountain chalets & lawns",
    ],
    image: "/Aboutusasset/Campbanner.jpg",
    visualBadge: "Luxury Collection",
  },
  {
    id: "item-3",
    index: "04",
    icon: Headphones,
    tag: "Always Connected",
    title: "24/7 Dedicated Concierge",
    description:
      "From route guidance to private chefs and celebratory setups, our dedicated on-ground care team and travel experts are available around the clock via phone and WhatsApp.",
    highlights: [
      "Dedicated personal trip manager",
      "Instant WhatsApp assistance",
      "Custom BBQ, bonfire & decor support",
    ],
    image: "/Homeasset/fully-serviced.jpg",
    visualBadge: "On-Ground Assistance",
  },
  {
    id: "item-4",
    index: "05",
    icon: Zap,
    tag: "Real-Time Booking",
    title: "Instant Confirmation & Easy Access",
    description:
      "Enjoy live calendar availability, instant voucher generation, and secure payments. All properties feature verified GPS navigation and guaranteed private parking.",
    highlights: [
      "Real-time calendar reservations",
      "Instant digital vouchers & receipts",
      "Verified turn-by-turn road access",
    ],
    image: "/Aboutusasset/Cottagebanner.jpg",
    visualBadge: "Instant Confirmation",
  },
];

export function WhyChooseUs() {
  const [activeId, setActiveId] = useState("item-0");
  const currentFeature =
    features.find((f) => f.id === activeId) || features[0];

  return (
    <section className="relative w-full py-8 sm:py-12 md:py-16 bg-white overflow-hidden">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[750px] h-[350px] bg-gradient-to-tr from-orange-400/10 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with App-style Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-6 sm:mb-10 md:mb-12 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>The Villa Camp Difference</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Why Guests Choose Us</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              The Villa Camp
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            We are dedicated to creating seamless getaways with handpicked stays, transparent pricing, and trusted on-ground care.
          </p>
        </div>

        {/* =========================================================================
            Main Split Showcase: Interactive Accordion (Left) + Visual Card (Right)
           ========================================================================= */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
          {/* Left Column: Interactive Accordion */}
          <div className="w-full lg:w-7/12">
            <Accordion
              type="single"
              collapsible
              value={activeId}
              onValueChange={(val) => {
                if (val) setActiveId(val);
              }}
              className="space-y-3"
            >
              {features.map((feature) => {
                const IconComponent = feature.icon;
                const isOpen = activeId === feature.id;

                return (
                  <AccordionItem
                    key={feature.id}
                    value={feature.id}
                    className={cn(
                      "rounded-2xl border transition-all duration-300 overflow-hidden bg-white shadow-2xs",
                      isOpen
                        ? "border-[#ff6900]/60 shadow-md shadow-orange-500/10 bg-orange-50/15"
                        : "border-neutral-200/90 hover:border-neutral-300"
                    )}
                  >
                    <AccordionTrigger
                      className={cn(
                        "py-3.5 px-3.5 sm:px-4 hover:no-underline cursor-pointer group flex items-center justify-between gap-3 text-left",
                        isOpen ? "bg-orange-50/30" : ""
                      )}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                        {/* Icon Container */}
                        <div
                          className={cn(
                            "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
                            isOpen
                              ? "bg-[#ff6900] text-white shadow-sm shadow-orange-500/30 scale-105"
                              : "bg-orange-50 text-[#ff6900] border border-orange-200/60 group-hover:bg-orange-100/70"
                          )}
                        >
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>

                        {/* Title & Tag */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 font-mono">
                              {feature.index}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded-full border",
                                isOpen
                                  ? "bg-orange-100 text-[#ff6900] border-orange-200"
                                  : "bg-neutral-100 text-neutral-500 border-neutral-200"
                              )}
                            >
                              {feature.tag}
                            </span>
                          </div>
                          <h3
                            className={cn(
                              "text-xs sm:text-sm md:text-base font-bold truncate transition-colors",
                              isOpen ? "text-[#ff6900]" : "text-neutral-900 group-hover:text-neutral-800"
                            )}
                          >
                            {feature.title}
                          </h3>
                        </div>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="px-3.5 sm:px-4 pb-4 pt-1 text-neutral-600">
                      {/* Description */}
                      <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-neutral-600 mb-3">
                        {feature.description}
                      </p>

                      {/* Bullet Highlights */}
                      <div className="space-y-1.5 mb-3">
                        {feature.highlights.map((h, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6900] shrink-0" />
                            <span className="text-[10px] sm:text-xs text-neutral-700 font-medium">
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Mobile Embedded Visual Preview (Only on screens < lg) */}
                      <div className="lg:hidden relative h-36 w-full rounded-xl overflow-hidden mt-3 border border-neutral-200/80 bg-neutral-100">
                        <Image
                          src={feature.image}
                          alt={feature.title}
                          fill
                          unoptimized
                          sizes="(max-width: 1024px) 90vw, 40vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white z-10">
                          <span className="text-xs font-bold truncate">
                            {feature.title}
                          </span>
                          <span className="text-[9px] bg-[#ff6900] font-bold px-2 py-0.5 rounded-full shrink-0">
                            {feature.visualBadge}
                          </span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Right Column: Dynamic Desktop Visual Card (Sticky) */}
          <div className="hidden lg:block lg:w-5/12 sticky top-24">
            <div className="relative h-[480px] w-full rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xl shadow-orange-500/5 bg-neutral-900 group">
              {/* Dynamic Photo Display */}
              <Image
                src={currentFeature.image}
                alt={currentFeature.title}
                fill
                unoptimized
                sizes="500px"
                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
              />

              {/* Scrim Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

              {/* Top Floating Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#ff6900]" />
                  <span>{currentFeature.visualBadge}</span>
                </div>

                <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-black/5 text-xs font-bold text-neutral-900">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              {/* Bottom Overlaid Details Card */}
              <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-[#ff6900] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                    {currentFeature.tag}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400 font-bold">
                    FEATURE {currentFeature.index}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-neutral-900 mb-1 leading-tight">
                  {currentFeature.title}
                </h4>

                <p className="text-[11px] text-neutral-600 leading-relaxed line-clamp-2">
                  {currentFeature.description}
                </p>

                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Excellence
                  </span>
                  <span className="text-neutral-400">The Villa Camp Standard</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            Trust & Stats Section
           ========================================================================= */}
        <div className="mt-8 sm:mt-12 md:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-orange-50/90 border border-orange-200/80 p-4 sm:p-6 md:p-8 shadow-2xs">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-orange-200/60">
            {/* Stat 1 */}
            <div className="flex flex-col items-center pt-2 md:pt-0">
              <div className="flex items-center gap-0.5 text-[#ff6900] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                <NumberTicker value={500} className="text-[#ff6900] font-black" />
                <span>+</span>
              </div>
              <div className="text-neutral-900 font-bold text-xs sm:text-sm mt-0.5">
                Verified Stays
              </div>
              <p className="text-neutral-500 text-[10px] sm:text-[11px] hidden sm:block">
                Villas, Cottages & Tents
              </p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center pt-2 md:pt-0 md:pl-4">
              <div className="flex items-center gap-0.5 text-[#ff6900] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                <NumberTicker value={15000} className="text-[#ff6900] font-black" />
                <span>+</span>
              </div>
              <div className="text-neutral-900 font-bold text-xs sm:text-sm mt-0.5">
                Happy Travelers
              </div>
              <p className="text-neutral-500 text-[10px] sm:text-[11px] hidden sm:block">
                Unforgettable Getaways
              </p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center gap-1 text-[#ff6900] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                <NumberTicker
                  value={4.9}
                  decimalPlaces={1}
                  className="text-[#ff6900] font-black"
                />
                <span className="text-amber-500 text-lg sm:text-xl">★</span>
              </div>
              <div className="text-neutral-900 font-bold text-xs sm:text-sm mt-0.5">
                Average Rating
              </div>
              <p className="text-neutral-500 text-[10px] sm:text-[11px] hidden sm:block">
                Real Guest Reviews
              </p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center pt-3 md:pt-0 md:pl-4">
              <div className="flex items-center gap-0.5 text-[#ff6900] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                <NumberTicker value={24} className="text-[#ff6900] font-black" />
                <span>/</span>
                <NumberTicker value={7} className="text-[#ff6900] font-black" />
              </div>
              <div className="text-neutral-900 font-bold text-xs sm:text-sm mt-0.5">
                On-Ground Care
              </div>
              <p className="text-neutral-500 text-[10px] sm:text-[11px] hidden sm:block">
                Always Here to Help
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
