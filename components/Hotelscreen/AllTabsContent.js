import React, { forwardRef, useState } from "react";
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
// import HighlightsTab from "./HighlightsTab";
// import SpacesTab from "./SpacesTab";
import { useCamping } from "@/lib/context/CampingContext";
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
  ShieldCheck,
  FlameKindling,
  Mountain,
  Table,
  Trees,
  Droplet,
  Users,
  Bed,
  BicepsFlexed,
} from "lucide-react";
import { FaUmbrellaBeach, FaPeopleRoof, FaBroom } from "react-icons/fa6";
import { Button } from "@heroui/react";
import { Tent, Backpack, Music, Footprints } from "lucide-react";
import { TbKayak } from "react-icons/tb";
import { MdKayaking, MdOutlineSpeaker } from "react-icons/md";

// react-icons (better semantics for some amenities)
import { FaFireAlt, FaParking, FaWater } from "react-icons/fa";
import { MdOutlineLocalDrink } from "react-icons/md";
import {
  FaSquareParking,
  FaTv,
  FaFilePdf,
  FaPeopleGroup,
  FaChild,
} from "react-icons/fa6";
import { BiBlanket } from "react-icons/bi";
import { GiSleepingBag } from "react-icons/gi";
import {
  Card,
  CardAction,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@heroui/react";
import { calculateBasePriceForRange } from "@/lib/datePricing";
import { useSelector } from "react-redux";
import { useHotel } from "@/lib/context/HotelContext";
import HotelDetailsDrawer from "./HotelDetailsDrawer";
import HighlightssTab from "./HighlightsTab";
// import TentDetailsDrawer from "./TentDetailsDrawer";
import { IoRoseOutline } from "react-icons/io5";
import { GiVideoConference } from "react-icons/gi";
import { CgGym } from "react-icons/cg";
import { IoCafeOutline } from "react-icons/io5";
import { LuFireExtinguisher } from "react-icons/lu";
import { IoBonfireOutline } from "react-icons/io5";

const AllTabsContent = ({ refs, tents, onBookTent }) => {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const hotel = useHotel();
  const [showAll, setShowAll] = useState(false);
  const { checkin, checkout } = useSelector((state) => state.booking);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const [selectedTent, setSelectedTent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes("mountain") || lowerAmenity.includes("view"))
      return <Mountain className="w-4 h-4" />;
    if (lowerAmenity.includes("kitchen") || lowerAmenity.includes("coffee"))
      return <Coffee className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

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
    "Drinking Water": <MdOutlineLocalDrink className="w-6 h-6 text-gray-600" />,
    "Charging Point": <BatteryCharging className="w-6 h-6 text-gray-600" />,
    Security: <ShieldCheck className="w-6 h-6 text-gray-600" />,
    "Private Parking": <FaParking className="w-6 h-6 text-gray-600" />,

    // Activities
    Barbeque: <FlameKindling className="w-6 h-6 text-gray-600" />,
    Bonfire: <FaFireAlt className="w-6 h-6 text-gray-600" />,
    Trekking: <Footprints className="w-6 h-6 text-gray-600" />,

    // Views
    "Mountain View": <Mountain className="w-6 h-6 text-gray-600" />,
    "Lake View": <Waves className="w-6 h-6 text-gray-600" />,

    // Common areas
    "Outdoor Seating": <Table className="w-6 h-6 text-gray-600" />,
    "Garden Area": <Trees className="w-6 h-6 text-gray-600" />,
    "Play Area": <FaChild className="w-6 h-6 text-gray-600" />,
    "Music System": <MdOutlineSpeaker className="w-6 h-6 text-gray-600" />,
    "Rain Dance Area": <Droplet className="w-6 h-6 text-gray-600" />,
    "River Rafting": <MdKayaking className="w-6 h-6 text-gray-600" />,
    Kayaking: <TbKayak className="w-6 h-6 text-gray-600" />,
    "Tent Stay": <Tent className="w-6 h-6 text-gray-600" />,
    Blankets: <BiBlanket className="w-6 h-6 text-gray-600" />,
    "Sleeping Bags": <GiSleepingBag className="w-6 h-6 text-gray-600" />,
    "Water Sports (Boating, Kayaking)": <MdKayaking className="w-6 h-6 text-gray-600" />,
    "Banquet Hall": <IoRoseOutline className="w-6 h-6 text-gray-600" />,
    "Conference Room": <GiVideoConference className="w-6 h-6 text-gray-600" />,
    "Restaurant": <Utensils className="w-6 h-6 text-gray-600" />,
    "Gym / Fitness Center": <CgGym className="w-6 h-6 text-gray-600" />,
    "Spa / Wellness Center": <BicepsFlexed className="w-6 h-6 text-gray-600" />,
    "In-house Cafe": <IoCafeOutline className="w-6 h-6 text-gray-600" />,
    "Fire Safety": <LuFireExtinguisher className="w-6 h-6 text-gray-600" />,
    "Bonfire Area": <IoBonfireOutline className="w-6 h-6 text-gray-600" />,
  };

  const displayedAmenities = showAll
    ? hotel?.amenities
    : hotel?.amenities?.slice(0, 8);

  return (
    <>
      <div className="pb-20">
        {/* Highlights Section */}
        <section
          ref={refs.highlightsRef}
          id="highlights"
          className="p-3 space-y-6 scroll-mt-16"
        >
          {/* Villa Description */}
          <div className="">
            <h3 className="text-lg font-semibold mb-3 border-l-3 border-orange-500 pl-2">
              {hotel?.name} - {hotel?.address?.area} - hotel in{" "}
              {hotel?.address?.city}
            </h3>
            <p className="text-villa-text-light text-sm leading-relaxed">
              {expandedDescription ? hotel?.description : hotel?.description}
            </p>
            <button
              onClick={() => setExpandedDescription(!expandedDescription)}
              className="text-villa-text-dark font-medium text-sm mt-2 underline"
            >
              {expandedDescription ? "Read Less" : "Read More"}
            </button>
          </div>
          <HighlightssTab highlights={hotel?.highlights} />

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
                {hotel?.cancellationPolicy &&
                  hotel?.cancellationPolicy.map((policy, index) => (
                    <ul key={index} className="space-y-1 text-villa-text-light">
                      <li>• {policy}</li>
                    </ul>
                  ))}
              </div>

              <div>
                <h4 className="font-medium mb-2">hotel Rules</h4>
                {hotel?.HotelRules &&
                  hotel?.HotelRules.map((rules, index) => (
                    <ul key={index} className="space-y-1 text-villa-text-light">
                      <li>• {rules}</li>
                    </ul>
                  ))}
              </div>

              <div>
                <h4 className="font-medium mb-2">Payment Terms</h4>
                {hotel?.paymentTerms &&
                  hotel?.paymentTerms.map((rules, index) => (
                    <ul key={index} className="space-y-1 text-villa-text-light">
                      <li>• {rules}</li>
                    </ul>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* Spaces Section */}
        {/* <section ref={refs.spacesRef} id="spaces" className="scroll-mt-16">
          <SpacesTab tents={tents} onBookTent={onBookTent} />
        </section> */}

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
            {hotel?.amenities?.length > 8 && (
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

            <div className="bg-gray-100 border border-gray-200 p-2 h-auto touch-auto  rounded-lg flex items-center justify-center mb-4">
              <GoogleMap coordinates={hotel?.coordinates} />
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Address</h4>
                <p className="text-sm text-villa-text-light">
                  {hotel?.address.addressLine},{hotel?.address.area},
                  {hotel?.address.city}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Nearby Attractions</h4>
                <ul className="space-y-1 text-sm text-villa-text-light">
                  {hotel?.nearbyattractions?.map((loc, index) => (
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
          <ExperiencesTab experiences={hotel?.experiences} />
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
              {` FAQ's related to ${hotel?.name} -  ${hotel?.address?.addressLine}, ${hotel?.address?.city}`}
            </h3>
            {hotel?.faqs &&
              hotel?.faqs.map((faq, index) => (
                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem
                    key={faq._id || index}
                    value={`faq-${index}`}
                    className="bg-gray-100 rounded-lg px-4 border-0"
                  >
                    <AccordionTrigger className="font-medium hover:no-underline">
                      {faq?.question}?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-villa-text-light">
                      {faq?.answer}.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
          </div>

          {/* Explore Your Stay */}
          <div className=" space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
                Explore Your Stay
              </h3>

              {hotel?.exploreStay?.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-3">
                  {hotel?.exploreStay?.map((item, index) => (
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

          {/* Tent Types Carousel */}
          {hotel?.rooms?.length > 0 && (
            <div className="bg-white">
              <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
                Available Rooms
              </h3>
              <Carousel className="w-full ">
                <CarouselContent className="-ml-4 bg-white">
                  {hotel?.rooms?.map((tent) => (
                    <CarouselItem
                      key={tent._id}
                      className="pl-4 md:pl-4 basis-2/3 md:basis-1/2 lg:basis-1/4 xl:basis-1/4 "
                    >
                      <Card className="overflow-hidden border border-gray-100  h-full p-0">
                        <CardHeader className="p-0">
                          {tent.images && tent.images.length > 0 ? (
                            <Image
                              unoptimized
                              height={50}
                              width={50}
                              src={tent.images[0]}
                              alt={tent.roomType}
                              className="w-full h-36 object-cover"
                            />
                          ) : (
                            <div className="w-full h-40 bg-muted flex items-center justify-center">
                              <Mountain className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                        </CardHeader>
                        <CardBody className="py-2">
                          <div className="flex justify-between items-start py-0">
                            <div className="text-md font-medium p-0">
                              <p className="text-md font-medium p-0">
                                {tent.roomType}
                              </p>
                              <p className="text-xs border rounded-full  p-1">
                                Total Rooms : {tent.totalRooms}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-md font-bold text-orange-500">
                                ₹
                                {calculateBasePriceForRange(
                                  checkInDate,
                                  checkOutDate,
                                  tent.pricing
                                )}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                per night
                              </p>
                            </div>
                          </div>

                          {/* <div className="flex gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {tent.min_capacity}-{tent.max_capacity} guests
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-muted-foreground" />
                            <span>{camping?.tents?.length} tents</span>
                          </div>
                        </div>

                        {tent.amenities && tent.amenities.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {tent.amenities
                              .slice(0, 3)
                              .map((amenity, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 border px-2 py-1 rounded text-xs"
                                >
                                  {getAmenityIcon(amenity)}
                                  <span>{amenity}</span>
                                </div>
                              ))}
                            {tent.amenities.length > 3 && (
                              <div className="px-2 py-1 border rounded text-xs">
                                +{tent.amenities.length - 3} more
                              </div>
                            )}
                          </div>
                        )} */}
                        </CardBody>
                        <CardFooter className="p-2 pt-0">
                          <Button
                            onPress={() => {
                              setSelectedTent(tent);
                              setDrawerOpen(true);
                            }}
                            className="w-full bg-black text-white"
                          >
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
              </Carousel>
            </div>
          )}
        </section>
      </div>

      <HotelDetailsDrawer
        room={selectedTent}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
};

export default AllTabsContent;
