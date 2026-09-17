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
  RefreshCcw,
} from "lucide-react";
import { toggleWishlist, optimisticToggle } from "@/Redux/Slices/wishlistSlice";
import { useAuthModal } from "@/context/AuthModalContext";
import { getStoredUser } from "@/lib/auth";
import { getCategoryRouteName, getCleanPropertyType } from "@/lib/categoryUtils";

export default function VillaReel({ villas = [] }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const { openAuthModal } = useAuthModal();

  // Redux Wishlist integration
  const wishlistIds = useSelector((state) => state.wishlist?.ids || []);

  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const isScrolling = useRef(false);
  const lastTapRef = useRef(0);

  const currentVilla = currentIndex < villas.length ? villas[currentIndex] : null;

  // Stop all video instances cleanly
  const stopAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, []);

  // Back navigation handler
  const handleBack = useCallback(() => {
    stopAllVideos();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }, [router, stopAllVideos]);

  // Safe category navigation
  const navigateToProperty = useCallback(() => {
    if (!currentVilla) return;
    stopAllVideos();
    const id = currentVilla.id || currentVilla._id;
    const routeType = getCategoryRouteName(currentVilla);
    router.push(`/view-${routeType}/${id}`);
  }, [currentVilla, router, stopAllVideos]);

  const handleViewVilla = navigateToProperty;

  // Check if current villa is liked
  const isCurrentLiked = useMemo(() => {
    if (!currentVilla || !wishlistIds || !Array.isArray(wishlistIds)) return false;
    const propertyId = currentVilla.id || currentVilla._id;
    const propertyType = getCleanPropertyType(currentVilla);
    const key = `${propertyType.toLowerCase()}:${propertyId}`;
    const rawId = String(propertyId);
    return (
      wishlistIds.includes(rawId) ||
      wishlistIds.includes(key) ||
      wishlistIds.some((item) => item?.propertyId === rawId || item?.propertyId === propertyId)
    );
  }, [wishlistIds, currentVilla]);

  // Handle Wishlist Toggle
  const handleToggleWishlist = useCallback(
    (e) => {
      e?.stopPropagation?.();
      if (!currentVilla) return;

      const currentUser = getStoredUser();
      if (!currentUser?._id) {
        openAuthModal();
        return;
      }

      const propertyId = currentVilla.id || currentVilla._id;
      const propertyType = getCleanPropertyType(currentVilla);

      dispatch(
        optimisticToggle({
          propertyId,
          propertyType,
        })
      );

      dispatch(
        toggleWishlist({
          propertyId,
          propertyType,
          userId: currentUser._id,
        })
      );
    },
    [currentVilla, dispatch, openAuthModal]
  );

  // Format currency
  const formatRupee = (val) => {
    if (val == null) return "₹0";
    const num = typeof val === "object" ? val.weekend || val.weekday || 0 : Number(val);
    return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(num)}`;
  };

  // Slide navigation handlers (can advance up to villas.length for the End Slide)
  const goToNext = useCallback(() => {
    if (currentIndex < villas.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [currentIndex, villas.length]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);
    }
  }, [currentIndex]);

  // 1. Critical unmount cleanup: stop, mute, remove src and unload all videos to guarantee no background audio
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          try {
            video.pause();
            video.muted = true;
            video.removeAttribute("src");
            video.load();
          } catch (e) {}
        }
      });
      videoRefs.current = [];
    };
  }, []);

  // 2. Browser tab switch, backgrounding, or back/forward popstate cleanup
  useEffect(() => {
    const handlePause = () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          try {
            video.pause();
          } catch (e) {}
        }
      });
      setIsPlaying(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handlePause();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePause);
    window.addEventListener("beforeunload", handlePause);
    window.addEventListener("popstate", handlePause);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePause);
      window.removeEventListener("beforeunload", handlePause);
      window.removeEventListener("popstate", handlePause);
    };
  }, []);

  // 3. Video playback management across indexes
  useEffect(() => {
    if (currentIndex >= villas.length) {
      // Reached the End of Reels screen: ensure all videos are halted
      videoRefs.current.forEach((video) => {
        if (video) {
          try {
            video.pause();
          } catch (e) {}
        }
      });
      return;
    }

    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === currentIndex) {
        video.muted = isMuted;
        if (isPlaying) {
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // If autoplay policy requires a user gesture, mute first then resume
              video.muted = true;
              video.play().catch(() => {});

              // On the very first user interaction anywhere, restore sound
              const unmuteOnUserGesture = () => {
                if (video && !isMuted) {
                  video.muted = false;
                }
                window.removeEventListener("pointerdown", unmuteOnUserGesture);
                window.removeEventListener("touchstart", unmuteOnUserGesture);
                window.removeEventListener("click", unmuteOnUserGesture);
                window.removeEventListener("keydown", unmuteOnUserGesture);
              };

              window.addEventListener("pointerdown", unmuteOnUserGesture, { once: true });
              window.addEventListener("touchstart", unmuteOnUserGesture, { once: true });
              window.addEventListener("click", unmuteOnUserGesture, { once: true });
              window.addEventListener("keydown", unmuteOnUserGesture, { once: true });
            });
          }
        } else {
          video.pause();
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });

    return () => {
      const activeVideo = videoRefs.current[currentIndex];
      if (activeVideo) {
        try {
          activeVideo.pause();
        } catch (e) {}
      }
    };
  }, [currentIndex, isPlaying, isMuted, villas.length]);

  // Time update progress tracker
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video && video.duration) {
      setCurrentTime(video.currentTime || 0);
      setDuration(video.duration || 0);
      setProgress(((video.currentTime || 0) / video.duration) * 100);
    }
  };

  // Single Tap: Play / Pause
  const handleVideoClick = () => {
    setIsPlaying((prev) => !prev);
  };

  // Double Tap: Like Burst
  const handleVideoDoubleTap = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
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
        // Clipboard error
      }
    }
  };

  // Keyboard Shortcuts (ArrowDown, ArrowUp, Space, M)
  useEffect(() => {
    const handleKeyDown = (e) => {
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

  // Lock overscroll behavior to prevent native browser pull-to-refresh
  useEffect(() => {
    const origBodyOverscroll = document.body.style.overscrollBehaviorY;
    const origHtmlOverscroll = document.documentElement.style.overscrollBehaviorY;
    document.body.style.overscrollBehaviorY = "none";
    document.documentElement.style.overscrollBehaviorY = "none";

    return () => {
      document.body.style.overscrollBehaviorY = origBodyOverscroll;
      document.documentElement.style.overscrollBehaviorY = origHtmlOverscroll;
    };
  }, []);

  // Desktop Wheel listener with smooth slide throttling
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
      }, 450);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: true });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [goToNext, goToPrev]);

  // Touch gestures with cancelable check to prevent native pull-to-refresh
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const onTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
        touchEndY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        touchEndY = e.touches[0].clientY;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      if (isScrolling.current) return;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) > 35) {
        isScrolling.current = true;
        if (deltaY > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        setTimeout(() => {
          isScrolling.current = false;
        }, 450);
      }
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [goToNext, goToPrev]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-[100dvh] bg-black overflow-hidden select-none z-50 flex flex-col justify-center items-center font-sans overscroll-none touch-none"
    >
      {/* 1. Ambient Blurred Backdrop (Desktop Dynamic Lighting) */}
      {currentVilla?.thumbnail ? (
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center blur-3xl opacity-25 scale-125 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${currentVilla.thumbnail})` }}
        />
      ) : (
        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-900 to-black pointer-events-none" />
      )}
      <div className="hidden md:block absolute inset-0 bg-black/60 pointer-events-none" />

      {/* 2. Top Header Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-auto">
        {/* Left: Back to Previous / Home */}
        <button
          type="button"
          onClick={handleBack}
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
          {/* Active Reel Videos Stack with Smooth Vertical Slide Up/Down Effect */}
          {villas.map((villa, index) => {
            const offset = index - currentIndex;
            // Mount adjacent items so transitions animate smoothly
            if (Math.abs(offset) > 1) return null;

            const isActive = offset === 0;

            return (
              <div
                key={villa.id || villa._id}
                className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out will-change-transform ${
                  isActive ? "z-10" : "z-0 pointer-events-none"
                }`}
                style={{
                  transform: `translateY(${offset * 100}%)`,
                }}
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

          {/* End of Reels Screen (Smoothly slides in after the last reel) */}
          {(() => {
            const endOffset = villas.length - currentIndex;
            if (Math.abs(endOffset) > 1) return null;
            const isEndActive = endOffset === 0;

            return (
              <div
                className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out will-change-transform flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900/98 via-black to-neutral-950 ${
                  isEndActive ? "z-20 pointer-events-auto" : "z-0 pointer-events-none"
                }`}
                style={{
                  transform: `translateY(${endOffset * 100}%)`,
                }}
              >
                {/* Ambient glow decoration */}
                <div className="absolute w-60 h-60 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center max-w-xs">
                  {/* Glowing icon badge */}
                  <div className="relative mb-5">
                    <div className="w-20 h-20 rounded-3xl bg-neutral-900/90 border border-white/15 backdrop-blur-xl flex items-center justify-center shadow-2xl">
                      <Sparkles className="w-9 h-9 text-[#ff6900] animate-pulse" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-black flex items-center justify-center shadow-md">
                      <Check className="w-4 h-4 text-white stroke-[3]" />
                    </div>
                  </div>

                  <span className="text-[11px] font-extrabold tracking-widest text-[#ff6900] uppercase mb-1.5">
                    You're All Caught Up
                  </span>

                  <h3 className="text-2xl font-black text-white mb-2.5 tracking-tight">
                    No More Reels
                  </h3>

                  <p className="text-xs text-neutral-300/80 leading-relaxed mb-6 font-normal">
                    You've explored all the latest villa shorts! More exclusive stays are being curated daily.
                  </p>

                  <div className="flex flex-col w-full gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentIndex(0);
                        setIsPlaying(true);
                      }}
                      className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      <span>Watch Again From Start</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBack}
                      className="w-full py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-bold backdrop-blur-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Explore All Stays</span>
                    </button>
                  </div>

                  {/* Revisit hint */}
                  <button
                    type="button"
                    onClick={goToPrev}
                    className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white/50 hover:text-white/80 transition-colors cursor-pointer"
                  >
                    <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
                    <span>Swipe down to revisit reels</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Last reel hint indicator */}
          {currentIndex === villas.length - 1 && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[11px] font-medium text-white/85 shadow-lg pointer-events-none flex items-center gap-1.5 animate-in fade-in duration-300">
              <Sparkles className="w-3 h-3 text-[#ff6900]" />
              <span>Last reel · Swipe up to finish</span>
            </div>
          )}

          {/* Center Heart Burst Animation on Double Tap */}
          {showHeartBurst && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 animate-in zoom-in-50 fade-in duration-300">
              <div className="w-24 h-24 rounded-full bg-[#ff6900]/90 backdrop-blur-md flex items-center justify-center shadow-2xl scale-125 animate-bounce">
                <Heart className="w-14 h-14 fill-white text-white drop-shadow-md" />
              </div>
            </div>
          )}

          {/* Paused Controls Overlay: Mute/Unmute Button Directly Above Play/Pause Button */}
          {currentVilla && !isPlaying && (
            <div
              onClick={handleVideoClick}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer pointer-events-auto"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col items-center gap-3.5 animate-in zoom-in-95 fade-in duration-200"
              >
                {/* Mute / Unmute Button at the top of pause/play button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMuted((prev) => {
                      const next = !prev;
                      const v = videoRefs.current[currentIndex];
                      if (v) v.muted = next;
                      return next;
                    });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 shadow-2xl transition-all active:scale-95 cursor-pointer touch-manipulation"
                  aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-white" />
                      <span className="text-xs font-bold tracking-wide">Unmute Sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-[#ff6900]" />
                      <span className="text-xs font-bold tracking-wide">Mute Sound</span>
                    </>
                  )}
                </button>

                {/* Central Play/Resume Button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transition-transform active:scale-90 cursor-pointer touch-manipulation"
                  aria-label="Play Reel"
                >
                  <Play className="w-8 h-8 fill-white translate-x-0.5 text-white" />
                </button>
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
            <div className="absolute bottom-0 left-0 right-0 z-20 p-4 sm:p-5 pb-[max(3rem,calc(env(safe-area-inset-bottom)+2.5rem))] flex flex-col gap-2 pointer-events-none">
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

          {/* 5. Minimal Sleek Scrubber Bar (No Timing or Reel Count Text) */}
          {currentVilla && (
            <div className="absolute bottom-[max(0.65rem,calc(env(safe-area-inset-bottom)+0.35rem))] left-0 right-0 z-30 px-3 sm:px-4 pointer-events-auto">
              <div
                onClick={handleProgressClick}
                className="group relative h-1.5 sm:h-1 hover:h-2 w-full bg-white/20 rounded-full cursor-pointer transition-all backdrop-blur-xs flex items-center touch-manipulation"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#ff6900] via-orange-400 to-amber-300 rounded-full relative transition-all duration-100"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md border border-[#ff6900] scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 6. Side Action Rail (Desktop & Mobile Unified Strip) */}
        <div className="absolute right-3 bottom-[max(8rem,calc(env(safe-area-inset-bottom)+7.5rem))] md:static md:right-auto md:bottom-auto md:ml-4 flex flex-col items-center gap-3 z-30 pointer-events-auto">
          {currentVilla && (
            <>
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
            </>
          )}

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
              disabled={currentIndex >= villas.length}
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
