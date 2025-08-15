"use client"

import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import PremiumPropertyHero from "./premium-property-hero"
import StickyTabsNavigation from "./sticky-tabs-navigation"
import StickyBookingWidget from "./sticky-booking-widget"
import PropertyContentSections from "./property-content-sections"
import PropertyHeaderSection from "./property-header-section"

export default function PropertyDetailsPage() {
  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{
        fontFamily:
          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* Hero Section */}
      <PremiumPropertyHero />

      {/* Property Header Section (not sticky) */}
      <PropertyHeaderSection />

      {/* Sticky Navigation (only tabs) */}
      <StickyTabsNavigation />

      {/* Main Content */}
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

      {/* Footer */}
   

      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          size="icon"
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
