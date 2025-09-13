"use client"
import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@heroui/react";

const testimonialss = [
  {
    id: 1,
    name: "Priya & Rajesh Sharma",
    location: "Mumbai",
    rating: 5,
    text: "Our anniversary stay at The Villa Camp was absolutely magical. The villa overlooking Pawna Lake was pristine, and the sunset views were breathtaking. The staff went above and beyond to make our celebration special.",
    experience: "Romantic Getaway",
    stayDate: "December 2024"
  },
  {
    id: 2,
    name: "The Patel Family",
    location: "Pune",
    rating: 5,
    text: "Perfect family vacation! The kids loved the spacious villa in Lonavala. Clean, safe, and with amazing amenities. The host was incredibly helpful with local recommendations. We'll definitely be back!",
    experience: "Family Vacation",
    stayDate: "November 2024"
  },
  {
    id: 3,
    name: "Arjun Mehta",
    location: "Delhi",
    rating: 5,
    text: "Adventure trip to Kamshet was incredible! The campsite was well-organized, and the paragliding arrangements were seamless. Great value for money and unforgettable memories.",
    experience: "Adventure Trip",
    stayDate: "October 2024"
  },
  {
    id: 4,
    name: "Kavya & Friends",
    location: "Bangalore",
    rating: 4,
    text: "Girls trip to Malavli was so much fun! The villa was beautiful, well-maintained, and had everything we needed. Loved the peaceful environment and the hospitality.",
    experience: "Friends Trip",
    stayDate: "September 2024"
  },
  {
    id: 5,
    name: "Nikhil Agarwal",
    location: "Hyderabad",
    rating: 5,
    text: "Business retreat at the luxury villa was perfect. Professional setup, excellent Wi-Fi, and serene environment helped our team focus and bond. Highly recommended for corporate stays.",
    experience: "Business Retreat",
    stayDate: "August 2024"
  }
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialss.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonialss.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonialss.length) % testimonialss.length);
    setIsAutoPlaying(false);
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 bg-gradient-to-b hidden md:block from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
            Guest Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Read what our guests say about their unforgettable experiences with us
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-emerald-100" />
            
            <div className="relative z-10">
              {/* Rating */}
              <div className="flex items-center justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${
                      i < testimonialss[currentIndex].rating 
                        ? 'text-amber-400 fill-current' 
                        : 'text-gray-200'
                    }`} 
                  />
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-xl md:text-2xl text-gray-700 text-center leading-relaxed mb-8 font-serif">
                "{testimonialss[currentIndex].text}"
              </blockquote>

              {/* Guest info */}
              <div className="text-center">
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {testimonialss[currentIndex].name}
                </h4>
                <p className="text-emerald-600 mb-2">
                  {testimonialss[currentIndex].location}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span>{testimonialss[currentIndex].experience}</span>
                  <span>•</span>
                  <span>{testimonialss[currentIndex].stayDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <Button
              variant="outline"
              size="sm"
              onPress={prevTestimonial}
              className="w-12 h-12 rounded-full p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots indicator */}
            <div className="flex items-center gap-2">
              {testimonialss.map((_, index) => (
                <Button
                  key={index}
                  onPress={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-emerald-600 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onPress={nextTestimonial}
              className="w-12 h-12 rounded-full p-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Review summary */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <Star className="w-5 h-5 text-amber-400 fill-current" />
            <span className="font-medium">4.8 out of 5</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Based on 150+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}