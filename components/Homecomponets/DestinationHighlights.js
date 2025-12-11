"use client"

import Image from "next/image"
import { MapPin, Star, ChevronLeft, ChevronRight, HomeIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

const destinations = [
  {
    name: "Lonavala",
    description: "Misty hills and scenic viewpoints",
    image:
      "https://images.unsplash.com/photo-1672662943161-ab22ba412741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25hdmFsYSUyMGhpbGxzJTIwbW91bnRhaW5zfGVufDF8fHx8MTc1Nzc3NDEzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 28,
    rating: 4.8,
  },
  {
    name: "Pawna Lake",
    description: "Tranquil waters and sunset views",
    image:
      "https://images.unsplash.com/photo-1734076749900-7e304090008c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXduYSUyMGxha2UlMjBzdW5zZXR8ZW58MXx8fHwxNzU3Nzc0MTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 15,
    rating: 4.9,
  },
  {
    name: "Kamshet",
    description: "Adventure sports and paragliding",
    image:
      "https://images.unsplash.com/photo-1731420738764-730de624433d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYW1zaGV0JTIwcGFyYWdsaWRpbmclMjBoaWxsc3xlbnwxfHx8fDE3NTc3NzQxMzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 12,
    rating: 4.7,
  },
  {
    name: "Malavli",
    description: "Lush greenery and peaceful retreats",
    image:
      "https://images.unsplash.com/photo-1623304027435-11c129173876?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxhdmxpJTIwbmF0dXJlJTIwZ3JlZW58ZW58MXx8fHwxNzU3Nzc0MTM0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    properties: 8,
    rating: 4.6,
  },
]

function DestinationCard({ destination }) {
  return (
    <div className="group w-full md:w-auto  rounded-2xl overflow-hidden shadow-none hover:shadow-2xl transition-all duration-300  h-full border border-gray-200">
      <div className="relative md:h-56 h-36  overflow-hidden">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          fill="true"
          className="object-fill w-full h-36 md:h-48  group-hover:scale-110 transition-transform duration-300"
         
        />
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm font-medium text-white">{destination.rating}</span>
        </div>
      </div>

      <div className="p-2 sm:p-6">
      <div className="flex  items-center text-sm text-gray-400 mb-2">

       <MapPin className="w-4 h-4 mr-1 text-red-400 " />
        <h3 className="text-lg sm:text-xl  text-black ">{destination.name}</h3>
      </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 truncate">{destination.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <HomeIcon className="w-4 h-4 mr-1 text-black" />
            {destination.properties} properties
          </div>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
            <svg
              className="w-4 h-4 text-gray-300 group-hover:text-gray-900 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DestinationHighlights() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return (
    <section className=" sm:py-6 md:py-12 ">
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center  sm:mb-12 md:mb-4">
        <h2 className="md:text-4xl text-center font-medium text-foreground">
            Choose Your Destination
          </h2>
          <p className="text-xs sm:text-base md:text-sm text-gray-400 max-w-3xl mx-auto text-pretty">
           {` Discover the perfect getaway in Lonavala's most beautiful hill stations`}
          </p>
        </div>

        <div className=" relative">
         

          <Carousel
            opts={{
              align: "start",
            
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {destinations.map((destination, index) => (
                <CarouselItem key={destination.name} className="pl-2 md:pl-4 basis-3/5 md:basis-4/16">
                  <Card className="border-0 border-gray-200 shadow-none bg-transparent">
                    <CardContent className="p-0">
                      <DestinationCard destination={destination} />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          
          </Carousel>
        </div>

      
      </div>
    </section>
  )
}
