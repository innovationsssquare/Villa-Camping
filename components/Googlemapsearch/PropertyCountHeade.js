"use client";

import React from "react";
import { List, ChevronUp, MapPin, Sparkles } from "lucide-react";

export const PropertyCountHeader = ({
  count,
  location,
  onToggleDrawer,
  isDrawerOpen,
}) => {
  return (
    <div className="w-full">
      {/* Bottom Sheet Trigger Bar */}
      <button
        type="button"
        onClick={onToggleDrawer}
        className="w-full bg-white/95 backdrop-blur-md hover:bg-white text-neutral-900 border-t border-neutral-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-3xl pt-2.5 pb-4 px-5 transition-all duration-300 cursor-pointer flex flex-col items-center select-none"
      >
        {/* Subtle Drag Handle */}
        <div className="w-10 h-1 bg-neutral-300 rounded-full mb-2.5 transition-colors group-hover:bg-neutral-400" />

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-50 text-[#ff6900] rounded-full flex items-center justify-center border border-orange-200/80 shrink-0">
              <List className="w-4 h-4" />
            </div>

            <div className="text-left">
              <div className="text-sm font-bold text-neutral-900 leading-tight flex items-center gap-1.5">
                <span>
                  {count > 1 ? `${count} Stays found` : `${count} Stay found`}
                </span>
                {count > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
              {location && (
                <div className="text-xs text-neutral-500 font-medium truncate flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#ff6900] shrink-0" />
                  <span>in {location}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-neutral-100 hover:bg-orange-50 text-neutral-700 hover:text-[#ff6900] px-3 py-1.5 rounded-full text-xs font-bold transition-colors">
            <span>{isDrawerOpen ? "Map" : "View List"}</span>
            <ChevronUp
              className={`w-4 h-4 transition-transform duration-300 ${
                isDrawerOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>
    </div>
  );
};