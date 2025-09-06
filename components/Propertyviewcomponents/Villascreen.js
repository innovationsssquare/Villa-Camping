"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Heart,
  Share,
  User,
  Star,
  Users,
  Bed,
  Bath,
  Mountain,
  Coffee,
  Wifi,
  Car,
  Utensils,
  Phone,
  MessageCircle,
  Play,
  Camera,
  Video,
  X,
  MapPin,
  Home,
  XCircle,
  AirVent,
  Waves,
  Tv,
  Shield,
  WashingMachine,
  ChefHat,
  TreePine,
  Droplets,
  Zap,
  Clock,
  CheckCircle,
  Info,
  IndianRupee,
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import ImageGalleryDialog from "./image-gallery-dialog";
import BookingDialog from "./booking-dialog";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { fetchVillaById } from "@/Redux/Slices/villaSlice";
import VillaScreenSkeleton from "./villa-screen-skeleton";
import ButtonLoader from "../Loadercomponents/button-loader";
import {
  setcategoryId,
  setOwnerId,
  setPropertyId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AmenitiesToggle from "./Villaview/amenities-toggle";
import HouseRulesAccordion from "./Villaview/house-rules-accordion";
import MapEmbed from "./Villaview/map-embed";
import Reviews from "./Villaview/reviews";
import ImageCarousel from "./Villaview/image-carousel";
import { Separator } from "@/components/ui/separator";

const amenityIcons = {
  WiFi: Wifi,
  "Air Conditioning": AirVent,
  "Swimming Pool": Waves,
  Parking: Car,
  TV: Tv,
  Balcony: Mountain,
  Security: Shield,
  "Washing Machine": WashingMachine,
  Kitchen: ChefHat,
  Garden: TreePine,
  "Water Supply": Droplets,
  "Power Backup": Zap,
};

export default function Villascreen() {
  const dispatch = useDispatch();
  const [isLiked, setIsLiked] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const params = useParams();
  const { id } = params;
  const { villa, loading, error } = useSelector((state) => state.villa);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchVillaById(id));
  }, [id]);

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setIsGalleryOpen(true);
  };

  const images = [
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",

    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  ];

  const videos = [
    {
      src: "https://res.cloudinary.com/db60uwvhk/video/upload/v1755329753/villas/100cb757-f0e4-41dd-8cb5-04ac141be6f2_ooqqmx.mp4",
      alt: "Villa Tour Video",
      thumbnail:
        "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    },
  ];

  const amenities = [
    { icon: Mountain, label: "Mountain View" },
    { icon: Coffee, label: "Breakfast Included" },
    { icon: Wifi, label: "WiFi" },
    { icon: Car, label: "Jacuzzi" },
    { icon: Utensils, label: "BBQ Grill" },
  ];

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  if (loading) {
    return <VillaScreenSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">Error loading villa details</p>
        </div>
      </div>
    );
  }

  if (!villa) {
    return (
      <div className="flex justify-center items-center h-screen bg-black/10">
        <div className="bg-black rounded-full flex justify-center items-center">
          <ButtonLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 overflow-hidden md:hidden block">
      {/* Header */}
      <div className="flex items-center justify-between py-4 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg">{villa?.name}</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image Gallery with Carousel */}
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {villa?.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-80">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={villa?.name}
                    width={90}
                    height={90}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-none" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-none" />

          {/* Overlays */}
          <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground z-10">
            Best Rated
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/90 hover:bg-white rounded-full z-10"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </Button>

          <div className="absolute bottom-4 right-4 flex gap-2 z-10">
            <Button
              onClick={() => openGallery(0)}
              className="bg-black/70 hover:bg-black/90 text-white rounded-lg"
            >
              <Camera className="h-4 w-4 mr-2" />
              View Photos
            </Button>

            <Drawer>
              <DrawerTrigger asChild>
                <Button className="bg-black/70 hover:bg-black/90 text-white rounded-lg">
                  <Video className="h-4 w-4 mr-2" />
                  Videos
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh] overflow-hidden">
                <div className="p-2">
                  <div className="w-full absolute top-2 justify-center flex items-center">
                    <span className="w-12 h-2 bg-gray-300 rounded-2xl"></span>
                  </div>
                  <div className="space-y-4">
                    <div className="relative aspect-auto h-[65vh] bg-black rounded-lg overflow-hidden">
                      {!isVideoPlaying ? (
                        <>
                          <img
                            src={villa?.images[0] || "/placeholder.svg"}
                            alt={villa?.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            size="lg"
                            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 hover:bg-white text-black"
                            onClick={handleVideoPlay}
                          >
                            <Play className="h-8 w-8 ml-1" />
                          </Button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                            {villa?.name}
                          </div>
                        </>
                      ) : (
                        <>
                          <video
                            className="w-full h-full object-fill"
                            controls
                            autoPlay
                            onEnded={() => setIsVideoPlaying(false)}
                          >
                            <source src={villa?.reelVideo} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </>
                      )}
                    </div>

                    <DrawerClose className="w-full">
                      <Button className="w-full h-10 text-lg font-semibold bg-black hover:bg-black/90">
                        Close
                      </Button>
                    </DrawerClose>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </Carousel>
      </div>

      {/* Property Details */}
      {/* <div className="p-4 space-y-4 max-w-screen-sm mx-auto">
        <div>
          <h2 className="text-2xl font-bold mb-2">{villa?.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <p className="text-sm">
              {villa?.location?.addressLine}, {villa?.location?.city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">
              {villa?.averageRating > 0 ? villa?.averageRating : "New"}
            </span>
            {villa?.averageRating > 0 && (
              <span className="text-muted-foreground">/5</span>
            )}
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-500">
            {villa?.totalReviews || 0} Reviews
          </Button>
        </div>

        <Card className="p-3 border  border-white bg-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Up to {villa?.maxCapacity} Guests</span>
            </div>
            <div className="flex items-center bg-black text-white p-2 rounded-md gap-2">
              <Bed className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{villa?.bhkType}</span>
            </div>
          </div>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-3 gap-4">
            {villa?.amenities?.map((amenity, index) => {
              const IconComponent = amenityIcons[amenity] || Coffee;
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-lg border  border-white bg-gray-200 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-black" />
                  </div>
                  <span className="text-xs text-center text-gray-700">
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">Check-in Details</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Check-in: {villa?.checkInTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Check-out: {villa?.checkOutTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                Security Deposit: ₹{villa?.securityDeposit}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">House Rules</h3>
          <div className="space-y-2">
            {villa?.houseRules?.slice(0, 3).map((rule, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rule}</span>
              </div>
            ))}
            {villa?.houseRules?.length > 3 && (
              <Button
                variant="link"
                className="p-0 h-auto text-blue-500 text-sm"
              >
                View all {villa?.houseRules?.length} rules
              </Button>
            )}
          </div>
        </Card>

        {villa?.foodOptions && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Food Options</h3>
            </div>
            <p className="text-sm text-gray-700">{villa?.foodOptions}</p>
          </Card>
        )}

        <Card className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
          </div>
          <p className="text-sm text-gray-700">{villa?.cancellationPolicy}</p>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">
                {villa?.averageRating > 0 ? villa?.averageRating : "New"}
              </span>
              {villa?.averageRating > 0 && (
                <span className="text-muted-foreground text-sm">/5</span>
              )}
            </div>
          </div>

          {Array.isArray(villa?.reviews) && villa?.reviews?.length > 0 ? (
            <div className="space-y-4">
              {villa.reviews.slice(0, 3).map((rev, idx) => (
                <div
                  key={idx}
                  className="border-b last:border-b-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium">
                      {rev?.userName || "Guest"}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {rev?.date || ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (Number(rev?.rating) || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/90">
                    {rev?.comment || ""}
                  </p>
                </div>
              ))}
              {villa.reviews.length > 3 && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-500 text-sm"
                >
                  View all {villa.reviews.length} reviews
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No reviews yet.</div>
          )}
        </Card>
      </div> */}

      <main className="max-w-screen-lg mx-auto px-4 py-4 md:py-6">
        {/* Header */}
        <section className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-balance">
                {villa.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" aria-hidden />
                <p className="text-sm">
                  {villa.location.addressLine}, {villa.location.city}
                </p>
              </div>
            </div>
            <Button variant="outline" size="icon" aria-label="Save property">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Rating and quick stats */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star
                className="h-4 w-4 fill-amber-400 text-amber-500"
                aria-hidden
              />
              <span className="font-semibold">
                {villa.averageRating > 0 ? villa.averageRating : "New"}
              </span>
              {villa.averageRating > 0 && (
                <span className="text-muted-foreground">/5</span>
              )}
              <span className="text-muted-foreground">&nbsp;·&nbsp;</span>
              <a
                href="#reviews"
                className="text-sm text-primary hover:underline"
              >
                {villa.totalReviews} reviews
              </a>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" aria-hidden /> Up to{" "}
                {villa.maxCapacity}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" aria-hidden /> {villa.bhkType}
              </span>
            </div>
          </div>
        </section>

      
        <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-2">About this place</h2>
              <p className="text-sm leading-relaxed text-pretty">
                {villa.description}
              </p>
            </Card>

            {/* Amenities (toggle) */}
            <AmenitiesToggle amenities={villa.amenities} />

            {/* House Rules (accordion) */}
            <HouseRulesAccordion rules={villa.houseRules} />

            {/* Check-in details (accordion inside) */}
            <Card className="p-0 overflow-hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="checkin">
                  <AccordionTrigger className="px-4">
                    Check-in details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4 space-y-2 text-sm">
                      <div>
                        Check-in:{" "}
                        <Badge variant="secondary">{villa.checkInTime}</Badge>
                      </div>
                      <div>
                        Check-out:{" "}
                        <Badge variant="secondary">{villa.checkOutTime}</Badge>
                      </div>
                      <div>
                        Security Deposit:{" "}
                        <Badge variant="secondary">
                          ₹{villa.securityDeposit}
                        </Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                {villa.foodOptions && (
                  <AccordionItem value="food">
                    <AccordionTrigger className="px-4">
                      Food options
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="px-4 pb-4 text-sm">
                        {villa.foodOptions}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="cancellation">
                  <AccordionTrigger className="px-4">
                    Cancellation policy
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4 text-sm">
                      {villa.cancellationPolicy}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            {/* Map */}
            <MapEmbed
              lat={villa.location.lat}
              lng={villa.location.lng}
              address={`${villa.location.addressLine}, ${villa.location.city}`}
            />

            {/* Reviews */}
            {/* <div id="reviews">
              <Reviews
                average={villa.averageRating}
                total={villa.totalReviews}
                reviews={villa.reviews}
              />
            </div> */}
            <Card className="villa-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="villa-section-title mb-0">
                  <Star className="h-5 w-5 text-villa-rating" />
                  Reviews
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="villa-rating-star" />
                  <span className="font-semibold text-foreground">
                    {villa?.averageRating > 0
                      ? villa?.averageRating.toFixed(1)
                      : "New"}
                  </span>
                  {villa?.averageRating > 0 && (
                    <span className="text-muted-foreground text-sm">/5</span>
                  )}
                </div>
              </div>

              {Array.isArray(villa?.reviews) && villa?.reviews?.length > 0 ? (
                <div className="space-y-6">
                  {villa.reviews.slice(0, 3).map((review, idx) => (
                    <div
                      key={idx}
                      className="border-b border-border last:border-b-0 pb-6 last:pb-0"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">
                          {review?.userName || "Guest"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {review?.date || ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (Number(review?.rating) || 0)
                                ? "fill-villa-rating text-villa-rating"
                                : "text-muted-foreground/30"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-foreground leading-relaxed">
                        {review?.comment || ""}
                      </p>
                    </div>
                  ))}
                  {villa.reviews.length > 3 && (
                    <Button
                      variant="ghost"
                      className="text-primary hover:text-primary/80 p-0"
                    >
                      View all {villa.reviews.length} reviews
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-muted-foreground">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </section>
      </main>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto max-w-screen-sm px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex flex-col leading-tight">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">
                ₹{villa?.basePricePerNight}
              </span>
              <span className="text-xs text-muted-foreground">/ night</span>
            </div>
            {villa?.averageRating > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{villa?.averageRating}</span>
                <span>·</span>
                <span>{villa?.totalReviews || 0} reviews</span>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              dispatch(setPropertyId(villa?._id));
              dispatch(setcategoryId(villa?.category));
              dispatch(setOwnerId(villa?.owner));
              dispatch(setPropertyType("Villa"));
              setIsBookingOpen(true);
            }}
            className="h-11 px-6 text-base font-semibold rounded-full text-white bg-black"
            // disabled={villa?.status !== "available"}
          >
            Book Now
          </Button>
        </div>
      </div>

      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={villa?.images}
        initialIndex={galleryStartIndex}
      />

      <BookingDialog
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        propertyName={villa?.name}
        price={villa?.basePricePerNight}
        originalPrice={villa?.basePricePerNight}
        propertyId={villa?._id}
        ownerId={villa?.owner}
        propertyType="Villa"
        // customerId:={}
      />
    </div>
  );
}
