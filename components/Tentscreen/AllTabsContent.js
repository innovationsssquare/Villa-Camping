import React, { forwardRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  Wifi,
  WavesLadder,
  CookingPot,
  Car,
  Fence,
  AirVent,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import fullyServicedImage from "@/public/Homeasset/fully-serviced.jpg";
import fourCourseMealImage from "@/public/Homeasset/four-course-meal.jpg";
import nearbyVillaImage from "@/public/Homeasset/nearby-villa.jpg";
import Image from "next/image";
import { FaSwimmer } from "react-icons/fa";
import GoogleMap from "../Propertyviewcomponents/google-map";
import ReviewsTab from "./ReviewsTab";
import ExperiencesTab from "./ExperiencesTab";
import HighlightsTab from "./HighlightsTab";
import SpacesTab from "./SpacesTab";

const AllTabsContent = ({ refs ,tents,onBookTent}) => {
  const [expandedDescription, setExpandedDescription] = useState(false);


  return (
    <div className="pb-20">
      {/* Highlights Section */}
     <section ref={refs.highlightsRef} id="highlights" className="scroll-mt-16">
        <HighlightsTab/>
      </section>

      {/* Refund Policy Section */}
      <section
        ref={refs.refundRef}
        id="refund-policy"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
            Rules and Refund Policy
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Cancellation Policy</h4>
              <ul className="space-y-1 text-villa-text-light">
                <li>• Free cancellation up to 7 days before check-in</li>
                <li>• 50% refund for cancellations 3-7 days before</li>
                <li>• No refund for cancellations within 3 days</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">House Rules</h4>
              <ul className="space-y-1 text-villa-text-light">
                <li>• Check-in: 2:00 PM - 8:00 PM</li>
                <li>• Check-out: 11:00 AM</li>
                <li>• No smoking inside the property</li>
                <li>• No pets allowed</li>
                <li>• No parties or events</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Terms</h4>
              <ul className="space-y-1 text-villa-text-light">
                <li>• 25% advance payment required at booking</li>
                <li>• Remaining amount due at check-in</li>
                <li>• Security deposit: ₹10,000 (refundable)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section ref={refs.spacesRef} id="spaces" className="scroll-mt-16">
        <SpacesTab tents={tents} onBookTent={onBookTent} />
      </section>

      {/* Reviews Section */}
      <section ref={refs.reviewsRef} id="reviews" className="scroll-mt-16">
        <ReviewsTab/>
      </section>

      {/* Amenities Section */}
      <section
        ref={refs.amenitiesRef}
        id="amenities"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
            Amenities
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <Wifi className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Free WiFi</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <WavesLadder className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Swimming Pool</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <CookingPot className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Kitchen</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <Car className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Parking</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <Fence className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">Garden</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg">
              <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                <AirVent className="w-4 h-4 text-black" />
              </div>
              <span className="text-sm font-medium">AC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section
        ref={refs.locationRef}
        id="location"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div >
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">Location</h3>

          <div className="bg-gray-100 border border-gray-200 p-2 h-auto  rounded-lg flex items-center justify-center mb-4">
           <GoogleMap/>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Address</h4>
              <p className="text-sm text-villa-text-light">
                RMalawali,Lonavala,Pune India
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Nearby Attractions</h4>
              <ul className="space-y-1 text-sm text-villa-text-light">
                <li>• Pawana Lake - 15 km</li>
                <li>• Tiger point - 12 km</li>
                <li>• Lohgad Fort - 18 km</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
    <section ref={refs.experiencesRef} id="experiences" className="scroll-mt-16">
        <ExperiencesTab/>
      </section>

      {/* FAQ Section */}
      <section
        ref={refs.faqsRef}
        id="faqs"
        className="p-3 space-y-6 scroll-mt-16"
      >
        {/* <button className="bg-villa-grey text-villa-text-dark px-6 py-2 rounded-lg text-sm font-medium">
          View Experiences
        </button> */}

        {/* FAQ Section */}
        <div >
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
           {` FAQ's related to Vastalya Villa - Malwali - Lonavala`}
          </h3>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="item-1"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                What are the check-in and check-out timings?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                Check-in is from 2:00 PM to 8:00 PM and check-out is at 11:00
                AM.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                Is breakfast included in the stay?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                Yes, complimentary breakfast is included with your stay.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                What activities are available nearby?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                You can enjoy hiking, boating at Nainital Lake, shopping at Mall
                Road, and visiting various viewpoints.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Explore Your Stay */}
        <div >
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">Explore Your Stay</h3>
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem
              value="explore-1"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                Villa Tour & Facilities
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                Take a virtual tour of our spacious villa with modern amenities
                and beautiful mountain views.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="explore-2"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                Local Attractions & Activities
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                Discover nearby attractions, adventure activities, and cultural
                experiences in Nainital.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="explore-3"
              className="bg-gray-100 rounded-lg px-4 border-0"
            >
              <AccordionTrigger className="font-medium hover:no-underline">
                Food & Dining Options
              </AccordionTrigger>
              <AccordionContent className="text-sm text-villa-text-light">
                Enjoy home-cooked meals, local cuisine, and nearby restaurant
                recommendations.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Nearby Villas */}
        <div >
          <div className="flex items-center justify-between mb-4 border-l-3 border-orange-500 pl-2">
            <h3 className="text-lg font-semibold">Nearby Villas</h3>
            <div className="flex items-center space-x-2 text-sm text-villa-text-light">
            
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-3/5">
                <div className="w-full bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-40 bg-gray-100 relative overflow-hidden">
                    <Image
                      src={nearbyVillaImage}
                      alt="Panorama @ Golden Bliss"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">
                      Panorama @ Golden Bliss ...
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold">₹11,008</span>
                      <span className="text-sm text-villa-text-light">
                        /Night
                      </span>
                    </div>
                    <p className="text-xs text-villa-text-light">
                      Book with confidence - This villa offers a super flexible
                      48-hour
                    </p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <div className="min-w-64 bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="h-40 bg-villa-grey/30"></div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">Another Villa...</h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg font-bold">₹9,500</span>
                      <span className="text-sm text-villa-text-light">
                        /Night
                      </span>
                    </div>
                    <p className="text-xs text-villa-text-light">
                      Beautiful mountain villa with modern amenities
                    </p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default AllTabsContent;
