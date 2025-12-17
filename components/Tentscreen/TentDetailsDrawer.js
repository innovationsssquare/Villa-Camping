import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Users,
  Tent,
  IndianRupee,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Lightbulb,
} from "lucide-react";
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
  Bed,
} from "lucide-react";
import { FaUmbrellaBeach, FaPeopleRoof, FaBroom } from "react-icons/fa6";
import { Backpack, Music, Footprints } from "lucide-react";
import { TbKayak } from "react-icons/tb";
import { MdKayaking, MdOutlineSpeaker } from "react-icons/md";
import { PiFanLight } from "react-icons/pi";
import { FaMattressPillow } from "react-icons/fa6";

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
import { GiPillow } from "react-icons/gi";

const TentDetailsDrawer = ({ tent, open, onOpenChange, onBookNow }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  if (!tent) return null;

  const images = tent.tentimages || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "booked":
        return "bg-orange-500/10 text-orange-600 border-orange-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
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
    Blanket: <BiBlanket className="w-6 h-6 text-gray-600" />,
    "Sleeping Bags": <GiSleepingBag className="w-6 h-6 text-gray-600" />,
    "Fan (Portable)": <PiFanLight className="w-6 h-6 text-gray-600" />,
    Dustbin: <Trash2 className="w-6 h-6 text-gray-600" />,
    "Light Inside Tent": <Lightbulb className="w-6 h-6 text-gray-600" />,
    Pillow: <GiPillow className="w-6 h-6 text-gray-600" />,
    Mattress: <FaMattressPillow className="w-6 h-6 text-gray-600" />,
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg overflow-y-auto">
          <DrawerHeader className="text-left">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-xl font-bold">
                {tent.tentType} Tent
              </DrawerTitle>
            </div>
            <DrawerDescription>
              Perfect for {tent.minCapacity}-{tent.maxCapacity} guests
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2 space-y-2">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${tent.tentType} tent`}
                  className="w-full h-56 object-cover"
                />
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Quick Info Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-muted-foreground">Capacity</p>
                <p className="font-semibold text-sm">
                  {tent.minCapacity}-{tent.maxCapacity}
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Tent className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-muted-foreground">Total Tents</p>
                <p className="font-semibold text-sm">{tent.totaltents}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <Calendar className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                <p className="text-xs text-muted-foreground">Availability</p>
                <p className="font-semibold text-sm">
                  {tent.isAvailable ? (
                    <Check className="w-4 h-4 inline text-green-500" />
                  ) : (
                    <X className="w-4 h-4 inline text-red-500" />
                  )}
                </p>
              </div>
            </div>

            <Separator />

            {/* Pricing Section */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-orange-500" />
                Pricing
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Weekday Price
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    ₹{tent.pricing.weekdayPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </div>
                <div className="border rounded-lg p-3 bg-orange-500/5 border-orange-500/20">
                  <p className="text-xs text-muted-foreground mb-1">
                    Weekend Price
                  </p>
                  <p className="text-lg font-bold text-orange-500">
                    ₹{tent.pricing.weekendPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">per night</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Amenities Section */}
            {tent.amenities && tent.amenities.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Amenities Included</h4>
                <div className="flex flex-wrap gap-2">
                  {tent.amenities.map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="ghost"
                      className="text-xs py-1.5 px-3"
                    >
                      {amenityIcons[amenity] || (
                        <Building2 className="w-4 h-4 text-black" />
                      )}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TentDetailsDrawer;
