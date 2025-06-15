"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Avatar from "@/public/Aboutusasset/Avatar.png"
export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef(null)
  
  const testimonials = [
    {
      id: 1,
      name: "Sneha Manohar",
      title: "Boutique Owner",
      text: "Brindah Has Completely Transformed My Tailoring Business! The Quality Of Their Products Is Top-Notch, And Ordering In Bulk Is So Easy. Fast Delivery And Eco-Friendly Options Make It My Go-To Platform!",
      rating: 5,
      image:Avatar
    },
    {
      id: 2,
      name: "Sneha Manohar",
      title: "Boutique Owner",
      text: "Brindah Has Completely Transformed My Tailoring Business! The Quality Of Their Products Is Top-Notch, And Ordering In Bulk Is So Easy. Fast Delivery And Eco-Friendly Options Make It My Go-To Platform!",
      rating: 5,
      image: Avatar
    },
    {
      id: 3,
      name: "Sneha Manohar",
      title: "Boutique Owner",
      text: "Brindah Has Completely Transformed My Tailoring Business! The Quality Of Their Products Is Top-Notch, And Ordering In Bulk Is So Easy. Fast Delivery And Eco-Friendly Options Make It My Go-To Platform!",
      rating: 5,
      image:Avatar
    },
    {
      id: 4,
      name: "Sneha Manohar",
      title: "Boutique Owner",
      text: "Brindah Has Completely Transformed My Tailoring Business! The Quality Of Their Products Is Top-Notch, And Ordering In Bulk Is So Easy. Fast Delivery And Eco-Friendly Options Make It My Go-To Platform!",
      rating: 5,
      image:Avatar
    }
  ]

  const nextSlide = () => {
    if (currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(testimonials.length - 1)
    }
  }

  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentIndex * (carouselRef.current.offsetWidth / 2.5)
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }, [currentIndex])

  return (
    <div className="bg-gray-50 py-16">
      <div className="w-full mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
          {/* Left side - Title and Controls */}
          <div className="w-full md:w-1/3 space-y-6">
            <div>
              <h2 className="text-2xl font-medium text-gray-800 mb-4">Feedbacks from our Customers!</h2>
              <p className="text-gray-600 text-sm">
              {`At Brindah, we prioritize quality, reliability, and a seamless shopping experience. 
                From premium tailoring essentials to fast and secure delivery, we ensure every 
                order meets your expectations. Your satisfaction is our success!`}
              </p>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex space-x-4">
              <button 
                onClick={prevSlide}
                className="w-12 h-12 flex items-center justify-center bg-[#106C83] text-white rounded-md hover:bg-[#106C83] cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="w-12 h-12 flex items-center justify-center bg-[#106C83] text-white rounded-md hover:bg-[#106C83] cursor-pointer transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Right side - Testimonial Cards */}
          <div 
            className="w-full md:w-2/3 overflow-hidden"
          >
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={`flex-shrink-0 w-full md:w-[calc(40%-12px)] snap-start`}
                >
                  <div className=" rounded-lg p-6 h-full cardgradient">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="relative w-10 h-10 overflow-hidden rounded-full bg-yellow-400">
                        <Image 
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4 ">{testimonial.text}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
