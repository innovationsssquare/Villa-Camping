import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users, Bed, Wifi, Coffee, Mountain } from "lucide-react";
import { useCamping } from "@/lib/context/CampingContext";

const SpacesTab = ({ tents = [], onBookTent }) => {
    const camping = useCamping();
  
  const getAmenityIcon = (amenity) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes("mountain") || lowerAmenity.includes("view"))
      return <Mountain className="w-4 h-4" />;
    if (lowerAmenity.includes("kitchen") || lowerAmenity.includes("coffee"))
      return <Coffee className="w-4 h-4" />;
    return <Coffee className="w-4 h-4" />;
  };

  return (
    <div className="p-4 space-y-6">
     
      {/* Meal Plan */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Meal Plan of Campsite
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
         
          <li>
            • Snacks: {camping?.meals?.eveningSnacks}
          </li>
          <li>• Veg-BBQ: {camping?.meals?.bbq?.veg}</li>
          <li>• NonVeg-BBQ: {camping?.meals?.bbq?.nonVeg}</li>
          <li>
            • Veg-dinner: {camping?.meals?.dinner?.veg}
          </li>
          <li>
            • Nonveg-dinner: {camping?.meals?.dinner?.nonVeg}
          </li>
          <li> Next Day Breakfast</li>
          <li>• Breakfast: {camping?.meals?.nextDayBreakfast}</li>
        </ul>
      </div>

      {/* Things to Carry */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Things to Carry
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Torch</li>
          <li>• Personal medicines</li>
          <li>• Extra pair of clothes and slippers</li>
          <li>• Comfortable footwear</li>
          <li>• Warm clothing or extra blanket (during winters)</li>
          <li>• Umbrella (during monsoon)</li>
        </ul>
      </div>
    </div>
  );
};

export default SpacesTab;
