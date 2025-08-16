"use client"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import Threads from "@/public/Productasset/Villaimg.png"
import MesaureTaps from "@/public/Productasset/Cottageimg.png"
import Fabrics from "@/public/Productasset/Hotelimg.png"
import Sewingmachine from "@/public/Productasset/Campimg.png"
import OtherEssentials from "@/public/Productasset/Capimg.png"
import Fasteners from "@/public/Productasset/Foodimg.png"
import { Button } from "@/components/ui/button"

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
      image: Fabrics,
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
      image: OtherEssentials,
    },
  ]

  return (
    <section className="w-full relative rounded-t-3xl backdrop-blur-2xl filter md:py-12 py-4 overflow-hidden">
      <div className="mx-auto">
        <h2 className="md:mb-10 mb-4 text-center md:text-3xl font-medium text-gray-800">Explore by Categories!</h2>

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="md:-ml-4 -ml-1 md:justify-center">
            {categories.map((category, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/8 lg:basis-1/8 basis-4/ flex justify-center">
                <Link href={`/category/${category.slug}`} className="group flex flex-col items-center justify-center">
                  <Button className="rounded-md md:rounded-full border-1 border-white relative bg-gray-200 md:bg-gray-200 hover:bg-gray-200 backdrop-blur-2xl mb-3 md:h-20 md:w-20 h-16 w-16 overflow-hidden transition-all duration-300 group-hover:shadow-lg">
                    <Image src={category.image || "/placeholder.svg"} alt={category.name} className="object-contain" />
                  </Button>
                  <span className="text-center md:text-sm text-xs font-medium text-gray-800">{category.name}</span>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default ShopbyCategory
