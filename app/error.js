"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 flex flex-col items-center justify-center px-6 text-center transition-colors">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-3 border border-rose-200 dark:border-rose-900/40">
        Error
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
        This page could not be loaded. You can retry, or go back to the home page to continue browsing stays.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 px-6 py-2.5 text-sm font-semibold text-white dark:text-neutral-900 shadow-md transition-all cursor-pointer"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 px-6 py-2.5 text-sm font-semibold text-neutral-900 dark:text-neutral-100 transition-all cursor-pointer"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
