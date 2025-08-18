"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
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
} from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import ImageGalleryDialog from "./image-gallery-dialog";
import Image from "next/image";

export default function VillaListing() {
  const [isLiked, setIsLiked] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex)
    setIsGalleryOpen(true)
  }

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

  return (
    <div className="min-h-screen bg-background overflow-hidden md:hidden block">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg">Barkat Villa - Ramgarh</h1>
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
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-80">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={image.alt}
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
            {/* <Drawer>
              <DrawerTrigger asChild>
                <Button className="bg-black/70 hover:bg-black/90 text-white rounded-lg">
                  <Camera className="h-4 w-4 mr-2" />
                  View Photos
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Photo Gallery ({images.length} photos)
                  </h3>
                  <ScrollArea className="h-[65vh]">
                    <div className="grid grid-cols-2 gap-2">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-square">
                          <img
                            src={image.src || "/placeholder.svg"}
                            alt={image.alt}
                            className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </DrawerContent>
            </Drawer> */}

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
                    {videos.map((video, index) => (
                      <div
                        key={index}
                        className="relative aspect-auto h-[75vh] bg-black rounded-lg overflow-hidden"
                      >
                        {!isVideoPlaying ? (
                          <>
                            <img
                              src={video.thumbnail || "/placeholder.svg"}
                              alt={video.alt}
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
                              {video.alt}
                            </div>
                          </>
                        ) : (
                          <video
                            className="w-full h-full object-fill"
                            controls
                            autoPlay
                            onEnded={() => setIsVideoPlaying(false)}
                          >
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </Carousel>
      </div>

      {/* Property Details */}
      <div className="p-4 space-y-6">
        {/* Title and Location */}
        <div>
          <h2 className="text-2xl font-bold mb-1">Barkat Villa - Ramgarh</h2>
          <p className="text-muted-foreground">Nainital, Uttarakhand</p>
          <Button variant="link" className="p-0 h-auto text-accent">
            View Brochure
          </Button>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-sm">Like a 5+</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground">/5</span>
          </div>
          <Button variant="link" className="p-0 h-auto text-blue-500">
            65 Reviews
          </Button>
        </div>

        {/* Property Stats */}
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Up to 15 Guests</span>
            </div>
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">5 Rooms</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">5 Baths</span>
            </div>
          </div>
        </Card>

        {/* Great For */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Great for:</p>
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">View</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="grid grid-cols-5 gap-4">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <amenity.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="text-xs text-center">{amenity.label}</span>
            </div>
          ))}
        </div>

        {/* Contact Options */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            Connect with Host
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent">
            <MessageCircle className="h-4 w-4 mr-2" />
            Request Callback
          </Button>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹41,312</span>
            <span className="text-sm text-muted-foreground line-through">
              ₹45,854
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            22 - 29 Aug | 2 Guests | 📅
          </p>
          <p className="text-sm text-muted-foreground">
            For 5 rooms | Per night + taxes
          </p>
        </div>

        {/* Book Now Button */}
        <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90">
          Book Now
        </Button>
      </div>

      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={images}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}
