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
        "sticky top-[82px] z-40 bg-white md:hidden border-b border-neutral-200/80 shadow-2xs transition-all duration-200",
        "translate-y-0"
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
                    "flex-shrink-0 transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#ff6900] text-white shadow-xs font-bold border border-transparent"
                      : "bg-neutral-100 hover:bg-neutral-200/80 text-neutral-700 border border-neutral-200/80",
                    "rounded-xl px-3 py-1.5 h-auto",
                    tab.id === "map" && "relative overflow-hidden"
                  )}
                >
                  {tab.id === "map" && (
                    <div className="absolute inset-0 opacity-80">
                      <Image
                        src={mapp}
                        alt="Map"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 relative z-10">
                    {tab.icon}
                    <span className="text-xs font-medium whitespace-nowrap">
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
