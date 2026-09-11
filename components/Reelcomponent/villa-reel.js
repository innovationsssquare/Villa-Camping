"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Sparkles,
  ExternalLink,
  Check,
  Compass,
  Flame,
} from "lucide-react";
import { toggleWishlist, optimisticToggle } from "@/Redux/Slices/wishlistSlice";

export default function VillaReel({ villas = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Redux Wishlist integration
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);
  const user = useSelector((state) => state.auth?.user || null);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const isScrolling = useRef(false);
  const startY = useRef(0);
  const currentY = useRef(0);
  const lastTapRef = useRef(0);

  const currentVilla = villas[currentIndex] || null;

  // Check if current villa is liked
  const isCurrentLiked = useMemo(() => {
    if (!currentVilla || !wishlistIds || !Array.isArray(wishlistIds)) return false;
    const propertyId = currentVilla.id || currentVilla._id;
    const propertyType = currentVilla.propertyType || "villa";
    const key = `${propertyType.toLowerCase()}:${propertyId}`;
    return (
      wishlistIds.includes(propertyId) ||
      wishlistIds.includes(key) ||
      wishlistIds.some((item) => item?.propertyId === propertyId)
    );
  }, [wishlistIds, currentVilla]);

  // Handle Wishlist Toggle
  const handleToggleWishlist = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!currentVilla) return;

      const propertyId = currentVilla.id || currentVilla._id;
      const propertyType = currentVilla.propertyType || "villa";

      dispatch(
        optimisticToggle({
          propertyId,
          propertyType,
        })
      );

      if (user?._id) {
        dispatch(
          toggleWishlist({
            propertyId,
            propertyType,
            userId: user._id,
          })
        );
      }
    },
    [currentVilla, dispatch, user]
  );

  // Format currency
  const formatRupee = (val) => {
    if (val == null) return "₹0";
    const num = typeof val === "object" ? val.weekend || val.weekday || 0 : Number(val);
    return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
  };

  // Route map
  const getPropertyRoute = (type) => {
    const t = (type || "villa").toLowerCase();
    if (t.includes("camp")) return "Camping";
    if (t.includes("cottage")) return "Cottage";
    if (t.includes("hotel")) return "Hotel";
    return "Villa";
  };

  const navigateToProperty = () => {
    if (!currentVilla) return;
    const id = currentVilla.id || currentVilla._id;
    const routeType = getPropertyRoute(currentVilla.propertyType);
    router.push(`/view-${routeType}/${id}`);
  };

  // Navigation handlers
  const goToNext = useCallback(() => {
    if (currentIndex < villas.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentIndex, villas.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentIndex]);

  // Video playback management across indexes
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex) {
        video.muted = isMuted;
        if (isPlaying) {
          video.play().catch(() => {
            // Autoplay restriction fallback
          });
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex, isPlaying, isMuted]);

  // Time update progress tracker
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
      setDuration(video.duration);
    }
  };

  // Single Tap: Play / Pause
  const handleVideoClick = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayIcon(true);
    setTimeout(() => setShowPlayIcon(false), 700);
  };

  // Double Tap: Like Burst
  const handleVideoDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap detected
      setShowHeartBurst(true);
      if (!isCurrentLiked) {
        handleToggleWishlist(e);
      }
      setTimeout(() => setShowHeartBurst(false), 900);
    }
    lastTapRef.current = now;
  };

  // Seek bar click
  const handleProgressClick = (e) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercent = (clickX / rect.width) * 100;
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo && currentVideo.duration) {
      currentVideo.currentTime = (newPercent / 100) * currentVideo.duration;
      setProgress(newPercent);
    }
  };

  // Share handler
  const handleShare = async (e) => {
    e.stopPropagation();
    if (!currentVilla) return;

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareData = {
      title: currentVilla.name,
      text: `Check out ${currentVilla.name} in ${currentVilla.location} on TheVillaCamp!`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2200);
      } catch {
        // clipboard error
      }
    }
  };

  // Keyboard Shortcuts (ArrowDown, ArrowUp, Space, M)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Avoid stealing typing focus if inside an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      if (e.key === "ArrowDown" || e.key === "j" || e.key === "PageDown") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "k" || e.key === "PageUp") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        handleVideoClick();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  // Desktop Wheel listener with throttling
  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling.current) return;
      if (Math.abs(e.deltaY) < 30) return;

      isScrolling.current = true;
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [goToNext, goToPrev]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    currentY.current = e.touches[0].clientY;
    isScrolling.current = false;
  };

  const handleTouchMove = (e) => {
    currentY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const deltaY = startY.current - currentY.current;
    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen bg-black overflow-hidden select-none z-50 flex flex-col justify-center items-center font-sans"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Ambient Blurred Backdrop (Desktop Dynamic Lighting) */}
      {currentVilla?.thumbnail && (
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-125 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${currentVilla.thumbnail})` }}
        />
      )}
      <div className="hidden md:block absolute inset-0 bg-black/60 pointer-events-none" />

      {/* 2. Top Header Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-auto">
        {/* Left: Back to Home */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition-all cursor-pointer group"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-xs font-bold hidden sm:inline">Back</span>
        </button>

        {/* Center: Live Shorts Badge */}
        <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white shadow-xs">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6900] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff6900]" />
          </span>
          <span className="text-xs font-extrabold tracking-wide uppercase">
            Shorts
          </span>
        </div>

        {/* Right: Sound Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMuted((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/15 transition-all cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-4 h-4 text-white" />
              <span className="text-[11px] font-bold hidden sm:inline">Muted</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-[#ff6900]" />
              <span className="text-[11px] font-bold hidden sm:inline">Sound On</span>
            </>
          )}
        </button>
      </header>

      {/* 3. Central Video Frame & Action Rail Container */}
      <div className="relative w-full h-full md:h-[calc(100vh-60px)] md:max-h-[840px] md:w-auto flex items-center justify-center">
        {/* Main 9:16 Video Player Card */}
        <div className="relative w-full h-full md:w-[410px] lg:w-[430px] md:aspect-[9/16] md:rounded-3xl overflow-hidden bg-neutral-950 shadow-2xl border-0 md:border md:border-white/15">
          {/* Active Reel Videos Stack */}
          {villas.map((villa, index) => {
            const isActive = index === currentIndex;
            // Only mount current, previous, and next for lightweight memory
            if (Math.abs(index - currentIndex) > 1) return null;

            return (
              <div
                key={villa.id || villa._id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                  isActive ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
                }`}
              >
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  src={villa.videoUrl}
                  poster={villa.thumbnail}
                  loop
                  playsInline
                  muted={isMuted}
                  preload={isActive ? "auto" : "metadata"}
                  onTimeUpdate={isActive ? handleTimeUpdate : undefined}
                  onClick={handleVideoClick}
                  onTouchStart={handleVideoDoubleTap}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Scrim Gradients for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />
              </div>
            );
          })}

          {/* Center Heart Burst Animation on Double Tap */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-300">
              <div className="w-24 h-24 rounded-full bg-[#ff6900]/90 backdrop-blur-md flex items-center justify-center shadow-2xl scale-125 animate-bounce">
                <Heart className="w-14 h-14 fill-white text-white drop-shadow-md" />
              </div>
            </div>
          )}

          {/* Center Play / Pause Indicator on Single Tap */}
          {showPlayIcon && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in fade-in zoom-in-75 duration-200">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl">
                {isPlaying ? (
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                ) : (
                  <Pause className="w-8 h-8 fill-white" />
                )}
              </div>
            </div>
          )}

          {/* Link Copied Notification */}
          {copiedToast && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-black/90 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link copied to clipboard!</span>
            </div>
          )}

          {/* 4. Bottom Video Info & Booking CTA */}
          {currentVilla && (
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 flex flex-col gap-2.5 pointer-events-none">
              {/* Location Tag & Rating */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                  <MapPin className="w-3 h-3 text-[#ff6900]" />
                  <span>{currentVilla.location || "Maharashtra"}</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{currentVilla.rating || 4.9}</span>
                  <span className="text-white/60">({currentVilla.reviews || 28})</span>
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug drop-shadow-md truncate">
                  {currentVilla.name}
                </h2>
                <p className="text-xs text-white/80 font-medium line-clamp-1">
                  {currentVilla.guests ? `${currentVilla.guests} Guests` : "Private Stay"}
                  {currentVilla.amenities?.length > 0 && ` · ${currentVilla.amenities.slice(0, 3).join(" · ")}`}
                </p>
              </div>

              {/* Price & Primary Book Button */}
              <div className="flex items-center justify-between gap-3 pt-1 pointer-events-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-white/70 font-medium">Starts from</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl sm:text-2xl font-black text-white leading-none">
                      {formatRupee(currentVilla.price)}
                    </span>
                    <span className="text-xs text-white/80 font-normal">/ night</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={navigateToProperty}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white font-extrabold text-xs sm:text-sm shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <span>View Stay</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 5. Sleek Real-Time Progress Bar at Bottom of Video */}
          <div
            onClick={handleProgressClick}
            className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 hover:h-2.5 transition-all cursor-pointer z-30"
          >
            <div
              className="h-full bg-gradient-to-r from-[#ff6900] to-orange-400 relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-xs opacity-0 hover:opacity-100" />
            </div>
          </div>
        </div>

        {/* 6. Side Action Rail (Desktop & Mobile Unified Strip) */}
        <div className="absolute right-3.5 bottom-24 md:static md:right-auto md:bottom-auto md:ml-4 flex flex-col items-center gap-3 z-30 pointer-events-auto">
          {/* Wishlist Heart Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-90 ${
                isCurrentLiked
                  ? "bg-[#ff6900] text-white"
                  : "bg-black/60 hover:bg-black/80 text-white border border-white/20 hover:border-white/40"
              }`}
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform ${
                  isCurrentLiked ? "fill-white scale-110" : "text-white"
                }`}
              />
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-xs">
              {isCurrentLiked ? "Saved" : "Save"}
            </span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-90"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-xs">
              Share
            </span>
          </div>

          {/* Quick Property Route Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              type="button"
              onClick={navigateToProperty}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-white/40 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-90"
              aria-label="Details"
            >
              <Compass className="w-5 h-5 text-[#ff6900]" />
            </button>
            <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-xs">
              Stay
            </span>
          </div>

          {/* Desktop Only: Previous Reel (↑) */}
          <div className="hidden md:flex flex-col items-center mt-2">
            <button
              type="button"
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/15 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Previous Reel"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Only: Next Reel (↓) */}
          <div className="hidden md:flex flex-col items-center">
            <button
              type="button"
              onClick={goToNext}
              disabled={currentIndex === villas.length - 1}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white border border-white/15 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer shadow-md active:scale-95"
              aria-label="Next Reel"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
