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
  Compass,
  Smartphone,
  Star,
  Zap,
  Tag,
  MessageCircle,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Footerlogo from "@/public/Productasset/Logoicon.png";

export default function Footer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };
  const { destinationData, destinationLoading, destinationFetched } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    if (!destinationFetched && !destinationLoading) {
      dispatch(fetchdestination());
    }
  }, [dispatch, destinationFetched, destinationLoading]);

  const handleDestinationClick = (namePrefix) => {
    const matched = destinationData?.find((dest) =>
      dest.name?.toLowerCase().includes(namePrefix.toLowerCase())
    );
    if (matched) {
      dispatch(setselectedLocationId(matched._id));
    }
    router.push("/search-your-gateway");
  };

  return (
    <footer className="relative w-full bg-neutral-950 text-white overflow-hidden pt-8 sm:pt-14 md:pt-16 pb-28 sm:pb-16 md:pb-8 border-t border-neutral-800/80">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-b from-orange-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            MOBILE VIEW (< md): Minimal, Clean Luxury Footer
           ========================================================================= */}
        <div className="block md:hidden">
          {/* 1. Brand Header & Verified Status */}
          <div className="flex items-center justify-between pb-5 border-b border-neutral-800/80">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center">
                <Image
                  src={Footerlogo}
                  alt="The Villa Camp"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-base font-extrabold text-white tracking-tight">
                  The Villa <span className="text-[#ff6900]">Camp</span>
                </span>
                <span className="block text-[10px] text-neutral-400 font-medium tracking-wider uppercase -mt-0.5">
                  Curated Luxury Stays
                </span>
              </div>
            </Link>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-semibold">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified</span>
            </div>
          </div>

          {/* 2. One-Tap Instant Concierge & Caretaker Actions */}
          <div className="grid grid-cols-3 gap-2 py-3.5 border-b border-neutral-800/80">
            <a
              href="tel:+918669186483"
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <Phone className="w-4 h-4 text-[#ff6900]" />
              <span className="text-[11px] font-semibold">Direct Call</span>
            </a>
            <a
              href="https://wa.me/918669186483"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-semibold">WhatsApp</span>
            </a>
            <a
              href="mailto:info@thevillacamp.com"
              className="flex flex-col items-center justify-center gap-1.5 py-2.5 px-2 rounded-2xl bg-neutral-900/90 border border-neutral-800/80 hover:border-neutral-700 active:scale-95 transition-all text-neutral-300 hover:text-white"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-semibold">Support</span>
            </a>
          </div>

          {/* 3. Minimal Accordions */}
          <div className="divide-y divide-neutral-800/70 border-b border-neutral-800/80">
            {/* Accordion 1: Destinations */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleSection("destinations")}
                className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Top Getaways & Locations</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-neutral-400 transition-transform duration-200",
                    openSection === "destinations" && "rotate-180 text-[#ff6900]"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "destinations" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-1 pl-5 space-y-2 text-xs text-neutral-400">
                      <li>
                        <button
                          type="button"
                          onClick={() => handleDestinationClick("Lonavala")}
                          className="hover:text-white transition-colors text-left"
                        >
                          Lonavala Luxury Villas
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleDestinationClick("Pawna")}
                          className="hover:text-white transition-colors text-left"
                        >
                          Pawna Lake Camps & Glamping
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleDestinationClick("Kamshet")}
                          className="hover:text-white transition-colors text-left"
                        >
                          Kamshet Nature Cottages
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          onClick={() => handleDestinationClick("Malavli")}
                          className="hover:text-white transition-colors text-left"
                        >
                          Malavli Mountain Retreats
                        </button>
                      </li>
                      <li>
                        <Link
                          href="/search-your-gateway"
                          className="inline-flex items-center gap-1.5 text-[#ff6900] font-medium pt-1"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>Explore All on Map</span>
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Stay Collections */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleSection("categories")}
                className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Stay Collections</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-neutral-400 transition-transform duration-200",
                    openSection === "categories" && "rotate-180 text-[#ff6900]"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "categories" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-1 pl-5 space-y-2 text-xs text-neutral-400">
                      <li>
                        <Link href="/category/Villa" className="hover:text-white transition-colors">
                          Private Pool Villas & Estates
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Camping" className="hover:text-white transition-colors">
                          Lakeside Camping & Glamping
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Cottage" className="hover:text-white transition-colors">
                          Wooden & Scenic Cottages
                        </Link>
                      </li>
                      <li>
                        <Link href="/category/Hotel" className="hover:text-white transition-colors">
                          Boutique Resorts & Hotels
                        </Link>
                      </li>
                      <li>
                        <Link href="/shorts" className="inline-flex items-center gap-1 text-amber-400 font-medium pt-1">
                          <span>📹 Trending Video Shorts</span>
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 3: Support, Company & Policies */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => toggleSection("support")}
                className="w-full py-3 flex items-center justify-between text-left text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Support & Trust Policies</span>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-neutral-400 transition-transform duration-200",
                    openSection === "support" && "rotate-180 text-[#ff6900]"
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {openSection === "support" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="pb-3 pt-1 pl-5 space-y-2 text-xs text-neutral-400">
                      <li>
                        <Link href="/about" className="hover:text-white transition-colors">
                          About The Villa Camp
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="hover:text-white transition-colors">
                          24/7 Guest Support
                        </Link>
                      </li>
                      <li>
                        <Link href="/become-host" className="inline-flex items-center gap-1 text-[#ff6900] font-medium">
                          <span>List Your Property (Free)</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                          Cancellation & Refund Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="/privacy-policy" className="hover:text-white transition-colors">
                          Privacy Policy
                        </Link>
                      </li>
                      <li>
                        <Link href="/terms-of-service" className="hover:text-white transition-colors">
                          Terms of Service
                        </Link>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 4. Compact App Download Bar */}
          <div className="my-4 p-3 rounded-2xl bg-neutral-900/70 border border-neutral-800/80 flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6900] shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">The Villa Camp App</p>
                <p className="text-[10px] text-neutral-400 truncate">Exclusive deals & instant check-in</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="App Store"
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-semibold border border-neutral-700/80 active:scale-95 transition-all"
              >
                iOS
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Play"
                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-semibold border border-neutral-700/80 active:scale-95 transition-all"
              >
                Android
              </a>
            </div>
          </div>

          {/* 5. Minimal Trust Strip */}
          <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-neutral-800/70 text-[10px] text-neutral-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
              <span>100% Verified Stays</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Secure 256-Bit Pay</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Best Rate Direct</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
              <span>24/7 Care</span>
            </div>
          </div>

          {/* 6. Social Media, Copyright & Legal */}
          <div className="pt-4 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-[#ff6900] hover:border-[#ff6900] transition-all"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-neutral-400">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <span className="text-neutral-700">•</span>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">
                Terms
              </Link>
              <span className="text-neutral-700">•</span>
              <Link href="/cancellation-policy" className="hover:text-white transition-colors">
                Cancellations
              </Link>
            </div>

            <p className="text-[10px] text-neutral-500 pb-4">
              © {new Date().getFullYear()} The Villa Camp. Handcrafted luxury getaways.
            </p>
          </div>
        </div>

        {/* =========================================================================
            DESKTOP VIEW (>= md): Full Editorial 6-Column Authority Layout
           ========================================================================= */}
        <div className="hidden md:block">
        {/* =========================================================================
            Top Mobile App Promotion Banner (Option 3)
           ========================================================================= */}
        <div className="relative rounded-3xl bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-950 border border-neutral-800/90 p-5 sm:p-7 md:p-9 mb-10 sm:mb-14 shadow-2xl overflow-hidden">
          {/* Subtle Orange Glow inside banner */}
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            {/* Left Column: Heading, Perks & Value Props */}
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/25 text-[#ff6900] text-[11px] sm:text-xs font-semibold mb-3 shadow-2xs">
                <Smartphone className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>The Villa Camp Mobile App</span>
                <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
                <span className="text-white/80 font-normal">iOS & Android</span>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Experience Luxury Getaways at Your Fingertips
              </h3>

              <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                Book private pool villas faster, unlock exclusive mobile-only deals, receive instant WhatsApp gate passes, and chat 24/7 directly with estate caretakers.
              </p>

              {/* App Perks Badges */}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/70 text-neutral-300 font-medium">
                  <Tag className="w-3.5 h-3.5 text-[#ff6900]" />
                  <span>Up to 15% In-App Member Rates</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/70 text-neutral-300 font-medium">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Instant Digital Check-In</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/80 border border-neutral-700/70 text-neutral-300 font-medium">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Direct Caretaker Chat</span>
                </span>
              </div>
            </div>

            {/* Right Column: Download Buttons & Rating */}
            <div className="flex flex-col gap-2.5 w-full sm:w-auto min-w-[190px] lg:shrink-0">
              {/* Apple App Store */}
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-[#ff6900]/50 transition-all shadow-md cursor-pointer active:scale-95"
              >
                <svg className="w-6 h-6 fill-white group-hover:text-[#ff6900] transition-colors shrink-0" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.09 1.73-.95 2.75 1 .08 2.06-.5 2.68-1.25z"/>
                </svg>
                <div className="text-left">
                  <span className="block text-[9px] text-neutral-400 uppercase tracking-wider leading-none">Download on the</span>
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5 group-hover:text-[#ff6900] transition-colors">
                    App Store
                  </span>
                </div>
              </a>

              {/* Google Play Store */}
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-[#ff6900]/50 transition-all shadow-md cursor-pointer active:scale-95"
              >
                <svg className="w-5 h-5 fill-white group-hover:text-[#ff6900] transition-colors shrink-0 ml-0.5" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.958V2.772c.162-.358.376-.684.61-.958zm11.242 11.244l2.508-2.508L4.85 3.398l9.999 9.66zm0 1.884L4.85 24.602l12.509-7.152-2.508-2.508zm1.53-1.53l3.522 2.013c1.07.612 1.07 1.609 0 2.221l-3.522 2.013 2.13-2.13-2.13-2.117z"/>
                </svg>
                <div className="text-left ml-0.5">
                  <span className="block text-[9px] text-neutral-400 uppercase tracking-wider leading-none">GET IT ON</span>
                  <span className="block text-xs sm:text-sm font-bold text-white tracking-tight mt-0.5 group-hover:text-[#ff6900] transition-colors">
                    Google Play
                  </span>
                </div>
              </a>

              {/* Social Proof Subtext */}
              <div className="flex items-center justify-between px-1 text-[10px] text-neutral-400">
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>4.9 Rating</span>
                </div>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-400">50K+ Installs</span>
              </div>
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
      </div>
    </footer>
  );
}
