"use client"

import { Star, Wifi, Car, Waves, Coffee, Mountain, UtensilsCrossed, MapPin, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PropertyContentSections() {
  const amenities = [
    { icon: Mountain, label: "Mountain View", available: true },
    { icon: UtensilsCrossed, label: "Breakfast Included", available: true },
    { icon: Wifi, label: "WiFi", available: true },
    { icon: Waves, label: "Jacuzzi", available: true },
    { icon: Coffee, label: "BBQ Grill", available: true },
    { icon: Car, label: "Parking", available: true },
  ]

  const experiences = [
    {
      title: "FULLY-SERVICED VILLAS",
      image: "/placeholder.svg?height=200&width=300&text=Fully+Serviced+Villas",
    },
    {
      title: "FOUR COURSE MEAL",
      image: "/placeholder.svg?height=200&width=300&text=Four+Course+Meal",
    },
    {
      title: "PREMIUM INTERIORS",
      image: "/placeholder.svg?height=200&width=300&text=Premium+Interiors",
    },
    {
      title: "CURATED EXPERIENCES",
      image: "/placeholder.svg?height=200&width=300&text=Curated+Experiences",
    },
  ]

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      date: "March 2024",
      comment:
        "Absolutely stunning property with breathtaking mountain views. The villa is spacious and well-maintained.",
      avatar: "PS",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      date: "February 2024",
      comment: "Perfect for a family getaway. The amenities were excellent and the staff was very helpful.",
      avatar: "RK",
    },
    {
      name: "Anita Patel",
      rating: 4,
      date: "January 2024",
      comment: "Beautiful location and great facilities. Would definitely recommend for a peaceful retreat.",
      avatar: "AP",
    },
  ]

  return (
    <div
      className="max-w-4xl space-y-12"
      style={{
        fontFamily:
          'Airbnb Cereal VF, Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif',
      }}
    >
      {/* Overview Section */}
      <section id="overview" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed mb-4 transition-all duration-300">
            Experience luxury and tranquility at Barkat Villa, a stunning property nestled in the picturesque hills of
            Ramgarh, Nainital. This magnificent villa offers breathtaking mountain views and is perfect for families and
            groups seeking an unforgettable getaway.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6 transition-all duration-300">
            The villa features spacious rooms, modern amenities, and beautiful outdoor spaces where you can relax and
            enjoy the serene mountain atmosphere. With its prime location and exceptional facilities, Barkat Villa
            promises a memorable stay in the heart of Uttarakhand.
          </p>

          {/* Amenities Preview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {amenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-105 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-2 shadow-sm transition-all duration-300 hover:shadow-md">
                  <amenity.icon className="w-6 h-6 text-gray-600 transition-all duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 transition-all duration-300">{amenity.label}</span>
              </div>
            ))}
          </div>

          <Button
            variant="link"
            className="text-blue-500 hover:text-blue-600 p-0 h-auto font-medium transition-all duration-300 hover:transform hover:scale-105"
          >
            +20 Amenities
          </Button>

          {/* Connect with Host */}
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-6 mt-8 transition-all duration-300 hover:bg-gray-100 hover:shadow-md">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-gray-600 transition-all duration-300" />
              <span className="font-medium text-gray-900 transition-all duration-300">Connect with Host</span>
            </div>
            <Button
              variant="outline"
              className="bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:transform hover:scale-105"
            >
              Request Callback
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="highlights" className="scroll-mt-32 min-h-[600px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Property Highlights</h2>

        {/* The StayVista Experience */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-red-500 mr-4 transition-all duration-300"></div>
            <h3 className="text-xl font-bold text-gray-900 transition-all duration-300">The StayVista Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={experience.image || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/50">
                  <h4 className="text-white font-bold text-center px-4 transition-all duration-300 group-hover:transform group-hover:scale-105">
                    {experience.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "🏔️",
              title: "Stunning Mountain Views",
              desc: "Wake up to breathtaking panoramic views of the Himalayan ranges from every room of the villa.",
            },
            {
              icon: "🏡",
              title: "Spacious Accommodation",
              desc: "5 well-appointed rooms that can comfortably accommodate up to 15 guests.",
            },
            {
              icon: "🍽️",
              title: "Delicious Meals",
              desc: "Enjoy authentic local cuisine and continental dishes prepared by our experienced chefs.",
            },
            {
              icon: "🌿",
              title: "Peaceful Location",
              desc: "Located away from the hustle and bustle, perfect for a peaceful and rejuvenating retreat.",
            },
          ].map((item, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 transition-all duration-300">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-600 transition-all duration-300">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Refund Policy Section */}
      <section id="refund-policy" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Refund Policy</h2>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300">Cancellation Policy</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="transition-all duration-300 hover:text-gray-900">
                    • Free cancellation up to 7 days before check-in
                  </li>
                  <li className="transition-all duration-300 hover:text-gray-900">
                    • 50% refund for cancellations 3-7 days before check-in
                  </li>
                  <li className="transition-all duration-300 hover:text-gray-900">
                    • No refund for cancellations within 3 days of check-in
                  </li>
                </ul>
              </div>
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300">Modification Policy</h3>
                <p className="text-gray-700 transition-all duration-300 hover:text-gray-900">
                  Date changes are subject to availability and may incur additional charges based on rate differences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spaces Section */}
      <section id="spaces" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Spaces</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-6 -m-6">
            <h3 className="font-semibold text-lg mb-4 transition-all duration-300">Indoor Spaces</h3>
            <ul className="space-y-2 text-gray-700">
              {[
                "5 spacious bedrooms with mountain views",
                "Large living room with comfortable seating",
                "Fully equipped kitchen",
                "5 modern bathrooms",
                "Dining area for group meals",
              ].map((item, index) => (
                <li
                  key={index}
                  className="transition-all duration-300 hover:text-gray-900 hover:transform hover:translate-x-2"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-6 -m-6">
            <h3 className="font-semibold text-lg mb-4 transition-all duration-300">Outdoor Spaces</h3>
            <ul className="space-y-2 text-gray-700">
              {[
                "Private garden with mountain views",
                "Outdoor seating area",
                "BBQ facility",
                "Parking space for multiple vehicles",
                "Terrace with panoramic views",
              ].map((item, index) => (
                <li
                  key={index}
                  className="transition-all duration-300 hover:text-gray-900 hover:transform hover:translate-x-2"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="scroll-mt-32 min-h-[600px] transition-all duration-500 ease-out">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 transition-all duration-300">Reviews</h2>
          <div className="flex items-center space-x-2 transition-all duration-300 hover:transform hover:scale-105">
            <Star className="w-5 h-5 fill-current text-yellow-400 transition-all duration-300" />
            <span className="text-xl font-semibold transition-all duration-300">4.8</span>
            <span className="text-gray-500 transition-all duration-300">• 65 reviews</span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 hover:bg-blue-600">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 transition-all duration-300">{review.name}</h4>
                      <span className="text-sm text-gray-500 transition-all duration-300">{review.date}</span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-current text-yellow-400 transition-all duration-300 hover:scale-125"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 transition-all duration-300">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-6 bg-transparent transition-all duration-300 hover:shadow-md hover:transform hover:scale-105"
        >
          Show all 65 reviews
        </Button>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-105"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition-all duration-300">
                <amenity.icon className="w-4 h-4 text-green-600 transition-all duration-300" />
              </div>
              <span className="font-medium text-gray-900 transition-all duration-300">{amenity.label}</span>
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="mt-6 bg-transparent transition-all duration-300 hover:shadow-md hover:transform hover:scale-105"
        >
          <span className="text-blue-500">+20 Amenities</span>
        </Button>
      </section>

      {/* Meals Section */}
      {/* <section  className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Meals</h2>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-3 transition-all duration-300">Breakfast</h3>
                <p className="text-gray-700 mb-2 transition-all duration-300">
                  Start your day with a delicious breakfast featuring local and continental options.
                </p>
                <span className="text-green-600 font-medium transition-all duration-300">Included in stay</span>
              </div>
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-3 transition-all duration-300">Lunch & Dinner</h3>
                <p className="text-gray-700 mb-2 transition-all duration-300">
                  Enjoy authentic Kumaoni cuisine and popular Indian dishes prepared with fresh local ingredients.
                </p>
                <span className="text-blue-600 font-medium transition-all duration-300">Available on request</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section> */}

      {/* Location Section */}
      <section id="location" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Location</h2>
        <Card className="transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 mb-4">
              <MapPin className="w-5 h-5 text-red-500 mt-1 transition-all duration-300 hover:scale-125" />
              <div>
                <h3 className="font-semibold text-lg transition-all duration-300">Ramgarh, Nainital</h3>
                <p className="text-gray-600 transition-all duration-300">Uttarakhand, India</p>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center transition-all duration-300 hover:bg-gray-300">
              <span className="text-gray-500 transition-all duration-300">Interactive Map</span>
            </div>
            <p className="text-gray-700 transition-all duration-300">
              Located in the serene hill station of Ramgarh, this villa offers easy access to local attractions while
              maintaining privacy and tranquility. The property is approximately 20 km from Nainital city center.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Experiences Section */}
      <section id="experiences" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">Experiences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: "🥾",
              title: "Nature Walks",
              desc: "Explore the beautiful trails around Ramgarh with guided nature walks through apple orchards and pine forests.",
            },
            {
              icon: "🌅",
              title: "Sunrise Views",
              desc: "Wake up early to witness spectacular sunrise views over the Himalayan peaks from the villa's terrace.",
            },
          ].map((item, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-3 transition-all duration-300">
                  {item.icon} {item.title}
                </h3>
                <p className="text-gray-600 transition-all duration-300">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 transition-all duration-300">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: "What is the check-in and check-out time?", a: "Check-in: 2:00 PM | Check-out: 11:00 AM" },
            { q: "Is parking available?", a: "Yes, free parking is available for multiple vehicles." },
            { q: "Are pets allowed?", a: "Pets are allowed with prior approval and additional charges may apply." },
          ].map((faq, index) => (
            <Card key={index} className="transition-all duration-300 hover:shadow-lg hover:transform hover:scale-102">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2 transition-all duration-300">{faq.q}</h3>
                <p className="text-gray-700 transition-all duration-300">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
