"use client";
import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import VillaHeader from "./VillaHeader";
import VillaHero from "./VillaHero";
import VillaDetails from "./VillaDetails";
import StickyTabs from "./StickyTabs";
import AllTabsContent from "./AllTabsContent";
import FixedBookingBar from "./FixedBookingBar";
import { VillaProvider } from "@/lib/context/VillaContext";
import ButtonLoader from "../Loadercomponents/button-loader";
import VillaScreenSkeleton from "../Propertyviewcomponents/villa-screen-skeleton";
import { XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchVillaById } from "@/Redux/Slices/villaSlice";
import { BaseUrl } from "@/lib/API/Baseurl";

const tabs = [
  { id: "highlights", label: "Highlights" },
  { id: "events", label: "Events" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "spaces", label: "Spaces" },
  { id: "reviews", label: "Reviews" },
  { id: "amenities", label: "Amenities" },
  { id: "meals", label: "Meals" },
  { id: "location", label: "Location" },
  { id: "experiences", label: "Experiences" },
  { id: "faqs", label: "FAQ's" },
];

const Villaview = () => {
  const [activeTab, setActiveTab] = useState("highlights");
  const [events, setEvents] = useState([]);

  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { villa, loading, error } = useSelector((state) => state.villa);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchVillaById(id));
  }, [id]);

  useEffect(() => {
    if (id) {
      fetch(`${BaseUrl}/PropertyEvent/property/villa/${id}`)
        .then((res) => res.json())
        .then((json) => {
          if (json?.success && Array.isArray(json?.events)) {
            setEvents(json.events);
          }
        })
        .catch(() => {});
    }
  }, [id]);

  const hasEvents =
    (villa?.events && villa.events.length > 0) ||
    events.some(
      (e) => e.isActive !== false && (!e.endDate || new Date(e.endDate) >= new Date())
    );

  // Intersection Observer for each section
  const { ref: highlightsRef, inView: highlightsInView } = useInView({
    threshold: 0.3,
  });
  const { ref: refundRef, inView: refundInView } = useInView({
    threshold: 0.3,
  });
  const { ref: spacesRef, inView: spacesInView } = useInView({
    threshold: 0.3,
  });
  const { ref: reviewsRef, inView: reviewsInView } = useInView({
    threshold: 0.3,
  });
  const { ref: amenitiesRef, inView: amenitiesInView } = useInView({
    threshold: 0.3,
  });
  const { ref: mealsRef, inView: mealsInView } = useInView({
    threshold: 0.3,
  });
  const { ref: locationRef, inView: locationInView } = useInView({
    threshold: 0.3,
  });
  const { ref: experiencesRef, inView: experiencesInView } = useInView({
    threshold: 0.3,
  });
  const { ref: faqsRef, inView: faqsInView } = useInView({ threshold: 0.3 });

  // Update active tab based on what's in view
  useEffect(() => {
    if (highlightsInView) setActiveTab("highlights");
    else if (refundInView) setActiveTab("refund-policy");
    else if (spacesInView) setActiveTab("spaces");
    else if (reviewsInView) setActiveTab("reviews");
    else if (amenitiesInView) setActiveTab("amenities");
    else if (mealsInView) setActiveTab("meals");
    else if (locationInView) setActiveTab("location");
    else if (experiencesInView) setActiveTab("experiences");
    else if (faqsInView) setActiveTab("faqs");
  }, [
    highlightsInView,
    refundInView,
    spacesInView,
    reviewsInView,
    amenitiesInView,
    mealsInView,
    locationInView,
    experiencesInView,
    faqsInView,
  ]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const offset = 96; // Account for sticky header (48px) + tabs (48px)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <VillaScreenSkeleton view="mobile" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Error loading villa details</p>
        </div>
      </div>
    );
  }

  if (!villa) {
    return (
      <div className="flex justify-center items-center h-screen bg-black/10">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
      </div>
    );
  }

  return (
    <VillaProvider villa={villa}>
      <div className="min-h-screen bg-background relative md:hidden">
        {/* Sticky Header at top-0 */}
        <VillaHeader />

        <VillaHero />
        <VillaDetails />

        {/* Sticky Tabs Bar - Sticks directly below the 48px header at top-12 (48px) */}
        <div className="sticky top-12 z-40 bg-white border-b border-gray-200 shadow-xs">
          <StickyTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isSticky={true}
            hasEvents={hasEvents}
          />
        </div>

        <div>
          <AllTabsContent
            refs={{
              highlightsRef,
              refundRef,
              spacesRef,
              reviewsRef,
              amenitiesRef,
              mealsRef,
              locationRef,
              experiencesRef,
              faqsRef,
            }}
          />
        </div>

        <FixedBookingBar />
      </div>
    </VillaProvider>
  );
};

export default Villaview;
