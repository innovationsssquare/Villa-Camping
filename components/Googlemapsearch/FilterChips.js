import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Flame, Plus, Zap, Video } from "lucide-react";

export const FilterChips = ({ onFilterSelect }) => {
  const [activeFilters, setActiveFilters] = React.useState(new Set());

  const filters = [
    {
      id: "hot",
      label: "97",
      icon: <Flame className="h-3 w-3 text-red-500" />,
      active: activeFilters.has("hot"),
    },
    {
      id: "price-20k",
      label: "20.2K+",
      icon: <Plus className="h-3 w-3 text-green-500" />,
      active: activeFilters.has("price-20k"),
    },
    {
      id: "price-2k",
      label: "2.3K+",
      icon: <Zap className="h-3 w-3 text-yellow-500" />,
      active: activeFilters.has("price-2k"),
    },
    {
      id: "trending",
      label: "2.9K+",
      icon: <Video className="h-3 w-3 text-purple-500" />,
      active: activeFilters.has("trending"),
    },
  ];

  const handleFilterClick = (filterId) => {
    const newActiveFilters = new Set(activeFilters);
    if (newActiveFilters.has(filterId)) {
      newActiveFilters.delete(filterId);
    } else {
      newActiveFilters.add(filterId);
    }
    setActiveFilters(newActiveFilters);
    onFilterSelect?.(filterId);
  };

  return (
    <div className="px-2 py-3 ">
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {filters.map((filter) => (
            <CarouselItem key={filter.id} className="pl-2 md:pl-4 basis-auto">
              <Badge
                variant="outline"
                className={`villa-filter-chip cursor-pointer bg-white border border-gray-300 rounded-full px-2 p-2 shadow-2xl whitespace-nowrap flex items-center gap-2 ${
                  filter.active ? "active" : ""
                }`}
                onClick={() => handleFilterClick(filter.id)}
              >
                {filter.icon}
                {filter.label}
              </Badge>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
