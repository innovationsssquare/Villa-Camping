import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import Threads from "@/public/Homeasset/Threads.png"
import MesaureTaps from "@/public/Homeasset/MesaureTaps.png"
import Fabrics from "@/public/Homeasset/Fabrics.png"
import Sewingmachine from "@/public/Homeasset/Sewingmachine.png"
import OtherEssentials from "@/public/Homeasset/OtherEssentials.png"
import Fasteners from "@/public/Homeasset/Fasteners.png"
import Pressing from "@/public/Homeasset/Pressing.png"
import CuttingTools from "@/public/Homeasset/CuttingTools.png"

const ShopbyCategory = () => {
  const categories = [
    {
      name: "Threads",
      slug: "threads",
      image: Threads,
    },
    {
      name: "Measuring Tools",
      slug: "measuring-tools",
      image: MesaureTaps,
    },
    {
      name: "Fabrics",
      slug: "fabrics",
      image:Fabrics,
    },
    {
      name: "Sewing Machine",
      slug: "sewing-machine",
      image: Sewingmachine,
    },
    {
      name: "Cutting Tools",
      slug: "Cutting-Tools",
      image: CuttingTools,
    },
    {
      name: "Pressing & Finishing",
      slug: "Pressing-and-Finishing",
      image: Pressing,
    },
    {
      name: "Fasteners & Closures",
      slug: "Fasteners-and-Closures",
      image: Fasteners,
    },
    {
      name: "Other Essentials",
      slug: "Other-Essentials",
      image:OtherEssentials,
    },
  ];

  return (
    <section className="w-full bg-gray-50 md:py-12 py-4 overflow-hidden">
      <div className=" mx-auto">
        <h2 className="md:mb-10 mb-4 text-center md:text-3xl font-medium text-gray-800">
          Shop by Categories!
        </h2>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="md:-ml-4 -ml-1 ">
            {categories.map((category,index) => (
              <CarouselItem
                key={index}
                className="pl-4  md:basis-1/8 lg:basis-1/8 basis-4/"
              >
                <Link
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center"
                >
                  <div className="relative mb-3 md:h-28 md:w-28 h-16 w-16 overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover categorygradient"
                    />
                  </div>
                  <span className="text-center md:text-sm text-xs font-medium text-gray-800">
                    {category.name}
                  </span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ShopbyCategory;
