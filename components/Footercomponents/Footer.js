"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  setselectedLocationId,
  fetchdestination,
} from "@/Redux/Slices/propertiesSlice";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ShieldCheck,
  CreditCard,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Send,
  Compass,
} from "lucide-react";
import Footerlogo from "@/public/Productasset/Logoicon.png";

export default function Footer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { destinationData } = useSelector((state) => state.properties);

  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!destinationData || destinationData.length === 0) {
      dispatch(fetchdestination());
    }
  }, [dispatch, destinationData]);

  const handleDestinationClick = (namePrefix) => {
    const matched = destinationData?.find((dest) =>
      dest.name?.toLowerCase().includes(namePrefix.toLowerCase())
    );
    if (matched) {
      dispatch(setselectedLocationId(matched._id));
    }
    router.push("/search-your-gateway");
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubscribed(true);
  };

  return (
    <footer className="relative w-full bg-neutral-950 text-white overflow-hidden pt-10 sm:pt-14 md:pt-16 pb-24 sm:pb-12 md:pb-8 border-t border-neutral-800/80">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            Top Newsletter / Travel Club Card
           ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900/95 via-neutral-900/80 to-neutral-950 border border-neutral-800/90 p-5 sm:p-8 md:p-10 mb-10 sm:mb-14 shadow-2xl overflow-hidden">
          {/* Subtle Orange Scrim inside banner */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-[#ff6900]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-2 shadow-2xs">
                <Sparkles className="w-3 h-3 text-[#ff6900]" />
                <span>The Villa Camp Travel Club</span>
                <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
                <span className="text-white/80 font-normal">Get 10% Off First Stay</span>
              </div>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Unlock Secret Weekend Deals & Flash Sales
              </h3>
              <p className="text-[11px] sm:text-xs md:text-sm text-neutral-400 mt-1.5 leading-relaxed">
                Join 15,000+ travelers. Get handpicked private pool villas, lakeside camping alerts, and exclusive long-weekend discount vouchers directly to your inbox.
              </p>
            </div>

            {/* Newsletter Subscription Form */}
            <div className="w-full lg:w-auto lg:min-w-[380px]">
              {isSubscribed ? (
                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Welcome to the club! Check your inbox for your 10% discount code.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="w-full h-11 sm:h-12 px-4 rounded-xl sm:rounded-full bg-neutral-800/90 border border-neutral-700/80 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-[#ff6900] focus:ring-1 focus:ring-[#ff6900] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-11 sm:h-12 px-6 rounded-xl sm:rounded-full bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#ff7a1a] hover:to-[#f06414] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            Main Footer Navigation Grid
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-neutral-800/80">
          {/* Column 1 & 2: Brand Identity & Contact */}
          <div className="sm:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Brand Header */}
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center group-hover:border-[#ff6900]/50 transition-colors">
                  <Image
                    src={Footerlogo}
                    alt="The Villa Camp Logo"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-black text-white tracking-tight">
                    The Villa <span className="text-[#ff6900]">Camp</span>
                  </span>
                  <span className="block text-[10px] text-neutral-400 font-medium -mt-1 tracking-wider uppercase">
                    Luxury Stays & Getaways
                  </span>
                </div>
              </Link>

              {/* Brand Summary */}
              <p className="text-[11px] sm:text-xs text-neutral-400 leading-relaxed mb-4 max-w-sm">
                Maharashtra’s premier luxury staycation platform. Discover handpicked private pool villas, lakeside glamping tents, and secluded mountain chalets across Lonavala, Pawna Lake, Alibaug, and Karjat.
              </p>

              {/* Contact Information */}
              <div className="space-y-2.5 mb-5 text-[11px] sm:text-xs text-neutral-400">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                  <span>Apti, Pavananagar, Mawal, Lonavala, Maharashtra 410401</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#ff6900] shrink-0" />
                  <a
                    href="tel:+918669186483"
                    className="text-white hover:text-[#ff6900] transition-colors font-medium"
                  >
                    +91 8669186483
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#ff6900] shrink-0" />
                  <a
                    href="mailto:info@thevillacamp.com"
                    className="text-white hover:text-[#ff6900] transition-colors font-medium"
                  >
                    info@thevillacamp.com
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all hover:scale-105"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all hover:scale-105"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all hover:scale-105"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all hover:scale-105"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 3: Top Destinations (Dynamic with Redux Handler) */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              Top Getaways
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <button
                  onClick={() => handleDestinationClick("Lonavala")}
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all text-left bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="text-[#ff6900] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Lonavala Villas</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDestinationClick("Pawna")}
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all text-left bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="text-[#ff6900] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Pawna Lake Camps</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDestinationClick("Kamshet")}
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all text-left bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="text-[#ff6900] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Kamshet Cottages</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleDestinationClick("Malavli")}
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all text-left bg-transparent border-none p-0 cursor-pointer flex items-center gap-1.5 group"
                >
                  <span className="text-[#ff6900] opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                  <span>Malavli Retreats</span>
                </button>
              </li>
              <li>
                <Link
                  href="/search-your-gateway"
                  className="inline-flex items-center gap-1 text-[#ff6900] font-semibold hover:underline pt-1"
                >
                  <Compass className="w-3 h-3" />
                  <span>Search on Map</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Browse Categories */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              Stay Types
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <Link
                  href="/category/Villa"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Private Pool Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/category/Camping"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Lakeside Camping & Tents
                </Link>
              </li>
              <li>
                <Link
                  href="/category/Cottage"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Scenic Wooden Cottages
                </Link>
              </li>
              <li>
                <Link
                  href="/category/Hotel"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Resorts & Boutique Hotels
                </Link>
              </li>
              <li>
                <Link
                  href="/shorts"
                  className="text-neutral-400 hover:text-[#ff6900] hover:translate-x-1 transition-all inline-flex items-center gap-1"
                >
                  <span>📹 Trending Video Shorts</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Guest & Company */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              Company
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  About Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  24/7 Guest Support
                </Link>
              </li>
              <li>
                <Link
                  href="/become-host"
                  className="text-neutral-400 hover:text-[#ff6900] hover:translate-x-1 transition-all inline-flex items-center gap-1 font-semibold"
                >
                  <span>List Your Property</span>
                  <span className="text-[9px] bg-[#ff6900] text-white px-1.5 py-0.2 rounded-full font-bold">Free</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/experiences"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Curated Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="/category/all"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Special Offers & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Policies & Trust */}
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-3.5 sm:mb-4 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900]" />
              Policies & Safety
            </h4>
            <ul className="space-y-2 text-[11px] sm:text-xs">
              <li>
                <Link
                  href="/cancellation-policy"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-neutral-400 hover:text-white hover:translate-x-1 transition-all inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold pt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>100% Verified Inspection</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================================================
            Trust Signals Bar (Pill Badges)
           ========================================================================= */}
        <div className="py-6 border-b border-neutral-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-[11px] sm:text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-[#ff6900] shrink-0" />
            <span>100% Verified Stays</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-[11px] sm:text-xs font-medium">
            <CreditCard className="w-4 h-4 text-[#ff6900] shrink-0" />
            <span>Secure 256-Bit Payments</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-[11px] sm:text-xs font-medium">
            <HeartHandshake className="w-4 h-4 text-[#ff6900] shrink-0" />
            <span>Best Rate Direct Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-400 text-[11px] sm:text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#ff6900] shrink-0" />
            <span>24/7 Live On-Ground Care</span>
          </div>
        </div>

        {/* =========================================================================
            Bottom Bar: Copyright & Legal
           ========================================================================= */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] sm:text-xs text-neutral-500">
          <div>
            <p>© {new Date().getFullYear()} The Villa Camp. All rights reserved.</p>
            <p className="text-[10px] text-neutral-600 mt-0.5">
              Handcrafted for unforgettable weekend retreats across Maharashtra.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <Link
              href="/privacy-policy"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <span className="text-neutral-700">•</span>
            <Link
              href="/terms-of-service"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <span className="text-neutral-700">•</span>
            <Link
              href="/cancellation-policy"
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Cancellations
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
