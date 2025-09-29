import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import StickyTabs from "./StickyTabs";
import AllTabsContent from "./AllTabsContent";
import FixedBookingBar from "./FixedBookingBar";
import TentHeader from "./TentHeader";
import TentHero from "./TentHero";
import TentDetails from "./TentDetails";


const tabs = [
  { id: "highlights", label: "Highlights" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "spaces", label: "Spaces" },
  { id: "reviews", label: "Reviews" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "experiences", label: "Experiences" },
  { id: "faqs", label: "FAQ's" },
];

const Tentview = () => {
  const [activeTab, setActiveTab] = useState("highlights");
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const tabsRef = useRef(null);

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
    else if (locationInView) setActiveTab("location");
    else if (experiencesInView) setActiveTab("experiences");
    else if (faqsInView) setActiveTab("faqs");
  }, [
    highlightsInView,
    refundInView,
    spacesInView,
    reviewsInView,
    amenitiesInView,
    locationInView,
    experiencesInView,
    faqsInView,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (tabsRef.current) {
        const rect = tabsRef.current.getBoundingClientRect();
        setShowStickyTabs(rect.top <= 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const offset = 80; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background relative md:hidden overflow-hidden">
      <TentHeader/>
      <TentHero/>
      <TentDetails/>

      <div ref={tabsRef}>
        <StickyTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isSticky={false}
        />
      </div>

      {showStickyTabs && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-gray-200 shadow-sm">
          <StickyTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            isSticky={true}
          />
        </div>
      )}

      <div>
        <AllTabsContent
          refs={{
            highlightsRef,
            refundRef,
            spacesRef,
            reviewsRef,
            amenitiesRef,
            locationRef,
            experiencesRef,
            faqsRef,
          }}
        />
      </div>

      <FixedBookingBar />
    </div>
  );
};

export default Tentview;
