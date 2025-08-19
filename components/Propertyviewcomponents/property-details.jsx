"use client";

import { useState } from "react";
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
import Home from "@/app/page";

export default function PropertyDetails() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isLiked, setIsLiked] = useState(false);

  const images = [
    "/images/villa-hero.jpg",
    "/placeholder.svg?height=400&width=600&text=Pool+View",
    "/placeholder.svg?height=400&width=600&text=Living+Room",
    "/placeholder.svg?height=400&width=600&text=Bedroom",
    "/placeholder.svg?height=400&width=600&text=Kitchen",
  ];

  const amenities = [
    { icon: Wifi, label: "Free WiFi" },
    { icon: Car, label: "Free Parking" },
    { icon: Waves, label: "Pool" },
    { icon: Coffee, label: "Kitchen" },
  ];

  const reviews = [
    {
      name: "Sarah Johnson",
      rating: 5,
      date: "March 2024",
      comment:
        "Absolutely stunning property with breathtaking views. The infinity pool is incredible!",
    },
    {
      name: "Michael Chen",
      rating: 5,
      date: "February 2024",
      comment:
        "Perfect for a luxury getaway. Every detail was thoughtfully designed.",
    },
  ];

  return (
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
                  <p className="font-semibold">₹{15000 + item * 5000} night</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
