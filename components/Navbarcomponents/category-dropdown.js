"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Search, Compass, Home, Tent, Trees, Hotel, Sparkles } from "lucide-react";
import { setSelectedCategory, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice";
import { KNOWN_CATEGORY_IDS, matchCategory } from "@/lib/categoryUtils";
import Image from "next/image";

export function CategorySearch({ onCategorySelect, isMobile = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.category);

  const defaultCategories = [
    {
      id: KNOWN_CATEGORY_IDS.VILLA,
      name: "Villas",
      description: "Private pools & luxury estates",
      icon: Home,
      image: "/Productasset/Villaimg.png",
      fallbackImage: "/Aboutusasset/Villabanner.jpg",
    },
    {
      id: KNOWN_CATEGORY_IDS.CAMPING,
      name: "Campings",
      description: "Lakeside tents & bonfire nights",
      icon: Tent,
      image: "/Productasset/Campimg.png",
      fallbackImage: "/Aboutusasset/Campbanner.jpg",
    },
    {
      id: KNOWN_CATEGORY_IDS.COTTAGE,
      name: "Cottages",
      description: "Cozy nature & hill retreats",
      icon: Trees,
      image: "/Productasset/Cottageimg.png",
      fallbackImage: "/Aboutusasset/Cottagebanner.jpg",
    },
    {
      id: KNOWN_CATEGORY_IDS.HOTEL,
      name: "Hotels",
      description: "Resorts & boutique suites",
      icon: Hotel,
      image: "/Productasset/Hotelimg.png",
      fallbackImage: "/Aboutusasset/Hotelbanner.jpg",
    },
  ];

  const handleSelect = (catId, catName) => {
    let finalId = catId;
    if (finalId) {
      const upper = String(finalId).trim().toUpperCase();
      if (KNOWN_CATEGORY_IDS[upper]) {
        finalId = KNOWN_CATEGORY_IDS[upper];
      }
    }
    dispatch(setSelectedCategory(finalId));
    dispatch(setSelectedCategoryname(catName));
    if (onCategorySelect) onCategorySelect(finalId, catName);
  };

  const filtered = (categories || []).filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`relative z-50 bg-white rounded-3xl border border-neutral-200/90 shadow-[0_16px_48px_rgba(0,0,0,0.14)] p-6 ${
        isMobile ? "w-80" : "w-[480px]"
      }`}
    >
      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by stay type (Villa, Camping, Cottage...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 bg-neutral-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black text-xs md:text-sm font-medium transition-all"
        />
      </div>

      {/* Categories Grid (Airbnb Style Destination Cards) */}
      <div>
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Explore by Stay Type
        </div>

        {searchTerm === "" ? (
          <div className="grid grid-cols-2 gap-3">
            {defaultCategories.map((item) => {
              const matchedBackend = matchCategory(item.name, categories);
              const targetId = matchedBackend ? matchedBackend._id : item.id;
              const targetName = matchedBackend ? matchedBackend.name : item.name;
              const targetImage =
                matchedBackend?.image || item.fallbackImage || item.image;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(targetId, targetName)}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border border-neutral-200/90 hover:border-black hover:shadow-xs transition-all duration-200 text-left cursor-pointer group bg-neutral-50/40 hover:bg-white"
                >
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/80 relative shrink-0 shadow-2xs group-hover:border-neutral-400 transition-colors">
                    <Image
                      src={targetImage}
                      alt={item.name}
                      fill
                      sizes="44px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs md:text-sm font-bold text-neutral-900 line-clamp-1">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-neutral-500 line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto">
            {filtered.map((cat) => {
              const catKey = (cat.name || "").toLowerCase();
              const catImg =
                cat.image ||
                (catKey.includes("camp")
                  ? "/Aboutusasset/Campbanner.jpg"
                  : catKey.includes("cottage")
                  ? "/Aboutusasset/Cottagebanner.jpg"
                  : catKey.includes("hotel")
                  ? "/Aboutusasset/Hotelbanner.jpg"
                  : "/Aboutusasset/Villabanner.jpg");

              return (
                <button
                  key={cat._id}
                  type="button"
                  onClick={() => handleSelect(cat._id, cat.name)}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 relative shrink-0 border border-neutral-200/80">
                      <Image
                        src={catImg}
                        alt={cat.name}
                        fill
                        sizes="32px"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      {cat.name}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400">Select →</span>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-6 text-xs text-neutral-500">
                No matching stay types found
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
