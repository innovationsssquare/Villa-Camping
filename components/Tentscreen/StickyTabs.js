import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils"; 

const StickyTabs = ({ tabs, activeTab, onTabChange, isSticky }) => {
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const activeTab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const activeTabRect = activeTab.getBoundingClientRect();

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
        "bg-background border-b border-gray-200 overflow-x-auto scrollbar-hide",
        isSticky && "shadow-sm"
      )}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="flex space-x-0 min-w-max px-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={tab.id === activeTab ? activeTabRef : null}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-3 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "text-orange-500 border-villa-blue"
                : "text-villa-text-light border-transparent hover:text-villa-text-dark"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StickyTabs;
