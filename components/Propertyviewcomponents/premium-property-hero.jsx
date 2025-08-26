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

  const sidebarImages = [
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  ];

  const allImages = [
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
    "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[70vh]">
          {/* Main Hero Image */}
          <div className="lg:col-span-3 relative rounded-2xl overflow-hidden group">
            <div
              className={`w-full h-full transition-all duration-300 ${
                isZoomed ? "cursor-grab" : "cursor-zoom-in"
              } ${isDragging ? "cursor-grabbing" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
            >
              <Image
                width={300}
                height={300}
                ref={imageRef}
                src={allImages[currentImageIndex] || "/placeholder.svg"}
                alt="Gardenéa Villa"
                className="w-full h-full object-cover transition-all duration-500 ease-out select-none"
                style={{
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
            <div className="absolute top-6 left-6 flex space-x-3">
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg">
                <span className="text-yellow-500">⭐</span>
                <span className="text-gray-800 font-semibold text-sm">
                  Best Rated
                </span>
              </div>
              <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <span className="text-gray-800 font-semibold text-sm">
                  Luxury
                </span>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="absolute top-6 right-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                className="bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg backdrop-blur-sm"
                onClick={handleZoomReset}
                disabled={zoomLevel === 1}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Zoom Level Indicator */}
            {isZoomed && (
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}

            {/* Navigation Arrows */}
            {!isZoomed && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </>
            )}

            {/* Zoom Instructions */}
            {!isZoomed && (
              <div className="absolute bottom-20 right-6 bg-black/70 text-white px-3 py-2 rounded-lg text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Double-click to zoom
              </div>
            )}

            {/* Bottom Action Buttons */}
            <div className="absolute bottom-6 left-6 flex space-x-4">
              <Button
                onClick={() => setIsVideoOpen(true)}
                className="bg-black/70 hover:bg-black/80 text-white backdrop-blur-sm border-0 rounded-full px-6 py-3 font-medium"
              >
                <Play className="w-4 h-4 mr-2" />
                View Video
              </Button>
              <Button
                variant="outline"
                className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm border-white/50 rounded-full px-6 py-3 font-medium"
                onClick={() => openGallery(0)}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                View Photos
              </Button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-6 right-6 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>

          {/* Sidebar Images */}
          <div className="lg:col-span-1 flex flex-col space-y-4">
            <div
              className="relative flex-1 rounded-2xl overflow-hidden group cursor-pointer bg-black"
              onClick={() => setIsVideoOpen(true)}
            >
              <img
                src={sidebarImages[0] || "/placeholder.svg"}
                alt="Property Video Tour"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Video Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 hover:bg-white rounded-full p-4 transition-all duration-200 group-hover:scale-110 shadow-lg">
                  <Play className="w-8 h-8 text-gray-800 ml-1" />
                </div>
              </div>

              {/* Video Label */}
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                Video Tour
              </div>
            </div>

            {/* Bottom Sidebar Image with More Count */}
            <div
              className="relative flex-1 rounded-2xl overflow-hidden group cursor-pointer"
              onClick={() => openGallery(2)}
            >
              <img
                src={sidebarImages[1] || "/placeholder.svg"}
                alt="Spa Pool Area"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

              {/* More Photos Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-3xl font-bold mb-1">+36</div>
                  <div className="text-lg font-medium">More</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Property Title and Details */}
      
      </div>

      <VideoDialog
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title="Gardenéa Villa - Property Tour"
      />

      {/* Image Gallery Dialog */}
      <ImageGalleryDialog
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={allImages}
        initialIndex={galleryStartIndex}
      />
    </div>
  );
}
