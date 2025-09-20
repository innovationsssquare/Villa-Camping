import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from './PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, MapPin, X, Filter } from 'lucide-react';


export const PropertiesListDrawer = ({ 
  isOpen,
  onOpenChange,
  properties, 
  location,
  totalCount 
}) => {
  const [sortBy, setSortBy] = useState('price-low');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'beds':
        return b.beds - a.beds;
      case 'size':
        return b.sqft - a.sqft;
      default:
        return 0;
    }
  });

  const filteredProperties = selectedType === 'all' 
    ? sortedProperties 
    : sortedProperties.filter(property => property.type === selectedType);

  const propertyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'villa', label: 'Villa' },
    { value: 'house', label: 'House' },
    { value: 'apartment', label: 'Apartment' }
  ];

  const sortOptions = [
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'beds', label: 'Most Bedrooms' },
    { value: 'size', label: 'Largest First' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-full border-none fixed bottom-0 left-0 right-0 p-0 w-full overflow-hidden">
          <div className="flex flex-col h-full">
            <SheetHeader className="p-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-villa-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-villa-primary" />
                  </div>
                  <div>
                    <SheetTitle className="text-left">
                      {properties.length > 0 ? `${totalCount.toLocaleString()} Properties` : 'No Search Property'}
                    </SheetTitle>
                    {location && properties.length > 0 && (
                      <p className="text-sm text-villa-text-muted mt-1">in {location}</p>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>
            
            {properties.length > 0 ? (
              <>
                {/* Filters and Sort */}
                <div className="px-3 py-4 border-b border-gray-200 bg-gray-50 w-full">
                  <div className="grid grid-cols-2 gap-2 items-center w-full ">
                    <div className="w-full ">
                      <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                        <SelectTrigger className="bg-white border-gray-200 w-full">
                          <SlidersHorizontal className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=" w-full">
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="bg-white border-gray-200 w-full">
                          <Filter className="w-4 h-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-villa-text-muted">
                      Showing {filteredProperties.length} of {totalCount} properties
                    </div>
                    {/* <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {filteredProperties.filter(p => p.isHot).length} Hot
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {filteredProperties.filter(p => p.isDeal).length} Deals
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {filteredProperties.filter(p => p.has3DTour).length} 3D Tours
                      </Badge>
                    </div> */}
                  </div>
                </div>
                
                <ScrollArea className="flex-1 h-[70vh] pb-8">
                  <div className="p-3 space-y-4">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        // onClick={() => setSelectedProperty(property)}
                        className="cursor-pointer"
                      >
                        <PropertyCard
                          property={property}
                          compact={true}
                        />
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="p-6 text-center mt-40">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-villa-text-muted text-sm">
                  No properties found for your search
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Property Detail Overlay */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <PropertyCard
              property={selectedProperty}
              onClose={() => setSelectedProperty(null)}
            />
          </div>
        </div>
      )}
    </>
  );
};