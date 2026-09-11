"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VillaReel from "@/components/Reelcomponent/villa-reel";
import { fetchAllReels } from "@/Redux/Slices/propertiesSlice";
import { Loader2, ArrowLeft, RefreshCcw, Film } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { reeldata, reeldataloading, reeldataerror } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchAllReels());
  }, [dispatch]);

  /* -------------------- LOADING STATE -------------------- */
  if (reeldataloading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-950 text-white z-50">
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="h-8 w-8 rounded-full border-2 border-white/20 border-t-[#ff6900] animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-white tracking-wide">
              Loading Villa Shorts
            </span>
            <span className="text-xs text-neutral-500">
              Discovering premier stays & getaways...
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------- ERROR STATE -------------------- */
  if (reeldataerror) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-950 text-white px-6 text-center z-50">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-4 text-[#ff6900] shadow-xl">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
        <p className="text-xs text-neutral-400 max-w-xs mb-6">
          We couldn’t stream the villa reels right now. Please check your network and try again.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => dispatch(fetchAllReels())}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- EMPTY STATE -------------------- */
  if (!reeldata || reeldata.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-neutral-950 text-white px-6 text-center z-50">
        <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-4 text-neutral-500 shadow-xl">
          <Film className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2 text-white">No reels available</h2>
        <p className="text-xs text-neutral-400 max-w-xs mb-6">
          Check back later for new exclusive stays and reels.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Explore Stays</span>
        </button>
      </div>
    );
  }

  return <VillaReel villas={reeldata} />;
};

export default Page;
