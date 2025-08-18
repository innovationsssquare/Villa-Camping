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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumPropertyHero from "./premium-property-hero";
import PropertyHeaderSection from "./property-header-section";
import StickyTabsNavigation from "./sticky-tabs-navigation";
import PropertyContentSections from "./property-content-sections";
import StickyBookingWidget from "./sticky-booking-widget";
import Logo  from "../../public/Loginasset/Logo2.png"
import Image from "next/image";

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
      <header className="bg-[#FFFFFF4D] backdrop-blur-2xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Image
                    src={Logo}
                    alt="Thevillacamp"
                    className="h-12 w-12 object-contain mt-2"
                  />

                  {/* <span className="text-black  font-bold text-xl hidden sm:block">Thevillacamp</span> */}
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        {/* Property Header */}
        {/* <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gardenéa
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="font-medium">4.9</span>
                  <span>(127 reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Alibaug, Maharashtra</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Share className="w-4 h-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? "fill-current text-red-500" : ""
                  }`}
                />
                <span>Save</span>
              </Button>
            </div>
          </div>
        </div> */}

        {/* Image Gallery */}
        {/* <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl overflow-hidden">
            <div className="relative">
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Villa exterior"
                className="w-full h-96 md:h-[500px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Property view ${index + 2}`}
                    className="w-full h-[120px] md:h-[240px] object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" className="mt-4 bg-transparent">
            Show all photos
          </Button>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div className="border-b border-gray-200 pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Entire villa hosted by StayVista
                  </h2>
                  <div className="flex items-center space-x-4 text-gray-600 mt-1">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>8 guests</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Bed className="w-4 h-4" />
                      <span>4 bedrooms</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Bath className="w-4 h-4" />
                      <span>4 bathrooms</span>
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              </div>
            </div>

            {/* Description */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About this place
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Escape to luxury at Gardenéa, a stunning contemporary villa
                nestled in the serene landscapes of Alibaug. This architectural
                masterpiece features floor-to-ceiling windows, an infinity pool,
                and breathtaking views of the surrounding gardens. Perfect for
                families and groups seeking an unforgettable getaway with modern
                amenities and timeless elegance.
              </p>
              <Button variant="ghost" className="mt-4 p-0 h-auto font-medium">
                Show more
              </Button>
            </div>

            {/* Amenities */}
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <amenity.icon className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">{amenity.label}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="mt-6 bg-transparent">
                Show all amenities
              </Button>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <Star className="w-6 h-6 fill-current text-yellow-400" />
                <span className="text-xl font-semibold">4.9 · 127 reviews</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {review.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-current text-yellow-400"
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="mt-6 bg-transparent">
                Show all reviews
              </Button>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold">₹25,000</span>
                    <span className="text-gray-600"> night</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="font-medium">4.9</span>
                    <span className="text-gray-500">(127)</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-700 uppercase">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-sm mt-1 border-none outline-none"
                      />
                    </div>
                    <div className="border border-gray-300 rounded-lg p-3">
                      <label className="text-xs font-medium text-gray-700 uppercase">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-sm mt-1 border-none outline-none"
                      />
                    </div>
                  </div>

                  <div className="border border-gray-300 rounded-lg p-3">
                    <label className="text-xs font-medium text-gray-700 uppercase">
                      Guests
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm">{guests} guests</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() => setGuests(guests + 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-red-500 hover:bg-red-600 text-white mb-4">
                  Reserve
                </Button>

                <p className="text-center text-sm text-gray-600 mb-4">
                  You won't be charged yet
                </p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">₹25,000 x 5 nights</span>
                    <span>₹1,25,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cleaning fee</span>
                    <span>₹2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>₹3,750</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹1,31,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location */}
        {/* <div className="mt-12 border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Where you'll be
          </h3>
          <div className="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center">
            <span className="text-gray-500">Map placeholder</span>
          </div>
          <p className="text-gray-600">Alibaug, Maharashtra, India</p>
        </div> */}

        {/* Similar Properties */}
        <div className="mt-12 border-t border-gray-200 pt-8">
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
