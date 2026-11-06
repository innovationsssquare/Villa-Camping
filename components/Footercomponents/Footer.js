"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  ShieldCheck,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import HeaderLogo from "@/public/Productasset/mainlogo_clean.png";

export default function Footer() {
  const socialChannels = [
    {
      id: "instagram",
      name: "Instagram",
      url: "https://www.instagram.com/thevillacamp/",
      icon: Instagram,
      color: "#E1306C",
      bgColor: "#FFF1F2",
      borderColor: "#FCE7F3",
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://www.youtube.com/@Thevillacamp",
      icon: Youtube,
      color: "#FF0000",
      bgColor: "#FEF2F2",
      borderColor: "#FEE2E2",
    },
    {
      id: "facebook",
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61594403481188",
      icon: Facebook,
      color: "#1877F2",
      bgColor: "#EFF6FF",
      borderColor: "#DBEAFE",
    },
    {
      id: "x",
      name: "X",
      url: "https://x.com/Thevillacamp",
      icon: Twitter,
      color: "#0F172A",
      bgColor: "#F8FAFC",
      borderColor: "#E2E8F0",
    },
  ];

  return (
    <footer className="w-full bg-[#F8FAFC] border-t border-[#F1F5F9] pt-8 sm:pt-10 pb-28 sm:pb-14 md:pb-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center">
        {/* Header Logo */}
        <Link
          href="/"
          className="inline-flex items-center justify-center mb-4 transition-transform hover:scale-105 active:scale-95"
        >
          <Image
            src={HeaderLogo}
            alt="The Villa Camp"
            width={145}
            height={36}
            priority
            className="h-8 sm:h-9 w-auto object-contain"
          />
        </Link>

        {/* 1. Official Social Channels Row (Exact matching Thevillacamp app) */}
        <div className="flex flex-col items-center justify-center my-2">
          <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.6px] mb-3">
            Connect With Us
          </span>

          <div className="flex items-center justify-center gap-3.5 sm:gap-4">
            {socialChannels.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${item.name}`}
                  style={{
                    backgroundColor: item.bgColor,
                    borderColor: item.borderColor,
                  }}
                  className="w-[42px] h-[42px] rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.03)] cursor-pointer"
                >
                  <IconComponent
                    className="w-5 h-5 transition-transform duration-200"
                    style={{ color: item.color }}
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* 2. One-Line Short Description with Government of India MSME / UDYAM Register */}
        <div className="my-3 px-3">
          <p className="text-[11px] sm:text-xs text-neutral-500 font-medium leading-relaxed max-w-2xl flex items-center justify-center flex-wrap gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 inline" />
            <span>
              Govt. of India MSME (UDYAM) Registered Enterprise • Verified Luxury Stays & Certified Caretakers across Maharashtra.
            </span>
          </p>
        </div>

        {/* 3. Minimal Quick Navigation & Legal Links */}
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1.5 text-[11px] sm:text-xs text-neutral-500 my-2">
          <Link
            href="/experiences"
            className="hover:text-neutral-900 transition-colors"
          >
            Experiences
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            href="/services"
            className="hover:text-neutral-900 transition-colors"
          >
            Services
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            href="/become-host"
            className="hover:text-[#FF5A36] font-medium transition-colors"
          >
            Become a Host
          </Link>
          <span className="text-neutral-300">•</span>
          <a
            href="tel:+918669186483"
            className="hover:text-neutral-900 transition-colors"
          >
            +91 8669186483
          </a>
          <span className="text-neutral-300">•</span>
          <Link
            href="/privacy-policy"
            className="hover:text-neutral-900 transition-colors"
          >
            Privacy
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            href="/terms-of-service"
            className="hover:text-neutral-900 transition-colors"
          >
            Terms
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            href="/cancellation-policy"
            className="hover:text-neutral-900 transition-colors"
          >
            Cancellations
          </Link>
        </div>

        {/* 4. Domain Button & Copyright (Exact match with Thevillacamp app homeFooter / profileFooter) */}
        <div className="mt-3 pt-3 border-t border-[#F1F5F9] w-full flex flex-col items-center justify-center gap-1.5">
          <a
            href="https://thevillacamp.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-1 px-2 rounded-lg text-[#FF5A36] hover:text-[#e04f2e] transition-colors active:scale-95"
          >
            <Globe className="w-3.5 h-3.5 text-[#FF5A36]" />
            <span className="text-[13px] font-bold tracking-[0.3px]">
              thevillacamp.in
            </span>
          </a>

          <p className="text-[11px] text-[#94A3B8] font-normal">
            © {new Date().getFullYear()} The Villa Camp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
