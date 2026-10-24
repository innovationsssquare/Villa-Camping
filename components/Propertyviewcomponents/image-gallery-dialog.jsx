"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";

export default function ImageGalleryDialog({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  property,
  propertyId,
  propertyType,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [desktopViewMode, setDesktopViewMode] = useState("horizontal"); // "horizontal" (wide horizontal presentation) | "fit" (fit original aspect)

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const activeThumbnailRef = useRef(null);

  const safeImages = Array.isArray(images) && images.length > 0 ? images : [];

  const { isLiked, handleWishlist } = useWishlist({
    property,
    propertyId,
    propertyType,
  });

  useEffect(() => {
    setCurrentIndex(initialIndex);
    resetZoom();
  }, [initialIndex, isOpen]);

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

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentIndex]);

  const nextImage = () => {
    if (safeImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
    resetZoom();
  };

  const prevImage = () => {
    if (safeImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
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

  // Mobile Touch Gestures (Swipe left/right)
  const handleTouchStart = (e) => {
    if (zoomLevel > 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (zoomLevel > 1) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (zoomLevel > 1) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (deltaX > swipeThreshold) {
      nextImage();
    } else if (deltaX < -swipeThreshold) {
      prevImage();
    }
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
  }, [isOpen, currentIndex, zoomLevel, safeImages.length]);

  if (!isOpen || safeImages.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md select-none overflow-hidden">
      {/* ── TOP HEADER (Floating Overlay) ── */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4 max-w-7xl mx-auto pointer-events-auto">
          {/* Close & Image Counter */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-10 h-10 text-white hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/10 text-white text-xs md:text-sm font-medium tracking-wide">
              {currentIndex + 1} / {safeImages.length}
            </div>
          </div>

          {/* Controls: Zoom (Desktop/Tablet) & Wishlist */}
          <div className="flex items-center space-x-2">
            {/* Desktop View Mode Toggle (Wide Horizontal vs Fit Original) */}
            <div className="hidden md:flex items-center bg-white/10 backdrop-blur-md px-1.5 py-1 rounded-full border border-white/10">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setDesktopViewMode((prev) => (prev === "horizontal" ? "fit" : "horizontal"))
                }
                className="h-7 px-3 text-white hover:bg-white/20 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all"
                title={
                  desktopViewMode === "horizontal"
                    ? "Switch to Fit Original photo"
                    : "Switch to Wide Horizontal photo"
                }
              >
                {desktopViewMode === "horizontal" ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] tracking-wide">Fit Original</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] tracking-wide">Wide View</span>
                  </>
                )}
              </Button>
            </div>

            {/* Zoom Controls (hidden on mobile, visible on sm+) */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="w-8 h-8 text-white hover:bg-white/20 disabled:opacity-30 rounded-full"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="w-8 h-8 text-white hover:bg-white/20 disabled:opacity-30 rounded-full"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                disabled={zoomLevel === 1}
                className="w-8 h-8 text-white hover:bg-white/20 disabled:opacity-30 rounded-full"
                title="Reset Zoom (0)"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {/* Wishlist Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all active:scale-90 ${
                isLiked ? "text-red-500 hover:text-red-400" : "text-white hover:text-red-400"
              }`}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={`w-5 h-5 transition-all duration-200 ${
                  isLiked ? "fill-red-500 text-red-500 scale-110" : ""
                }`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* ── AMBIENT BACKDROP GLOW (Fills Desktop Void with Warm Photo Harmony) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10">
        <img
          src={safeImages[currentIndex] || "/placeholder.svg"}
          alt=""
          className="w-full h-full object-cover opacity-35 blur-3xl scale-125 transition-all duration-700 ease-out"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* ── MAIN IMAGE VIEWPORT (Guaranteed Zero Overlap above Bottom Indicators) ── */}
      <div
        className="absolute top-14 bottom-[135px] md:bottom-[145px] inset-x-0 z-20 flex items-center justify-center px-3 sm:px-6 md:px-12 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative flex items-center justify-center w-full h-full max-w-7xl mx-auto">
          <div
            className={`relative flex items-center justify-center w-full h-full overflow-hidden ${
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
            {/* ── Responsive Display Frame: Vertical on Mobile, 50-60% Width Horizontal on Desktop ── */}
            <div
              className={`relative flex items-center justify-center transition-all duration-300 ${
                desktopViewMode === "horizontal"
                  ? "w-auto h-auto max-w-full max-h-full md:w-[56vw] md:max-w-[58vw] md:aspect-[16/10] md:max-h-full"
                  : "w-full h-full"
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${
                  zoomPosition.x / zoomLevel
                }px, ${zoomPosition.y / zoomLevel}px)`,
              }}
            >
              <img
                src={safeImages[currentIndex] || "/placeholder.svg"}
                alt={`Gallery image ${currentIndex + 1}`}
                className={`select-none rounded-xl md:rounded-2xl shadow-2xl ring-1 ring-white/15 transition-all duration-300 ${
                  desktopViewMode === "horizontal"
                    ? "w-auto h-auto max-w-[calc(100vw-24px)] max-h-full object-contain md:w-full md:h-full md:max-w-none md:max-h-none md:object-cover md:object-center"
                    : "max-w-[calc(100vw-32px)] sm:max-w-[calc(100vw-80px)] md:max-w-[58vw] max-h-full w-auto h-auto object-contain"
                }`}
                draggable={false}
              />
            </div>
          </div>

          {/* Zoom Level Indicator */}
          {zoomLevel > 1 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3.5 py-1 rounded-full text-xs md:text-sm font-medium border border-white/20 backdrop-blur-md shadow-lg pointer-events-none">
              {Math.round(zoomLevel * 100)}%
            </div>
          )}
        </div>

        {/* ── FLOATING VIEWPORT NAVIGATION ARROWS (Outside Photo) ── */}
        {zoomLevel === 1 && safeImages.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="fixed left-2 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            >
              <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:-translate-x-0.5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="fixed right-2 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 z-40 w-11 h-11 md:w-14 md:h-14 rounded-full bg-black/60 hover:bg-black/90 active:scale-95 text-white backdrop-blur-md border border-white/20 shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-105 group"
            >
              <ChevronRight className="w-6 h-6 md:w-7 md:h-7 transition-transform group-hover:translate-x-0.5" />
            </button>
          </>
        )}
      </div>

      {/* ── BOTTOM THUMBNAIL STRIP & INSTRUCTIONS (Clean Non-Overlapping Footer) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-4 pb-3 md:pb-4 px-4 h-[135px] md:h-[145px] flex flex-col justify-end">
        <div className="max-w-6xl mx-auto flex flex-col items-center pointer-events-auto w-full">
          {/* Thumbnails Container with Smooth Auto-Scroll */}
          <div className="w-full flex justify-center overflow-hidden">
            <div className="flex space-x-2 md:space-x-3 overflow-x-auto scrollbar-hide py-1 px-2 max-w-full">
              {safeImages.map((image, index) => (
                <button
                  key={index}
                  ref={index === currentIndex ? activeThumbnailRef : null}
                  onClick={() => {
                    setCurrentIndex(index);
                    resetZoom();
                  }}
                  className={`flex-shrink-0 w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-white ring-2 ring-white/50 scale-105 opacity-100 shadow-xl"
                      : "border-transparent opacity-50 hover:opacity-90 hover:border-white/40"
                  }`}
                  aria-label={`Jump to image ${index + 1}`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Keyboard Hints */}
          <div className="hidden md:flex items-center space-x-3 mt-1.5 text-white/50 text-xs tracking-wider">
            <span>← → Navigate</span>
            <span>•</span>
            <span>Double-click to zoom</span>
            <span>•</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
