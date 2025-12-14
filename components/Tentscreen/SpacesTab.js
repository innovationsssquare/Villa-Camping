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
      {/* Tent Types Carousel */}
      {tents?.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
            Available Tent Types
          </h3>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {tents.map((tent) => (
                <CarouselItem
                  key={tent.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <Card className="overflow-hidden h-full">
                    <CardHeader className="p-0">
                      {tent.tent_images && tent.tent_images.length > 0 ? (
                        <img
                          src={tent.tent_images[0]}
                          alt={tent.tent_type}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-muted flex items-center justify-center">
                          <Mountain className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {tent.tent_type} Tent
                        </CardTitle>
                        <div className="text-right">
                          <p className="text-xl font-bold text-primary">
                            ₹{tent.price_per_night}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            per night
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {tent.min_capacity}-{tent.max_capacity} guests
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4 text-muted-foreground" />
                          <span>{tent.total_tents} tents</span>
                        </div>
                      </div>

                      {tent.amenities && tent.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tent.amenities.slice(0, 3).map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-xs"
                            >
                              {getAmenityIcon(amenity)}
                              <span>{amenity}</span>
                            </div>
                          ))}
                          {tent.amenities.length > 3 && (
                            <div className="px-2 py-1 bg-secondary rounded text-xs">
                              +{tent.amenities.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={() =>
                          onBookTent?.(
                            tent.id,
                            tent.tent_type,
                            tent.price_per_night
                          )
                        }
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      )}

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
