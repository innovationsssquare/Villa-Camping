"use client";

import { useEffect } from "react";

/**
 * Next.js Global Error Boundary
 * Catches unhandled errors that occur in the root layout (app/layout.js)
 * and provides a fallback UI so users are never presented with a blank screen.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR_BOUNDARY] Unhandled exception in root layout:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="m-0 p-0 font-sans bg-neutral-50 text-neutral-900 antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-rose-100 text-rose-700 mb-4 border border-rose-200">
            System Notice
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Something unexpected occurred
          </h1>
          <p className="mt-3 max-w-md text-sm text-neutral-600 leading-relaxed">
            We are having trouble loading this page. Our technical team has been notified.
            Please try refreshing or return to the main homepage.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              Reload application
            </button>
            <a
              href="/"
              className="rounded-full border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-800 px-6 py-2.5 text-sm font-semibold transition-all cursor-pointer"
            >
              Go to Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
