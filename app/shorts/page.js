"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import VillaReel from "@/components/Reelcomponent/villa-reel";
import { fetchAllReels } from "@/Redux/Slices/propertiesSlice";
import { Loader2 } from "lucide-react";

const Page = () => {
  const dispatch = useDispatch();
  const { reeldata, reeldataloading, reeldataerror } = useSelector(
    (state) => state.properties
  );

  useEffect(() => {
    dispatch(fetchAllReels());
  }, []);

  // 🔑 THIS IS THE FIX
  if (reeldataloading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-3 text-sm text-white/80">Loading reels...</span>
      </div>
    );
  }

  /* -------------------- ERROR STATE -------------------- */
  if (reeldataerror) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-white/70 mb-4">
          We couldn’t load reels right now.
        </p>
        <button
          onClick={() => dispatch(fetchAllReels())}
          className="px-4 py-2 rounded-md bg-white text-black text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  /* -------------------- EMPTY STATE -------------------- */
  if (!reeldata || reeldata.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white px-6 text-center">
        <h2 className="text-xl font-semibold mb-2">No reels available</h2>
        <p className="text-sm text-white/70">
          Check back later for new stays and experiences.
        </p>
      </div>
    );
  }

  return <VillaReel villas={reeldata} />;
};

export default Page;
