"use client"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Snowflake } from "lucide-react"
import Image from "next/image"
import disscount from "@/public/Homeasset/disscount.png"
import { useRouter } from "next/navigation"

export default function OfferCarousel({ heroApi, heroCurrentIndex = 0, heroCount = 0 }) {
  const [currentSlide, setCurrentSlide] = useState(0)
const router=useRouter()
const carouselItems = [
  {
    title: "Escape to Nature!",
    description: "Book lakeside villas, cottages, and camps in Lonavala & Pawna",
    cta: "Book your stay ↗",
    icon: disscount,
  },
  {
    title: "Limited-Time Deals!",
    description: "Get exclusive discounts on weekend getaways",
    cta: "Grab the offer ↗",
    icon: disscount,
  },
  {
    title: "All-In-One Getaway Hub",
    description: "Explore villas, camps, cottages & hotels in Malavli, Kamshet & more",
    cta: "Explore locations ↗",
    icon: disscount,
  },
];



 useEffect(() => {
    if (heroCurrentIndex !== undefined && heroCurrentIndex < carouselItems.length) {
      setCurrentSlide(heroCurrentIndex)
    }
  }, [heroCurrentIndex, carouselItems.length])

  const nextSlide = () => {
    const nextIndex = currentSlide === carouselItems.length - 1 ? 0 : currentSlide + 1
    setCurrentSlide(nextIndex)
    if (heroApi && nextIndex < heroCount) {
      heroApi.scrollTo(nextIndex)
    }
  }

  const prevSlide = () => {
    const prevIndex = currentSlide === 0 ? carouselItems.length - 1 : currentSlide - 1
    setCurrentSlide(prevIndex)
    if (heroApi && prevIndex < heroCount) {
      heroApi.scrollTo(prevIndex)
    }
  }

  return (
    <div className="absolute md:h-40 h-28 bg-[#00000033] backdrop-blur-xs w-full top-1/2 -translate-1/2 -translate-y-1/2 left-1/2  overflow-hidden ">
      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4 md:max-w-md max-w-xs flex flex-col items-center">
          <Image className="md:w-10 md:h-10 h-6 w-6 mr-4 md:mr-0" alt={carouselItems[currentSlide].title} src={carouselItems[currentSlide].icon}/>
          <h2 className="text-sm md:text-3xl font-bold ">{carouselItems[currentSlide].title}</h2>
          <p className="md:mb-4 mb-2 text-xs md:text-base">{carouselItems[currentSlide].description}</p>
          <button onClick={()=>router.push("/category/all")} className="inline-flex items-center text-white hover:underline font-medium text-xs md:text-lg">
            {carouselItems[currentSlide].cta}
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black hover:bg-black/80 rounded p-2 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="md:h-5 md:w-5 h-2 w-2" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-black/80 rounded p-2 text-white"
        aria-label="Next slide"
      >
        <ChevronRight className="md:h-5 md:w-5 h-2 w-2" />
      </button>

      {/* <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  )
}

