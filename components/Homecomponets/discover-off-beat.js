"use client"
import { Button } from "@/components/ui/button"
import { CardStack } from "@/components/ui/card-stack"
import  { Card } from "@/components/ui/card-stack"
import { MapPin, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

const destinations = [
  {
    id: 1,
    name: "Diu",
    designation: "Portuguese Heritage Island",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ttAlxAjGL6WEtXnDqWQY6QIWLBVTOZ.png",
    description:
      "Once a Portuguese colony, Diu is a small island city dotted with beaches from all sides. It also showcases a rich heritage through its forts, churches, and museums.",
    visited: false,
  },
  {
    id: 2,
    name: "Hampi",
    designation: "UNESCO World Heritage Site",
    image: "/ancient-ruins-of-hampi-with-boulder-landscape.jpg",
    description:
      "A UNESCO World Heritage Site, Hampi is an ancient village with fascinating ruins, boulder landscapes, and rich history dating back to the Vijayanagara Empire.",
    visited: false,
  },
  {
    id: 3,
    name: "Spiti Valley",
    designation: "Cold Desert Mountain Valley",
    image: "/spiti-valley-mountain-landscape-with-monastery.jpg",
    description:
      "A cold desert mountain valley located high in the Himalayas, known for its Buddhist monasteries, ancient culture, and breathtaking landscapes.",
    visited: true,
  },
  {
    id: 4,
    name: "Majuli",
    designation: "World's Largest River Island",
    image: "/majuli-island-river-landscape-with-traditional-hut.jpg",
    description:
      "The world's largest river island in Assam, famous for its vibrant culture, traditional crafts, and unique ecosystem along the Brahmaputra River.",
    visited: false,
  },
]

const cards = destinations.map((destination) => ({
  id: destination.id,
  name: destination.name,
  designation: destination.designation,
  content: (
    <div className="h-full flex flex-col">
      <div className="relative flex-1 mb-4">
        <img
          src={destination.image || "/placeholder.svg"}
          alt={destination.name}
          className="w-full h-32 object-cover rounded-2xl"
        />
        <div className="absolute bottom-2 left-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-black/70 text-white hover:bg-black/80 backdrop-blur-sm text-xs px-2 py-1 h-auto"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Explore {destination.name}
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-neutral-600 dark:text-neutral-300 text-sm mb-3 line-clamp-3">{destination.description}</p>
        <div className="flex gap-2">
          <Button
            variant={destination.visited ? "default" : "outline"}
            size="sm"
            className={`flex-1 text-xs h-8 ${
              destination.visited ? "bg-blue-500 hover:bg-blue-600" : "border-blue-500 text-blue-500 hover:bg-blue-50"
            }`}
          >
            <MapPin className="h-3 w-3 mr-1" />
            {destination.visited ? "Visited" : "Mark Visited"}
          </Button>
          <Button variant="default" size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-xs h-8">
            <Search className="h-3 w-3 mr-1" />
            Explore
          </Button>
        </div>
      </div>
    </div>
  ),
}))

export default function DiscoverOffBeat() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="max-w-md mx-auto">
      

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <div className="mx-4 text-gray-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Discover Off-Beat</h1>
          <p className="text-gray-600 text-sm px-4">
            Explore new places with our interactive card stack.
          </p>
        </div>

        <div className="flex justify-center items-center mb-8">
          <CardStack items={cards} offset={10} scaleFactor={0.06} />
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-500 text-sm">
          <p>Cards automatically cycle through destinations</p>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}
