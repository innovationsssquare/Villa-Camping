"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function ConsentGTM({ gtmId, measurementId }) {
  const [consent, setConsent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("cookie_consent");
      if (v === "true") setConsent(true);
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

  if (!consent && dismissed) return null;

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
        <div className="fixed bottom-4 right-4 z-50 bg-white p-4 rounded-lg shadow-md max-w-sm">
          <div className="text-sm text-gray-800 mb-2">We use cookies for analytics. Accept?</div>
          <div className="flex space-x-2 justify-end">
            <button onClick={decline} className="px-3 py-1 rounded bg-gray-200">Decline</button>
            <button onClick={accept} className="px-3 py-1 rounded bg-blue-600 text-white">Accept</button>
          </div>
        </div>
      )}
    </>
  );
}
