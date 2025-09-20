import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter, SlidersHorizontal, X, Home, Building, TreePine } from 'lucide-react';



const PROPERTY_TYPES = [
  { id: 'villa', label: 'Villa', icon: Home },
  { id: 'apartment', label: 'Apartment', icon: Building },
  { id: 'house', label: 'House', icon: TreePine },
];

const AMENITIES = [
  'Swimming Pool',
  'Garden',
  'Parking',
  'Gym',
  'Security',
  'Power Backup',
  'Elevator',
  'Balcony',
  'AC',
  'Furnished',
  'Pet Friendly',
  'Mountain View'
];

const LOCATIONS = [
  'Lonavala',
  'Khandala',
  'Pune Hills',
  'Karjat',
  'Tiger Point',
  'Rajmachi Point'
];

export const FilterDrawer = ({ isOpen, onOpenChange }) => {
  const [priceRange, setPriceRange] = useState([100000, 1000000]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [bedrooms, setBedrooms] = useState([1, 5]);
  const [bathrooms, setBathrooms] = useState([1, 4]);

  const toggleType = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleLocation = (location) => {
    setSelectedLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([100000, 1000000]);
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setSelectedLocations([]);
    setBedrooms([1, 5]);
    setBathrooms([1, 4]);
  };

  const applyFilters = () => {
    console.log('Applied filters:', {
      priceRange,
      selectedTypes,
      selectedAmenities,
      selectedLocations,
      bedrooms,
      bathrooms
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </SheetTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-villa-primary"
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-8">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-4 text-villa-text">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={2000000}
                    min={50000}
                    step={10000}
                    className="mb-4"
                  />
                  <div className="flex justify-between text-sm text-villa-text-muted">
                    <span>₹{(priceRange[0] / 1000).toFixed(0)}K</span>
                    <span>₹{(priceRange[1] / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Property Type */}
              <div>
                <h3 className="font-semibold mb-4 text-villa-text">Property Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {PROPERTY_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          selectedTypes.includes(type.id)
                            ? 'border-villa-primary bg-villa-primary/5'
                            : 'border-gray-200 hover:border-villa-primary/50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedTypes.includes(type.id) ? 'text-villa-primary' : 'text-gray-500'
                        }`} />
                        <div className={`text-sm font-medium ${
                          selectedTypes.includes(type.id) ? 'text-villa-primary' : 'text-gray-700'
                        }`}>
                          {type.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Bedrooms & Bathrooms */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4 text-villa-text">Bedrooms</h3>
                  <div className="px-2">
                    <Slider
                      value={bedrooms}
                      onValueChange={setBedrooms}
                      max={6}
                      min={1}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-villa-text-muted">
                      <span>{bedrooms[0]} BHK</span>
                      <span>{bedrooms[1]}+ BHK</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4 text-villa-text">Bathrooms</h3>
                  <div className="px-2">
                    <Slider
                      value={bathrooms}
                      onValueChange={setBathrooms}
                      max={5}
                      min={1}
                      step={1}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-villa-text-muted">
                      <span>{bathrooms[0]}</span>
                      <span>{bathrooms[1]}+</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Locations */}
              <div>
                <h3 className="font-semibold mb-4 text-villa-text">Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((location) => (
                    <Badge
                      key={location}
                      variant={selectedLocations.includes(location) ? "default" : "outline"}
                      className="cursor-pointer px-3 py-2 text-sm"
                      onClick={() => toggleLocation(location)}
                    >
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-4 text-villa-text">Amenities</h3>
                <div className="grid grid-cols-2 gap-3">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Apply Button */}
          <div className="p-6 border-t bg-white">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-villa-primary hover:bg-villa-primary/90"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};