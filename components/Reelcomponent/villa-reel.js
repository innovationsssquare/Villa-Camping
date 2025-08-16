"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, Share2, Star, MapPin, Users, Wifi, Car, Coffee } from "lucide-react"

const villas = [
  {
    id: "1",
    name: "Luxury Beachfront Villa",
    price: 850,
    location: "Pawna, Lonavala",
    rating: 4.9,
    reviews: 127,
    guests: 8,
    amenities: ["WiFi", "Parking", "Pool"],
    videoUrl:
      "https://res.cloudinary.com/db60uwvhk/video/upload/v1753628901/villas/3bcd86b2-ca18-4ebd-a1b2-11f77c543277_b8fe00.mp4",
  },
  {
    id: "2",
    name: "Mountain Retreat Villa",
    price: 1200,
    location: "Malwali, Lonavala",
    rating: 4.8,
    reviews: 89,
    guests: 6,
    amenities: ["WiFi", "Parking", "Fireplace"],
    videoUrl:
      "https://res.cloudinary.com/db60uwvhk/video/upload/v1754769740/villas/7cb659ec-6dd6-44d1-a4c0-210d6ae6b81f_qpltjz.mp4",
  },
  {
    id: "3",
    name: "City Penthouse Villa",
    price: 950,
    location: "Kamshet, Lonavala",
    rating: 4.7,
    reviews: 203,
    guests: 4,
    amenities: ["WiFi", "Gym", "Concierge"],
    videoUrl: "https://res.cloudinary.com/db60uwvhk/video/upload/v1755329753/villas/100cb757-f0e4-41dd-8cb5-04ac141be6f2_ooqqmx.mp4",
  },
  {
    id: "4",
    name: "Tropical Paradise Villa",
    price: 750,
    location: "Lonavala, Pune",
    rating: 4.9,
    reviews: 156,
    guests: 10,
    amenities: ["WiFi", "Pool", "Beach Access"],
    videoUrl: "/videos/tropical-villa.mp4",
  },
]

export default function VillaReel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const containerRef = useRef(null)
  const videoRefs = useRef([])
  const startY = useRef(0)
  const currentY = useRef(0)
  const isScrolling = useRef(false)
  const controlsTimeoutRef = useRef()
  const swipeStartTime = useRef(0)

  useEffect(() => {
    // Store original body styles
    const originalStyle = window.getComputedStyle(document.body)
    const originalOverflow = originalStyle.overflow
    const originalHeight = originalStyle.height

    // Freeze body scroll
    document.body.style.overflow = "hidden"
    document.body.style.height = "100vh"
    document.documentElement.style.overflow = "hidden"
    document.documentElement.style.height = "100vh"

    // Prevent default touch behaviors on the document
    const preventScroll = (e) => {
      e.preventDefault()
    }

    document.addEventListener("touchmove", preventScroll, { passive: false })
    document.addEventListener("wheel", preventScroll, { passive: false })

    // Cleanup function to restore original scroll behavior
    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.height = originalHeight
      document.documentElement.style.overflow = ""
      document.documentElement.style.height = ""
      document.removeEventListener("touchmove", preventScroll)
      document.removeEventListener("wheel", preventScroll)
    }
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          if (isPlaying) {
            video.play().catch(() => {
              // Handle autoplay restrictions
            })
          } else {
            video.pause()
          }
        } else {
          video.pause()
          video.currentTime = 0
        }
      }
    })
  }, [currentIndex, isPlaying])

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY
    currentY.current = e.touches[0].clientY
    swipeStartTime.current = Date.now()
    isScrolling.current = false
  }

  const handleTouchMove = (e) => {
    e.preventDefault()
    if (!isScrolling.current) {
      currentY.current = e.touches[0].clientY
    }
  }

  const handleTouchEnd = () => {
    if (isScrolling.current) return

    const deltaY = startY.current - currentY.current
    const swipeTime = Date.now() - swipeStartTime.current
    const swipeVelocity = Math.abs(deltaY) / swipeTime

    const minSwipeDistance = 80
    const minSwipeVelocity = 0.3

    if (Math.abs(deltaY) > minSwipeDistance && swipeVelocity > minSwipeVelocity) {
      isScrolling.current = true

      if (deltaY > 0 && currentIndex < villas.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setIsPlaying(true)
      } else if (deltaY < 0 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1)
        setIsPlaying(true)
      }

      setTimeout(() => {
        isScrolling.current = false
      }, 600)
    }
  }

  const handleWheel = (e) => {
    if (isScrolling.current) return

    e.preventDefault()
    isScrolling.current = true

    if (e.deltaY > 0 && currentIndex < villas.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsPlaying(true)
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsPlaying(true)
    }

    setTimeout(() => {
      isScrolling.current = false
    }, 600)
  }

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying)
    setShowControls(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false)
    }, 2000)
  }

  const handleBookNow = (villa) => {
    alert(`Booking ${villa.name} for $${villa.price}/night`)
  }

  const handleShare = async (villa, event) => {
    event.stopPropagation()
    event.preventDefault()

    const shareData = {
      title: villa.name,
      text: `Check out this amazing ${villa.name} for just $${villa.price}/night!`,
      url: window.location.href,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        // toast({
        //   title: "Shared successfully!",
        //   description: "Villa reel has been shared.",
        // })
      } else {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
        // toast({
        //   title: "Link copied!",
        //   description: "Villa reel link has been copied to clipboard.",
        // })
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        // toast({
        //   title: "Share failed",
        //   description: "Unable to share this reel. Please try again.",
        //   variant: "destructive",
        // })
      }
    }
  }

  const [lastTap, setLastTap] = useState(0)
  const handleDoubleTap = () => {
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      console.log("Double tap detected!")
    } else {
      setLastTap(now)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden bg-black z-50">
      <div
        ref={containerRef}
        className="relative w-full h-full transition-transform duration-500 ease-out"
        style={{
          transform: `translateY(-${currentIndex * 100}vh)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {villas.map((villa, index) => (
          <div key={villa.id} className="relative w-full h-screen flex-shrink-0">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              src={villa.videoUrl}
              loop
              playsInline
              preload="metadata"
              onClick={handleVideoClick}
              onTouchEnd={handleDoubleTap}
            />
            <div className="absolute inset-0 bg-black/20" />

            {showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-4 animate-fade-in">
                  {isPlaying ? <Pause className="w-12 h-12 text-white" /> : <Play className="w-12 h-12 text-white" />}
                </div>
              </div>
            )}

            {!isPlaying && !showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-4">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            )}

            <div className="absolute hidden bottom-44 right-4 z-10">
              <Button
                onClick={(e) => handleShare(villa, e)}
                size="icon"
                className="bg-black/50 hover:bg-black/70 border-0 backdrop-blur-sm rounded-full w-12 h-12 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <Share2 className="w-5 h-5 text-white" />
              </Button>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ paddingBottom: `max(3rem, calc(2rem + env(safe-area-inset-bottom)))` }}
            >
              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

              <div className="relative p-3 space-y-2">
                {/* Location and Rating */}
                <div className="flex items-center gap-2 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">{villa.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-semibold">{villa.rating}</span>
                    <span className="text-xs text-white/70">({villa.reviews})</span>
                  </div>
                </div>

                {/* Villa Name */}
                <div className="flex items-center gap-2 text-white/90">
                <h2 className="text-xl font-bold text-white leading-tight tracking-tight">{villa.name}</h2>
                 <Button
                      onClick={() => handleBookNow(villa)}
                      className=" bg-white text-black font-bold py-4 text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
                      size="sm"
                    >
                      Book Now
                    </Button>

                </div>

                {/* Amenities and Guests */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-white/80">
                      <Users className="w-4 h-4" />
                      <span className="text-sm font-medium">{villa.guests} guests</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {villa.amenities.slice(0, 3).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {amenity === "WiFi" && <Wifi className="w-3 h-3 text-white/70" />}
                          {amenity === "Parking" && <Car className="w-3 h-3 text-white/70" />}
                          {amenity === "Pool" && <Coffee className="w-3 h-3 text-white/70" />}
                          {amenity === "Fireplace" && <Coffee className="w-3 h-3 text-white/70" />}
                          {amenity === "Gym" && <Coffee className="w-3 h-3 text-white/70" />}
                          {amenity === "Concierge" && <Coffee className="w-3 h-3 text-white/70" />}
                          {amenity === "Beach Access" && <Coffee className="w-3 h-3 text-white/70" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price and Booking Section */}
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">{villa.price}</span>
                    <span className="text-xs text-white/70 font-medium">per night</span>
                  </div>

                  {/* <div className="flex gap-3">
                    <Button
                      onClick={() => handleBookNow(villa)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-0"
                      size="lg"
                    >
                      Book Now
                    </Button>
                    <Button
                      onClick={(e) => handleShare(villa, e)}
                      size="lg"
                      className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {currentIndex === 0 && isPlaying && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 text-white/70 text-sm animate-bounce"
          style={{ bottom: `calc(16rem + env(safe-area-inset-bottom))` }}
        >
          Swipe up for more villas
        </div>
      )}
    </div>
  )
}
