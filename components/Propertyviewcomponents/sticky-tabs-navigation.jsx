"use client";

import { useState, useEffect, useRef, useCallback, useContext, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { VillaContext } from "@/lib/context/VillaContext";
import { BaseUrl } from "@/lib/API/Baseurl";

export default function StickyTabsNavigation({ onTabChange, hasEvents: hasEventsProp, events: eventsProp }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSticky, setIsSticky] = useState(false);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const villa = useContext(VillaContext);
  const [events, setEvents] = useState(eventsProp || villa?.events || []);

  const isHotel = Boolean(villa?.rooms && villa.rooms.length > 0);
  const isCottage = Boolean(villa?.cottages && villa.cottages.length > 0);
  const isCamping = Boolean(villa?.tents && villa.tents.length > 0);

  useEffect(() => {
    if (eventsProp && Array.isArray(eventsProp)) {
      setEvents(eventsProp);
      return;
    }
    if (villa?.events && Array.isArray(villa.events) && villa.events.length > 0) {
      setEvents(villa.events);
    }
    const pId = villa?._id || villa?.id;
    if (!pId) return;
    const pType = isHotel ? "hotel" : isCottage ? "cottage" : isCamping ? "camping" : "villa";

    fetch(`${BaseUrl}/PropertyEvent/property/${pType}/${pId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json?.events)) {
          setEvents(json.events);
        }
      })
      .catch(() => {});
  }, [villa?._id, isHotel, isCottage, isCamping, eventsProp]);

  const activeEvents = useMemo(() => {
    return (events || []).filter(
      (e) => e.isActive !== false && (!e.endDate || new Date(e.endDate) >= new Date())
    );
  }, [events]);

  const hasEvents = hasEventsProp !== undefined ? Boolean(hasEventsProp) : activeEvents.length > 0;

  const tabsRef = useRef(null);
  const tabsContainerRef = useRef(null);
  const tabRefs = useRef({});
  const isManualScrollingRef = useRef(false);
  const manualScrollTimerRef = useRef(null);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "highlightss", label: "Highlights" },
    { id: "eventss", label: "Events", isEvent: true },
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

              if (tab.isEvent && hasEvents) {
                return (
                  <div
                    key={tab.id}
                    className="relative inline-flex p-[1.5px] rounded-full bg-gradient-to-r from-[#ff6900] via-rose-500 to-amber-400 shadow-sm animate-pulse hover:animate-none transition-all"
                  >
                    <button
                      ref={(el) => {
                        if (el) tabRefs.current[tab.id] = el;
                      }}
                      type="button"
                      onClick={() => scrollToSection(tab.id)}
                      className={`relative px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold whitespace-nowrap rounded-full cursor-pointer flex items-center gap-1.5 transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white shadow-xs"
                          : "bg-white text-neutral-900 hover:text-[#ff6900]"
                      }`}
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]"></span>
                      </span>
                      <Sparkles className={`w-3.5 h-3.5 ${isActive ? "text-amber-200" : "text-[#ff6900]"}`} />
                      <span>{tab.label}</span>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/25 text-white"
                            : "bg-gradient-to-r from-orange-500 to-rose-500 text-white"
                        }`}
                      >
                        {activeEvents.length > 1 ? `${activeEvents.length} Live` : "Live"}
                      </span>
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    if (el) tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`relative px-3.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors rounded-full cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? "text-[#ff6900] bg-orange-50/60 font-bold"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab.isEvent && (
                    <Sparkles className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <span>{tab.label}</span>
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
