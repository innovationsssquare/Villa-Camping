"use client";
import React, { useState, useRef, useEffect } from "react";
import StickyTabs from "./StickyTabs";
import AllTabsContent from "./AllTabsContent";
import FixedBookingBar from "./FixedBookingBar";
import CottageHeader from "./CottageHeader";
import CottageHero from "./CottageHero";
import CottageDetails from "./CottageDetails";
import { CottageProvider } from "@/lib/context/CottageContext";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchCottageById } from "@/Redux/Slices/cottageSlice";
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

const Cottageview = () => {
  const [activeTab, setActiveTab] = useState("highlights");
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const tabsRef = useRef(null);
  const isManualScrollingRef = useRef(false);
  const manualTimerRef = useRef(null);

  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { cottage, loading, error } = useSelector((state) => state.cottage);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCottageById(id));
  }, [id, dispatch]);

  // Sequential Scroll-Spy logic
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (tabsRef.current) {
            const rect = tabsRef.current.getBoundingClientRect();
            setShowStickyTabs(rect.top <= 48);
          }

          if (isManualScrollingRef.current) {
            ticking = false;
            return;
          }

          const headerOffset = 95;
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
      const offset = 95; // Account for sticky header (48px) + tabs (44px)
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
          <p className="text-red-500">Error loading cottage details</p>
        </div>
      </div>
    );
  }

  if (!cottage) {
    return (
      <div className="flex justify-center items-center h-screen bg-black/10">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
      </div>
    );
  }


  return (
    <CottageProvider cottage={cottage}>

      <div className="min-h-screen bg-background relative md:hidden overflow-hidden">
        <CottageHeader />
        <CottageHero />
        <CottageDetails />

        <div ref={tabsRef}>
          <StickyTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isSticky={false}
          />
        </div>

        {showStickyTabs && (
          <div className="fixed top-12 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <StickyTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isSticky={true}
            />
          </div>
        )}

        <div>
          <AllTabsContent />
        </div>

        <FixedBookingBar />
      </div>
    </CottageProvider>
  );
};

export default Cottageview;
