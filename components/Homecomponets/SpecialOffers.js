"use client"
import { useState, useEffect } from "react";
import { Calendar, Users, Percent, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@heroui/react";

const offers = [
  {
    id: 1,
    title: "Early Bird Special",
    discount: "25% OFF",
    description: "Book 30 days in advance and save big on your villa stay",
    image: "https://images.unsplash.com/photo-1678889284805-5c86fb1dba5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWxsYSUyMGV4dGVyaW9yJTIwcG9vbHxlbnwxfHx8fDE3NTc3NzQxNTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    validUntil: "March 31, 2025",
    minStay: "2 nights",
    maxGuests: "8 guests",
    properties: "Selected villas",
    badge: "Limited Time"
  },
  {
    id: 2,
    title: "Weekend Getaway Package",
    discount: "20% OFF",
    description: "Perfect for quick escapes with complimentary breakfast included",
    image: "https://images.unsplash.com/photo-1606589572650-4a7a366424a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3R0YWdlJTIwY2FtcHNpdGUlMjBuYXR1cmV8ZW58MXx8fHwxNzU3Nzc0MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    validUntil: "Ongoing",
    minStay: "2 nights",
    maxGuests: "6 guests",
    properties: "Cottages & Campsites",
    badge: "Popular"
  },
  {
    id: 3,
    title: "Family Fun Package",
    discount: "30% OFF",
    description: "Special rates for families with kids activities and meals included",
    image: "https://images.unsplash.com/photo-1731336478850-6bce7235e320?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGJlZHJvb218ZW58MXx8fHwxNzU3Nzc0MTcyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    validUntil: "April 15, 2025",
    minStay: "3 nights",
    maxGuests: "10 guests",
    properties: "Family villas",
    badge: "Best Value"
  },
  {
    id: 4,
    title: "Monsoon Special",
    discount: "35% OFF",
    description: "Experience the magic of monsoons with cozy indoor amenities",
    image: "https://images.unsplash.com/photo-1623304027435-11c129173876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxhdmxpJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzU3Nzc0MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    validUntil: "June 30, 2025",
    minStay: "2 nights",
    maxGuests: "6 guests",
    properties: "All properties",
    badge: "Seasonal"
  }
];

export function SpecialOffers() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerView(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerView(2);
      } else {
        setItemsPerView(1);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= offers.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, offers.length - itemsPerView) : prev - 1
    );
  };

  const visibleOffers = offers.slice(currentIndex, currentIndex + itemsPerView);
  if (visibleOffers.length < itemsPerView) {
    visibleOffers.push(...offers.slice(0, itemsPerView - visibleOffers.length));
  }

  return (
    <section id="offers" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Special Offers & Packages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
           {` Don't miss out on these exclusive deals and seasonal packages`}
          </p>
        </div>

        {/* Carousel container */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex gap-6 transition-transform duration-300 ease-in-out">
              {visibleOffers.map((offer, index) => (
                <div 
                  key={`${offer.id}-${index}`}
                  className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3"
                >
                  <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    {/* Image with badge */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {offer.badge}
                      </div>
                      <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-2 rounded-xl font-bold">
                        {offer.discount}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-serif text-gray-900 mb-2">
                        {offer.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {offer.description}
                      </p>

                      {/* Offer details */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-emerald-600" />
                          Valid until {offer.validUntil}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                          Minimum {offer.minStay} stay
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-emerald-600" />
                          Up to {offer.maxGuests}
                        </div>
                      </div>

                      {/* Property type */}
                      <div className="text-xs text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 inline-block mb-4">
                        {offer.properties}
                      </div>

                      {/* CTA */}
                      <Button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white">
                        Book This Offer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full p-0 bg-white shadow-lg hover:shadow-xl z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full p-0 bg-white shadow-lg hover:shadow-xl z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center mt-8 gap-2">
          {Array.from({ length: Math.ceil(offers.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                Math.floor(currentIndex / itemsPerView) === index
                  ? 'bg-emerald-600 w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-3xl p-8 md:p-12">
          <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
            Ready to Save on Your Next Getaway?
          </h3>
          <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
           {` These offers won't last forever. Book now and create unforgettable memories 
            at unbeatable prices.`}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-emerald-800 hover:bg-gray-100 px-8 py-3"
          >
            View All Offers
          </Button>
        </div>
      </div>
    </section>
  );
}