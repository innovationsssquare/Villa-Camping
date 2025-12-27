import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@heroui/react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import VideoModal from "./VideoModal";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import {
  Wifi,
  Snowflake,
  AirVent,
  BatteryCharging,
  GlassWater,
  ShieldCheck,
  Bed,
  Droplet,
  Tv as LucideTv,
  Table,
  Bath,
  Waves,
  Volume2,
  Utensils as LucideUtensils,
  Coffee,
  Trees,
  Home,
  Flame,
  Fire,
  Lightbulb,
  Star,
  MapPin,
  Users,
  BadgeCheck,
  Heart,
  Share2,
  FlameKindling,
  Camera,
  Mountain,
  Building2,
  Sun,
  Utensils,
} from "lucide-react";

// react-icons for items lucide doesn't provide (or where a better semantic icon exists)
import {
  FaSquareParking,
  FaTv,
  FaFilePdf,
  FaPeopleGroup,
  FaChild,
  FaUmbrellaBeach,
} from "react-icons/fa6";
import { BiBlanket } from "react-icons/bi";
import {
  MdKitchen,
  MdOutlineLocalDining,
  MdOutlineFreeBreakfast,
  MdOutlineSpeaker,
  MdPool,
} from "react-icons/md";
import { calculateBasePriceForRange } from "@/lib/datePricing";
// lucide-react
import { Tent, Backpack, Music, Footprints } from "lucide-react";
import { TbKayak } from "react-icons/tb";
import { MdKayaking } from "react-icons/md";

// react-icons (better semantics for some amenities)
import { FaFireAlt, FaParking, FaWater } from "react-icons/fa";
import { MdOutlineLocalDrink } from "react-icons/md";
import { clearSelectedTents, removeCoupon } from "@/Redux/Slices/bookingSlice";
import { MdOutlineLocalLaundryService } from "react-icons/md";

const PropertyCardnew = ({ property }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState();
  const { selectedCategoryName } = useSelector((state) => state.booking);
  const { checkin, checkout } = useSelector((state) => state.booking);
  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);
  useEffect(() => {
    if (!api) return;

    setCurrentSlide(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  const amenitiesIcons = {
    WiFi: <Wifi className="w-6 h-6 text-gray-600" />,
    Heating: <Snowflake className="w-6 h-6 text-gray-600" />,
    AC: <AirVent className="w-6 h-6 text-gray-600" />,
    "Power Backup": <BatteryCharging className="w-6 h-6 text-gray-600" />,
    "Water Supply": <GlassWater className="w-6 h-6 text-gray-600" />,
    Security: <ShieldCheck className="w-6 h-6 text-gray-600" />,
    CCTV: <Camera className="w-6 h-6 text-gray-600" />, // If you don't have Camera from lucide, use another (see note below)
    Parking: <FaSquareParking className="w-6 h-6 text-gray-600" />,
    "AC Bedrooms/Hall": <AirVent className="w-6 h-6 text-gray-600" />,
    "Aquagaurd for drinking water": (
      <Droplet className="w-6 h-6 text-gray-600" />
    ),
    "Extra mattresses": <Bed className="w-6 h-6 text-gray-600" />,

    "LED TV Mobile Connect": <FaTv className="w-6 h-6 text-gray-600" />,
    "Board Games": <Star className="w-6 h-6 text-gray-600" />, // fallback to star if no specific game icon
    "Sunset Point": <Star className="w-6 h-6 text-gray-600" />,
    "Table & Chairs": <Table className="w-6 h-6 text-gray-600" />,
    "Geyser in all Bathrooms": <Bath className="w-6 h-6 text-gray-600" />,

    "Swimming Pool": <MdPool className="w-6 h-6 text-gray-600" />,
    "Sound System": <MdOutlineSpeaker className="w-6 h-6 text-gray-600" />,
    Refrigerator: <MdKitchen className="w-6 h-6 text-gray-600" />,
    Kitchen: <MdKitchen className="w-6 h-6 text-gray-600" />,
    "Coffee Maker": <Coffee className="w-6 h-6 text-gray-600" />,
    Microwave: <MdKitchen className="w-6 h-6 text-gray-600" />,
    Oven: <MdKitchen className="w-6 h-6 text-gray-600" />,

    "Outdoor Dining Area": <Trees className="w-6 h-6 text-gray-600" />,
    "Dining Area": <MdOutlineLocalDining className="w-6 h-6 text-gray-600" />,
    "BBQ Grill": <FlameKindling className="w-6 h-6 text-gray-600" />,
    Balcony: <Home className="w-6 h-6 text-gray-600" />,
    Garden: <Trees className="w-6 h-6 text-gray-600" />,
    "Terrace / Patio": <Home className="w-6 h-6 text-gray-600" />,

    "Fire Extinguisher": <Flame className="w-6 h-6 text-gray-600" />,
    "Daily Breakfast": (
      <MdOutlineFreeBreakfast className="w-6 h-6 text-gray-600" />
    ),
    "Smart Lighting": <Lightbulb className="w-6 h-6 text-gray-600" />,
    "Tent Stay": <Tent className="w-6 h-6 text-gray-600" />,
    "Sleeping Bags": <Backpack className="w-6 h-6 text-gray-600" />,
    Blankets: <Bed className="w-6 h-6 text-gray-600" />,
    Mattresses: <Bed className="w-6 h-6 text-gray-600" />,

    // Utilities
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
    Restaurant: <Utensils className="w-6 h-6 text-gray-600" />,
    "Laundry Service": (
      <MdOutlineLocalLaundryService className="w-6 h-6 text-gray-600" />
    ),
    "Walking Area": <Footprints className="w-6 h-6 text-gray-600" />,
  };

  const greatForIcons = {
    "Mountain View": <Mountain className="w-4 h-4 text-gray-600" />,
    "Ideal for Families": <FaChild className="w-4 h-4 text-gray-600" />,
    "Ideal for Groups": <FaPeopleGroup className="w-4 h-4 text-gray-600" />,
    Beachfront: <FaUmbrellaBeach className="w-4 h-4 text-gray-600" />,
    "Nature Retreat": <Trees className="w-4 h-4 text-gray-600" />,
    "Romantic Getaway": <Heart className="w-4 h-4 text-gray-600" />,
  };

  function isWeekendInIndia(date = new Date()) {
    const dt = typeof date === "string" ? new Date(date) : date;
    // weekday short like "Sat", "Sun", "Mon" etc in the Asia/Kolkata timezone
    const weekdayShort = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
    }).format(dt);

    return weekdayShort === "Sat" || weekdayShort === "Sun";
  }

  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    // no decimal places - change maximumFractionDigits if needed
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount));
    return `₹${formatted}`;
  }

  const basePrice = calculateBasePriceForRange(
    checkInDate?.toISOString(),
    checkOutDate?.toISOString(),
    property?.pricing ?? {}
  );

  const nights = Math.max(
    1,
    Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24))
  );

  function getDisplayPrice(property, checkInDate) {
    const isWeekend = (() => {
      const day = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
      }).format(checkInDate);
      return day === "Sat" || day === "Sun";
    })();

    return isWeekend
      ? property?.pricing?.weekendPrice
      : property?.pricing?.weekdayPrice;
  }

  return (
    <Card
      className={`overflow-hidden shadow-none p-0 transition-all duration-300 bg-gradient-luxury border border-gray-300`}
    >
      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex md:h-80">
        {/* Image Section */}
        <div className="relative w-2/5 bg-gray-100">
          <Carousel className="w-full h-full">
            <CarouselContent>
              {property?.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    height={50}
                    width={50}
                    unoptimized
                    src={image}
                    alt={`${property?.name} - Image ${index + 1}`}
                    className="w-full h-80 object-fill"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Carousel>

          <div className="absolute top-4 left-4 flex gap-2">
            {property?.tags && (
              <Badge className="bg-white text-black font-normal">
                <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                Best Rated
              </Badge>
            )}
            {/* {isLuxury && (
              <Badge className="bg-primary text-primary-foreground font-light">
                Luxury
              </Badge>
            )} */}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="light"
              size="icon"
              className=" hover:bg-transparent text-white"
              onPress={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="light"
              size="icon"
              className=" hover:bg-transparent text-white"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal
              thumbnailSrc={property?.images[0]}
              videoUrl={property?.reelVideo}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Title and Location */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {property?.name}
                  </h3>
                  {property?.isapproved && (
                    <div className="w-4 h-4 bg-verified-green rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-card rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {property?.address?.addressLine}, {property?.address?.city}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-star-gold text-star-gold" />
                  <span className="font-semibold">
                    {property?.averageRating} of 5
                  </span>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Upto {property?.maxCapacity} Guests
              </span>
              {/* <span className="flex items-center gap-1">
                <Home className="w-4 h-4" />
                {property?.rooms} Rooms
              </span> */}
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                {property?.baths} Baths
              </span>
            </div>

            {/* Great For Tags */}
            <div className="mb-4">
              <span className="text-sm text-muted-foreground mr-2">
                Great for:
              </span>
              <div className="inline-flex gap-2">
                {property?.greatFor?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="flex gap-4">
              {property?.topamenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-center items-center gap-1 text-xs text-muted-foreground"
                >
                  <div>
                    {amenitiesIcons[amenity] || (
                      <Building2 className="w-6 h-6 text-gray-600" />
                    )}
                    {index === 5 && villa.topamenities.length > 6 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          +{villa?.amenities?.length - 5}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center ">{amenity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Price and Booking Section */}
        <div className="w-1/4 p-6 border-l border-gray-200 flex flex-col justify-between">
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-1">
              Min 1 Nights
            </div>
            <div className="text-2xl font-bold text-price-text mb-2">
              {basePrice}
            </div>
            <div className="text-xs text-muted-foreground">
              for 1 Nights + Taxes
            </div>
          </div>
          <div className="space-y-3">
            <Button
              onPress={() => {
                dispatch(removeCoupon());
                dispatch(clearSelectedTents());
              }}
              className="w-full bg-black hover:bg-black text-primary-foreground font-semibold"
            >
              View →
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Layout (Vertical) */}
      <div className="md:hidden">
        {/* Image Section */}
        <div className="relative h-auto bg-gray-100">
          <Carousel className="w-full h-64" setApi={setApi}>
            <CarouselContent>
              {property?.images.map((image, index) => (
                <CarouselItem key={index}>
                  <Image
                    height={50}
                    unoptimized
                    width={50}
                    src={image}
                    alt={`${property?.name} - Image ${index + 1}`}
                    className="w-full h-64 object-fill"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" /> */}
          </Carousel>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {property?.images.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>

          <div className="absolute top-4 left-4 flex gap-2">
            {property?.tags &&
              property?.tags.map((tag, index) => (
                <Badge
                  key={index}
                  className="bg-white text-black rounded-full font-semibold text-xs"
                >
                  <Star className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            {/* {isLuxury && (
              <Badge className="bg-black text-primary-foreground rounded-full font-semibold text-xs">
                Luxury
              </Badge>
            )} */}
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-card text-foreground rounded-md h-8 w-8"
              onPress={() => setIsWishlisted(!isWishlisted)}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 hover:bg-card text-foreground rounded-md h-8 w-8"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Video Button */}
          <div className="absolute bottom-4 left-4">
            <VideoModal
              thumbnailSrc={property?.images[0]}
              videoUrl={property?.reelVideo}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title, Rating and Location */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {property?.name}
                </h3>
                {property?.isapproved && (
                  <BadgeCheck className="text-xs text-green-500" size={14} />
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {property?.address?.addressLine}, {property?.address?.city}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 fill-star-gold text-star-gold fill-amber-400 text-amber-400" />
                <span className="font-semibold text-sm">
                  {property?.averageRating} of 5
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              Upto {property?.maxCapacity} Guests
            </span>
            {/* <span className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              {property?.rooms} Rooms
            </span> */}
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              {property?.baths} Baths
            </span>
          </div>

          {/* Great For Tags */}
          <div className="mb-4">
            {property?.greatFor?.length > 0 && (
              <div className="flex flex-col">
                <div className="flex flex-wrap  items-center">
                  <p className="text-sm text-villa-text-light">Great for:</p>
                  {property.greatFor.slice(0, 1).map((item, index) => (
                    <div
                      key={index}
                      className="bg-villa-green/10 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      {greatForIcons[item] || (
                        <Sun className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="grid grid-cols-5   gap-3 mb-4 overflow-hidden">
            {property?.topamenities.map((amenity, index) => (
              <div
                key={index}
                className="flex flex-col  items-center gap-1 text-xs text-muted-foreground w-full "
              >
                <div>
                  {amenitiesIcons[amenity] || (
                    <Building2 className="w-5 h-5 text-gray-600" />
                  )}
                  {index === 5 && villa.topamenities.length > 6 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-villa-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        +{villa?.amenities?.length - 5}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-[0.67rem] text-center w-full">{amenity}</p>
              </div>
            ))}
          </div>

          {/* Price and Booking Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-end justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Price start</div>
                <div className="text-xs text-muted-foreground">
                  for 1 Nights
                </div>
              </div>
              <div className="flex flex-col justify-center items-end">
                <div className="text-lg font-bold">
                  {formatRupee(property.pricing.weekdayPrice)}
                </div>
                {property.pricing.weekendPrice >
                  property.pricing.weekdayPrice && (
                  <p   className="text-xs">
                    Weekend ₹{formatRupee(property.pricing.weekendPrice)}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onPress={() => {
                  router.push(`/view-${selectedCategoryName}/${property?._id}`);
                  dispatch(removeCoupon());
                  dispatch(clearSelectedTents());
                }}
                className="w-full bg-black  text-primary-foreground font-semibold"
              >
                Book Now →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PropertyCardnew;
