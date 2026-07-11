"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaStar,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, Bed, Eye } from "lucide-react";
import GoogleMap from "../google-map";
import { useHotel } from "@/lib/context/HotelContext";
import CustomAmenityIcon from "@/components/ui/CustomAmenityIcon";
import HotelDetailsDrawer from "@/components/Hotelscreen/HotelDetailsDrawer";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import Image from "next/image";

export default function PropertyContentSections() {
  const hotel = useHotel();
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { checkin, checkout } = useSelector((state) => state.booking);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const amenities = hotel?.amenities || [];
  const displayedAmenities = showAllAmenities
    ? amenities
    : amenities.slice(0, 8);

  const reviews = hotel?.reviews || [];

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
            {(hotel?.images?.slice(0, 4) || []).map((img, index) => {
              const titles = ["FULLY-SERVICED ROOMS", "EXQUISITE STAY", "PREMIUM INTERIORS", "CURATED EXPERIENCES"];
              return (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-xl"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Image
                    height={192}
                    width={300}
                    src={img || "/placeholder.svg"}
                    alt={titles[index] || "Experience"}
                    className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/60">
                    <h4 className="text-white font-bold text-center px-4 transition-all duration-300 group-hover:transform group-hover:scale-105 text-sm uppercase">
                      {titles[index] || ""}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Refund Policy Section */}
      <section
        id="refund-policyy"
        className="scroll-mt-32 min-h-[200px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Rules and Refund Policy
        </h2>
        <Card className="border-gray-200 border transition-all duration-300">
          <CardContent className="p-6">
            <div className="space-y-6">
              {hotel?.cancellationPolicy?.length > 0 && (
                <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                  <h3 className="font-semibold text-lg mb-2 text-black transition-all duration-300">
                    Cancellation Policy
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {hotel.cancellationPolicy.map((policy, index) => (
                      <li key={index} className="transition-all duration-300 hover:text-black">
                        • {policy}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hotel?.HotelRules?.length > 0 && (
                <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                  <h3 className="font-semibold text-lg mb-2 text-black transition-all duration-300">
                    Hotel Rules
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {hotel.HotelRules.map((rule, index) => (
                      <li key={index} className="transition-all duration-300 hover:text-black">
                        • {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {hotel?.paymentTerms?.length > 0 && (
                <div className="transition-all duration-300 hover:bg-gray-50 rounded-lg p-4 -m-4">
                  <h3 className="font-semibold text-lg mb-2 text-black transition-all duration-300">
                    Payment Terms
                  </h3>
                  <ul className="space-y-2 text-gray-700 text-sm">
                    {hotel.paymentTerms.map((term, index) => (
                      <li key={index} className="transition-all duration-300 hover:text-black">
                        • {term}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Available Rooms Section */}
      {hotel?.rooms?.length > 0 && (
        <section
          id="tents-list"
          className="scroll-mt-32 min-h-[250px] transition-all duration-500 ease-out"
        >
          <h2 className="text-2xl font-bold text-black mb-6">
            Available Rooms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotel.rooms.map((room) => (
              <Card
                key={room._id}
                className="overflow-hidden border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Room Image */}
                <div className="relative h-48 w-full bg-gray-100 flex-shrink-0">
                  {room.roomimages && room.roomimages.length > 0 ? (
                    <Image
                      src={room.roomimages[0]}
                      alt={room.roomType}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-150 text-gray-400">
                      No Images Available
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
                    Total Rooms: {room.totalRooms}
                  </div>
                </div>

                {/* Card Info */}
                <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">
                      {room.roomType} Room
                    </h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{room.minCapacity}-{room.maxCapacity} Guests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <span>Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xl font-black text-black">
                        ₹{calculateBasePriceForRange(checkInDate, checkOutDate, room.pricing).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-gray-500">per night + taxes</p>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedRoom(room);
                        setDrawerOpen(true);
                      }}
                      className="bg-black hover:bg-gray-800 text-white rounded-lg flex items-center gap-1 px-4"
                      size="sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section
        id="reviewss"
        className="scroll-mt-32 min-h-[300px] transition-all duration-500 ease-out"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black transition-all duration-300">
            Reviews
          </h2>
          <div className="flex items-center space-x-2 transition-all duration-300 hover:transform hover:scale-105">
            <FaStar className="w-5 h-5 text-yellow-400 transition-all duration-300" />
            <span className="text-xl font-semibold text-black transition-all duration-300">
              {hotel?.averageRating || "N/A"}
            </span>
            <span className="text-gray-500 transition-all duration-300">
              • {hotel?.totalReviews || reviews.length} reviews
            </span>
          </div>
        </div>

        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <Card
                key={review._id || index}
                className="border-gray-200 border transition-all duration-300"
              >
                <CardContent className="p-3">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200 text-black font-semibold text-lg">
                      {(review.userName || review.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-black transition-all duration-300">
                          {review.userName || review.name || "Anonymous"}
                        </h4>
                        <span className="text-sm text-gray-500 transition-all duration-300">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                              })
                            : review.date || ""}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(review.rating || 0)].map((_, i) => (
                          <FaStar
                            key={i}
                            className="w-4 h-4 text-yellow-400 transition-all duration-300 hover:scale-125"
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 transition-all text-sm duration-300">
                        {review.comment || review.text || ""}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No reviews yet.</p>
        )}

        {(hotel?.totalReviews || reviews.length) > 3 && (
          <Button
            variant="outline"
            className="mt-6 border-gray-200 text-black hover:bg-gray-50 transition-all duration-300 hover:shadow-md hover:transform hover:scale-105 bg-transparent"
          >
            Show all {hotel?.totalReviews || reviews.length} reviews
          </Button>
        )}
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
          {displayedAmenities?.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-md hover:transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-gray-200 border border-white rounded-md flex items-center justify-center transition-all duration-300">
                <CustomAmenityIcon name={amenity} className="w-5 h-5 text-black" />
              </div>
              <span className="font-medium text-sm text-black transition-all duration-300">
                {amenity}
              </span>
            </div>
          ))}
        </div>

        {amenities.length > 8 && (
          <Button
            variant="outline"
            className="mt-4 border-gray-200 text-black hover:bg-gray-50 transition-all duration-300 bg-transparent"
            onClick={() => setShowAllAmenities(!showAllAmenities)}
          >
            {showAllAmenities ? "Show Less" : `Show all ${amenities.length} amenities`}
          </Button>
        )}
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
                  {hotel?.address?.addressLine || "Address"}
                </h3>
                <p className="text-gray-600 transition-all duration-300">
                  {hotel?.address?.area}{hotel?.address?.city ? `, ${hotel.address.city}` : ""}
                </p>
              </div>
            </div>
            {hotel?.coordinates && (
              <GoogleMap
                coordinates={hotel.coordinates}
                zoom={14}
                className="w-full h-64 rounded-lg mb-4 border border-gray-300"
              />
            )}
            {hotel?.nearbyattractions?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-base text-black mb-2">Nearby Attractions</h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  {hotel.nearbyattractions.map((loc, index) => (
                    <li key={index} className="transition-all duration-300 hover:text-black">
                      • {loc?.nearbylocation} - {loc?.distance} km
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* FAQs Section */}
      <section
        id="faqss"
        className="scroll-mt-32 min-h-[200px] transition-all duration-500 ease-out"
      >
        <h2 className="text-2xl font-bold text-black mb-6 transition-all duration-300">
          Explore Your Stay
        </h2>
        {hotel?.faqs?.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {hotel.faqs.map((item, index) => (
              <AccordionItem
                key={item._id || index}
                value={`faq-${index}`}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4"
              >
                <AccordionTrigger className="font-medium hover:no-underline text-black text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : hotel?.exploreStay?.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {hotel.exploreStay.map((item, index) => (
              <AccordionItem
                key={item._id || index}
                value={`explore-${index}`}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4"
              >
                <AccordionTrigger className="font-medium hover:no-underline text-black text-left">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-700 leading-relaxed">
                  {item.description}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-sm text-gray-400">No details available.</p>
        )}
      </section>

      {/* Hotel Details Overlay */}
      <HotelDetailsDrawer
        room={selectedRoom}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
