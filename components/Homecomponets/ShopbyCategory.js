import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import Threads from "@/public/Aboutusasset/Villa.png"
import MesaureTaps from "@/public/Aboutusasset/Cottage.png"
import Fabrics from "@/public/Aboutusasset/Hotel.png"
import Sewingmachine from "@/public/Aboutusasset/Camp.png"
import OtherEssentials from "@/public/Aboutusasset/Cab.png"
import Fasteners from "@/public/Aboutusasset/Food.png"

const ShopbyCategory = () => {
  const categories = [
    {
      name: "Villa",
      slug: "villa",
      image: Threads,
    },
    {
      name: "Cottage",
      slug: "cottage",
      image: MesaureTaps,
    },
    {
      name: "Hotel",
      slug: "hotel",
      image:Fabrics,
    },
    {
      name: "Camp ",
      slug: "camp",
      image: Sewingmachine,
    },
    {
      name: "Cab",
      slug: "Cab",
      image: Fasteners,
    },
    {
      name: "Food",
      slug: "Food",
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
