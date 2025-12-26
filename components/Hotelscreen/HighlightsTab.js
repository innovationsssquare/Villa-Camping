import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const HighlightssTab = ({ highlights}) => {
  return (
    <div className="p-3 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">
          Highlights
        </h3>

        {highlights.length > 0 ? (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {highlights.map((exp, index) => (
                  <CarouselItem key={exp._id || index} className="md:basis-1/2">
                    <div className="aspect-video bg-villa-grey/30 rounded-lg overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.title || `Experience ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={800}
                        height={400}
                      />
                    </div>
                    <div className="mt-3">
                      <h4 className="text-base font-semibold">{exp.title}</h4>
                      <p className="text-sm text-villa-text-light">
                        {exp.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No experiences available</p>
        )}
      </div>
    </div>
  );
};

export default HighlightssTab;
