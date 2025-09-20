import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from './PropertyCard';
import { Search, MapPin, Clock, TrendingUp, Filter, X } from 'lucide-react';





const SAMPLE_LOCATIONS = [
  { id: '1', name: 'Lonavala', type: 'city', coordinates: [73.4062, 18.7537], propertyCount: 45 },
  { id: '2', name: 'Khandala', type: 'area', coordinates: [73.3931, 18.7322], propertyCount: 23 },
  { id: '3', name: 'Pune Hills', type: 'area', coordinates: [73.8567, 18.5204], propertyCount: 67 },
  { id: '4', name: 'Karjat', type: 'city', coordinates: [73.3228, 18.9109], propertyCount: 34 },
  { id: '5', name: 'Tiger Point', type: 'landmark', coordinates: [73.4170, 18.7480], propertyCount: 12 },
  { id: '6', name: 'Rajmachi Point', type: 'landmark', coordinates: [73.4500, 18.7200], propertyCount: 8 },
];

const SAMPLE_SEARCH_PROPERTIES = [
  {
    id: '1',
    price: 785000,
    title: 'Luxury Villa in Lonavala',
    address: 'Lonavala Hills, Maharashtra 410403',
    beds: 4,
    baths: 4,
    sqft: 2819,
    coordinates: [73.4062, 18.7537] ,
    image: '/src/assets/villa-1.jpg',
    type: 'villa',
    features: ['Pool', 'Garden', 'Mountain View'],
    isHot: true,
    has3DTour: true,
    description: 'Beautiful luxury villa with stunning mountain views and modern amenities.'
  },
  {
    id: '2',
    price: 332000,
    title: 'Cozy Retreat Villa',
    address: 'Pune Hills, Maharashtra 411057',
    beds: 3,
    baths: 2,
    sqft: 1850,
    coordinates: [73.8567, 18.5204] ,
    image: '/src/assets/villa-2.jpg',
    type: 'villa',
    features: ['Garden', 'Parking'],
    isHot: true,
    description: 'Perfect retreat villa for weekend getaways with family.'
  }
];

const RECENT_SEARCHES = [
  'Luxury Villa Lonavala',
  'Beach House Khandala', 
  'Mountain View Properties'
];

const TRENDING_SEARCHES = [
  'Villa with Pool',
  'Pet Friendly Houses',
  '3 BHK Apartments'
];

export const SearchDrawer = ({ isOpen, onOpenChange, onLocationSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('locations');
  const [filteredLocations, setFilteredLocations] = useState(SAMPLE_LOCATIONS);
  const [filteredProperties, setFilteredProperties] = useState(SAMPLE_SEARCH_PROPERTIES);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setFilteredLocations(
        SAMPLE_LOCATIONS.filter(location =>
          location.name.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredProperties(
        SAMPLE_SEARCH_PROPERTIES.filter(property =>
          property.title.toLowerCase().includes(query.toLowerCase()) ||
          property.address.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredLocations(SAMPLE_LOCATIONS);
      setFilteredProperties(SAMPLE_SEARCH_PROPERTIES);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-left">Search & Explore</SheetTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>
          
          <div className="px-6 py-4 border-b">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations or properties..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'locations' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('locations')}
                className="flex-1"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Locations
              </Button>
              <Button
                variant={activeTab === 'properties' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('properties')}
                className="flex-1"
              >
                <Filter className="w-4 h-4 mr-2" />
                Properties
              </Button>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-6">
              {activeTab === 'locations' ? (
                <>
                  {searchQuery ? (
                    <div>
                      <h3 className="font-semibold mb-3 text-villa-text">
                        Search Results ({filteredLocations.length})
                      </h3>
                      <div className="space-y-2">
                        {filteredLocations.map((location) => (
                          <button
                            key={location.id}
                            onClick={() => {
                              onLocationSelect(location);
                              onOpenChange(false);
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-villa-primary/20"
                          >
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-villa-primary/10 rounded-full flex items-center justify-center mr-3">
                                <MapPin className="w-4 h-4 text-villa-primary" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-villa-text">{location.name}</div>
                                <div className="text-sm text-villa-text-muted capitalize flex items-center">
                                  {location.type}
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    {location.propertyCount} properties
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Popular Locations */}
                      <div>
                        <h3 className="font-semibold mb-3 text-villa-text">Popular Locations</h3>
                        <div className="space-y-2">
                          {SAMPLE_LOCATIONS.slice(0, 4).map((location) => (
                            <button
                              key={location.id}
                              onClick={() => {
                                onLocationSelect(location);
                                onOpenChange(false);
                              }}
                              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-villa-primary/20"
                            >
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-villa-primary/10 rounded-full flex items-center justify-center mr-3">
                                  <MapPin className="w-4 h-4 text-villa-primary" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium text-villa-text">{location.name}</div>
                                  <div className="text-sm text-villa-text-muted capitalize">
                                    {location.type}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {location.propertyCount} properties
                              </Badge>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recent Searches */}
                      <div>
                        <h3 className="font-semibold mb-3 text-villa-text flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Recent Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {RECENT_SEARCHES.map((search, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-sm"
                              onClick={() => handleSearch(search)}
                            >
                              {search}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Trending */}
                      <div>
                        <h3 className="font-semibold mb-3 text-villa-text flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Trending Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {TRENDING_SEARCHES.map((search, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-sm"
                              onClick={() => handleSearch(search)}
                            >
                              {search}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div>
                  <h3 className="font-semibold mb-3 text-villa-text">
                    Properties ({filteredProperties.length})
                  </h3>
                  <div className="space-y-3">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        compact={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};