"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Sparkles } from "lucide-react";

// Lazy-load the heavy AI Concierge Chatbot component ONLY when the user clicks the launcher
const AIConciergeModal = dynamic(() => import("./AIConciergeBot"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-3 sm:bottom-6 right-2 sm:right-6 z-[99999] w-[calc(100vw-1rem)] sm:w-[355px] h-[630px] max-h-[92vh] bg-[#fbfaf6] rounded-[28px] shadow-2xl border border-neutral-200/90 flex items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-neutral-800">Starting AI Concierge...</p>
        <p className="text-[11px] text-neutral-500">Preparing personalized stay recommendations</p>
      </div>
    </div>
  ),
});

export default function AIConciergeLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {/* 
        =========================================================================
        FLOATING WIDGETS CLUSTER: WHATSAPP + AI CONCIERGE LAUNCHER
        - Guaranteed visibility on Homepage for both mobile and desktop
        - Mobile: bottom-[86px] right-3 (floats smoothly above the 70px mobilenav bar)
        - Tablet: sm:bottom-24 sm:right-6
        - Desktop: md:bottom-8 md:right-8
        =========================================================================
      */}
      {!isOpen && (
        <div
          data-ai-concierge-mascot="true"
          className="fixed bottom-[86px] right-3 sm:bottom-24 sm:right-6 md:bottom-8 md:right-8 z-[99999] flex items-center gap-3 transition-all duration-200 pointer-events-auto"
        >
          {/* WhatsApp Floating Widget Button (Desktop Only) */}
          <a
            href="https://wa.me/918669186483?text=Hi%20The%20Villa%20Camp%2C%20I%20am%20interested%20in%20booking%20a%20luxury%20stay!"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex relative group items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Chat with Concierge on WhatsApp"
          >
            {/* Subtle Static Ambient Glow Ring */}
            <span className="absolute -inset-0.5 rounded-full bg-emerald-500/25 blur-sm group-hover:blur-md transition-all" />

            {/* Circular WhatsApp Container */}
            <div className="relative w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba59] border-2 border-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all">
              <svg
                viewBox="0 0 24 24"
                width="28"
                height="28"
                fill="currentColor"
                className="text-white drop-shadow-xs"
              >
                <path d="M20.52 3.48A11.93 11.93 0 0012.06 0C5.46 0 .09 5.37.09 11.97c0 2.11.55 4.16 1.6 5.98L0 24l6.23-1.63a11.93 11.93 0 005.83 1.51h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.52-8.43zM12.06 21.88h-.01a9.92 9.92 0 01-5.06-1.39l-.36-.21-3.76.99 1-3.66-.23-.38a9.92 9.92 0 01-1.52-5.26c0-5.48 4.46-9.94 9.95-9.94 2.65 0 5.15 1.03 7.03 2.91a9.88 9.88 0 012.91 7.03c0 5.48-4.46 9.94-9.95 9.94zm5.45-7.44c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.64-.93-2.25-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.51s1.08 2.91 1.23 3.11c.15.2 2.11 3.23 5.12 4.53.72.31 1.28.5 1.71.64.72.23 1.37.2 1.88.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35z" />
              </svg>
            </div>

            {/* Hover Tooltip (Desktop - Anchored to Left) */}
            <span className="hidden sm:group-hover:flex absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-medium whitespace-nowrap shadow-xl items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              Chat on WhatsApp • 24/7 Support
            </span>
          </a>

          {/* AI Concierge Mascot Trigger Button */}
          <button
            type="button"
            id="ai-concierge-mascot-launcher"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="relative group flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
            aria-label="Open AI Concierge"
          >
            {/* Outer Breathing Glow Ring */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-400/35 to-amber-300/35 blur-md group-hover:blur-lg transition-all animate-pulse" />

            {/* Circular Mascot Avatar Container */}
            <div className="relative w-14 h-14 rounded-full bg-white border-2 border-orange-200/90 shadow-xl overflow-hidden p-0.5">
              <img
                src="/assets/ai-concierge-mascot.png"
                alt="VillaCamp AI Concierge"
                width={56}
                height={56}
                className="w-full h-full object-cover rounded-full"
                loading="eager"
              />
            </div>

            {/* Active Online Indicator Badge */}
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>

            {/* Hover Tooltip (Desktop - Anchored to Left) */}
            <span className="hidden sm:group-hover:flex absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-medium whitespace-nowrap shadow-xl items-center gap-1.5 animate-in fade-in slide-in-from-right-2 duration-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Plan your stay with AI
            </span>
          </button>
        </div>
      )}

      {/* AI Concierge Chat Modal (Dynamically loaded on-demand when clicked) */}
      {isOpen && (
        <AIConciergeModal
          isOpen={true}
          onClose={() => setIsOpen(false)}
          showLauncher={false}
        />
      )}
    </>
  );
}
