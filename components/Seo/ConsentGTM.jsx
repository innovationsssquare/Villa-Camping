"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";

export default function ConsentGTM({ gtmId, measurementId }) {
  const [consent, setConsent] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem("cookie_consent");
      if (v === "true") {
        setConsent(true);
      } else if (v === "false") {
        setDismissed(true);
      }
    } catch (e) {}
  }, []);

  const accept = () => {
    try {
      localStorage.setItem("cookie_consent", "true");
    } catch (e) {}
    setConsent(true);
  };

  const decline = () => {
    try {
      localStorage.setItem("cookie_consent", "false");
    } catch (e) {}
    setDismissed(true);
  };

  if (!mounted) return null;

  return (
    <>
      {consent && (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'}); var f=d.getElementsByTagName(s)[0], j=d.createElement(s); j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id=${gtmId}'; f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>

          {measurementId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
                strategy="afterInteractive"
              />
              <Script id="gtag-init" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config','${measurementId}');`}
              </Script>
            </>
          )}
        </>
      )}

      {!consent && !dismissed && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="relative bg-neutral-950/95 text-white backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/15 p-4 sm:p-5 shadow-2xl space-y-3.5">
            {/* Top row with icon & close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[#ff6900] shrink-0">
                  <Cookie className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Cookie &amp; Privacy Preferences
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Secure &amp; GDPR / Indian IT Act Compliant</span>
                  </div>
                </div>
              </div>

              <button
                onClick={decline}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Dismiss cookie notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-neutral-300 leading-relaxed">
              We use essential, analytical, and functional cookies to ensure seamless booking performance, personalize your luxury staycation recommendations, and remember your session.
            </p>

            {/* Actions */}
            <div className="pt-1 flex flex-wrap sm:flex-nowrap items-center gap-2">
              <button
                onClick={accept}
                className="flex-1 h-9 px-4 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center shadow-md transition-all cursor-pointer"
              >
                Accept All
              </button>
              <button
                onClick={decline}
                className="h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-[0.99] text-white/90 hover:text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer"
              >
                Essential Only
              </button>
              <Link
                href="/privacy-policy"
                className="text-[11px] text-neutral-400 hover:text-neutral-200 underline underline-offset-2 ml-auto shrink-0"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
