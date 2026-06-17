"use client";

// Using HTML5 video for hero instead of the carousel component
import Image from "next/image";
import Link from "next/link";
import Banner1 from "@/public/Aboutusasset/Villabanner.jpg";
import Banner2 from "@/public/Aboutusasset/Campbanner.jpg";
import Banner3 from "@/public/Aboutusasset/Cottagebanner.jpg";
import Banner4 from "@/public/Aboutusasset/Hotelbanner.jpg";
import { useEffect, useState } from "react";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { cn } from "@/lib/utils";
import OfferCarousel from "./offer-carousel";
export default function Hero() {
  const [categoriesApi, setCategoriesApi] = useState();
  const { isVisible } = useScrollDirection();

  return (
    <main
      className={cn(
        "h-auto  overflow-hidden",
        isVisible ? "translate-y-16" : "translate-y-16"
      )}
    >
      {/* Hero Video Section: replace carousel with a looping hero video. */}
      <section className="w-full relative">
        <div className="relative md:h-screen h-[350px] w-full">
          <video
            className="object-fill w-full h-full brightness-70 "
            autoPlay
            muted
            loop
            playsInline
            poster={Banner1.src}
          >
            <source src="/Productasset/Video Project.mp4" type="video/mp4" />
            <Image
              src={Banner1}
              alt="hero poster"
              fill
              className="object-cover brightness-50"
            />
          </video>
        </div>
        <div className="w-full">
          <OfferCarousel />
        </div>
      </section>
    </main>
  );
}
