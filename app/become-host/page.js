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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseUrl } from "@/lib/API/Baseurl";

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
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 selection:bg-[#ff6900] selection:text-white">
      {/* =====================================================================
          1. CINEMATIC LUXURY HERO SECTION
          ===================================================================== */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Villa Background Banner with Vignette Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Aboutusasset/Villabanner.jpg"
            alt="The Villa Camp Luxury Estate Background"
            fill
            priority
            className="object-cover object-center brightness-[0.38] scale-105 transition-transform duration-1000"
          />
          {/* Gradients to blend smoothly with dark background */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/50 to-neutral-950" />
        </div>

        {/* Ambient Amber Glow Balls */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#ff6900]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Glowing Partner Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-400 mb-6 shadow-lg shadow-black/40">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
            <span className="tracking-wide">The Villa Camp • Luxury Host Partnership</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] max-w-4xl">
            Turn Your Luxury Villa Into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] via-amber-400 to-[#ff8c33]">
              High-Yield Asset
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mt-5 leading-relaxed font-normal">
            Join Western India&apos;s premier luxury hospitality network across Lonavala,
            Alibaug, and Pawana Lake. Zero upfront fees, guaranteed guest vetting, and automated
            24-hour payouts.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-8 w-full sm:w-auto">
            <Button
              onClick={() => scrollToSection("inquiry-form-section")}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white text-sm font-bold shadow-xl shadow-[#ff6900]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>List Your Property</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              onClick={() => scrollToSection("yield-estimator")}
              className="w-full sm:w-auto h-12 px-7 rounded-full bg-white/5 hover:bg-white/10 text-neutral-200 border-white/20 text-sm font-semibold backdrop-blur-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Estimate Your Earnings</span>
              <TrendingUp className="w-4 h-4 text-orange-400" />
            </Button>
          </div>

          {/* Proof Strip / Metric Pills */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-12 sm:mt-16 w-full max-w-4xl">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">₹4.5L - ₹8.5L</span>
              <span className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 block">
                Avg. Monthly Gross Yield
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-center">
              <span className="block text-lg sm:text-2xl font-black text-emerald-400">100%</span>
              <span className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 block">
                Govt ID Verified Guests
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-center">
              <span className="block text-lg sm:text-2xl font-black text-white">₹0</span>
              <span className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 block">
                Zero Upfront Listing Fee
              </span>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 backdrop-blur-md text-center">
              <span className="block text-lg sm:text-2xl font-black text-[#ff6900]">48 Hours</span>
              <span className="text-[11px] sm:text-xs text-neutral-400 mt-0.5 block">
                Inspection to Live Booking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. DYNAMIC EARNINGS / YIELD ESTIMATOR
          ===================================================================== */}
      <section
        id="yield-estimator"
        className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/90 border-y border-neutral-800 relative overflow-hidden"
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Transparent Profitability
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Estimate Your Villa&apos;s Monthly Revenue
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Realized metrics based on historical occupancy data across our active Maharashtra
              portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-neutral-950/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Location Selectors */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
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
                          : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2.5">
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
                          ? "bg-white text-neutral-950 border-white shadow-md"
                          : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights Note */}
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-[#ff6900] shrink-0" />
                <span>
                  Includes professional housekeeping supervision, dynamic pricing algorithms, and 24/7 guest concierge.
                </span>
              </div>
            </div>

            {/* Right Result Card (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-900/60 border border-neutral-800 shadow-xl relative overflow-hidden flex flex-col justify-between h-full">
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
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
                    <span className="text-[11px] text-neutral-400 block">Avg. Weekend ADR</span>
                    <span className="text-sm font-bold text-white mt-0.5 block">
                      {currentEstimate.weekendAdr}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/70">
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
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Total Owner Protection
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Why Premier Estate Owners Partner With Us
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              We handle every operational headache so you enjoy purely passive hospitality income.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">100% Guest KYC Audits</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Every booking undergoes mandatory government photo ID checks and screening against
                  unauthorized parties.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Party Policy</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Free HDR & Drone Shoot</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Complimentary architectural photography and 4K aerial drone coverage worth
                  ₹25,000 at zero cost to you.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-blue-400">
                <Check className="w-3.5 h-3.5" />
                <span>Zero Cost Setup</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#ff6900]/10 border border-[#ff6900]/20 text-[#ff6900] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Banknote className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">24h Automated Payouts</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Direct bank settlements via RazorpayX within 24 hours of guest check-in. Never
                  chase payment balances.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-[#ff6900]">
                <Check className="w-3.5 h-3.5" />
                <span>Instant Bank Credit</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all group flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">Regional Field Managers</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Dedicated on-ground villa supervisors in Lonavala and Alibaug inspecting upkeep and
                  assisting caretaking staff.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center gap-1.5 text-[11px] font-semibold text-purple-400">
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
      <section className="w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/60 border-y border-neutral-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Swift 48-Hour Turnaround
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Inquiry to First Booking in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 relative">
              <span className="text-3xl font-black text-neutral-700 block mb-3">01</span>
              <h4 className="text-base font-bold text-white mb-1.5">Submit Property Details</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Fill out our simple 2-minute inquiry form below. Tell us your villa location,
                amenities, and room layout.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 relative">
              <span className="text-3xl font-black text-neutral-700 block mb-3">02</span>
              <h4 className="text-base font-bold text-white mb-1.5">Site Audit & Free Shoot</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Our regional manager visits for a rapid quality audit and conducts our complimentary
                drone & HDR photoshoot.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800/90 relative">
              <span className="text-3xl font-black text-[#ff6900] block mb-3">03</span>
              <h4 className="text-base font-bold text-white mb-1.5">Go Live & Earn</h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
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
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 relative overflow-hidden"
      >
        {/* Background mesh glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#ff6900]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Description (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400">
                <Smartphone className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>The Villa Camp • Owner App</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Your Complete Villa Empire{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-400">
                  in the Palm of Your Hand
                </span>
              </h2>

              <p className="text-xs sm:text-sm md:text-base text-neutral-300 leading-relaxed">
                Whether relaxing in Mumbai or traveling abroad, the Thevillacamp Owner App gives you
                instant, real-time oversight over your estate. Monitor bookings, block personal dates,
                and receive automated daily earnings alerts.
              </p>

              {/* Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-300">
                    <strong className="text-white">Instant Reservation Alerts:</strong> Push
                    notifications the second a confirmed guest pays.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-300">
                    <strong className="text-white">1-Tap Personal Stay Block:</strong> Reserve your
                    villa for family weekends instantly.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <div className="text-xs text-neutral-300">
                    <strong className="text-white">Live RazorpayX Settlement:</strong> Transparent
                    breakdown of rent, taxes, and bank transfers.
                  </div>
                </div>
              </div>

              {/* Badges & QR Code */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                {/* App Store Badge */}
                <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 transition-colors cursor-pointer">
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
                <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center gap-3 transition-colors cursor-pointer">
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
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                  <QrCode className="w-4 h-4 text-[#ff6900]" />
                  <span>Scan QR code for instant install</span>
                </div>
              </div>
            </div>

            {/* Right Mockup: Realistic Mobile Phone Screen (6 cols) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-[300px] sm:w-[330px] h-[610px] sm:h-[640px] rounded-[48px] bg-neutral-900 border-[10px] border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between">
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
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 text-white relative overflow-hidden"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Partner with ThevillaCamp</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                List your property with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-400">
                  complete peace of mind
                </span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                Join top villa and campsite owners earning steady rental yield. Our hospitality
                specialists handle marketing, professional photoshoots, and guest vetting while you
                track income on the Owner App.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Strict Guest Verification</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Government ID audits, party policy enforcement, and group profiling before every check-in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Free Professional Photoshoot &amp; Setup</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      High-definition architectural photography and HDR drone shots included at zero upfront cost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Hotline with Call & WhatsApp Links */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                <a
                  href="tel:+918669186483"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors text-white font-medium"
                >
                  <Phone className="w-4 h-4 text-[#ff6900]" />
                  <span>Call Hotline: +91 86691 86483</span>
                </a>

                <a
                  href="https://wa.me/918669186483?text=Hi%2C%20I%20am%20interested%20in%20listing%20my%20property%20with%20The%20Villa%20Camp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 hover:bg-emerald-900/60 transition-colors text-emerald-300 font-medium"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Concierge</span>
                </a>
              </div>
            </div>

            {/* Right Column: Lead Capture Card (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-2xl border border-neutral-200">
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

                  <p className="text-[10px] text-center text-neutral-400 pt-1">
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
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950 border-t border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQ_LIST.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#ff6900]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
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
