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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-24 md:pt-28 pb-16">
      <section className="relative overflow-hidden bg-neutral-950 text-white py-16 md:py-24 px-4 sm:px-6 lg:px-8 mx-3 sm:mx-6 rounded-3xl mb-12 shadow-xl">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#ff6900]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#ff6900]" />
            <span>Coming Soon • Villa Concierge & On-Demand Services</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Elevate Your Getaway with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] via-amber-400 to-orange-300">
              Bespoke Experiences
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-300 leading-relaxed">
            We are putting the finishing touches on our signature in-villa services. From private culinary chefs and starlit acoustic bonfires to celebration decor and luxury chauffeur transfers — extraordinary memories are just around the corner.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-neutral-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Premium Partners
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Handcrafted For Every Stay
            </span>
            <span className="w-1 h-1 rounded-full bg-neutral-600 hidden sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#ff6900]" /> Launching in Next Phase
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
