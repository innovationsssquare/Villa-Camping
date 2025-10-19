import { Button } from "@/components/ui/button"
import { Download, Home, TrendingUp, Headphones } from "lucide-react"

export default function BecomeHostPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Download Our Property Owner App</h1>
              <p className="text-lg text-gray-600 mb-6">
                Manage your properties on the go with our powerful mobile app. Get instant notifications, track
                bookings, and communicate with guests anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download iOS
                </Button>
                <Button variant="outline" className="flex items-center justify-center gap-2 bg-transparent">
                  <Download className="w-4 h-4" />
                  Download Android
                </Button>
              </div>
            </div>

            {/* Right side - Image placeholder */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg h-64 md:h-80 flex items-center justify-center">
              <div className="text-center">
                <Home className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">App Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Become a Host Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Become a Host?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">List Your Property</h3>
              <p className="text-gray-600">
                Easily list your property with beautiful photos and detailed descriptions. Reach millions of potential
                guests worldwide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Earn Income</h3>
              <p className="text-gray-600">
                Set your own prices and availability. Earn passive income by sharing your space with travelers from
                around the world.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our dedicated support team is always here to help. Get assistance with bookings, guest communication,
                and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Host Success Stories Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Host Success Stories</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Stat 1 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <p className="text-4xl font-bold text-blue-600 mb-2">50K+</p>
              <p className="text-gray-600">Active Hosts</p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <p className="text-4xl font-bold text-green-600 mb-2">$2M+</p>
              <p className="text-gray-600">Earned Monthly</p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <p className="text-4xl font-bold text-purple-600 mb-2">98%</p>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Hosting?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of successful hosts and start earning today. It only takes a few minutes to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
              Start Listing Now
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-blue-700 px-8 py-6 text-lg font-semibold bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
