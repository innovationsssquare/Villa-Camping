"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Play,
  Eye,
  Sparkles,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { TrendingVideoSkeleton } from "./TrendingVideoSkeleton";
import { fetchTrendingReels } from "@/Redux/Slices/propertiesSlice";
import VideoModal from "./VideoModel";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";

function VideoCard({ video, onPlay }) {
  const authorInitial = video.author ? video.author.trim().charAt(0).toUpperCase() : "V";
  const propertyTypeLabel = video.propertyType
    ? video.propertyType.charAt(0).toUpperCase() + video.propertyType.slice(1)
    : "Reel";

  return (
    <div
      onClick={() => onPlay(video)}
      className="group relative flex flex-col aspect-[9/15] sm:aspect-[9/16] rounded-2xl overflow-hidden border border-neutral-200/90 bg-neutral-900 hover:border-[#ff6900]/70 hover:shadow-xl hover:shadow-orange-500/15 transition-all duration-300 cursor-pointer select-none"
    >
      {/* Background Poster Image */}
      <Image
        src={video.image || "/placeholder.svg"}
        alt={video.title || "Trending video"}
        fill
        unoptimized
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 16vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Gradient Scrims for Readability and Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />

      {/* Top Badges Row */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
        {/* Views Pill */}
        <div className="bg-black/60 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/15 shadow-2xs">
          <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#ff6900]" />
          <span>{video.views || "1K Views"}</span>
        </div>

        {/* Property Type Badge */}
        <span className="bg-[#ff6900] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs uppercase tracking-wider">
          {propertyTypeLabel}
        </span>
      </div>

      {/* Center Play Icon with Glassmorphism Effect */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center text-white shadow-lg group-hover:scale-115 group-hover:bg-[#ff6900] group-hover:border-[#ff6900] transition-all duration-300">
          <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white translate-x-0.5" />
        </div>
      </div>

      {/* Bottom Video & Creator Details */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex flex-col gap-1">
        <h3 className="text-white font-bold text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-tight drop-shadow-sm group-hover:text-orange-200 transition-colors">
          {video.title}
        </h3>

        <div className="flex items-center gap-1.5 pt-0.5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-[#ff6900] to-amber-400 text-white flex items-center justify-center text-[8px] sm:text-[9px] font-bold border border-white/40 shadow-xs shrink-0">
            {authorInitial}
          </div>
          <span className="text-[10px] sm:text-[11px] text-white/90 font-medium truncate drop-shadow-xs">
            {video.author}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function TrendingVideos() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { reelsvideo, reelloading, reelerror } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchTrendingReels());
  }, [dispatch]);

  useEffect(() => {
    if (!api) return;

    const updateSnapshot = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateSnapshot();
    api.on("select", updateSnapshot);
    api.on("reInit", updateSnapshot);

    return () => {
      api.off("select", updateSnapshot);
      api.off("reInit", updateSnapshot);
    };
  }, [api, reelsvideo]);

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  return (
    <section className="w-full py-6 sm:py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header - Centered with App-style Typography */}
        <div className="relative text-center max-w-2xl mx-auto mb-4 sm:mb-6 md:mb-8 px-2">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-orange-50 border border-orange-200 text-[#ff6900] text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ff6900]" />
            <span>Curated Shorts</span>
            <span className="w-1 h-1 rounded-full bg-orange-300 mx-0.5" />
            <span className="text-neutral-600 font-normal">Real Guest Moments</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight leading-snug">
            Trending{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-[#ea580c]">
              Videos & Shorts
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-neutral-500 mt-1 leading-relaxed max-w-md mx-auto">
            Experience the vibe before you book. Browse real stays captured by guests and creators.
          </p>

          {/* Centered Action Button */}
          <div className="mt-2.5 sm:mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => router.push("/shorts")}
              className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-orange-50 hover:bg-orange-100/80 border border-orange-200 text-[#ff6900] text-[11px] sm:text-xs font-semibold transition-all hover:scale-105 active:scale-95 shadow-2xs group cursor-pointer"
            >
              <div className="w-4 h-4 rounded-full bg-[#ff6900] flex items-center justify-center text-white">
                <Play className="w-2 h-2 fill-white text-white translate-x-0.5" />
              </div>
              <span>Watch All Shorts</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Loading Skeleton (Horizontal Carousel Layout for both Mobile and Desktop) */}
        {reelloading && (
          <div className="flex gap-2.5 sm:gap-3.5 overflow-hidden w-full py-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="basis-[42%] sm:basis-[28%] md:basis-[22%] lg:basis-[18%] xl:basis-[15.5%] shrink-0"
              >
                <TrendingVideoSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {reelerror && (
          <div className="py-10 text-center">
            <p className="text-sm text-neutral-500">
              Unable to load trending videos right now.
            </p>
            <button
              type="button"
              onClick={() => dispatch(fetchTrendingReels())}
              className="mt-3 inline-flex items-center gap-1 text-xs text-[#ff6900] font-semibold hover:underline"
            >
              <RefreshCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Trending Videos Carousel */}
        {!reelloading && reelsvideo && reelsvideo.length > 0 && (
          <div className="relative py-2">
            <Carousel
              setApi={(api) => setApi(api)}
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2.5 sm:-ml-3.5">
                {reelsvideo.map((video) => (
                  <CarouselItem
                    key={video.id || video._id || video.videoUrl}
                    className="pl-2.5 sm:pl-3.5 basis-[42%] sm:basis-[28%] md:basis-[22%] lg:basis-[18%] xl:basis-[15.5%]"
                  >
                    <VideoCard video={video} onPlay={(v) => setActiveVideo(v)} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex -left-4 sm:-left-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
              <CarouselNext className="hidden sm:flex -right-4 sm:-right-5 bg-white border border-neutral-200 text-neutral-700 hover:text-black shadow-md hover:scale-105" />
            </Carousel>

            {/* Bottom Carousel Indicator for both Mobile and Desktop */}
            <CarouselIndicator
              current={current}
              count={count}
              variant="pills"
              onDotClick={handleDotClick}
              className="mt-3"
            />
          </div>
        )}
      </div>

      {/* Controlled Video Player Modal */}
      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          videoUrl={activeVideo.videoUrl}
          thumbnailSrc={activeVideo.image}
          title={activeVideo.title}
          author={activeVideo.author}
        />
      )}
    </section>
  );
}
