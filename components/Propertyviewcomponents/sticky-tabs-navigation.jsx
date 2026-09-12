"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

export default function StickyTabsNavigation({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSticky, setIsSticky] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const tabsRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const isManualScrollingRef = useRef(false);
  const manualScrollTimerRef = useRef(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "highlightss", label: "Highlights" },
    { id: "refund-policyy", label: "Refund Policy" },
    { id: "spacess", label: "Spaces" },
    { id: "reviewss", label: "Reviews" },
    { id: "amenitiess", label: "Amenities" },
    { id: "mealss", label: "Meals" },
    { id: "locationn", label: "Location" },
    { id: "experiencess", label: "Experiences" },
    { id: "faqss", label: "FAQ's" },
  ];

  // Update sliding indicator position
  const updateIndicator = useCallback((tabId) => {
    const tabElement = tabRefs.current[tabId];
    const container = tabsContainerRef.current;
    if (tabElement && container) {
      const containerRect = container.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();
      const left = tabRect.left - containerRect.left + container.scrollLeft;
      const width = tabRect.width;

      setIndicatorStyle({ left, width });

      // Ensure tab is visible in horizontal scroll
      const tabOffsetLeft = tabElement.offsetLeft;
      const tabWidth = tabElement.offsetWidth;
      const containerWidth = container.offsetWidth;
      const currentScroll = container.scrollLeft;

      if (tabOffsetLeft < currentScroll) {
        container.scrollTo({ left: tabOffsetLeft - 16, behavior: "smooth" });
      } else if (tabOffsetLeft + tabWidth > currentScroll + containerWidth) {
        container.scrollTo({
          left: tabOffsetLeft + tabWidth - containerWidth + 16,
          behavior: "smooth",
        });
      }
    }
  }, []);

  useEffect(() => {
    updateIndicator(activeTab);
  }, [activeTab, updateIndicator]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // 1. Sticky bar detection
          if (tabsRef.current) {
            const tabsTop = tabsRef.current.getBoundingClientRect().top;
            setIsSticky(tabsTop <= 74);
          }

          // If manual smooth scrolling from tab click, don't override
          if (isManualScrollingRef.current) {
            ticking = false;
            return;
          }

          // 2. Sequential Scroll-Spy Calculation
          const headerOffset = 130;
          const isNearBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 70;

          let targetTab = "overview";

          if (isNearBottom) {
            targetTab = tabs[tabs.length - 1].id;
          } else {
            // Check sequentially from top to bottom
            for (const tab of tabs) {
              const el = document.getElementById(tab.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= headerOffset + 40) {
                  targetTab = tab.id;
                }
              }
            }
          }

          setActiveTab((prev) => {
            if (prev !== targetTab) {
              onTabChange?.(targetTab);
              return targetTab;
            }
            return prev;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      updateIndicator(activeTab);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Initial check
    handleScroll();
    setTimeout(() => updateIndicator(activeTab), 150);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (manualScrollTimerRef.current) {
        clearTimeout(manualScrollTimerRef.current);
      }
    };
  }, [onTabChange, updateIndicator, activeTab]);

  const scrollToSection = (tabId) => {
    isManualScrollingRef.current = true;
    setActiveTab(tabId);
    updateIndicator(tabId);
    onTabChange?.(tabId);

    const element = document.getElementById(tabId);
    if (element) {
      const offset = 125;
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: Math.max(0, elementPosition - offset),
        behavior: "smooth",
      });
    }

    if (manualScrollTimerRef.current) {
      clearTimeout(manualScrollTimerRef.current);
    }
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 850);
  };

  return (
    <div
      ref={tabsRef}
      className={`w-full sticky top-16 md:top-[72px] z-30 transition-all duration-200 bg-white/95 backdrop-blur-md border-b border-gray-200 ${
        isSticky ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div
            ref={tabsContainerRef}
            className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar py-2 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`relative px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors rounded-full cursor-pointer ${
                    isActive
                      ? "text-[#ff6900] bg-orange-50/60 font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Smooth orange indicator underline */}
          <div
            className="absolute bottom-0 h-0.5 bg-[#ff6900] transition-all duration-300 ease-out rounded-full"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
