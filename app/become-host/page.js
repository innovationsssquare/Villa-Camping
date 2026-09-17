"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  TrendingUp,
  Camera,
  CalendarCheck,
  Users,
  CheckCircle2,
  Send,
  Phone,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  MessageSquare,
  Loader2,
  AlertCircle,
  ShieldCheck,
  IndianRupee,
  Smartphone,
  Download,
  Calendar,
  Star,
  Check,
  ChevronDown,
  HelpCircle,
  QrCode,
  Lock,
  Building,
  CreditCard,
  MapPin,
  ExternalLink,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseUrl } from "@/lib/API/Baseurl";

// =============================================================================
// ESTIMATOR DATA: Realistic historical yields for Maharashtra luxury stays
// =============================================================================
const ESTIMATOR_DATA = {
  Lonavala: {
    "2 BHK": { monthly: 240000, annual: 2880000, adr: 16000, occupancy: "74%" },
    "3 BHK": { monthly: 420000, annual: 5040000, adr: 26000, occupancy: "82%" },
    "4 BHK": { monthly: 650000, annual: 7800000, adr: 40000, occupancy: "85%" },
    "5+ BHK Estate": { monthly: 980000, annual: 11760000, adr: 62000, occupancy: "80%" },
  },
  Alibaug: {
    "2 BHK": { monthly: 280000, annual: 3360000, adr: 20000, occupancy: "75%" },
    "3 BHK": { monthly: 480000, annual: 5760000, adr: 32000, occupancy: "84%" },
    "4 BHK": { monthly: 740000, annual: 8880000, adr: 48000, occupancy: "86%" },
    "5+ BHK Estate": { monthly: 1150000, annual: 13800000, adr: 75000, occupancy: "82%" },
  },
  "Pawana Lake": {
    "2 BHK": { monthly: 210000, annual: 2520000, adr: 15000, occupancy: "76%" },
    "3 BHK": { monthly: 360000, annual: 4320000, adr: 24000, occupancy: "82%" },
    "4 BHK": { monthly: 540000, annual: 6480000, adr: 36000, occupancy: "84%" },
    "5+ BHK Estate": { monthly: 840000, annual: 10080000, adr: 55000, occupancy: "80%" },
  },
  Khandala: {
    "2 BHK": { monthly: 250000, annual: 3000000, adr: 18000, occupancy: "76%" },
    "3 BHK": { monthly: 440000, annual: 5280000, adr: 28000, occupancy: "83%" },
    "4 BHK": { monthly: 680000, annual: 8160000, adr: 42000, occupancy: "85%" },
    "5+ BHK Estate": { monthly: 1040000, annual: 12480000, adr: 66000, occupancy: "81%" },
  },
  Karjat: {
    "2 BHK": { monthly: 220000, annual: 2640000, adr: 16000, occupancy: "75%" },
    "3 BHK": { monthly: 380000, annual: 4560000, adr: 25000, occupancy: "82%" },
    "4 BHK": { monthly: 580000, annual: 6960000, adr: 38000, occupancy: "84%" },
    "5+ BHK Estate": { monthly: 890000, annual: 10680000, adr: 58000, occupancy: "80%" },
  },
  Mahabaleshwar: {
    "2 BHK": { monthly: 260000, annual: 3120000, adr: 19000, occupancy: "77%" },
    "3 BHK": { monthly: 450000, annual: 5400000, adr: 29000, occupancy: "84%" },
    "4 BHK": { monthly: 700000, annual: 8400000, adr: 45000, occupancy: "86%" },
    "5+ BHK Estate": { monthly: 1000000, annual: 12000000, adr: 65000, occupancy: "82%" },
  },
};

const FAQ_LIST = [
  {
    q: "How much commission does The Villa Camp charge?",
    a: "Listing your property is 100% free with zero registration or onboarding charges. We work on a purely success-based performance commission deducted only when your villa generates confirmed, paid bookings.",
  },
  {
    q: "Can I use the villa for my personal family trips?",
    a: "Absolutely! Through The Villa Camp Owner App, you have total control to block any weekend or holiday for your personal family vacations with a single tap.",
  },
  {
    q: "How are incoming guests vetted and verified?",
    a: "Every guest must undergo a mandatory government ID KYC check before check-in. Furthermore, our guest screening desk enforces strict group-profiling to protect your property from rowdy parties.",
  },
  {
    q: "How and when do I receive payouts?",
    a: "All payouts are automated through RazorpayX and deposited directly into your registered bank account within 24 hours of guest check-in. You can track transaction IDs and earnings live on your Owner App.",
  },
  {
    q: "Do I have to pay for the architectural photography?",
    a: "No. Once your property is approved, our regional production crew will conduct a complimentary HDR interior photoshoot and drone shoot worth ₹25,000 at zero cost to you.",
  },
];

// =============================================================================
// SUB-COMPONENT: Realistic iPhone Mobile Screen with Live Owner App UI
// =============================================================================
function OwnerAppMobileScreen() {
  return (
    <div className="relative mx-auto w-[290px] sm:w-[320px] select-none">
      {/* Ambient background glow behind phone */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#ff6900]/30 to-amber-400/20 rounded-[48px] blur-2xl opacity-70 pointer-events-none" />

      {/* Titanium Phone Body */}
      <div className="relative rounded-[42px] sm:rounded-[46px] p-3 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-2xl border-[3px] border-neutral-700/80">
        {/* Screen bezel */}
        <div className="relative rounded-[32px] sm:rounded-[36px] bg-neutral-950 overflow-hidden border border-white/10 text-white flex flex-col h-[570px] sm:h-[610px]">
          {/* Dynamic Island / Notch */}
          <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-300 z-30 shrink-0">
            <span>9:41</span>
            <div className="w-20 h-4 bg-black rounded-full border border-neutral-800 flex items-center justify-center gap-1.5 px-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono text-neutral-400">TVC</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* App Header Inside Phone */}
          <div className="p-3.5 pb-2 flex items-center justify-between border-b border-white/10 bg-neutral-900/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ff6900] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                VC
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Property Owner
                </span>
                <span className="text-xs font-extrabold text-white block truncate">
                  Villa Solitude, Lonavala ▾
                </span>
              </div>
            </div>
            <div className="relative w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-neutral-300">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
            </div>
          </div>

          {/* Scrollable Phone Content */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar text-xs">
            {/* Revenue Widget */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 border border-white/10 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  This Month Earnings
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  +24.8%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white mt-1">
                ₹4,82,500
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 mt-2 border-t border-white/10">
                <span>Next Payout: <strong>₹54,000</strong></span>
                <span className="text-emerald-400 font-bold">Auto-Settled</span>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {[
                { label: "Calendar", icon: Calendar },
                { label: "Payouts", icon: CreditCard },
                { label: "Guests", icon: Users },
                { label: "Rates", icon: TrendingUp },
              ].map((act, i) => (
                <div
                  key={i}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-1 transition-all"
                >
                  <act.icon className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span className="text-[9px] font-medium text-neutral-300">{act.label}</span>
                </div>
              ))}
            </div>

            {/* Active Upcoming Reservation Card */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded-md bg-[#ff6900]/20 text-[#ff6900] font-bold">
                  Next Check-In
                </span>
                <span className="text-neutral-400">In 2 days</span>
              </div>

              <div className="flex items-center gap-2.5">
                <img
                  src="/Aboutusasset/Villabanner.jpg"
                  alt="Villa Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-white/15"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-extrabold text-white text-xs block truncate">
                    Rohan Sharma & Family
                  </span>
                  <span className="text-[10px] text-neutral-400 block">
                    3 Nights • 6 Adults, 2 Kids
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold block">
                    ₹54,000 • Govt KYC Verified ✓
                  </span>
                </div>
              </div>
            </div>

            {/* Instant Family Calendar Lock Banner */}
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-amber-500/20 flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-1.5 text-amber-300">
                <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Personal Family Block: Active</span>
              </div>
              <span className="text-neutral-400 font-mono">Oct 12-14</span>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="p-2 px-4 border-t border-white/10 bg-neutral-900 flex items-center justify-between text-neutral-400 text-[10px] shrink-0">
            <div className="flex flex-col items-center text-[#ff6900] font-bold">
              <Home className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Home</span>
            </div>
            <div className="flex flex-col items-center hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Bookings</span>
            </div>
            <div className="flex flex-col items-center hover:text-white transition-colors">
              <IndianRupee className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Earnings</span>
            </div>
            <div className="flex flex-col items-center hover:text-white transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="text-[8px] mt-0.5">Concierge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Badge 1: Instant Payout Tag */}
      <div className="absolute -top-4 -left-6 sm:-left-10 bg-white/95 text-neutral-900 p-2.5 sm:p-3 rounded-2xl shadow-xl border border-neutral-200 backdrop-blur-md hidden sm:flex items-center gap-2.5 z-40 animate-bounce [animation-duration:4s]">
        <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
            Direct Bank Payout
          </span>
          <span className="text-xs font-black text-neutral-900 block">
            ₹54,000 Settled in 24h
          </span>
        </div>
      </div>

      {/* Floating Badge 2: Verified Host Rating */}
      <div className="absolute -bottom-4 -right-4 sm:-right-8 bg-neutral-950/95 text-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-neutral-800 backdrop-blur-md flex items-center gap-2.5 z-40">
        <div className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
          <Star className="w-4 h-4 fill-amber-400" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Host Satisfaction
          </span>
          <span className="text-xs font-black text-white block">
            4.98 / 5.0 (140+ Reviews)
          </span>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT: Redesigned /become-host Page
// =============================================================================
export default function BecomeHostPage() {
  // Inquiry Form State (preserved completely as requested)
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

  // Estimator Selection State
  const [selectedLocation, setSelectedLocation] = useState("Lonavala");
  const [selectedBhk, setSelectedBhk] = useState("3 BHK");
  const [openFaq, setOpenFaq] = useState(0);

  const currentYield = useMemo(() => {
    const locData = ESTIMATOR_DATA[selectedLocation] || ESTIMATOR_DATA["Lonavala"];
    return locData[selectedBhk] || locData["3 BHK"];
  }, [selectedLocation, selectedBhk]);

  // Form Submission Handler (identical endpoint, payload, and flow)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError("Please provide your full name and phone number.");
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
        err.message ||
          "Could not submit inquiry. Please try again or call our helpline."
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const el = document.getElementById("host-inquiry-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToApp = () => {
    const el = document.getElementById("download-app-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="w-full bg-neutral-950 text-neutral-100 overflow-x-hidden pt-16">
      {/* =====================================================================
          1. HERO SECTION: Cinematic Luxury Villa Visual with Dark Luxury Theme
          ===================================================================== */}
      <section className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Full Bleed Villa Background Image with Dark Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Aboutusasset/Villabanner.jpg"
            alt="Luxury Villa Estate"
            fill
            priority
            className="object-cover object-center scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/80" />
          <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/40 to-neutral-950/90" />
          {/* Subtle brand orange ambient glow */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#ff6900]/15 rounded-full blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
          {/* Glowing Partner Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-orange-400 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse" />
            <span>The Villa Camp • Luxury Host Partnership</span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.1] drop-shadow-md">
            Turn Your Luxury Villa into a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] via-orange-400 to-amber-300">
              High-Yield Asset
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-neutral-300 mt-6 max-w-2xl leading-relaxed">
            Partner with Maharashtra’s premier villa & retreat network. We bring
            high-intent luxury guests, complimentary HDR drone shoots, and 24-hour
            automated bank payouts — with zero upfront cost.
          </p>

          {/* Dual CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="w-full sm:w-auto bg-[#ff6900] hover:bg-[#e05d00] text-white font-extrabold text-sm px-8 h-13 rounded-full shadow-lg hover:shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer gap-2"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={scrollToApp}
              className="w-full sm:w-auto rounded-full font-bold text-sm h-13 px-7 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md transition-all cursor-pointer gap-2"
            >
              <Smartphone className="w-4 h-4 text-[#ff6900]" />
              <span>Explore Host App</span>
            </Button>
          </div>

          {/* 4 Proof Metrics Strip at bottom of hero */}
          <div className="mt-14 sm:mt-18 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl">
            {[
              {
                value: "₹4.5L - ₹8.5L",
                label: "Avg. Monthly Gross Yield",
                icon: IndianRupee,
              },
              {
                value: "100%",
                label: "Govt ID Verified Guests",
                icon: ShieldCheck,
              },
              {
                value: "₹0",
                label: "Zero Upfront Listing Fee",
                icon: Award,
              },
              {
                value: "48 Hours",
                label: "Inspection to Live Booking",
                icon: Clock,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-3.5 sm:p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center hover:border-[#ff6900]/40 transition-colors"
              >
                <div className="flex items-center justify-center text-[#ff6900] mb-1">
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="text-base sm:text-xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. INTERACTIVE ESTIMATOR: Potential Monthly & Annual Revenue
          ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 border-y border-neutral-800 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Yield Estimator
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              How much could your property earn?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Select your villa location and configuration to view projected
              monthly rental yield based on real verified stay data.
            </p>
          </div>

          <div className="bg-neutral-950 rounded-3xl border border-neutral-800 p-6 sm:p-10 shadow-2xl">
            {/* Control Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8 border-b border-neutral-800">
              {/* Location Tabs */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                  1. Property Destination
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "Lonavala",
                    "Alibaug",
                    "Pawana Lake",
                    "Khandala",
                    "Karjat",
                    "Mahabaleshwar",
                  ].map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setSelectedLocation(loc)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        selectedLocation === loc
                          ? "bg-[#ff6900] text-white shadow-md"
                          : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* BHK Configuration */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                  2. Villa Configuration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["2 BHK", "3 BHK", "4 BHK", "5+ BHK Estate"].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBhk(bhk)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        selectedBhk === bhk
                          ? "bg-[#ff6900] text-white shadow-md"
                          : "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Projected Yield Output Card */}
            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="space-y-1">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Estimated Monthly Yield
                </span>
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-400">
                  ₹{currentYield.monthly.toLocaleString("en-IN")}
                </div>
                <span className="text-xs text-neutral-500 block">
                  Projected Gross Booking Value
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                    Avg. Weekend ADR
                  </span>
                  <span className="text-lg font-extrabold text-white mt-0.5 block">
                    ₹{currentYield.adr.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                    Target Occupancy
                  </span>
                  <span className="text-lg font-extrabold text-emerald-400 mt-0.5 block">
                    {currentYield.occupancy}
                  </span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <Button
                  onClick={scrollToForm}
                  className="w-full md:w-auto bg-white hover:bg-neutral-200 text-neutral-950 font-black text-xs px-6 h-12 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Start Earning With This Villa
                </Button>
                <span className="text-[10px] text-neutral-500 block mt-2">
                  *Based on peak and non-peak seasonality averages.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. WHY HOST WITH US: The 4 Pillars of Protection & Yield
          ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Owner Protections
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Hospitality management built around your peace of mind
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2">
              Unlike generic listing sites, The Villa Camp provides end-to-end
              protection, verified guests, and on-ground local support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: ShieldCheck,
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                title: "100% Guest KYC Audits",
                desc: "Every guest must submit government ID proof. Strict noise policies and family group profiling ensure no rowdy party disruptions.",
              },
              {
                icon: Camera,
                color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                title: "Complimentary HDR Shoot",
                desc: "We send our in-house photography & drone crew to capture magazine-worthy visuals worth ₹25,000 at zero cost to you.",
              },
              {
                icon: IndianRupee,
                color: "text-[#ff6900] bg-[#ff6900]/10 border-[#ff6900]/20",
                title: "24h Automated Payouts",
                desc: "Earnings are settled straight into your bank account within 24 hours of guest check-in via RazorpayX. Zero payment chasing.",
              },
              {
                icon: Users,
                color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                title: "Dedicated Field Manager",
                desc: "Our regional hospitality manager in Lonavala & Alibaug personally assists with key handovers, maintenance, and inquiries.",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-[#ff6900]/40 transition-all space-y-3 group"
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${pillar.color}`}
                >
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#ff6900] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. HOW IT WORKS: 3-Step Simple Onboarding
          ===================================================================== */}
      <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900] block mb-2">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Inquiry to Earning in 48 Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {[
              {
                step: "01",
                title: "Submit Property Details",
                desc: "Fill out the 2-minute inquiry below. Our regional acquisitions lead will connect within a few hours to understand your goals.",
              },
              {
                step: "02",
                title: "Site Audit & Free Photoshoot",
                desc: "We visit your villa to inspect amenities, conduct drone photography, and set competitive weekend pricing.",
              },
              {
                step: "03",
                title: "Go Live & Receive Payouts",
                desc: "Your villa is published across our high-intent traveler network. Manage reservations and receive direct bank payouts on the Owner App.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-neutral-950 border border-neutral-800 relative overflow-hidden space-y-3"
              >
                <div className="text-4xl font-black text-neutral-800">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          5. DOWNLOAD APP SECTION: Villa Backdrop + Realistic Mobile Screen Frame
          ===================================================================== */}
      <section
        id="download-app-section"
        className="w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-neutral-950 relative overflow-hidden"
      >
        {/* Villa Image Backdrop with Dark Blur */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <Image
            src="/Aboutusasset/Villabanner.jpg"
            alt="Villa Backdrop"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-neutral-950/90" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column (7 cols): App Description & Action Badges */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#ff6900]">
                <Smartphone className="w-3.5 h-3.5" />
                <span>The Villa Camp • Owner Companion App</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Complete Property Command Center{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-400">
                  Right in Your Pocket
                </span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl">
                Run your second home like a 5-star boutique resort from anywhere in the world.
                Accept bookings, view guest KYC details, block private family dates,
                and track direct bank deposits in real time.
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  "Real-time push notifications for instant bookings",
                  "1-Tap personal family calendar lock",
                  "Transparent revenue & automated payout ledger",
                  "Direct concierge chat with on-ground local team",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#ff6900]/20 text-[#ff6900] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-medium text-neutral-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Download Buttons & QR Code */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Store Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://apps.apple.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-all shadow-md hover:scale-[1.02]"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-2 .6-2.63 1.35-.57.65-.99 1.7-0.86 2.72 1.01.08 2.01-.52 2.57-1.2" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block leading-none">
                        Download on the
                      </span>
                      <span className="text-xs font-black text-white block mt-0.5">
                        App Store
                      </span>
                    </div>
                  </a>

                  <a
                    href="https://play.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 transition-all shadow-md hover:scale-[1.02]"
                  >
                    <div className="w-6 h-6 flex items-center justify-center text-[#ff6900]">
                      <svg className="w-5 h-5 fill-current text-[#ff6900]" viewBox="0 0 24 24">
                        <path d="M3.6 2.4c-.4.4-.6 1-.6 1.8v15.6c0 .8.2 1.4.6 1.8l.1.1 9.4-9.4v-.2L3.7 2.3l-.1.1zM16.9 15.9l-3.8-3.8v-.2l3.8-3.8.1.1 4.5 2.6c1.3.7 1.3 1.9 0 2.6l-4.6 2.5zM13.1 12.1L3.7 21.5c.4.4 1.1.5 1.9.1l10.9-6.2-3.4-3.3zM13.1 11.9l3.4-3.3L5.6 2.4c-.8-.4-1.5-.3-1.9.1l9.4 9.4z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="text-[10px] text-neutral-400 uppercase tracking-wider block leading-none">
                        Get it on
                      </span>
                      <span className="text-xs font-black text-white block mt-0.5">
                        Google Play
                      </span>
                    </div>
                  </a>
                </div>

                {/* QR Code Scan Tag */}
                <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-7 h-7 text-neutral-950" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-300 block">
                      Scan to Install
                    </span>
                    <span className="text-[9px] text-neutral-500 block">
                      iOS & Android
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Realistic Mobile Screen Frame */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <OwnerAppMobileScreen />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. HOST INQUIRY FORM: High-Converting, Exact Form Logic Preserved
          ===================================================================== */}
      <section
        id="host-inquiry-form"
        className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-900 border-t border-neutral-800"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (5 cols): Partnership Benefits & Helpline */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Zero Risk • Zero Listing Fees</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Ready to maximize your villa’s potential?
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Submit your property details below. Our regional acquisitions manager
                will conduct a preliminary yield assessment and reach out within 24 hours.
              </p>

              {/* Trust Reassurance Checklist */}
              <div className="space-y-3 pt-2">
                {[
                  "No upfront listing or photography fees",
                  "You retain 100% ownership and calendar authority",
                  "Dedicated regional operations team based in Lonavala & Alibaug",
                  "Comprehensive damage protection & pre-stay security deposits",
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Direct Hotline Banner */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Host Onboarding Helpline
                  </span>
                  <span className="text-sm font-black text-white block mt-0.5">
                    +91 86691 86483
                  </span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold rounded-xl h-9 px-3 gap-1.5"
                >
                  <a
                    href="https://wa.me/918669186483?text=Hello%20The%20Villa%20Camp,%20I%20want%20to%20list%20my%20property"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column (7 cols): The Preserved Inquiry Form Card */}
            <div className="lg:col-span-7 bg-white text-neutral-900 rounded-3xl p-6 sm:p-9 shadow-2xl border border-neutral-200">
              <div className="mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff6900] block mb-1">
                  Express 48-Hour Onboarding
                </span>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-950">
                  Get Started as a Host
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Tell us about your villa, cottage, or camp and our regional
                  manager will connect via call or WhatsApp.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900">
                    Submission Received!
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    Thank you,{" "}
                    <strong className="text-neutral-800">
                      {formData.fullName}
                    </strong>
                    . Our team will contact you at{" "}
                    <strong className="text-neutral-800">{formData.phone}</strong>{" "}
                    within 24 hours.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="rounded-full text-xs font-semibold text-[#ff6900] border-orange-200 hover:bg-orange-50 mt-3"
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
                          onClick={() =>
                            setFormData({ ...formData, propertyType: type })
                          }
                          className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                            formData.propertyType === type
                              ? "border-[#ff6900] bg-orange-50/80 text-[#ff6900] shadow-2xs font-bold"
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
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
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
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
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
                    Zero listing fees. We only earn a performance commission when
                    your property generates paid bookings.
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
                    <span className="font-bold text-sm sm:text-base text-white">
                      {faq.q}
                    </span>
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
    </main>
  );
}
