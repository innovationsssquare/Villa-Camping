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
import Logo from "../../public/Loginasset/Logo2.png";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { fetchVillaById } from "@/Redux/Slices/villaSlice";
import { useDispatch, useSelector } from "react-redux";
import VillaScreenSkeleton from "./villa-screen-skeleton";
import ButtonLoader from "../Loadercomponents/button-loader";
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
        {/* Header */}
        <header className="bg-[#FFFFFF4D] backdrop-blur-2xl border-b border-gray-200 sticky top-0 z-40 ">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Image
                      src={Logo}
                      alt="Thevillacamp"
                      className="h-12 w-12 object-contain mt-2"
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
              {/* Content Sections */}
              <div className="lg:col-span-2">
                <PropertyContentSections />
              </div>

              {/* Sticky Booking Widget */}
              <div className="lg:col-span-1 relative">
                <StickyBookingWidget />
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mt-12 border-t border-gray-200 py-8 w-11/12 mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Similar stays
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card key={item} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={`/villa-sign.png?height=200&width=300&text=Villa+${item}`}
                      alt={`Similar property ${item}`}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Villa Paradise {item}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="text-sm">4.8</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Goa, India</p>
                    <p className="font-semibold">
                      ₹{15000 + item * 5000} night
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </VillaProvider>
  );
}
