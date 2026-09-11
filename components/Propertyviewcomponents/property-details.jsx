"use client";

import { useEffect, useState } from "react";
import {
  Heart,
  Share,
  Star,
  MapPin,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Waves,
  Coffee,
  Plus,
  Minus,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumPropertyHero from "./premium-property-hero";
import PropertyHeaderSection from "./property-header-section";
import StickyTabsNavigation from "./sticky-tabs-navigation";
import PropertyContentSections from "./property-content-sections";
import StickyBookingWidget from "./sticky-booking-widget";
import Logo from "../../public/Productasset/Logo2.png";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { fetchVillaById } from "@/Redux/Slices/villaSlice";
import { useDispatch, useSelector } from "react-redux";
import VillaScreenSkeleton from "./villa-screen-skeleton";
import ButtonLoader from "../Loadercomponents/button-loader";
import VillaDetailHeader from "./villa-detail-header";
import { VillaProvider } from "@/lib/context/VillaContext";

export default function PropertyDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { villa, loading, error } = useSelector((state) => state.villa);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchVillaById(id));
  }, [id]);

  if (loading) {
    return <VillaScreenSkeleton />;
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
      <div
        className="min-h-screen bg-gray-50 hidden md:block"
        style={{
          fontFamily:
            'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        {/* Modern StayVista-style Header */}
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

              {/* Right Column: Sticky Booking Widget in place of Instant Confirmation card */}
              <div className="lg:col-span-1 relative">
                <StickyBookingWidget />
              </div>
            </div>
          </div>

          {/* Similar Properties - Coming soon with backend data */}
          {/* <div className="mt-12 border-t border-gray-200 py-8 w-11/12 mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Similar stays
            </h3>
          </div> */}
        </main>
      </div>
    </VillaProvider>
  );
}
