"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import {
  ChevronDown,
  Filter,
  MapPin,
  ArrowUpDown,
  Sparkles,
  TrendingUp,
  Navigation,
  SlidersHorizontal,
  WavesLadder,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import mapp from "@/public/Aboutusasset/google-maps.jpg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SortDrawer } from "../Productcomponets/SortDrawer";
import { useDispatch } from "react-redux";
import { setSortBy } from "@/Redux/Slices/propertyFilterSlice";
import { GiPoolDive } from "react-icons/gi";

const defaultTabs = [
  {
    id: "map",
    label: "Map",
    icon: <MapPin className="w-4 h-4 text-red-500" />,
    active: true,
  },
  {
    id: "pool",
    label: "Pool",
    icon: <WavesLadder className="w-4 h-4 text-sky-500" />,
  },
   {
    id: "trending",
    label: "Trending",
    icon: <TrendingUp className="w-4 h-4 text-fuchsia-500" />,
  },
  {
    id: "newly",
    label: "Newly Launched",
    icon: <Sparkles className="w-4 h-4 text-amber-500" />,
  },
  {
    id: "featured",
    label: "Featured",
    icon: <TrendingUp className="w-4 h-4 text-blue-500" />,
  },
 
  // {
  //   id: "nearby",
  //   label: "Nearby",
  //   icon: <Navigation className="w-4 h-4 text-teal-500" />,
  // },
];

export const NavigationCarousel = ({
  tabs = defaultTabs,
  onTabChange,
  onFilterClick,
  onSortClick,
}) => {
  const [activeTab, setActiveTab] = useState(
    tabs.find((tab) => tab.active)?.id || tabs[0]?.id
  );
  const scrollContainerRef = useRef(null);
  const { isVisible } = useScrollDirection();
  const router = useRouter();

  const dispatch = useDispatch();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);

    switch (tabId) {
      case "newly":
        dispatch(setSortBy("new"));
        break;

      case "featured":
        dispatch(setSortBy("featured"));
        break;

      case "trending":
        dispatch(setSortBy("trending"));
        break;

      case "pool":
        dispatch(setSortBy("pool"));
        break;

      case "map":
        router.push("/search-your-gateway");
        return;

      default:
        break;
    }
  };

  const handleFilterClick = () => {
    onFilterClick?.();
  };

  // Auto-scroll active tab into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(
        '[data-active="true"]'
      );
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeTab]);

  return (
    <div
      className={cn(
        "sticky top-24 z-40  bg-white md:hidden transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0 bg-white " : "-translate-y-12 bg-white"
      )}
    >
      <div className="flex items-center gap-3 p-2 mt-1">
        <SortDrawer />
        {/* Scrollable Tabs Container */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto scrollbar-hide mt-1"
        >
          <div className="flex items-center gap-2 min-w-max pb-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  data-active={isActive}
                  onPress={() => handleTabClick(tab.id)}
                  className={cn(
                    "flex-shrink-0 transition-all duration-200 animate-fade-in",
                    isActive
                      ? "bg-tab-active text-tab-active-foreground shadow-soft border border-gray-300"
                      : "bg-tab-inactive text-tab-inactive-foreground hover:bg-secondary/80 border border-gray-300",
                    "rounded-lg px-3 py-2 h-auto",
                    tab.id === "map" && "relative overflow-hidden"
                  )}
                >
                  {tab.id === "map" && (
                    <div className="absolute inset-0 opacity-90">
                      <Image
                        src={mapp}
                        alt="Map"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 relative z-10">
                    {tab.icon}
                    <span className="text-xs font-normal whitespace-nowrap">
                      {tab.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
