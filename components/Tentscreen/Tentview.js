"use client";
import React, { useState, useRef, useEffect } from "react";
import StickyTabs from "./StickyTabs";
import AllTabsContent from "./AllTabsContent";
import FixedBookingBar from "./FixedBookingBar";
import TentHeader from "./TentHeader";
import TentHero from "./TentHero";
import TentDetails from "./TentDetails";
import { CampingProvider } from "@/lib/context/CampingContext";
import { VillaProvider } from "@/lib/context/VillaContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchCampingById } from "@/Redux/Slices/campingSlice";
import ButtonLoader from "../Loadercomponents/button-loader";
import { XCircle } from "lucide-react";
import VillaScreenSkeleton from "../Propertyviewcomponents/villa-screen-skeleton";

const tabs = [
  { id: "highlights", label: "Highlights" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "spaces", label: "Spaces" },
  { id: "reviews", label: "Reviews" },
  { id: "amenities", label: "Amenities" },
  { id: "meals", label: "Meals" },
  { id: "location", label: "Location" },
  { id: "experiences", label: "Experiences" },
  { id: "faqs", label: "FAQ's" },
];

const Tentview = () => {
  const [activeTab, setActiveTab] = useState("highlights");
  const isManualScrollingRef = useRef(false);
  const manualTimerRef = useRef(null);

  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { camping, loading, error } = useSelector((state) => state.camping);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCampingById(id));
  }, [id, dispatch]);

  // Sequential Scroll-Spy logic
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (isManualScrollingRef.current) {
            ticking = false;
            return;
          }

          const headerOffset = 96;
          const isNearBottom =
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 60;

          let targetTab = "highlights";

          if (isNearBottom) {
            targetTab = tabs[tabs.length - 1].id;
          } else {
            for (const tab of tabs) {
              const el = document.getElementById(tab.id);
              if (el) {
                const rect = el.getBoundingClientRect();
                if (rect.top <= headerOffset + 30) {
                  targetTab = tab.id;
                }
              }
            }
          }

          setActiveTab(targetTab);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    };
  }, []);

  const handleTabChange = (tabId) => {
    isManualScrollingRef.current = true;
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const offset = 96; // Account for sticky header (48px) + tabs (48px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });
    }

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      isManualScrollingRef.current = false;
    }, 800);
  };

  if (loading) {
    return <VillaScreenSkeleton view="mobile" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Error loading camping details</p>
        </div>
      </div>
    );
  }

  if (!camping) {
    return (
      <div className="flex justify-center items-center h-screen bg-black/10">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
      </div>
    );
  }

  return (
    <VillaProvider villa={camping}>
      <CampingProvider camping={camping}>
        <div className="min-h-screen bg-background relative md:hidden">
          {/* Sticky Header at top-0 */}
          <TentHeader />

          <TentHero />
          <TentDetails />

          {/* Sticky Tabs Bar - Sticks directly below the 48px header at top-12 (48px) */}
          <div className="sticky top-12 z-40 bg-white border-b border-gray-200 shadow-xs">
            <StickyTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isSticky={true}
            />
          </div>

          <div>
            <AllTabsContent />
          </div>

          <FixedBookingBar />
        </div>
      </CampingProvider>
    </VillaProvider>
  );
};

export default Tentview;
