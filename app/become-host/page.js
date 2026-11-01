"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Camera,
  Banknote,
  Users,
  ChevronDown,
  ChevronRight,
  Phone,
  MessageSquare,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Star,
  Download,
  Building2,
  Compass,
  ArrowUpRight,
  Lock,
  Clock,
  Shield,
  BadgeCheck,
  Check,
  QrCode,
  Smartphone,
  MapPin,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseUrl } from "@/lib/API/Baseurl";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// =============================================================================
// DATA: YIELD ESTIMATOR MATRIX
// =============================================================================
const LOCATION_RATES = {
  Lonavala: {
    "2 BHK": { monthly: "₹2,20,000 - ₹3,40,000", weekendAdr: "₹14,500", occupancy: "78%" },
    "3 BHK": { monthly: "₹3,50,000 - ₹5,20,000", weekendAdr: "₹22,000", occupancy: "82%" },
    "4 BHK": { monthly: "₹4,80,000 - ₹7,40,000", weekendAdr: "₹32,000", occupancy: "85%" },
    "5+ BHK": { monthly: "₹7,00,000 - ₹12,50,000", weekendAdr: "₹48,000", occupancy: "86%" },
  },
  "Pawana Lake": {
    "2 BHK": { monthly: "₹1,80,000 - ₹2,90,000", weekendAdr: "₹12,000", occupancy: "75%" },
    "3 BHK": { monthly: "₹3,00,000 - ₹4,60,000", weekendAdr: "₹18,500", occupancy: "80%" },
    "4 BHK": { monthly: "₹4,20,000 - ₹6,50,000", weekendAdr: "₹27,000", occupancy: "83%" },
    "5+ BHK": { monthly: "₹6,20,000 - ₹10,80,000", weekendAdr: "₹42,000", occupancy: "84%" },
  },
  Alibaug: {
    "2 BHK": { monthly: "₹2,50,000 - ₹3,80,000", weekendAdr: "₹16,000", occupancy: "80%" },
    "3 BHK": { monthly: "₹4,00,000 - ₹6,00,000", weekendAdr: "₹26,000", occupancy: "84%" },
    "4 BHK": { monthly: "₹5,50,000 - ₹8,80,000", weekendAdr: "₹38,000", occupancy: "87%" },
    "5+ BHK": { monthly: "₹8,50,000 - ₹14,50,000", weekendAdr: "₹55,000", occupancy: "88%" },
  },
  Khandala: {
    "2 BHK": { monthly: "₹2,10,000 - ₹3,30,000", weekendAdr: "₹14,000", occupancy: "76%" },
    "3 BHK": { monthly: "₹3,40,000 - ₹5,00,000", weekendAdr: "₹21,000", occupancy: "80%" },
    "4 BHK": { monthly: "₹4,60,000 - ₹7,10,000", weekendAdr: "₹30,000", occupancy: "83%" },
    "5+ BHK": { monthly: "₹6,80,000 - ₹11,80,000", weekendAdr: "₹46,000", occupancy: "85%" },
  },
  Karjat: {
    "2 BHK": { monthly: "₹1,60,000 - ₹2,60,000", weekendAdr: "₹11,500", occupancy: "74%" },
    "3 BHK": { monthly: "₹2,80,000 - ₹4,20,000", weekendAdr: "₹17,000", occupancy: "78%" },
    "4 BHK": { monthly: "₹3,90,000 - ₹5,90,000", weekendAdr: "₹24,500", occupancy: "81%" },
    "5+ BHK": { monthly: "₹5,60,000 - ₹9,20,000", weekendAdr: "₹38,000", occupancy: "82%" },
  },
  Mahabaleshwar: {
    "2 BHK": { monthly: "₹1,90,000 - ₹3,00,000", weekendAdr: "₹13,000", occupancy: "75%" },
    "3 BHK": { monthly: "₹3,20,000 - ₹4,80,000", weekendAdr: "₹19,500", occupancy: "79%" },
    "4 BHK": { monthly: "₹4,40,000 - ₹6,80,000", weekendAdr: "₹28,500", occupancy: "82%" },
    "5+ BHK": { monthly: "₹6,40,000 - ₹10,90,000", weekendAdr: "₹43,000", occupancy: "84%" },
  },
};

// =============================================================================
// DATA: FAQ LIST
// =============================================================================
const FAQ_LIST = [
  {
    q: "How does The Villa Camp pricing and commission model work?",
    a: "We operate on a zero-upfront-cost, performance-based partnership model. Listing your property, professional drone/HDR photography, and onboarding are completely free. We charge a modest performance commission only when your villa generates confirmed, paid bookings.",
  },
  {
    q: "Can I block dates for my personal family stays?",
    a: "Absolutely! Through the Owner App or host web portal, you have full 1-tap control over your master calendar. You can block off personal weekends, holidays, or maintenance days anytime with zero penalty or restrictions.",
  },
  {
    q: "How are incoming guests vetted for safety and security?",
    a: "Every adult guest must provide government-approved ID (Aadhaar, Passport, or Driving License) prior to check-in. We enforce strict house rules against unauthorized party crowds and maintain on-ground caretaker coordination for physical check-ins.",
  },
  {
    q: "When and how do hosts receive rental payouts?",
    a: "Payouts are automated directly into your registered bank account within 24 hours of guest check-in via RazorpayX. You can review detailed transaction breakdowns, taxes, and monthly reports instantly in the Owner App.",
  },
  {
    q: "Who handles property marketing and professional photography?",
    a: "Our in-house creative production team conducts a complimentary photoshoot with architectural cameras and high-definition aerial drone footage (worth ₹25,000). We market your property across high-net-worth traveler networks and curated corporate channels.",
  },
];

export default function BecomeHostPage() {
  // Yield Estimator State
  const [selectedLocation, setSelectedLocation] = useState("Lonavala");
  const [selectedBhk, setSelectedBhk] = useState("3 BHK");
  const [isLocationDrawerOpen, setIsLocationDrawerOpen] = useState(false);
  const [isBhkDrawerOpen, setIsBhkDrawerOpen] = useState(false);

  // Host Inquiry Form State (Strictly preserved)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    propertyType: "Luxury Villa",
    location: "Lonavala",
    bedrooms: "3 BHK",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  // Current Estimated Figures
  const currentEstimate = useMemo(() => {
    const locData = LOCATION_RATES[selectedLocation] || LOCATION_RATES["Lonavala"];
    return locData[selectedBhk] || locData["3 BHK"];
  }, [selectedLocation, selectedBhk]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError("Please provide your full name and valid phone number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}/HostInquiry/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          propertyType: formData.propertyType,
          location: formData.location,
          bedrooms: formData.bedrooms,
          source: "become_host_page",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit property inquiry.");
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Host inquiry submission error:", err);
      setError(
        err.message || "Could not submit inquiry. Please try again or call our host hotline."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-neutral-900 selection:bg-[#ff6900] selection:text-white">
      {/* =====================================================================
          1. 📱 MOBILE VIEW ONLY (block md:hidden): Matches Homepage Hero
          ===================================================================== */}
      <div className="block md:hidden bg-white relative mb-2">
        {/* Banner with Centered Typography */}
        <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0">
            <Image
              src="/Aboutusasset/Villabanner.jpg"
              alt="Turn Your Villa Into High Yield"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.88] contrast-[1.03]"
            />
          </div>

          {/* Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none z-[1]" />

          {/* Center: Bold White Headline & Translucent Tag */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-14 pb-14">
            <div className="flex flex-col items-center max-w-sm">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.22] drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                Turn Your Villa Into High Yield
              </h1>

              <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/70 bg-black/30 backdrop-blur-md text-white text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Host Partnership • 24h Payouts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Yield Estimator & List Card Overlapping Hero Banner */}
        <div className="relative z-30 px-3.5 -mt-16 sm:-mt-20 pb-3">
          <div className="bg-white rounded-[24px] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80">
            {/* Box 1: Location Picker Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsLocationDrawerOpen(true)}
              className="w-full bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3.5 py-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-[#ff6900] shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-neutral-500 font-medium">Villa Location</span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-800 truncate">
                    {selectedLocation}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
            </button>

            {/* Box 2: BHK Picker & Dynamic Estimated Yield Side-by-Side */}
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              {/* BHK Picker */}
              <button
                type="button"
                onClick={() => setIsBhkDrawerOpen(true)}
                className="bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] min-w-0 shadow-2xs text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-orange-100/80 flex items-center justify-center text-[#ff6900] shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-neutral-500 font-medium">Bedrooms</span>
                    <span className="text-[11px] font-bold text-neutral-900 truncate">
                      {selectedBhk}
                    </span>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              </button>

              {/* Live Estimated Yield Preview */}
              <div className="bg-[#f8f9fc] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center gap-2 shadow-2xs min-w-0">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <Banknote className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-neutral-500 font-medium">Est. Monthly</span>
                  <span className="text-[11px] font-bold text-emerald-600 truncate">
                    {currentEstimate.monthly.split(" - ")[0]}...
                  </span>
                </div>
              </div>
            </div>

            {/* Box 3: Orange CTA Button */}
            <button
              type="button"
              onClick={() => scrollToSection("inquiry-form-section")}
              className="mt-3.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6900] via-[#ff7a1a] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] active:scale-[0.98] text-white font-bold text-sm shadow-[0_8px_24px_rgba(255,105,0,0.36)] flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>List Your Property</span>
            </button>

            <p className="text-[10px] text-neutral-400 text-center mt-2.5 font-normal">
              Zero upfront fees • Free professional photography • 24h Payouts
            </p>
          </div>
        </div>

        {/* Location Selection Drawer */}
        <Drawer open={isLocationDrawerOpen} onOpenChange={setIsLocationDrawerOpen}>
          <DrawerContent className="max-h-[85vh] rounded-t-3xl border-none bg-white p-0 overflow-hidden">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1" />
            <DrawerHeader className="text-left px-5 pt-2 pb-3 border-b border-neutral-150">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#ff6900]" />
                    <span>Select Villa Destination</span>
                  </DrawerTitle>
                  <div className="text-xs text-neutral-500 font-medium mt-0.5">
                    Choose your property&apos;s regional market
                  </div>
                </div>
                <DrawerClose asChild>
                  <button type="button" className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-500">
                    <X className="h-4 w-4" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="px-5 py-3 divide-y divide-neutral-100 max-h-[55vh] overflow-y-auto no-scrollbar">
              {Object.keys(LOCATION_RATES).map((loc) => {
                const isSelected = selectedLocation === loc;
                return (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3.5 text-left transition-colors hover:text-[#ff6900]"
                  >
                    <span className={cn("text-sm", isSelected ? "font-bold text-[#ff6900]" : "font-medium text-neutral-800")}>
                      {loc}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#ff6900]" />}
                  </button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>

        {/* BHK Selection Drawer */}
        <Drawer open={isBhkDrawerOpen} onOpenChange={setIsBhkDrawerOpen}>
          <DrawerContent className="max-h-[85vh] rounded-t-3xl border-none bg-white p-0 overflow-hidden">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1" />
            <DrawerHeader className="text-left px-5 pt-2 pb-3 border-b border-neutral-150">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#ff6900]" />
                    <span>Select Villa Configuration</span>
                  </DrawerTitle>
                  <div className="text-xs text-neutral-500 font-medium mt-0.5">
                    Choose the bedroom count of your property
                  </div>
                </div>
                <DrawerClose asChild>
                  <button type="button" className="rounded-full w-8 h-8 flex items-center justify-center hover:bg-neutral-100 text-neutral-500">
                    <X className="h-4 w-4" />
                  </button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="px-5 py-3 divide-y divide-neutral-100 max-h-[55vh] overflow-y-auto no-scrollbar">
              {["2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk) => {
                const isSelected = selectedBhk === bhk;
                return (
                  <button
                    key={bhk}
                    type="button"
                    onClick={() => {
                      setSelectedBhk(bhk);
                      setIsBhkDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3.5 text-left transition-colors hover:text-[#ff6900]"
                  >
                    <span className={cn("text-sm", isSelected ? "font-bold text-[#ff6900]" : "font-medium text-neutral-800")}>
                      {bhk}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-[#ff6900]" />}
                  </button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* =====================================================================
          1. 💻 DESKTOP VIEW ONLY (hidden md:flex): Matches Homepage Hero
          ===================================================================== */}
      <section className="hidden md:flex relative w-full min-h-[600px] lg:min-h-[660px] flex-col justify-between overflow-hidden shadow-xl mb-12 sm:mb-16">
        {/* Authentic Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/Aboutusasset/Villabanner.jpg"
            alt="The Villa Camp Luxury Estate Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.88] contrast-[1.03]"
          />
          {/* Dual Vignette & Dark Gradient Overlay for Maximum Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75 pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none z-[1]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none z-[1]" />
        </div>

        {/* Hero Content Container (pt-28 md:pt-32 accounts for transparent header) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-10 flex flex-col justify-between flex-1">
          <div className="max-w-3xl flex flex-col">
            {/* Transparent Blur Badge */}
            <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse shrink-0" />
              <span>The Villa Camp Host Partnership</span>
              <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
              <span className="text-white/80 font-normal">Western India&apos;s Luxury Network</span>
            </div>

            {/* Main Headline: Bold White Text with Editorial Proportions */}
            <h1 className="text-2xl md:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.18] drop-shadow-lg">
              Turn Your Luxury Villa Into a High-Yield Asset
            </h1>

            {/* Shortened Subtitle */}
            <p className="text-white/90 text-sm md:text-base max-w-2xl mt-3.5 font-normal leading-relaxed drop-shadow-md">
              Join Western India&apos;s premier luxury hospitality network with zero upfront fees, verified guests, and automated 24-hour payouts.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => scrollToSection("inquiry-form-section")}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>List Your Property</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("yield-estimator")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#ff6900]" />
                <span>Estimate Your Earnings</span>
              </button>
            </div>
          </div>

          {/* Proof Strip / Metric Pills (Frosted Glass on Hero) */}
          <div className="mt-10 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
                <span className="block text-lg sm:text-2xl font-black text-white">₹4.5L - ₹8.5L</span>
                <span className="text-[11px] text-white/70 mt-0.5 block font-medium">
                  Avg. Monthly Gross Yield
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
                <span className="block text-lg sm:text-2xl font-black text-emerald-400">100%</span>
                <span className="text-[11px] text-white/70 mt-0.5 block font-medium">
                  Govt ID Verified Guests
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
                <span className="block text-lg sm:text-2xl font-black text-white">₹0</span>
                <span className="text-[11px] text-white/70 mt-0.5 block font-medium">
                  Zero Upfront Listing Fee
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shadow-xs">
                <span className="block text-lg sm:text-2xl font-black text-[#ff6900]">48 Hours</span>
                <span className="text-[11px] text-white/70 mt-0.5 block font-medium">
                  Inspection to Live Booking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DYNAMIC EARNINGS / YIELD ESTIMATOR
          ===================================================================== */}
      <section
        id="yield-estimator"
        className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-neutral-200 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Transparent Profitability
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Estimate Your Villa&apos;s Monthly Revenue
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              Realized metrics based on historical occupancy data across our active Maharashtra
              portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl shadow-neutral-900/5">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Location Selectors */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2.5">
                  1. Select Destination Area
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.keys(LOCATION_RATES).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        setSelectedLocation(loc);
                        setFormData((prev) => ({ ...prev, location: loc }));
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        selectedLocation === loc
                          ? "bg-[#ff6900] text-white border-[#ff6900] shadow-md shadow-[#ff6900]/20"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-600 mb-2.5">
                  2. Select Property Configuration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => {
                        setSelectedBhk(bhk);
                        setFormData((prev) => ({ ...prev, bedrooms: bhk }));
                      }}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        selectedBhk === bhk
                          ? "bg-neutral-900 text-white border-neutral-900 shadow-md"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights Note */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200/70 text-xs text-neutral-700">
                <ShieldCheck className="w-4 h-4 text-[#ff6900] shrink-0" />
                <span>
                  Includes professional housekeeping supervision, dynamic pricing algorithms, and 24/7 guest concierge.
                </span>
              </div>
            </div>

            {/* Right Result Card (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <span className="text-xs text-neutral-400 font-medium">
                    {selectedLocation} • {selectedBhk}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <TrendingUp className="w-3 h-3" /> Live Demand
                  </span>
                </div>

                <div>
                  <span className="text-xs text-neutral-400 font-medium block">
                    Estimated Monthly Yield (Gross)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-[#ff6900] mt-1">
                    {currentEstimate.monthly}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                    <span className="text-[11px] text-neutral-400 block">Avg. Weekend ADR</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {currentEstimate.weekendAdr}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                    <span className="text-[11px] text-neutral-400 block">Target Occupancy</span>
                    <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
                      {currentEstimate.occupancy}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button
                  onClick={() => scrollToSection("inquiry-form-section")}
                  className="w-full h-11 bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#ff6900]/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Lock In These Rates for Your Stay</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. THE 4 CORE PILLARS OF HOST PARTNERSHIP
          ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Total Owner Protection
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Why Premier Estate Owners Partner With Us
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2">
              We handle every operational headache so you enjoy purely passive hospitality income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">100% Guest KYC Audits</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Every booking undergoes mandatory government photo ID checks and screening against
                  unauthorized parties.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Party Policy</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Free HDR & Drone Shoot</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Complimentary architectural photography and 4K aerial drone coverage worth
                  ₹25,000 at zero cost to you.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-blue-600">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Cost Setup</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#ff6900] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">24h Automated Payouts</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Direct bank settlements via RazorpayX within 24 hours of guest check-in. Never
                  chase payment balances.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-[#ff6900]">
                <Check className="w-3.5 h-3.5" />
                <span>Instant Bank Credit</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xl hover:shadow-neutral-900/5 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Regional Field Managers</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Dedicated on-ground villa supervisors in Lonavala and Alibaug inspecting upkeep and
                  assisting caretaking staff.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] font-semibold text-purple-600">
                <Check className="w-3.5 h-3.5" />
                <span>On-Ground Supervision</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. 3-STEP SIMPLE ONBOARDING ROADMAP
          ===================================================================== */}
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-y border-neutral-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Swift 48-Hour Turnaround
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              From Inquiry to First Booking in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="text-3xl font-black text-neutral-300 block mb-3">01</span>
              <h4 className="text-base font-bold text-neutral-900 mb-1.5">Submit Property Details</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Fill out our simple 2-minute inquiry form below. Tell us your villa location,
                amenities, and room layout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="text-3xl font-black text-neutral-300 block mb-3">02</span>
              <h4 className="text-base font-bold text-neutral-900 mb-1.5">Site Audit & Free Shoot</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our regional manager visits for a rapid quality audit and conducts our complimentary
                drone & HDR photoshoot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-sm hover:shadow-md transition-shadow relative">
              <span className="text-3xl font-black text-[#ff6900] block mb-3">03</span>
              <h4 className="text-base font-bold text-neutral-900 mb-1.5">Go Live & Earn</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your luxury property is launched across high-intent travelers. Track bookings and
                automated payouts on your Owner App.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DOWNLOAD APP SECTION WITH REALISTIC MOBILE SCREEN MOCKUP
          ===================================================================== */}
      <section
        id="download-app"
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        {/* Background mesh glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#ff6900]/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Description (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#ff6900]">
                <Smartphone className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>The Villa Camp • Owner App</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
                Your Complete Villa Empire{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-500">
                  in the Palm of Your Hand
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-neutral-600 leading-relaxed">
                Whether relaxing in Mumbai or traveling abroad, the Thevillacamp Owner App gives you
                instant, real-time oversight over your estate. Monitor bookings, block personal dates,
                and receive automated daily earnings alerts.
              </p>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-700">
                    <strong className="text-neutral-900">Instant Reservation Alerts:</strong> Push
                    notifications the second a confirmed guest pays.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-700">
                    <strong className="text-neutral-900">1-Tap Personal Stay Block:</strong> Reserve your
                    villa for family weekends instantly.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-700">
                    <strong className="text-neutral-900">Live RazorpayX Settlement:</strong> Transparent
                    breakdown of rent, taxes, and bank transfers.
                  </div>
                </div>
              </div>

              {/* Badges & QR Code */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {/* App Store Badge */}
                <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-3 transition-colors cursor-pointer shadow-md">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.92.04-2.02.62-2.66 1.37-.56.65-.87 1.7-.74 2.72 1.03.08 2.07-.49 2.48-1.24z" />
                  </svg>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Download on
                    </span>
                    <span className="text-xs font-bold text-white block">Apple App Store</span>
                  </div>
                </div>

                {/* Google Play Badge */}
                <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center gap-3 transition-colors cursor-pointer shadow-md">
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.793 12 3.61 22.186c-.28-.27-.44-.657-.44-1.096V2.91c0-.44.16-.827.439-1.096zm11.238 11.239l2.096-2.096-10.45-6.033 8.354 8.129zm2.096-4.108l2.25 1.3c.75.433.75 1.134 0 1.567l-2.25 1.3-2.096-2.096 2.096-2.071zm-4.192-2.071L4.397 21.314l10.45-6.033-2.096-2.096z" />
                  </svg>
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Get it on
                    </span>
                    <span className="text-xs font-bold text-white block">Google Play Store</span>
                  </div>
                </div>

                {/* Direct APK / Host Login */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-700">
                  <QrCode className="w-4 h-4 text-[#ff6900]" />
                  <span>Scan QR code for instant install</span>
                </div>
              </div>
            </div>

            {/* Right Mockup: Realistic Mobile Phone Screen (6 cols) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-[300px] sm:w-[330px] h-[610px] sm:h-[640px] rounded-[48px] bg-neutral-900 border-[10px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between">
                {/* iPhone Titanium Dynamic Island & Speaker Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900/80 border border-neutral-700" />
                  <div className="w-2 h-2 rounded-full bg-neutral-800" />
                </div>

                {/* Inner Screen Surface */}
                <div className="w-full h-full bg-neutral-950 text-white flex flex-col justify-between pt-9 pb-4 px-4 overflow-hidden select-none">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 px-2 font-medium">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px]">5G</span>
                      <div className="w-4 h-2 border border-neutral-400 rounded-sm p-0.5">
                        <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="mt-3 flex items-center justify-between px-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                        Host Dashboard
                      </span>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-1">
                        <span>Villa Solitude, Lonavala</span>
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                      </h4>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#ff6900]/20 border border-[#ff6900]/40 flex items-center justify-center text-[#ff6900] text-xs font-bold">
                      TC
                    </div>
                  </div>

                  {/* Monthly Revenue Card */}
                  <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-[#ff6900] to-amber-600 text-white shadow-lg shadow-[#ff6900]/20">
                    <span className="text-[10px] uppercase tracking-wider text-white/80 block">
                      August Gross Earnings
                    </span>
                    <div className="text-2xl font-black mt-0.5">₹4,82,500</div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20 text-[10px] text-white/90">
                      <span>16 Confirmed Nights</span>
                      <span className="bg-black/20 px-2 py-0.5 rounded-full font-semibold">
                        +24.8% vs July
                      </span>
                    </div>
                  </div>

                  {/* Quick Action Pills inside app */}
                  <div className="grid grid-cols-4 gap-1.5 mt-3">
                    <div className="p-2 rounded-xl bg-neutral-900 text-center border border-neutral-800">
                      <Calendar className="w-3.5 h-3.5 text-[#ff6900] mx-auto mb-1" />
                      <span className="text-[9px] text-neutral-300 block font-medium">Calendar</span>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 text-center border border-neutral-800">
                      <Banknote className="w-3.5 h-3.5 text-emerald-400 mx-auto mb-1" />
                      <span className="text-[9px] text-neutral-300 block font-medium">Payouts</span>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 text-center border border-neutral-800">
                      <Users className="w-3.5 h-3.5 text-blue-400 mx-auto mb-1" />
                      <span className="text-[9px] text-neutral-300 block font-medium">Guests</span>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-900 text-center border border-neutral-800">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
                      <span className="text-[9px] text-neutral-300 block font-medium">Rates</span>
                    </div>
                  </div>

                  {/* Active Reservation Notification Inside Phone */}
                  <div className="mt-3 p-3 rounded-xl bg-neutral-900/90 border border-neutral-800/80">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Check-in Tomorrow
                      </span>
                      <span className="text-neutral-400">₹54,000 Payout</span>
                    </div>
                    <div className="text-xs font-bold text-white">Rohan Sharma &amp; Family</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      6 Guests • 2 Nights • Govt KYC Verified
                    </div>
                  </div>

                  {/* 1-Tap Lock Feature Inside Phone */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-900/50 border border-neutral-800/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-orange-400" />
                      <span className="text-[10px] text-neutral-300 font-medium">
                        Personal Stay Lock
                      </span>
                    </div>
                    <div className="w-8 h-4 bg-[#ff6900] rounded-full p-0.5 flex justify-end">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>

                  {/* Bottom App Navigation Bar */}
                  <div className="mt-auto pt-2 border-t border-neutral-800/80 flex items-center justify-around text-neutral-500">
                    <div className="text-center text-[#ff6900]">
                      <div className="w-1.5 h-1.5 bg-[#ff6900] rounded-full mx-auto mb-1" />
                      <span className="text-[9px] font-bold">Home</span>
                    </div>
                    <div className="text-center">
                      <Calendar className="w-3.5 h-3.5 mx-auto mb-0.5" />
                      <span className="text-[9px]">Bookings</span>
                    </div>
                    <div className="text-center">
                      <Banknote className="w-3.5 h-3.5 mx-auto mb-0.5" />
                      <span className="text-[9px]">Earnings</span>
                    </div>
                    <div className="text-center">
                      <MessageSquare className="w-3.5 h-3.5 mx-auto mb-0.5" />
                      <span className="text-[9px]">Help</span>
                    </div>
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. HOST INQUIRY FORM SECTION (STRICTLY PRESERVED 5 FIELDS)
          ===================================================================== */}
      <section
        id="inquiry-form-section"
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-neutral-200 text-neutral-900 relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#ff6900]">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Partner with ThevillaCamp</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
                List your property with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-500">
                  complete peace of mind
                </span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Join top villa and campsite owners earning steady rental yield. Our hospitality
                specialists handle marketing, professional photoshoots, and guest vetting while you
                track income on the Owner App.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Strict Guest Verification</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Government ID audits, party policy enforcement, and group profiling before every check-in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">Free Professional Photoshoot &amp; Setup</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      High-definition architectural photography and HDR drone shots included at zero upfront cost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Hotline with Call & WhatsApp Links */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-700">
                <a
                  href="tel:+918669186483"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#ff6900]" />
                  <span>Call Hotline: +91 86691 86483</span>
                </a>

                <a
                  href="https://wa.me/918669186483?text=Hi%2C%20I%20am%20interested%20in%20listing%20my%20property%20with%20The%20Villa%20Camp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors text-emerald-800 font-semibold shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Right Column: Lead Capture Card (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-xl border border-neutral-200">
              <div className="mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff6900] block mb-1">
                  48-Hour Onboarding
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                  Get Started as a Host
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Tell us about your villa or camp and our regional manager will connect via call or WhatsApp.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">Submission Received!</h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Thank you, <strong className="text-neutral-800">{formData.fullName}</strong>. Our
                    regional team will contact you at{" "}
                    <strong className="text-neutral-800">{formData.phone}</strong> within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full text-xs font-semibold text-[#ff6900] border-orange-200 hover:bg-orange-50 mt-3 cursor-pointer"
                  >
                    Submit Another Property
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Property Type Radio Pills */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      What type of stay do you own?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["Luxury Villa", "Glamping Tent", "Cottage"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({ ...formData, propertyType: type })}
                          className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                            formData.propertyType === type
                              ? "border-[#ff6900] bg-orange-50/80 text-[#ff6900] font-bold shadow-2xs"
                              : "border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Patil"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all text-neutral-900"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 8669186483"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all text-neutral-900"
                    />
                  </div>

                  {/* Location & Configuration Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Location / Area
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                      >
                        <option value="Lonavala">Lonavala</option>
                        <option value="Pawana Lake">Pawana Lake</option>
                        <option value="Khandala">Khandala</option>
                        <option value="Alibaug">Alibaug</option>
                        <option value="Karjat">Karjat</option>
                        <option value="Mahabaleshwar">Mahabaleshwar</option>
                        <option value="Other">Other Region</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-700 mb-1">
                        Configuration
                      </label>
                      <select
                        value={formData.bedrooms}
                        onChange={(e) =>
                          setFormData({ ...formData, bedrooms: e.target.value })
                        }
                        className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                      >
                        <option value="1-2 BHK">1 - 2 BHK</option>
                        <option value="3 BHK">3 BHK</option>
                        <option value="4 BHK">4 BHK</option>
                        <option value="5+ BHK">5+ BHK Estate</option>
                        <option value="Glamping Site">Camping Site</option>
                      </select>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{error}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting details...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Property for Review</span>
                      </>
                    )}
                  </Button>

                  <p className="text-[10px] text-center text-neutral-500 pt-1">
                    Zero listing fees. We only earn a performance commission when your property generates paid bookings.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          7. FAQ ACCORDION SECTION
          ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-50 border border-neutral-200/80 overflow-hidden transition-colors hover:border-neutral-300"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-neutral-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#ff6900]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-200/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
