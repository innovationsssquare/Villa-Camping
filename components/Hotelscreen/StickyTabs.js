"use client";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const StickyTabs = ({ tabs, activeTab, onTabChange, isSticky, hasEvents }) => {
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeTabEl = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeTabRect = activeTabEl.getBoundingClientRect();

      const scrollLeft =
        activeTabRect.left -
        containerRect.left +
        container.scrollLeft -
        containerRect.width / 2 +
        activeTabRect.width / 2;

      container.scrollTo({
        left: scrollLeft,
        behavior: "smooth",
      });
    }
  }, [activeTab]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "bg-white border-b border-gray-200 overflow-x-auto scrollbar-none",
        isSticky && "shadow-xs"
      )}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex space-x-0 min-w-max px-3 items-center">
        {tabs.map((tab) => {
          const isEvent = tab.id === "events";
          const isSelected = activeTab === tab.id;

          if (isEvent && hasEvents) {
            return (
              <div
                key={tab.id}
                className="relative inline-flex p-[1.5px] my-1 mr-1 rounded-full bg-gradient-to-r from-[#ff6900] via-rose-500 to-amber-400 animate-pulse hover:animate-none"
              >
                <button
                  ref={isSelected ? activeTabRef : null}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold whitespace-nowrap rounded-full transition-all flex items-center gap-1.5 cursor-pointer",
                    isSelected
                      ? "bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white shadow-xs"
                      : "bg-white text-gray-900"
                  )}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]"></span>
                  </span>
                  <span>{tab.label}</span>
                  <span className="text-[9px] uppercase px-1 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white font-extrabold">
                    Live
                  </span>
                </button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              ref={isSelected ? activeTabRef : null}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                isSelected
                  ? "text-[#ff6900] border-[#ff6900]"
                  : "text-gray-500 border-transparent hover:text-gray-900"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StickyTabs;
