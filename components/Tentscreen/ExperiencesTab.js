import React, { useState } from "react";
import experience1 from "@/public/Homeasset/fully-serviced.jpg";
import experience2 from "@/public/Homeasset/four-course-meal.jpg";
import nearbyVillaImage from "@/public/Homeasset/nearby-villa.jpg";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

// Experience images
const experienceImages = [experience1, experience2, experience1, experience2];

const ExperiencesTab = () => {
  return (
    <div className="p-3 space-y-6">
      {/* Experiences Carousel */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
          Experiences
        </h3>
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {experienceImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2">
                  <div className="aspect-video bg-villa-grey/30 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt={`Experience ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="mt-4">
          <p className="text-sm text-villa-text-light mb-4">
            {` Whether you're seeking relaxation, adventure, or simply a break from the ordinary, 
            StayVista's immersive experiences tailored meet your preferences. Have a private 
            celebration or just enjoy a bonfire and karaoke night under the stars.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesTab;
