"use client";

import { useState, useRef } from "react";
import {
  Play,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageGalleryDialog from "./image-gallery-dialog";
import VideoDialog from "./video-dialog";
import Image from "next/image";
import { useVilla } from "@/lib/context/VillaContext";

export default function PremiumPropertyHero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const imageRef = useRef(null);
  const villa = useVilla();

;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % villa?.images?.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + villa?.images?.length) % villa?.images?.length
    );
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setIsZoomed(false);
      setZoomPosition({ x: 0, y: 0 });
    }
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (isZoomed) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - zoomPosition.x,
        y: e.clientY - zoomPosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && isZoomed) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = (zoomLevel - 1) * 200;
      const maxY = (zoomLevel - 1) * 150;

      setZoomPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e) => {
    if (!isZoomed) {
      const rect = imageRef.current?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 200;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 150;
        setZoomPosition({ x, y });
        setZoomLevel(2);
        setIsZoomed(true);
      }
    } else {
      handleZoomReset();
    }
  };

  const openGallery = (startIndex = 0) => {
    setGalleryStartIndex(startIndex);
    setIsGalleryOpen(true);
  };

  return (
    <div className="h-auto bg-gray-50">
      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-2 lg:px-4 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 h-[60vh] sm:h-[65vh] lg:h-[70vh] min-h-[420px] max-h-[640px] overflow-hidden">
          {/* Main Hero Image */}
          <div className="md:col-span-3 lg:col-span-3 relative rounded-2xl overflow-hidden group h-full min-h-0 bg-neutral-900">
            <div
              className={`absolute inset-0 overflow-hidden transition-all duration-300 ${
                isZoomed ? "cursor-grab" : "cursor-zoom-in"
              } ${isDragging ? "cursor-grabbing" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
            >
              <img
                ref={imageRef}
                src={villa?.images?.[currentImageIndex] || "/placeholder.svg"}
                alt={villa?.name || "Property photo"}
                className="w-full h-full object-cover transition-all duration-500 ease-out select-none"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${zoomLevel}) translate(${
                    zoomPosition.x / zoomLevel
                  }px, ${zoomPosition.y / zoomLevel}px)`,
                  transformOrigin: "center center",
                }}
                draggable={false}
              />
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>

            {/* Badges */}
            <div className="absolute top-6 left-6 flex space-x-2.5 z-10">
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-md border border-white/60">
                <span className="text-amber-500 text-xs">★</span>
                <span className="text-gray-900 font-bold text-xs">
                  Best Rated
                </span>
              </div>
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-white/60">
                <span className="text-gray-900 font-bold text-xs">
                  Luxury Stay
                </span>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-6 right-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 hover:text-[#ff6900] rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 hover:text-[#ff6900] rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 hover:text-[#ff6900] rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomReset}
                disabled={zoomLevel === 1}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Level Indicator */}
            {isZoomed && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}

            {/* Navigation Arrows */}
            {!isZoomed && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 hover:text-[#ff6900]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 hover:text-[#ff6900]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Zoom Instructions */}
            {!isZoomed && (
              <div className="absolute bottom-20 right-6 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                Double-click to zoom
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="absolute bottom-6 left-6 flex space-x-3 z-10">
              <Button
                onClick={() => setIsVideoOpen(true)}
                className="bg-black/80 hover:bg-black text-white backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 font-semibold text-xs shadow-lg transition-transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 mr-2 text-[#ff6900] fill-current" />
                View Video
              </Button>
              <Button
                variant="outline"
                className="bg-white/95 hover:bg-white text-gray-900 backdrop-blur-md border-white/70 rounded-full px-5 py-2.5 font-semibold text-xs shadow-lg transition-transform active:scale-95 hover:text-[#ff6900]"
                onClick={() => openGallery(0)}
              >
                <ImageIcon className="w-3.5 h-3.5 mr-2 text-[#ff6900]" />
                View Photos
              </Button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 right-6 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm z-10 border border-white/10">
              {currentImageIndex + 1} / {villa?.images?.length || 1}
            </div>
          </div>

          {/* Sidebar Images */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4 h-full min-h-0">
            <div
              className="relative flex-1 min-h-0 rounded-2xl overflow-hidden group cursor-pointer bg-neutral-900"
              onClick={() => setIsVideoOpen(true)}
            >
              <img
                src={villa?.images?.[0] || "/placeholder.svg"}
                alt="Property Video Tour"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Video Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/95 hover:bg-white rounded-full p-4 transition-all duration-300 group-hover:scale-110 shadow-xl group-hover:shadow-orange-500/25 pointer-events-auto">
                  <Play className="w-7 h-7 text-gray-900 group-hover:text-[#ff6900] ml-1 transition-colors fill-current" />
                </div>
              </div>

              {/* Video Label */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-medium backdrop-blur-sm border border-white/10 pointer-events-none">
                Video Tour
              </div>
            </div>

            {/* Bottom Sidebar Image with More Count */}
            {(villa?.images?.length || 0) > 1 && (
              <div
                className="relative flex-1 min-h-0 rounded-2xl overflow-hidden group cursor-pointer bg-neutral-900"
                onClick={() => openGallery(1)}
              >
                <img
                  src={villa?.images?.[1] || villa?.images?.[0] || "/placeholder.svg"}
                  alt="Property photos"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>

                {/* More Photos Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-white">
                    <div className="text-3xl font-bold mb-1">
                      +{(villa?.images?.length || 0)}
                    </div>
                    <div className="text-lg font-medium">More</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Property Title and Details */}
      
      </div>

      <VideoDialog
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={villa?.reelVideo}
        title={villa?.name}
      />

      {/* Image Gallery Dialog */}
      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={villa?.images}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}
