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
import Banner1 from "@/public/Aboutusasset/Villabanner.png";
import Banner2 from "@/public/Aboutusasset/Campbanner.png";
import Banner3 from "@/public/Aboutusasset/Cottagebanner.png";
import Banner4 from "@/public/Aboutusasset/Hotelbanner.png";
import Autoplay from "embla-carousel-autoplay"

import { useEffect, useState } from "react";
import OfferCarousel from "./offer-carousel";
export default function Hero() {
  const [heroApi, setHeroApi] = useState();
  const [heroCurrentIndex, setHeroCurrentIndex] = useState(0);
  const [heroCount, setHeroCount] = useState(0);
  const [categoriesApi, setCategoriesApi] = useState();

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
    <main className="h-auto md:pt-44 pt-24 overflow-hidden">
      {/* Hero Carousel Section */}
      <section className="w-full relative">
        <Carousel    plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]} className="w-full " setApi={setHeroApi}>
          <CarouselContent>
            <CarouselItem>
              <div className="relative md:h-[400px] h-[250px] w-full">
                <Image
                  src={Banner1}
                  alt="Sewing supplies including blue fabric, thread spools, and a sewing machine"
                  fill
                  className="object-fill"
                  priority
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-[400px] h-[250px] w-full">
                <Image
                  src={Banner2}
                  alt="Sewing supplies"
                  fill
                  className="object-fill"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-[400px] h-[250px]  w-full">
                <Image
                  src={Banner3}
                  alt="Crafting materials"
                  fill
                  className="object-fill"
                />
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative md:h-[400px] h-[250px]  w-full">
                <Image
                  src={Banner4}
                  alt="Crafting materials"
                  fill
                  className="object-fill"
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
                  index === heroCurrentIndex ? "bg-[#106C83]" : "bg-white opacity-50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </section>

   
    </main>
  );
}

