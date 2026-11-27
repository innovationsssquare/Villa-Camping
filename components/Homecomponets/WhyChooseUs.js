"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ShieldCheck,
  BadgePercent,
  Sparkles,
  Headphones,
  Zap,
  CheckCircle2,
  Star,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
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
    shortLabel: "Verified",
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
    shortLabel: "Best Rate",
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
    shortLabel: "Curated",
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
    shortLabel: "Concierge",
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
    shortLabel: "Instant",
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

const AUTO_ADVANCE_MS = 5500;

export function WhyChooseUs() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPausedByHover, setIsPausedByHover] = useState(false);

  const activeId = features[activeIndex]?.id || "item-0";
  const currentFeature = features[activeIndex] || features[0];

  // Scroll-driven motion across the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  const ambientBlobY = useTransform(smoothProgress, [0, 1], [-45, 55]);
  const visualParallaxY = useTransform(smoothProgress, [0, 1], [24, -24]);
  const visualParallaxScale = useTransform(smoothProgress, [0, 0.5, 1], [0.97, 1, 0.985]);
  const timelineScaleY = useTransform(smoothProgress, [0.1, 0.78], [0.05, 1]);

  // Smooth auto-cycle across pillars when enabled and not hovered
  useEffect(() => {
    if (!isAutoPlaying || isPausedByHover) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isPausedByHover, activeIndex]);

  const handleSelectIndex = (idx, pauseAuto = true) => {
    const normalized = ((idx % features.length) + features.length) % features.length;
    setActiveIndex(normalized);
    if (pauseAuto) setIsAutoPlaying(false);
  };

  const handleMobileDragEnd = (_event, info) => {
    if (info.offset.x < -45 || info.velocity.x < -300) {
      handleSelectIndex(activeIndex + 1, true);
    } else if (info.offset.x > 45 || info.velocity.x > 300) {
      handleSelectIndex(activeIndex - 1, true);
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={sectionRef}
        className="relative w-full py-10 sm:py-14 md:py-16 bg-white overflow-x-clip"
      >
        {/* Scroll-Driven Ambient Gradient Glow */}
        <motion.div
          style={{ y: ambientBlobY }}
          aria-hidden="true"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] sm:w-[780px] h-[360px] bg-gradient-to-tr from-orange-400/12 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Section Header - Centered with Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center max-w-2xl mx-auto mb-7 sm:mb-10 md:mb-12 px-2"
          >
            {/* Eyebrow Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-2 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900] animate-pulse" />
              <span>The Villa Camp Difference</span>
              <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
              <span className="text-neutral-600 font-normal">Why Guests Choose Us</span>
            </motion.div>

            {/* Heading */}
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight leading-snug">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
                The Villa Camp
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed max-w-md mx-auto">
              We are dedicated to creating seamless getaways with handpicked stays, transparent pricing, and trusted on-ground care.
            </p>
          </motion.div>

          {/* =========================================================================
              MOBILE INTERACTIVE DECK & PILL SELECTOR (< lg)
             ========================================================================= */}
          <div className="lg:hidden mb-6 space-y-3.5">
            {/* Interactive Horizontal Step Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {features.map((feature, idx) => {
                const isSelected = idx === activeIndex;
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => handleSelectIndex(idx, true)}
                    className={cn(
                      "relative shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer isolate",
                      isSelected
                        ? "text-white"
                        : "text-neutral-600 bg-neutral-100/90 border border-neutral-200/80 hover:text-neutral-900"
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="whyMobileActivePill"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] shadow-sm shadow-orange-500/25 z-0"
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 shrink-0 relative z-10" />
                    <span className="relative z-10">{feature.shortLabel}</span>
                  </button>
                );
              })}
            </div>

            {/* Swipeable Animated Mobile Feature Preview */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden border border-neutral-200/90 shadow-lg bg-neutral-900 touch-pan-y"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeature.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.18}
                  onDragEnd={handleMobileDragEnd}
                  initial={{ opacity: 0, x: 24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -24, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={currentFeature.image}
                    alt={currentFeature.title}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 95vw, 500px"
                    className="object-cover select-none pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                    <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-semibold flex items-center gap-1 border border-white/20">
                      <Sparkles className="w-3 h-3 text-[#ff6900]" />
                      {currentFeature.visualBadge}
                    </span>
                    <span className="bg-white/95 px-2 py-0.5 rounded-full text-[10px] font-bold text-neutral-900 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      4.9 / 5.0
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/40 shadow-md">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-[#ff6900] uppercase tracking-wider">
                        {currentFeature.index} • {currentFeature.tag}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-medium">
                        Swipe card
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-neutral-900 leading-tight">
                      {currentFeature.title}
                    </h3>
                    <p className="text-[11px] text-neutral-600 line-clamp-2 mt-0.5">
                      {currentFeature.description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* =========================================================================
              Main Split Showcase: Interactive Timeline + Accordion (Left) + Sticky Visual (Right)
             ========================================================================= */}
          <div
            className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10"
            onMouseEnter={() => setIsPausedByHover(true)}
            onMouseLeave={() => setIsPausedByHover(false)}
          >
            {/* Left Column: Scroll-Progress Rail + Interactive Accordion */}
            <div className="relative w-full lg:w-7/12 lg:pl-6">
              {/* Desktop Vertical Scroll Progress Timeline Rail */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute left-1.5 top-4 bottom-4 w-[3px] rounded-full bg-neutral-100 overflow-hidden"
              >
                <motion.div
                  style={{ scaleY: timelineScaleY, originY: 0 }}
                  className="w-full h-full bg-gradient-to-b from-[#ff6900] via-amber-400 to-[#ea580c] rounded-full"
                />
              </div>

              <Accordion
                type="single"
                collapsible
                value={activeId}
                onValueChange={(val) => {
                  const foundIdx = features.findIndex((f) => f.id === val);
                  if (foundIdx !== -1) handleSelectIndex(foundIdx, true);
                }}
                className="space-y-3"
              >
                {features.map((feature, idx) => {
                  const IconComponent = feature.icon;
                  const isOpen = activeId === feature.id;

                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{
                        duration: 0.42,
                        delay: idx * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="relative"
                    >
                      {/* Timeline Node Marker on Desktop */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "hidden lg:block absolute -left-[23px] top-6 w-3 h-3 rounded-full border-2 transition-all duration-300 z-10",
                          isOpen
                            ? "bg-[#ff6900] border-orange-200 scale-125 shadow-sm shadow-orange-500/40"
                            : "bg-white border-neutral-300"
                        )}
                      />

                      <AccordionItem
                        value={feature.id}
                        className={cn(
                          "relative rounded-2xl border transition-all duration-300 overflow-hidden bg-white shadow-2xs",
                          isOpen
                            ? "border-[#ff6900]/60 shadow-md shadow-orange-500/10 bg-orange-50/15"
                            : "border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs"
                        )}
                      >
                        <AccordionTrigger
                          className={cn(
                            "py-3.5 px-3.5 sm:px-4 hover:no-underline cursor-pointer group flex items-center justify-between gap-3 text-left",
                            isOpen ? "bg-orange-50/35" : ""
                          )}
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                            {/* Animated Icon Container */}
                            <motion.div
                              animate={{
                                scale: isOpen ? 1.06 : 1,
                                rotate: isOpen ? [0, -6, 0] : 0,
                              }}
                              transition={{ duration: 0.35 }}
                              className={cn(
                                "w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shrink-0",
                                isOpen
                                  ? "bg-gradient-to-br from-[#ff6900] to-[#ea580c] text-white shadow-sm shadow-orange-500/30"
                                  : "bg-orange-50 text-[#ff6900] border border-orange-200/60 group-hover:bg-orange-100/70"
                              )}
                            >
                              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.div>

                            {/* Title & Tag */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 font-mono">
                                  {feature.index}
                                </span>
                                <span
                                  className={cn(
                                    "text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.2 rounded-full border transition-colors",
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
                                  isOpen
                                    ? "text-[#ff6900]"
                                    : "text-neutral-900 group-hover:text-neutral-800"
                                )}
                              >
                                {feature.title}
                              </h3>
                            </div>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-3.5 sm:px-4 pb-4 pt-1 text-neutral-600">
                          <motion.div
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28 }}
                          >
                            {/* Description */}
                            <p className="text-[11px] sm:text-xs md:text-sm leading-relaxed text-neutral-600 mb-3">
                              {feature.description}
                            </p>

                            {/* Staggered Bullet Highlights */}
                            <div className="space-y-1.5 mb-3">
                              {feature.highlights.map((h, i) => (
                                <motion.div
                                  key={h}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.25, delay: i * 0.06 }}
                                  className="flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ff6900] shrink-0" />
                                  <span className="text-[10px] sm:text-xs text-neutral-700 font-medium">
                                    {h}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </AccordionContent>

                        {/* Animated Auto-Advance Progress Line on Active Desktop Card */}
                        {isOpen && isAutoPlaying && !isPausedByHover && (
                          <motion.div
                            key={`progress-${feature.id}-${activeIndex}`}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: AUTO_ADVANCE_MS / 1000,
                              ease: "linear",
                            }}
                            style={{ originX: 0 }}
                            className="hidden lg:block h-[2.5px] w-full bg-gradient-to-r from-[#ff6900] via-amber-400 to-[#ea580c]"
                          />
                        )}
                      </AccordionItem>
                    </motion.div>
                  );
                })}
              </Accordion>
            </div>

            {/* Right Column: Dynamic Desktop Visual Card (Sticky + Scroll Parallax + Animated Crossfade) */}
            <motion.div
              style={{ y: visualParallaxY, scale: visualParallaxScale }}
              className="hidden lg:block lg:w-5/12 sticky top-24"
            >
              <div className="relative h-[495px] w-full rounded-3xl overflow-hidden border border-neutral-200/90 shadow-xl shadow-orange-500/5 bg-neutral-900 group">
                {/* Animated Crossfade + Gentle Ken Burns Zoom */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentFeature.id}
                    initial={{ opacity: 0, scale: 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentFeature.image}
                      alt={currentFeature.title}
                      fill
                      unoptimized
                      sizes="500px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 pointer-events-none" />

                {/* Top Floating Badges + Interactive Play/Pause Toggle */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeature.visualBadge}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.25 }}
                      className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center gap-1.5 border border-white/20 shadow-sm"
                    >
                      <Sparkles className="w-3 h-3 text-[#ff6900]" />
                      <span>{currentFeature.visualBadge}</span>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAutoPlaying((prev) => !prev)}
                      aria-label={isAutoPlaying ? "Pause showcase rotation" : "Play showcase rotation"}
                      className="w-7 h-7 rounded-full bg-black/55 hover:bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      {isAutoPlaying ? (
                        <Pause className="w-3 h-3" />
                      ) : (
                        <Play className="w-3 h-3 ml-0.5" />
                      )}
                    </button>

                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-black/5 text-xs font-bold text-neutral-900">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5.0</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Overlaid Details Card with Smooth Transition & Controls */}
                <div className="absolute bottom-4 left-4 right-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-lg">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentFeature.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#ff6900] uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
                            {currentFeature.tag}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400 font-bold">
                            FEATURE {currentFeature.index}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {activeIndex + 1} / {features.length}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-neutral-900 mb-1 leading-tight">
                        {currentFeature.title}
                      </h4>

                      <p className="text-[11px] text-neutral-600 leading-relaxed line-clamp-2">
                        {currentFeature.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Interactive Prev / Dots / Next Showcase Controls */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Excellence
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleSelectIndex(activeIndex - 1, true)}
                        aria-label="Previous pillar"
                        className="w-6 h-6 rounded-full border border-neutral-200 hover:border-[#ff6900] hover:text-[#ff6900] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1 px-1">
                        {features.map((f, idx) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => handleSelectIndex(idx, true)}
                            aria-label={`View ${f.title}`}
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                              idx === activeIndex
                                ? "w-4 bg-[#ff6900]"
                                : "w-1.5 bg-neutral-300 hover:bg-neutral-400"
                            )}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectIndex(activeIndex + 1, true)}
                        aria-label="Next pillar"
                        className="w-6 h-6 rounded-full border border-neutral-200 hover:border-[#ff6900] hover:text-[#ff6900] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* =========================================================================
              Trust & Stats Section with Scroll Reveal & Hover Elevation
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 sm:mt-12 md:mt-16 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-orange-50/90 via-amber-50/40 to-orange-50/90 border border-orange-200/80 p-4 sm:p-6 md:p-8 shadow-2xs"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-orange-200/60">
              {/* Stat 1 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex flex-col items-center pt-2 md:pt-0"
              >
                <div className="flex items-center gap-0.5 text-[#ff6900] font-black text-xl sm:text-2xl md:text-3xl tracking-tight">
                  <NumberTicker value={500} className="text-[#ff6900] font-black" />
                  <span>+</span>
                </div>
                <div className="text-neutral-900 font-bold text-xs sm:text-sm mt-0.5">
                  Verified Stays
                </div>
                <p className="text-neutral-500 text-[10px] sm:text-[11px] hidden sm:block">
                  Villas, Cottages &amp; Tents
                </p>
              </motion.div>

              {/* Stat 2 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex flex-col items-center pt-2 md:pt-0 md:pl-4"
              >
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
              </motion.div>

              {/* Stat 3 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex flex-col items-center pt-3 md:pt-0 md:pl-4"
              >
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
              </motion.div>

              {/* Stat 4 */}
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className="flex flex-col items-center pt-3 md:pt-0 md:pl-4"
              >
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
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}

export default WhyChooseUs;
