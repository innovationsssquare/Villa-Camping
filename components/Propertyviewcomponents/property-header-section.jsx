"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertyHeaderSection() {
  return (
    <div
      className="bg-white"
      style={{
        fontFamily:
          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between">
          {/* Property Title */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Barkat Villa - Ramgarh</h1>
            <p className="text-lg text-gray-600 mb-4">Nainital, Uttarakhand</p>

            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">Like a 5⭐</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current text-yellow-400" />
                  <span className="font-medium">4.8</span>
                  <span className="text-gray-500">/5</span>
                </div>
                <a href="#reviews" className="text-blue-500 hover:text-blue-600 underline">
                  65 Reviews
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="text-gray-600">👥</span>
                <span className="text-sm font-medium">Up to 15 Guests</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="text-gray-600">🏠</span>
                <span className="text-sm font-medium">5 Rooms</span>
                <span className="text-blue-500 text-xs">ℹ️</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="text-gray-600">🛁</span>
                <span className="text-sm font-medium">5 Baths</span>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
                <span className="text-gray-600">🍽️</span>
                <span className="text-sm font-medium">Meals Available</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Great for:</h3>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">🏔️</span>
                <span className="font-medium">Mountain View</span>
              </div>
            </div>

            {/* Amenities Preview */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">🏔️</span>
                <span className="text-sm text-gray-700">Mountain</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">🍳</span>
                <span className="text-sm text-gray-700">Breakfast</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">📶</span>
                <span className="text-sm text-gray-700">WiFi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">🛁</span>
                <span className="text-sm text-gray-700">Jacuzzi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">🔥</span>
                <span className="text-sm text-gray-700">BBQ</span>
              </div>
              <Button variant="link" className="text-blue-500 hover:text-blue-600 p-0 h-auto">
                +20 Amenities
              </Button>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 ml-4 flex-shrink-0">
            <div className="text-right">
              <div className="text-gray-400 line-through text-lg mb-1">₹58,750</div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl md:text-3xl font-bold text-gray-900">₹52,975</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">(for 5 rooms) Per Night + Taxes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
