"use client";

import { useEffect } from "react";
import { XCircle } from "lucide-react";
import PremiumPropertyHero from "./premium-property-hero";
import PropertyHeaderSection from "./property-header-section";
import StickyTabsNavigation from "./sticky-tabs-navigation";
import PropertyContentSections from "./property-content-sections";
import StickyBookingWidget from "./sticky-booking-widget";
import VillaDetailHeader from "./villa-detail-header";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import VillaScreenSkeleton from "./villa-screen-skeleton";
import ButtonLoader from "../Loadercomponents/button-loader";
import { fetchCottageById } from "@/Redux/Slices/cottageSlice";
import { CottageProvider } from "@/lib/context/CottageContext";
import { VillaProvider } from "@/lib/context/VillaContext";

export default function CottageDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { cottage, loading, error } = useSelector((state) => state.cottage);

  useEffect(() => {
    dispatch(fetchCottageById(id));
  }, [id, dispatch]);

  if (loading) {
    return <VillaScreenSkeleton view="desktop" />;
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
    <VillaProvider villa={cottage}>
      <CottageProvider cottage={cottage}>
        <div
          className="min-h-screen bg-gray-50 hidden md:block"
          style={{
            fontFamily:
              'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
          }}
        >
          {/* Unified StayVista-style Property Header */}
          <VillaDetailHeader />

          <main className="w-full mx-auto">
            <PremiumPropertyHero />
            <StickyTabsNavigation />

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Overview Header + Content Sections */}
                <div className="lg:col-span-2 space-y-8">
                  <PropertyHeaderSection />
                  <PropertyContentSections />
                </div>

                {/* Right Column: Sticky Booking Widget */}
                <div className="lg:col-span-1 relative">
                  <StickyBookingWidget />
                </div>
              </div>
            </div>
          </main>
        </div>
      </CottageProvider>
    </VillaProvider>
  );
}
