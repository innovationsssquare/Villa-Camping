import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Bed, Bath, Square, MapPin, Camera, Eye, Heart, Share, Phone } from 'lucide-react';





export const PropertyCard = ({ property, onClose, compact = false }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const images = property.images || [property.image];

  if (compact) {
    return (
      <Card className="w-full bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in">
        <CardContent className="p-0">
          <div className="flex">
            <img
              src={property.image}
              alt={property.title}
              className="w-24 h-24 object-cover"
            />
            <div className="p-4 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg font-bold text-villa-primary">
                  ₹{property.price >= 1000000 ? `${(property.price / 1000000).toFixed(1)}M` : `${(property.price / 1000).toFixed(0)}K`}
                </span>
                <div className="flex gap-1">
                  {property.isHot && <Badge className="bg-red-500 text-white text-xs">🔥</Badge>}
                  {property.isDeal && <Badge className="bg-green-500 text-white text-xs">💰</Badge>}
                </div>
              </div>
              <h4 className="font-semibold text-sm text-villa-text mb-1 line-clamp-1">
                {property.title}
              </h4>
              <div className="flex items-center text-xs text-villa-text-muted mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="line-clamp-1">{property.address}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center">
                  <Bed className="w-3 h-3 mr-1" />
                  <span>{property.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-3 h-3 mr-1" />
                  <span>{property.baths}</span>
                </div>
                <div className="flex items-center">
                  <Square className="w-3 h-3 mr-1" />
                  <span>{property.sqft}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden animate-scale-in h-[60vh] mx-auto">
      <CardContent className="p-0">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        <div className="relative">
          {images.length > 1 ? (
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image, index) => (
                  <CarouselItem key={index}>
                    <img
                      src={image}
                      alt={`${property.title} - Image ${index + 1}`}
                      className="w-full h-56 object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-56 object-cover"
            />
          )}
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {property.isHot && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold animate-pulse">
                🔥 Hot
              </Badge>
            )}
            {property.isDeal && (
              <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold">
                💰 Great Deal
              </Badge>
            )}
            {property.has3DTour && (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-semibold flex items-center gap-1">
                <Camera className="w-3 h-3" />
                3D Tour
              </Badge>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-80">
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-villa-primary">
                ₹{property.price.toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-villa-text">
                {property.title}
              </h3>
              <Badge variant="outline" className="text-villa-text-muted capitalize">
                {property.type}
              </Badge>
            </div>
            
            <div className="flex items-center text-villa-text-muted mb-4">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{property.address}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bed className="w-5 h-5 mx-auto mb-1 text-villa-primary" />
                <div className="text-lg font-semibold">{property.beds}</div>
                <div className="text-xs text-villa-text-muted">Bedrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Bath className="w-5 h-5 mx-auto mb-1 text-villa-primary" />
                <div className="text-lg font-semibold">{property.baths}</div>
                <div className="text-xs text-villa-text-muted">Bathrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Square className="w-5 h-5 mx-auto mb-1 text-villa-primary" />
                <div className="text-lg font-semibold">{property.sqft}</div>
                <div className="text-xs text-villa-text-muted">Sq Ft</div>
              </div>
            </div>
            
            {property.description && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-sm text-villa-text-muted leading-relaxed">
                  {property.description}
                </p>
              </div>
            )}
            
            {property.features && property.features.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button className="flex-1 bg-villa-primary hover:bg-villa-primary/90">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};