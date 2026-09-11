import React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Sparkles, ArrowRight } from "lucide-react";

const fallbackExperiences = [
  {
    _id: "exp-1",
    title: "Private Chef BBQ & Sunset Sundowner",
    description:
      "Enjoy a freshly grilled barbecue under starlit skies, prepared live by your personal villa chef alongside curated local delicacies.",
    category: "Dining",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
  },
  {
    _id: "exp-2",
    title: "Scenic Hillside Nature Walk & Bird Watching",
    description:
      "Guided sunrise trails through peaceful native groves, quiet mist points, and pristine forest trails surrounding the estate.",
    category: "Outdoor",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  },
];

const ExperiencesTab = ({ experiences = [] }) => {
  const items =
    experiences && experiences.length > 0
      ? experiences
      : fallbackExperiences;

  return (
    <div className="p-3 space-y-6">
      <div>
        <h3 className="text-base font-bold mb-3 border-l-4 border-[#ff6900] pl-2.5 text-gray-900">
          Curated Experiences
        </h3>

        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-3">
              {items.map((exp, index) => (
                <CarouselItem key={exp._id || index} className="pl-3 basis-4/5 sm:basis-1/2">
                  <div className="rounded-2xl bg-white border border-neutral-200/80 overflow-hidden shadow-xs flex flex-col h-full">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                      <Image
                        src={exp.image || "/placeholder.svg"}
                        alt={exp.title || `Experience ${index + 1}`}
                        className="w-full h-full object-cover"
                        width={600}
                        height={380}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      {exp.category && (
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-gray-900 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-[#ff6900]" />
                            <span>{exp.category}</span>
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-2 left-3 z-10">
                        <span className="text-white text-[10px] font-semibold tracking-wider">
                          Experience 0{index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-1.5">
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">
                          {exp.title}
                        </h4>
                        {exp.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] font-semibold text-[#ff6900]">
                        <span>Exclusive to this villa</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesTab;
