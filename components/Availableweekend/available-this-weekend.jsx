"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@heroui/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PropertyCard } from "@/components/Availableweekend/property-card";
import { cn } from "@/lib/utils";
import Weekendcard from "./Weekendcard";

const locations = [
  "All",
  "Villa",
  "Camping",
  "Cottage",
  "Hotel",
];

const properties = [
  {
    id: 1,
    name: "The Ganga House",
    location: "Varanasi, Uttar Pradesh",
    rating: 4.8,
    guests: 10,
    rooms: 4,
    baths: 2,
    price: 20847,
    originalPrice: null,
     images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    bestRated: true,
  },
  {
    id: 2,
    name: "Barkat Villa - Ramgarh",
    location: "Nainital, Uttarakhand",
    rating: 4.8,
    guests: 15,
    rooms: 5,
    baths: 5,
    price: 50523,
    originalPrice: 54948,
     images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    bestRated: true,
  },
  {
    id: 3,
    name: "Twilight Perch",
    location: "Mussoorie, Uttarakhand",
    rating: 4.7,
    guests: 10,
    rooms: 4,
    baths: 4,
    price: 49018,
    originalPrice: 53306,
     images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    bestRated: true,
  },
  {
    id: 4,
    name: "The Kathguni House",
    location: "Manali, Himachal Pradesh",
    rating: 4.7,
    guests: 6,
    rooms: 3,
    baths: 4,
    price: 29429,
    originalPrice: null,
    images: [
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    ],
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875532/villas/de028d0f-5543-46e0-95fe-54c0c7bdb93b_jyasht.jpg",
    bestRated: true,
  },
  {
    id: 5,
    name: "Riverside Retreat",
    location: "Rishikesh, Uttarakhand",
    rating: 4.6,
    guests: 8,
    rooms: 3,
    baths: 3,
    price: 35000,
    originalPrice: null,
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875526/villas/905268c2-dc39-4a63-aba7-adf4c217d777_mylulh.jpg",
    bestRated: false,
  },
];

export function AvailableThisWeekend() {
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("Manali");

  return (
    <div className="w-full  mx-auto md:px-4 px-3 py-6 space-y-6 ">
      {/* Available This Weekend Section */}
      <div className="space-y-4">
        <h2 className="md:text-4xl md:text-center font-medium text-foreground">
          Available This Weekend
        </h2>

        {/* Location Filter Tabs */}
        <div className="flex md:justify-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {locations.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLocation(location)}
              className={cn(
                "whitespace-nowrap transition-all duration-200 cursor-pointer",
                selectedLocation === location
                  ? "bg-black text-primary-foreground  hover:bg-black"
                  : "border-1 border-white relative bg-gray-200"
              )}
            >
              {location}
            </Button>
          ))}
        </div>

        <Carousel
          opts={{
            align: "start",
           
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {properties.map((property) => (
              <CarouselItem
                key={property.id}
                className="pl-3 md:pl-4 basis-2/3 md:basis-1/2 lg:basis-1/4 xl:basis-1/4"
              >
                <Weekendcard property={property} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* <CarouselPrevious className="hidden md:flex -left-12" />
          <CarouselNext className="hidden md:flex -right-12" /> */}
        </Carousel>

        {/* Standard Features Section (Mobile) */}
        <div className="w-full py-2 md:py-4 flex justify-center items-center">
          <Button size="sm" className="bg-black text-white w-1/2 md:w-60">
            View All
          </Button>
        </div>
      </div>
    </div>
  );
}
