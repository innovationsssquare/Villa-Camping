"use client";

import { useState, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ImageGalleryDialog({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetZoom();
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetZoom();
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setZoomPosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 0.5, 1);
    setZoomLevel(newZoom);
    if (newZoom === 1) {
      setZoomPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - zoomPosition.x,
        y: e.clientY - zoomPosition.y,
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      const maxX = (zoomLevel - 1) * 300;
      const maxY = (zoomLevel - 1) * 200;

      setZoomPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY)),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case "Escape":
        onClose();
        break;
      case "ArrowLeft":
        prevImage();
        break;
      case "ArrowRight":
        nextImage();
        break;
      case "+":
      case "=":
        handleZoomIn();
        break;
      case "-":
        handleZoomOut();
        break;
      case "0":
        resetZoom();
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, zoomLevel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="relative w-full h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="text-white">
                <span className="text-lg font-medium">
                  {currentIndex + 1} / {images.length}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>

              {/* Action Buttons */}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`rounded-full hover:bg-white/20 ${
                  isLiked ? "text-red-500" : "text-white"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="relative max-w-full max-h-full">
            <div
              className={`relative overflow-hidden rounded-lg ${
                zoomLevel > 1 ? "cursor-grab" : "cursor-zoom-in"
              } ${isDragging ? "cursor-grabbing" : ""}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={() => {
                if (zoomLevel === 1) {
                  setZoomLevel(2);
                } else {
                  resetZoom();
                }
              }}
            >
              <img
                src={images[currentIndex] || "/placeholder.svg"}
                alt={`Gallery image ${currentIndex + 1}`}
                className="max-w-full md:max-h-[60vh] max-h-[70vh] object-contain transition-transform duration-300 select-none"
                style={{
                  transform: `scale(${zoomLevel}) translate(${
                    zoomPosition.x / zoomLevel
                  }px, ${zoomPosition.y / zoomLevel}px)`,
                }}
                draggable={false}
              />
            </div>

            {/* Navigation Arrows */}
            {zoomLevel === 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Zoom Level Indicator */}
            {zoomLevel > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute  bottom-0  md:bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent">
          <div className="p-4 md:p-6">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                  className={`flex-shrink-0 w-16 h-16 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-white shadow-lg scale-105"
                      : "border-transparent hover:border-white/50"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* <Button onClick={onClose} className="w-11/12 flex justify-center items-center mx-auto md:hidden  h-10 text-lg text-black mb-2 font-semibold bg-white hover:bg-white border border-black">
          Close
        </Button> */}
        {/* Instructions */}
        <div className="absolute bottom-20 right-6 text-white/70 text-sm hidden md:block">
          <div>← → Navigate • Double-click to zoom • ESC to close</div>
        </div>
      </div>
    </div>
  );
}
