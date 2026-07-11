"use client";

import { useEffect } from "react";
import { Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumPropertyHero from "./Cottage-view-details/premium-property-hero";
import PropertyHeaderSection from "./Cottage-view-details/property-header-section";
import StickyTabsNavigation from "./sticky-tabs-navigation";
import PropertyContentSections from "./Cottage-view-details/property-content-sections";
import StickyBookingWidget from "./Cottage-view-details/sticky-booking-widget";
import Logo from "../../public/Productasset/Logo2.png";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import VillaScreenSkeleton from "./villa-screen-skeleton";
import ButtonLoader from "../Loadercomponents/button-loader";
import { fetchCottageById } from "@/Redux/Slices/cottageSlice";
import { CottageProvider } from "@/lib/context/CottageContext";

export default function CottageDetails() {
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;
  const { cottage, loading, error } = useSelector((state) => state.cottage);

  useEffect(() => {
    dispatch(fetchCottageById(id));
  }, [id]);

  if (loading) {
    return <VillaScreenSkeleton />;
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
      <div
        className="min-h-screen bg-gray-50 hidden md:block"
        style={{
          fontFamily:
            'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
        }}
      >
        <header className="bg-white backdrop-blur-2xl border-b border-gray-200 sticky top-0 z-40 ">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={Logo}
                      alt="Thevillacamp"
                      className="h-16 w-16 object-contain mt-2"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  Become a host
                </Button>
                <Button variant="ghost" size="icon">
                  <Users className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full mx-auto">
          <PremiumPropertyHero />
          <StickyTabsNavigation />
          <PropertyHeaderSection />

          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <PropertyContentSections />
              </div>

              <div className="lg:col-span-1 relative">
                <StickyBookingWidget />
              </div>
            </div>
          </div>

          {/* Similar stays - Coming soon with backend data */}
          {/* <div className="mt-12 border-t border-gray-200 py-8 w-11/12 mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Similar stays</h3>
          </div> */}
        </main>
      </div>
    </CottageProvider>
  );
}
