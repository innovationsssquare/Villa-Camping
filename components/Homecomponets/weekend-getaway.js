"use client";

import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";
import Image from "next/image";

const weekendDestinations = [
  {
    id: 1,
    name: "Goa",
    description: "Popular for beaches and nightlife",
    distance: "451 km from Mumbai",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
  },
  {
    id: 2,
    name: "Ahmedabad",
    description: "The Commercial Capital of Gujarat",
    distance: "423 km from Mumbai",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  },
];

const staycationDestinations = [
  {
    id: 1,
    name: "Mumbai",
    description: "Luxury hotels and city experiences",
    distance: "0 km from Mumbai",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
  },
  {
    id: 2,
    name: "Pune",
    description: "Hill stations and resorts nearby",
    distance: "150 km from Mumbai",
    image:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  },
];

export default function WeekendGetaway() {
  const [activeTab, setActiveTab] = useState("weekend");

  const currentDestinations =
    activeTab === "weekend" ? weekendDestinations : staycationDestinations;

  return (
    <div className="w-full md:px-4 px-3 md:py-6 bg-gray-50 flex justify-center items-center flex-col">
      <div className="text-center md:py-4 py-2">
        <h2 className="text-lg md:text-3xl font-bold text-gray-900 mb-2 px-1">
          Plan your perfect getaway
        </h2>
        <p className="text-gray-600 md:text-sm text-xs mb-4 px-1">
          Discover amazing destinations for your next adventure. Choose from
          weekend escapes or relaxing staycations.
        </p>
      </div>
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={setActiveTab}
        aria-label="Options"
        className="w-full md:w-1/2"
        classNames={{
          tabList: "w-full   bg-gray-200  rounded-md p-0 mb-2",
          cursor: "w-full bg-black border border-black",
          tab: " px-0 md:h-10 ",
          tabContent:
            "group-data-[selected=true]:text-white w-full flex justify-center items-center md:font-semibold",
        }}
        color="primary"
        variant="light"
      >
        <Tab
          key="weekend"
          className="w-full md:py-4 py-2 "
          title={
            <div className="flex items-center space-x-2">
              <span>Weekend Getaway</span>
            </div>
          }
        >
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {currentDestinations.map((destination) => (
                <CarouselItem
                  key={destination.id}
                  className="pl-2 md:pl-4 basis-3/5 md:basis-6/36"
                >
                  <Card className="overflow-hidden border border-gray-200 shadow-none p-0 bg-white rounded-xl">
                    <CardBody className="p-0">
                      <div className="relative">
                        <Image
                          height={40}
                          width={40}
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.name}
                          className="w-full h-36 md:h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <div className="md:p-4 p-2">
                        <h3 className="font-bold md:text-lg text-sm text-black mb-1">
                          {destination.name}
                        </h3>
                        <p className="md:text-sm text-xs text-gray-600 mb-3 leading-relaxed truncate">
                          {destination.description}
                        </p>
                        <p className="md:text-sm text-xs text-gray-500 font-medium">
                          {destination.distance}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden" />
            <CarouselNext className="right-2 hidden" />
          </Carousel>
        </Tab>
        <Tab
          key="staycation"
          className="w-full md:py-4 py-2 "
          title={
            <div className="flex items-center space-x-2">
              <span>Staycation</span>
            </div>
          }
        >
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {currentDestinations.map((destination) => (
                <CarouselItem
                  key={destination.id}
                  className="pl-2 md:pl-4 basis-3/5 md:basis-6/36"
                >
                  <Card className="overflow-hidden border border-gray-200 shadow-none p-0 bg-white rounded-xl">
                    <CardBody className="p-0">
                      <div className="relative">
                        <Image
                          height={40}
                          width={40}
                          src={destination.image || "/placeholder.svg"}
                          alt={destination.name}
                          className="w-full h-36 md:h-44 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                      <div className="md:p-4 p-2">
                        <h3 className="font-bold md:text-lg text-sm text-black mb-1">
                          {destination.name}
                        </h3>
                        <p className="md:text-sm text-xs text-gray-600 mb-3 leading-relaxed truncate">
                          {destination.description}
                        </p>
                        <p className="md:text-sm text-xs text-gray-500 font-medium">
                          {destination.distance}
                        </p>
                      </div>
                    </CardBody>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hidden" />
            <CarouselNext className="right-2 hidden" />
          </Carousel>
        </Tab>
      </Tabs>
    </div>
  );
}
