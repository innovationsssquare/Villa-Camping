import React, { useState, useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import StickyTabs from "./StickyTabs";
import AllTabsContent from "./AllTabsContent";
import FixedBookingBar from "./FixedBookingBar";
import TentHeader from "./TentHeader";
import TentHero from "./TentHero";
import TentDetails from "./TentDetails";
import { CampingProvider } from "@/lib/context/CampingContext";
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
  { id: "location", label: "Location" },
  { id: "experiences", label: "Experiences" },
  { id: "faqs", label: "FAQ's" },
];

const Tentview = () => {
  const [activeTab, setActiveTab] = useState("highlights");
  const [showStickyTabs, setShowStickyTabs] = useState(false);
  const tabsRef = useRef(null);
const [tents, setTents] = useState([]);

  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { camping, loading, error } = useSelector((state) => state.camping);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchCampingById(id));
  }, [id]);

  const handleBookTent = (tentId, tentType, price) => {
    console.log('Booking tent:', { tentId, tentType, price });
    // TODO: Navigate to payment page or open booking modal
  };

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

if (loading) {
    return <VillaScreenSkeleton />;
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
    <CampingProvider  camping={camping}>

    <div className="min-h-screen bg-background relative md:hidden overflow-hidden">
      <TentHeader />
      <TentHero />
      <TentDetails />

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
         
          onBookTent={handleBookTent}
        />
      </div>

      <FixedBookingBar />
    </div>
    </CampingProvider>
  );
};

export default Tentview;
