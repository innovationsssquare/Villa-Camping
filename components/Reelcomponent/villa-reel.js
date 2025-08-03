"use client";

import React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const villas = [
  {
    id: "1",
    name: "Luxury Beachfront Villa",
    price: 850,
    videoUrl: "/videos/beach-villa.mp4",
  },
  {
    id: "2",
    name: "Mountain Retreat Villa",
    price: 1200,
    videoUrl: "/videos/mountain-villa.mp4",
  },
  {
    id: "3",
    name: "City Penthouse Villa",
    price: 950,
    videoUrl: "/videos/city-villa.mp4",
  },
  {
    id: "4",
    name: "Tropical Paradise Villa",
    price: 750,
    videoUrl: "/videos/tropical-villa.mp4",
  },
];

export default function VillaReel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const startY = useRef(0);
  const currentY = useRef(0);
  const isScrolling = useRef(false);
  const controlsTimeoutRef = useRef();

  // Auto-play current video and pause others
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          if (isPlaying) {
            video.play().catch(() => {
              // Handle autoplay restrictions
            });
          } else {
            video.pause();
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, isPlaying]);

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isScrolling.current) {
      currentY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    if (isScrolling.current) return;

    const deltaY = startY.current - currentY.current;
    const threshold = 50;

    if (Math.abs(deltaY) > threshold) {
      isScrolling.current = true;

      if (deltaY > 0 && currentIndex < villas.length - 1) {
        // Swipe up - next reel
        setCurrentIndex((prev) => prev + 1);
        setIsPlaying(true); // Auto-play next video
      } else if (deltaY < 0 && currentIndex > 0) {
        // Swipe down - previous reel
        setCurrentIndex((prev) => prev - 1);
        setIsPlaying(true); // Auto-play previous video
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    }
  };

  const handleWheel = (e) => {
    if (isScrolling.current) return;

    e.preventDefault();
    isScrolling.current = true;

    if (e.deltaY > 0 && currentIndex < villas.length - 1) {
      // Scroll down - next reel
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      // Scroll up - previous reel
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 500);
  };

  const handleVideoClick = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);

    // Hide controls after 2 seconds
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const handleBookNow = (villa) => {
    alert(`Booking ${villa.name} for $${villa.price}/night`);
  };

  // Handle double tap to like (optional advanced feature)
  const [lastTap, setLastTap] = useState(0);
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Double tap detected - could add like functionality here
      console.log("Double tap detected!");
    } else {
      setLastTap(now);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
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
          <div
            key={villa.id}
            className="relative w-full h-screen flex-shrink-0"
          >
            {/* Video Background */}
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

            {/* Play/Pause Control Overlay */}
            {showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-4 animate-fade-in">
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white" />
                  ) : (
                    <Play className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            )}

            {/* Permanent Play/Pause indicator when paused */}
            {!isPlaying && !showControls && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 rounded-full p-4">
                  <Play className="w-12 h-12 text-white" />
                </div>
              </div>
            )}

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
              <div className="text-white space-y-4">
                {/* Villa Name */}
                <h2 className="text-2xl font-bold leading-tight">
                  {villa.name}
                </h2>

                {/* Book Button */}
                <Button
                  onClick={() => handleBookNow(villa)}
                  className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-4 text-lg rounded-xl"
                  size="lg"
                >
                  Book Now - ${villa.price}/night
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll Hint */}
      {currentIndex === 0 && isPlaying && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-sm animate-bounce">
          Swipe up for more villas
        </div>
      )}
    </div>
  );
}
