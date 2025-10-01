"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import Banner1 from "@/public/Aboutusasset/Villabanner.jpg";
import Banner2 from "@/public/Aboutusasset/Campbanner.jpg";
import Banner3 from "@/public/Aboutusasset/Cottagebanner.jpg";
import Banner4 from "@/public/Aboutusasset/Hotelbanner.jpg";
import Autoplay from "embla-carousel-autoplay";

import { useEffect, useState } from "react";
import OfferCarousel from "./offer-carousel";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
export default function Hero() {
  const [heroApi, setHeroApi] = useState();
  const [heroCurrentIndex, setHeroCurrentIndex] = useState(0);
  const [heroCount, setHeroCount] = useState(0);
  const [categoriesApi, setCategoriesApi] = useState();
  const { isVisible } = useScrollDirection();

  useEffect(() => {
    if (!heroApi) return;

    setHeroCount(heroApi.scrollSnapList().length);

    const onSelect = () => {
      setHeroCurrentIndex(heroApi.selectedScrollSnap());
    };

    heroApi.on("select", onSelect);

    onSelect();

    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);

  const goToSlide = (index) => {
    heroApi?.scrollTo(index);
  };

  return (
    <main
      className={cn(
        "h-auto  overflow-hidden",
        isVisible ? "translate-y-16" : "translate-y-16"
      )}
    >
      {/* Hero Carousel Section */}
      <section className="w-full relative">
        <Carousel
          plugins={[
            Autoplay({
              delay: 8000,
            }),
          ]}
          className="w-full "
          setApi={setHeroApi}
        >
          <CarouselContent>
            <CarouselItem>
              <div className="relative md:h-screen h-[350px] w-full">
                <Image
                  src={Banner3}        
                  alt="Sewing supplies including blue fabric, thread spools, and a sewing machine"
                  fill
                  className="object-fill brightness-60"
                  priority
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-screen h-[350px] w-full">
                <Image
                  src={Banner4}
                  alt="Sewing supplies"
                  fill
                  className="object-fill brightness-60"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-screen h-[350px]  w-full">
                <Image
                  src={Banner1}
                  alt="Crafting materials"
                  fill
                  className="object-fill brightness-60"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-screen h-[350px]  w-full">
                <Image
                  src={Banner2}
                  alt="Crafting materials"
                  fill
                  className="object-fill brightness-60"
                />
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Dot indicators for hero carousel */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {Array.from({ length: heroCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-opacity ${
                  index === heroCurrentIndex
                    ? "bg-[#106C83]"
                    : "bg-white opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
        <OfferCarousel
          heroApi={heroApi}
          heroCurrentIndex={heroCurrentIndex}
          heroCount={heroCount}
        />
      </section>
    </main>
  );
}
