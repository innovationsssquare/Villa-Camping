"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Utensils,
  Flame,
  Wine,
  Car,
  HeartHandshake,
  Film,
  CheckCircle2,
  Clock,
  Send,
  BellRing,
  ShieldCheck,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const UPCOMING_SERVICES = [
  {
    id: "private-chef",
    title: "Personal Chef & Live Barbeque",
    tagline: "Restaurant-grade culinary art in your private villa",
    icon: Utensils,
    status: "In Beta Testing",
    badgeColor: "bg-orange-100 text-[#ff6900]",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    features: [
      "Custom multi-course menus tailored to your dietary preferences",
      "Live smoky charcoal BBQ on the villa lawn or poolside",
      "All premium groceries, fresh spices & tableware included",
      "Zero hassle: Complete kitchen prep, table service & cleanup",
    ],
  },
  {
    id: "bonfire-music",
    title: "Starlit Bonfires & Acoustic Nights",
    tagline: "Intimate fireside melodies under unpolluted skies",
    icon: Flame,
    status: "Launching Soon",
    badgeColor: "bg-amber-100 text-amber-800",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&auto=format&fit=crop&q=80",
    features: [
      "Wood-fired safe outdoor firepit with cozy seating",
      "Marshmallows, hot spiced cocoa & signature appetizers",
      "Optional private live acoustic guitarist or indie singer",
      "Warm ambient string fairy lights across the lawn",
    ],
  },
  {
    id: "celebration-styling",
    title: "Celebrations & Floating Pool Decor",
    tagline: "Turn milestones into unforgettable visual memories",
    icon: Wine,
    status: "Launching Soon",
    badgeColor: "bg-purple-100 text-purple-800",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80",
    features: [
      "Tropical floating breakfast trays in your private pool",
      "Anniversary & birthday balloon cabanas with neon signs",
      "Bespoke floral candlelight dinner setups",
      "Professional drone and portrait photographer add-on",
    ],
  },
  {
    id: "luxury-transfers",
    title: "Chauffeured Transfers & Sightseeing",
    tagline: "Arrive in comfort from Mumbai or Pune",
    icon: Car,
    status: "Partnering",
    badgeColor: "bg-blue-100 text-blue-800",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    features: [
      "Door-to-door luxury SUV pickups (Innova Hycross / Fortuner / BMW)",
      "Experienced local drivers well-versed with Western Ghat roads",
      "Day packages for Tiger Point, Pawana Lake & winery day tours",
      "Airport & railway station meet-and-greet service",
    ],
  },
  {
    id: "in-villa-wellness",
    title: "In-Villa Spa & Ayurvedic Massages",
    tagline: "Deep therapeutic relaxation without stepping out",
    icon: Sparkles,
    status: "Curating Therapists",
    badgeColor: "bg-emerald-100 text-emerald-800",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    features: [
      "Certified therapists with portable luxury massage tables",
      "Aromatherapy, Swedish & deep-tissue healing treatments",
      "Organic botanical oils, herbal compresses & sound therapy",
      "Morning sunrise guided meditation and yoga sessions on the lawn",
    ],
  },
  {
    id: "starlight-cinema",
    title: "Open-Air Starlight Cinema",
    tagline: "Your private film festival under the constellations",
    icon: Film,
    status: "Launching Soon",
    badgeColor: "bg-rose-100 text-rose-800",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    features: [
      "120-inch high-definition outdoor lawn projection screen",
      "Comfortable waterproof beanbags, rugs & plush throws",
      "Wireless Dolby surround-sound headphone system",
      "Gourmet buttery popcorn station & vintage soda bar",
    ],
  },
];

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    selectedService: "Private Chef & Live Barbeque",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isServiceDrawerOpen, setIsServiceDrawerOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    setIsSubmitted(true);
  };

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.contact.trim()) {
      const el = document.getElementById("waitlist-section");
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-0 pb-16">
      {/* ============================================================== */}
      {/* 📱 MOBILE VIEW ONLY (block md:hidden): Matches Homepage Hero   */}
      {/* ============================================================== */}
      <div className="block md:hidden bg-white relative mb-2">
        {/* Banner with Centered Typography */}
        <div className="relative w-full h-[380px] sm:h-[420px] overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
              alt="Bespoke In-Villa Services"
              className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.03]"
            />
          </div>

          {/* Vignette Gradients for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none z-[1]" />

          {/* Center: Bold White Headline & Translucent Tag */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-14 pb-14">
            <div className="flex flex-col items-center max-w-sm">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-[1.22] drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
                Bespoke In-Villa Services
              </h1>

              <div className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/70 bg-black/30 backdrop-blur-md text-white text-xs font-semibold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Villa Concierge • Coming Soon</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Request VIP Card Overlapping Hero Banner */}
        <div className="relative z-30 px-3.5 -mt-16 sm:-mt-20 pb-3">
          <div className="bg-white rounded-[24px] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-200/80">
            {/* Box 1: Service Selection Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsServiceDrawerOpen(true)}
              className="w-full bg-[#f8f9fc] hover:bg-[#ebf0f7] border border-neutral-200/60 rounded-2xl px-3.5 py-3 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-2xs text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Sparkles className="w-4 h-4 text-[#ff6900] shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-neutral-500 font-medium">Interested Service</span>
                  <span className="text-xs sm:text-sm font-bold text-neutral-800 truncate">
                    {formData.selectedService}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
            </button>

            {/* Box 2: Name & WhatsApp Inputs Side-by-Side */}
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <div className="bg-[#f8f9fc] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center shadow-2xs">
                <input
                  type="text"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 placeholder:font-normal focus:outline-none"
                />
              </div>
              <div className="bg-[#f8f9fc] border border-neutral-200/60 rounded-2xl px-3 py-2.5 flex items-center shadow-2xs">
                <input
                  type="tel"
                  placeholder="WhatsApp No."
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 placeholder:text-neutral-400 placeholder:font-normal focus:outline-none"
                />
              </div>
            </div>

            {/* Box 3: Orange CTA Button */}
            <button
              type="button"
              onClick={handleMobileSubmit}
              disabled={isSubmitted}
              className="mt-3.5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#ff6900] via-[#ff7a1a] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] active:scale-[0.98] text-white font-bold text-sm shadow-[0_8px_24px_rgba(255,105,0,0.36)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-85"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VIP Access Reserved!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>Request VIP Early Access</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-neutral-400 text-center mt-2.5 font-normal">
              No spam ever. We only notify you when concierge reservations open.
            </p>
          </div>
        </div>

        {/* Service Selection Drawer */}
        <Drawer open={isServiceDrawerOpen} onOpenChange={setIsServiceDrawerOpen}>
          <DrawerContent className="max-h-[85vh] rounded-t-3xl border-none bg-white p-0 overflow-hidden">
            <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1" />
            <DrawerHeader className="text-left px-5 pt-2 pb-3 border-b border-neutral-150">
              <div className="flex items-center justify-between">
                <div>
                  <DrawerTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#ff6900]" />
                    <span>Select In-Villa Service</span>
                  </DrawerTitle>
                  <div className="text-xs text-neutral-500 font-medium mt-0.5">
                    Choose the bespoke service you are most interested in
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
              {UPCOMING_SERVICES.map((srv) => {
                const isSelected = formData.selectedService === srv.title;
                const IconComponent = srv.icon;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, selectedService: srv.title });
                      setIsServiceDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-between py-3.5 text-left transition-colors hover:text-[#ff6900]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className={cn("text-sm block", isSelected ? "font-bold text-[#ff6900]" : "font-medium text-neutral-800")}>
                          {srv.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 block">{srv.tagline}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#ff6900] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* ============================================================== */}
      {/* 💻 DESKTOP VIEW ONLY (hidden md:flex): Matches Homepage Hero   */}
      {/* ============================================================== */}
      <section className="hidden md:flex relative w-full min-h-[580px] lg:min-h-[640px] flex-col justify-between overflow-hidden shadow-xl mb-10 md:mb-14">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
            alt="Villa Concierge & Bespoke Services"
            className="w-full h-full object-cover object-center brightness-[0.88] contrast-[1.03]"
          />
          {/* Gradients matching homepage hero for rich contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/75 pointer-events-none z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent pointer-events-none z-[1]" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none z-[1]" />
        </div>

        {/* Content Container (pt-28 md:pt-32 accounts for transparent header) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-10 flex flex-col justify-between flex-1">
          <div className="max-w-3xl flex flex-col">
            {/* Transparent Blur Badge */}
            <div className="inline-flex items-center self-start gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900] animate-pulse shrink-0" />
              <span>Villa Concierge &amp; On-Demand Services</span>
              <span className="w-1 h-1 rounded-full bg-white/60 mx-0.5" />
              <span className="text-white/80 font-normal">Coming Soon</span>
            </div>

            {/* Main Headline: Bold White Text with Editorial Proportions */}
            <h1 className="text-2xl md:text-4xl lg:text-[44px] font-black text-white tracking-tight leading-[1.18] drop-shadow-lg">
              Elevate Your Getaway with Bespoke Services
            </h1>

            {/* Shortened Subtitle */}
            <p className="text-white/90 text-sm md:text-base max-w-2xl mt-3.5 font-normal leading-relaxed drop-shadow-md">
              Signature in-villa chef dining, starlit acoustic bonfires, and bespoke concierge experiences handcrafted for your stay.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 mt-7">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById("waitlist-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-semibold text-sm shadow-[0_6px_20px_rgba(255,105,0,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Request VIP Early Access</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>

              <Link
                href="/category/all"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-medium text-sm shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Utensils className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Explore Available Villas</span>
              </Link>
            </div>
          </div>

          {/* Bottom Trust & Feature Badges Strip */}
          <div className="mt-10 pt-5 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Verified Premium Partners</div>
                  <div className="text-white/60 text-[10px]">Trained chefs &amp; artists</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-yellow-400/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-yellow-400" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Handcrafted For Stays</div>
                  <div className="text-white/60 text-[10px]">Custom multi-course menus</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ff6900]/20 border border-ff6900]/40 flex items-center justify-center text-[#ff6900] shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Dedicated Concierge</div>
                  <div className="text-white/60 text-[10px]">Pre-arrival coordination</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-sky-400/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-white text-xs font-bold leading-tight">Launching In Next Phase</div>
                  <div className="text-white/60 text-[10px]">Exclusive guest perks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="waitlist-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIP Early Access Waitlist Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/90 shadow-sm mb-16 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900]">
              <BellRing className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              Get VIP Early Access & Exclusive Inaugural Offers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto">
              Be the first to experience our personalized in-villa services. Sign up to receive priority booking and complimentary celebration perks when services go live.
            </p>

            {isSubmitted ? (
              <div className="mt-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col items-center justify-center space-y-2 animate-in fade-in zoom-in-95">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                <h4 className="font-bold text-sm">You are on the VIP Priority List!</h4>
                <p className="text-xs text-emerald-700 text-center max-w-md">
                  Thank you, {formData.name}. Our concierge team will reach out at {formData.contact} as soon as service bookings open.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-3 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Email or WhatsApp Number"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={formData.selectedService}
                    onChange={(e) => setFormData({ ...formData, selectedService: e.target.value })}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900]"
                  >
                    {UPCOMING_SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        Interested in: {s.title}
                      </option>
                    ))}
                  </select>

                  <Button
                    type="submit"
                    className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-xs transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" /> Notify Me
                  </Button>
                </div>

                <p className="text-[11px] text-neutral-400">
                  No spam ever. We only notify you when concierge reservations open.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ff6900] mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Upcoming Offerings
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Preview of Services Coming to Your Villa
          </h2>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {UPCOMING_SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.id}
                className="group flex flex-col bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300"
              >
                {/* Visual Header */}
                <div className="relative h-52 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-neutral-900 backdrop-blur-md shadow-xs">
                      <Icon className="w-3.5 h-3.5 text-[#ff6900]" />
                      {service.status}
                    </span>
                  </div>

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                    <h3 className="text-lg font-bold leading-snug drop-shadow-sm">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-200 line-clamp-1">
                      {service.tagline}
                    </p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                      What's Included
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs text-neutral-700 leading-relaxed"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-neutral-400">
                        Status:
                      </span>
                      <span className="text-xs font-bold text-[#ff6900] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Partner with us CTA */}
        <section className="mt-16 rounded-3xl bg-neutral-900 text-white p-8 md:p-12 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              For Chefs, Artists & Partners
            </span>
            <h3 className="text-2xl font-bold text-white">
              Are you a local chef, musician or service vendor?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300">
              Partner with ThevillaCamp to offer your premium services to verified guests staying in high-end villas across Lonavala, Khandala & Alibaug.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/become-host"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs sm:text-sm font-semibold shadow-md transition-all"
            >
              <HeartHandshake className="w-4 h-4" /> Partner With Us
            </Link>
            <Link
              href="/account/support"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-md transition-all"
            >
              Contact Team
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
