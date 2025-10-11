import React, { forwardRef, useState } from "react";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Check,
//   Wifi,
//   WavesLadder,
//   CookingPot,
//   Car,
//   Fence,
//   AirVent,
// } from "lucide-react";
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
import { useVilla } from "@/lib/context/VillaContext";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

import {
  Wifi,
  Wind,
  WavesLadder,
  CookingPot,
  Car,
  Fence,
  AirVent,
  Tv,
  Shield,
  Droplets,
  BatteryCharging,
  Building2,
  Snowflake,
  Key,
  Flame,
  Refrigerator,
  Sun,
  ShowerHead,
  Dumbbell,
  Coffee,
  Utensils,
  Waves,
  Bath,
  WashingMachine,
} from "lucide-react";
import { FaUmbrellaBeach, FaPeopleRoof, FaBroom } from "react-icons/fa6";
import { Button } from "../ui/button";

const AllTabsContent = ({ refs }) => {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const villa = useVilla();
  const [showAll, setShowAll] = useState(false);
  const [spacesApi, setSpacesApi] = useState();
  const [spacesCurrent, setSpacesCurrent] = useState(1);

  React.useEffect(() => {
    if (!spacesApi) return;

    setSpacesCurrent(spacesApi.selectedScrollSnap() + 1);

    spacesApi.on("select", () => {
      setSpacesCurrent(spacesApi.selectedScrollSnap() + 1);
    });
  }, [spacesApi]);

  const amenityIcons = {
    WiFi: <Wifi className="w-4 h-4 text-black" />,
    "Air Conditioning": <Wind className="w-4 h-4 text-black" />,
    "Swimming Pool": <WavesLadder className="w-4 h-4 text-black" />,
    Parking: <Car className="w-4 h-4 text-black" />,
    TV: <Tv className="w-4 h-4 text-black" />,
    Kitchen: <CookingPot className="w-4 h-4 text-black" />,
    "Washing Machine": <WashingMachine className="w-4 h-4 text-black" />,
    Balcony: <FaPeopleRoof className="w-4 h-4 text-black" />,
    Security: <Shield className="w-4 h-4 text-black" />,
    Garden: <Fence className="w-4 h-4 text-black" />,
    "Water Supply": <Droplets className="w-4 h-4 text-black" />,
    "Power Backup": <BatteryCharging className="w-4 h-4 text-black" />,
    Heater: <Snowflake className="w-4 h-4 text-black" />,
    "Beach Access": <FaUmbrellaBeach className="w-4 h-4 text-black" />,
    Housekeeping: <FaBroom className="w-4 h-4 text-black" />,
    Jacuzzi: <Bath className="w-4 h-4 text-black" />,
    "Mini Bar": <Coffee className="w-4 h-4 text-black" />,
    "Dining Area": <Utensils className="w-4 h-4 text-black" />,
    Refrigerator: <Refrigerator className="w-4 h-4 text-black" />,
    "Private Entrance": <Key className="w-4 h-4 text-black" />,
    "Hot Water": <Flame className="w-4 h-4 text-black" />,
    Shower: <ShowerHead className="w-4 h-4 text-black" />,
    Gym: <Dumbbell className="w-4 h-4 text-black" />,
    "Sun Deck": <Sun className="w-4 h-4 text-black" />,
    Spa: <Waves className="w-4 h-4 text-black" />,
  };

  const displayedAmenities = showAll
    ? villa?.amenities
    : villa?.amenities?.slice(0, 8);

  return (
    <div className="pb-20">
      {/* Highlights Section */}
      <section
        ref={refs.highlightsRef}
        id="highlights"
        className="p-3 space-y-6 scroll-mt-16"
      >
        {/* The StayVista Experience */}
        <div className="">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold border-l-3 border-orange-500 pl-2">
              The Villacamp Experience
            </h3>
            <div className="flex space-x-2"></div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <div className="min-w-48 relative rounded-lg overflow-hidden">
                  <Image
                    src={fullyServicedImage}
                    alt="Fully-Serviced Villas"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h4 className="text-lg font-bold">FULLY-SERVICED</h4>
                      <p className="text-sm">VILLAS</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-auto">
                <div className="min-w-48 relative rounded-lg overflow-hidden">
                  <Image
                    src={fourCourseMealImage}
                    alt="Four Course Meals"
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h4 className="text-lg font-bold">FOUR COURSE</h4>
                      <p className="text-sm">MEALS</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        {/* Villa Description */}
        <div className="">
          <h3 className="text-lg font-semibold mb-3 border-l-3 border-orange-500 pl-2">
            {villa?.name} - {villa?.address?.area} - Villa in{" "}
            {villa?.address?.city}
          </h3>
          <p className="text-villa-text-light text-sm leading-relaxed">
            {expandedDescription ? villa?.description : villa?.description}
          </p>
          <button
            onClick={() => setExpandedDescription(!expandedDescription)}
            className="text-villa-text-dark font-medium text-sm mt-2 underline"
          >
            {expandedDescription ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Drawer>
            <DrawerTrigger asChild>
              <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium">
                View Brochure
              </button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Villa Brochure</DrawerTitle>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                <div className="bg-villa-grey/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Highlights</h4>
                  <ul className="text-sm text-villa-text-light space-y-1">
                    <li>• 5 Bedroom Villa with Mountain Views</li>
                    <li>• Fully Furnished & Serviced</li>
                    <li>• Private Garden & BBQ Area</li>
                    <li>• Chef Services Available</li>
                  </ul>
                </div>
                <div className="bg-villa-grey/30 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Location Benefits</h4>
                  <ul className="text-sm text-villa-text-light space-y-1">
                    <li>• 15 minutes to Nainital Lake</li>
                    <li>• Peaceful hill station setting</li>
                    <li>• Easy access to trekking trails</li>
                  </ul>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
          <button className="bg-villa-grey text-villa-text-dark px-6 py-2 rounded-full text-sm font-medium">
            {`  FAQ's`}
          </button>
        </div>
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
                {villa?.cancellationPolicy.map((policy, index) => (
                  <li key={index}>• {policy}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">House Rules</h4>
              <ul className="space-y-1 text-villa-text-light">
                {villa?.houseRules.map((rule, index) => (
                  <li key={index}>• {rule}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Payment Terms</h4>
              <ul className="space-y-1 text-villa-text-light">
                {villa?.paymentTerms.map((terms, index) => (
                  <li key={index}>• {terms}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Section */}
      <section
        ref={refs.spacesRef}
        id="spaces"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div className=" space-y-6">
          {/* Villa Spaces Carousel */}
          {villa?.spaces.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold"> Spaces</h3>
                <span className="text-sm text-muted-foreground">
                  {spacesCurrent}/{villa?.spaces.length}
                </span>
              </div>
              <Carousel className="w-full" setApi={setSpacesApi}>
                <CarouselContent className="-ml-4">
                  {villa?.spaces.map((space) => {
                    const spaceId =
                      typeof space._id === "string" ? space._id : space._id;
                    return (
                      <CarouselItem
                        key={spaceId}
                        className="pl-4 md:basis-1/2 lg:basis-1/3"
                      >
                        <Card className="overflow-hidden h-full p-0">
                          <CardHeader className="p-0 ">
                            <Image
                              src={space.image}
                              height={48}
                              width={48}
                              alt={space.name}
                              className="w-full h-48 object-fill"
                            />
                          </CardHeader>
                          <CardContent className="p-4 space-y-3">
                            <CardTitle className="text-lg">
                              {space.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {space.description}
                            </p>

                            {space.details && space.details.length > 0 && (
                              <div className="space-y-1">
                                <p className="text-sm font-semibold">
                                  Details:
                                </p>
                                <ul className="space-y-1">
                                  {space.details.map((detail, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-muted-foreground"
                                    >
                                      • {detail}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section ref={refs.reviewsRef} id="reviews" className="scroll-mt-16">
        <ReviewsTab />
      </section>

      {/* Amenities Section */}
      <section
        ref={refs?.amenitiesRef}
        id="amenities"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
            Amenities
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-all duration-300 ease-in-out">
            {displayedAmenities?.map((amenity, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 bg-villa-grey/30 rounded-lg"
              >
                <div className="w-10 h-10 border-gray-400 bg-gray-100 rounded-sm border flex items-center justify-center">
                  {amenityIcons[amenity] || (
                    <Building2 className="w-4 h-4 text-black" />
                  )}
                </div>
                <span className="text-sm font-medium">{amenity}</span>
              </div>
            ))}
          </div>

          {/* Show More / Show Less */}
          {villa?.amenities?.length > 8 && (
            <div className="flex justify-center mt-4">
              <Button
                onPress={() => setShowAll(!showAll)}
                variant="flat"
                className="bg-orange-500/10 text-orange-600 font-medium text-sm"
              >
                {showAll ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section
        ref={refs.locationRef}
        id="location"
        className="p-3 space-y-6 scroll-mt-16"
      >
        <div>
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
            Location
          </h3>

          <div className="bg-gray-100 border border-gray-200 p-2 h-auto  rounded-lg flex items-center justify-center mb-4">
            <GoogleMap address={villa?.coordinates} />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Address</h4>
              <p className="text-sm text-villa-text-light">
                {villa?.address.addressLine},{villa?.address.area},
                {villa?.address.city}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Nearby Attractions</h4>
              <ul className="space-y-1 text-sm text-villa-text-light">
                {villa?.nearbyattractions?.map((loc, index) => (
                  <li key={index}>
                    • {loc?.nearbylocation} - {loc?.distance} km
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experiences Section */}
      <section
        ref={refs.experiencesRef}
        id="experiences"
        className="scroll-mt-16"
      >
        <ExperiencesTab experiences={villa?.experiences} />
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
        <div>
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
        <div className="p-3 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
              Explore Your Stay
            </h3>

            {villa?.exploreStay?.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-3">
                {villa?.exploreStay?.map((item, index) => (
                  <AccordionItem
                    key={item._id || index}
                    value={`explore-${index}`}
                    className="bg-gray-100 rounded-lg px-4 border-0"
                  >
                    <AccordionTrigger className="font-medium hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-villa-text-light">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-gray-400">No details available</p>
            )}
          </div>
        </div>

        {/* Nearby Villas */}
        <div>
          <div className="flex items-center justify-between mb-4 border-l-3 border-orange-500 pl-2">
            <h3 className="text-lg font-semibold">Nearby Villas</h3>
            <div className="flex items-center space-x-2 text-sm text-villa-text-light"></div>
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
