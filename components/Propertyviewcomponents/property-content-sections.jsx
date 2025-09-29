"use client";

import {
  FaStar,
  FaWifi,
  FaCar,
  FaWater,
  FaCoffee,
  FaMountain,
  FaUtensils,
  FaMapMarkerAlt,
  FaHome,
  FaBed,
  FaLeaf,
  FaHiking,
  FaSun,
  FaHotTub,
  FaFire,
  FaTv,
  FaSnowflake,
  FaGamepad,
  FaCamera,
  FaMusic,
  FaDumbbell,
  FaTree,
  FaShieldAlt,
  FaClock,
  FaPhone,
  FaCouch,
  FaBlender,
  FaMicrochip,
  FaSwimmingPool,
  FaTshirt,
  FaInfoCircle,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GoogleMap from "./google-map";
import { useVilla } from "@/lib/context/VillaContext";
import Image from "next/image";

export default function PropertyContentSections() {
  const villa = useVilla();

  const amenityIcons = {
    "Mountain View": FaMountain,
    "Breakfast Included": FaUtensils,
    WiFi: FaWifi,
    Jacuzzi: FaHotTub,
    "BBQ Grill": FaFire,
    "Free Parking": FaCar,
    "Smart TV": FaTv,
    "Air Conditioning": FaSnowflake,
    "Coffee Machine": FaCoffee,
    "Game Room": FaGamepad,
    "Security Cameras": FaCamera,
    "Sound System": FaMusic,
    "Fitness Center": FaDumbbell,
    "Garden View": FaTree,
    Terrace: FaSun,
    Heating: FaSnowflake,
    Safe: FaShieldAlt,
    "24/7 Support": FaClock,
    Phone: FaPhone,
    "Laundry Service": FaTshirt,
    Kitchen: FaUtensils,
    "Premium Bedding": FaBed,
    "Living Area": FaCouch,
    Refrigerator: FaBlender,
    Microwave: FaMicrochip,
    "Swimming Pool": FaSwimmingPool,

    // backend synonyms
    Parking: FaCar,
    Garden: FaTree,
    TV: FaTv,
    Security: FaShieldAlt,
    Balcony: FaSun,
    "Washing Machine": FaTshirt,
  };

  const amenities = villa?.amenities?.map((label) => ({
    label,
    icon: amenityIcons[label] || FaInfoCircle,
  }));

  const experiences = [
    {
      title: "FULLY-SERVICED VILLAS",
      image:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    },
    {
      title: "PARTY VIBE",
      image:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    },
    {
      title: "PREMIUM INTERIORS",
      image:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
    {
      title: "CURATED EXPERIENCES",
      image:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      date: "March 2024",
      comment:
        "Absolutely stunning property with breathtaking mountain views. The villa is spacious and well-maintained.",
      avatar:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
    {
      name: "Rajesh Kumar",
      rating: 5,
      date: "February 2024",
      comment:
        "Perfect for a family getaway. The amenities were excellent and the staff was very helpful.",
      avatar:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
    {
      name: "Anita Patel",
      rating: 4,
      date: "January 2024",
      comment:
        "Beautiful location and great facilities. Would definitely recommend for a peaceful retreat.",
      avatar:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
  ];

  return (
    <div className="w-full space-y-12">
      {/* Highlights Section */}
      <section
        id="highlightss"
        className="scroll-mt-32 min-h-[300px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Property Highlights
        </h2>

        {/* The StayVista Experience */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-black mr-4 transition-all duration-300"></div>
            <h3 className="text-xl font-bold text-black transition-all duration-300">
              The VillaCamp Experience
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="relative rounded-lg overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Image
                  height={40}
                  width={40}
                  src={villa?.images[index] || "/placeholder.svg"}
                  alt={experience.title}
                  className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/60">
                  <h4 className="text-white font-bold text-center px-4 transition-all duration-300 group-hover:transform group-hover:scale-105">
                    {experience.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Policy Section */}
      <section
        id="refund-policyy"
        className="scroll-mt-32 min-h-[200px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Refund Policy
        </h2>
        <Card className="border-gray-200 border transition-all duration-300">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-2 text-black transition-all duration-300">
                  Cancellation Policy
                </h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="transition-all duration-300 hover:text-black">
                    • Free cancellation up to 7 days before check-in
                  </li>
                  <li className="transition-all duration-300 hover:text-black">
                    • 50% refund for cancellations 3-7 days before check-in
                  </li>
                  <li className="transition-all duration-300 hover:text-black">
                    • No refund for cancellations within 3 days of check-in
                  </li>
                </ul>
              </div>
              <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                <h3 className="font-semibold text-lg mb-2 text-black transition-all duration-300">
                  Modification Policy
                </h3>
                <p className="text-gray-700 transition-all duration-300 hover:text-black text-sm">
                  Date changes are subject to availability and may incur
                  additional charges based on rate differences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Spaces Section */}
      <section
        id="spacess"
        className="scroll-mt-32 min-h-[200px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Spaces
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-6 -m-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-200 border border-white rounded-md flex items-center justify-center mr-3">
                <FaBed className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-semibold text-lg text-black transition-all duration-300">
                Indoor Spaces
              </h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              {[
                "5 spacious bedrooms with mountain views",
                "Large living room with comfortable seating",
                "Fully equipped kitchen",
                "5 modern bathrooms",
                "Dining area for group meals",
              ].map((item, index) => (
                <li
                  key={index}
                  className="transition-all duration-300 hover:text-black hover:transform hover:translate-x-2"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-6 -m-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gray-200 border border-white rounded-md flex items-center justify-center mr-3">
                <FaLeaf className="w-4 h-4 text-black" />
              </div>
              <h3 className="font-semibold text-lg text-black transition-all duration-300">
                Outdoor Spaces
              </h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              {[
                "Private garden with mountain views",
                "Outdoor seating area",
                "BBQ facility",
                "Parking space for multiple vehicles",
                "Terrace with panoramic views",
              ].map((item, index) => (
                <li
                  key={index}
                  className="transition-all duration-300 hover:text-black hover:transform hover:translate-x-2"
                >
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        id="reviewss"
        className="scroll-mt-32 min-h-[600px] transition-all duration-500 ease-out"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black transition-all duration-300">
            Reviews
          </h2>
          <div className="flex items-center space-x-2 transition-all duration-300 hover:transform hover:scale-105">
            <FaStar className="w-5 h-5 text-yellow-400 transition-all duration-300" />
            <span className="text-xl font-semibold text-black transition-all duration-300">
              4.8
            </span>
            <span className="text-gray-500 transition-all duration-300">
              • 65 reviews
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card
              key={index}
              className="border-gray-200 border transition-all duration-300 "
            >
              <CardContent className="p-3">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.avatar || "/placeholder.svg"}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 hover:border-gray-400"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-black transition-all duration-300">
                        {review.name}
                      </h4>
                      <span className="text-sm text-gray-500 transition-all duration-300">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar
                          key={i}
                          className="w-4 h-4 text-yellow-400 transition-all duration-300 hover:scale-125"
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 transition-all text-sm duration-300">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-6 border-gray-200 text-black hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:transform hover:scale-105 bg-transparent"
        >
          Show all 65 reviews
        </Button>
      </section>

      {/* Amenities Section */}
      <section
        id="amenitiess"
        className="scroll-mt-32 min-h-[200px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-3 transition-all duration-300">
          Amenities
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {amenities?.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gray-200 border border-white rounded-md flex items-center justify-center transition-all duration-300">
                <amenity.icon className="w-5 h-5 text-black transition-all duration-300" />
              </div>
              <span className="font-medium text-sm text-black transition-all duration-300">
                {amenity.label}
              </span>
            </div>
          ))}
        </div>

       
      </section>

      {/* Location Section */}
      <section
        id="locationn"
        className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Location
        </h2>
        <Card className="border-gray-200 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-8 h-8 bg-gray-200 border border-white rounded-md flex items-center justify-center">
                <FaMapMarkerAlt className="w-4 h-4 text-black transition-all duration-300" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-black transition-all duration-300">
                  Vastalya, Malawali
                </h3>
                <p className="text-gray-600 transition-all duration-300">
                  Lonavala, Pune
                </p>
              </div>
            </div>
            <GoogleMap
              center={{ lat: 18.7645, lng: 73.4084 }}
              zoom={14}
              className="w-full h-64 rounded-lg mb-4 border border-gray-300"
            />
            <p className="text-gray-700 text-sm transition-all duration-300">
              Located in the serene hill station of Ramgarh, this villa offers
              easy access to local attractions while maintaining privacy and
              tranquility. The property is approximately 20 km from Nainital
              city center.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* FAQs Section */}
      <section
        id="faqss"
        className="scroll-mt-32 min-h-[400px] transition-all duration-500 ease-out"
      >
        <h2 className="text-lg font-bold text-black mb-6 transition-all duration-300">
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {[
            {
              q: "What is the check-in and check-out time?",
              a: "Check-in: 2:00 PM | Check-out: 11:00 AM",
            },
            {
              q: "Is parking available?",
              a: "Yes, free parking is available for multiple vehicles.",
            },
            {
              q: "Are pets allowed?",
              a: "Pets are allowed with prior approval and additional charges may apply.",
            },
          ].map((faq, index) => (
            <Card
              key={index}
              className="border-gray-200 border transition-all duration-300"
            >
              <CardContent className="p-3">
                <h3 className="font-semibold text-base mb-2 text-black transition-all duration-300">
                  {faq.q}
                </h3>
                <p className="text-gray-700 text-sm transition-all duration-300">
                  {faq.a}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
