"use client";

import { useState } from "react";
import { Search, Heart } from "lucide-react";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Product1 from "@/public/Homeasset/Product1.png"
import Product2 from "@/public/Homeasset/Product2.png"
import Product3 from "@/public/Homeasset/Product3.png"
import Product4 from "@/public/Homeasset/Product4.png"
import { useRouter } from "next/navigation";
export default function ProductListing() {
  const [priceRange, setPriceRange] = useState([50]);
  return (
    <div className="w-full mx-auto md:px-8 px-3 md:py-8 py-32">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Sidebar - Filters */}
        <div className="w-full md:w-64 shrink-0 hidden md:block">
          <h2 className="text-xl font-medium mb-4">Filter</h2>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Categories</h3>
              <button className="text-gray-500 text-sm">Clear All</button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="sewing-machine"  />
                <label
                  htmlFor="sewing-machine"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Sewing Machine</span>
                  <span className="text-gray-500">(112)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="threads" />
                <label
                  htmlFor="threads"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Threads</span>
                  <span className="text-gray-500">(172)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="fabrics" />
                <label
                  htmlFor="fabrics"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Fabrics</span>
                  <span className="text-gray-500">(86)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="buttons" />
                <label
                  htmlFor="buttons"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Buttons</span>
                  <span className="text-gray-500">(99)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="cutting-tools" />
                <label
                  htmlFor="cutting-tools"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Cutting Tools</span>
                  <span className="text-gray-500">(11)</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="measuring-tools" />
                <label
                  htmlFor="measuring-tools"
                  className="text-sm flex justify-between w-full"
                >
                  <span>Measuring Tools</span>
                  <span className="text-gray-500">(21)</span>
                </label>
              </div>

              <button className="text-center w-full text-sm font-semibold text-lg mt-1">
                See all
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="flex justify-between w-full items-center mb-4">
            <h3 className="font-medium ">Price Range </h3>
            <p className="bg-[#EDC5C5] p-1 text-xs rounded-full">${priceRange}</p>
            </div>
            <Slider
              defaultValue={[50]}
              max={8000}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>$50</span>
              <span>$8,000+</span>
            </div>
          </div>

          {/* Color */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Color</h3>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-[#FFEC99] border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-blue-300 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-green-400 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-pink-300 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-teal-500 border-2 border-gray-700 ring-2 ring-white"></button>
            </div>
          </div>

          {/* Review */}
          <div>
            <h3 className="font-medium mb-4">Review</h3>
            <RadioGroup defaultValue="4-5">
              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="r1" className="flex items-center">
                  <div className="flex text-yellow-400 mr-2 text-xl">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>
                  <span className="text-sm">4.0 - 5 Star</span>
                </Label>
                <RadioGroupItem
                  value="4-5"
                  id="r1"
                />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="r2" className="flex items-center">
                  <div className="flex text-yellow-400 mr-2 text-xl">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                  </div>
                  <span className="text-sm">3.0 - 4 Star</span>
                </Label>
                <RadioGroupItem value="3-4" id="r2" />
              </div>

              <div className="flex items-center space-x-2 mb-2">
                <Label htmlFor="r3" className="flex items-center">
                  <div className="flex text-yellow-400 mr-2 text-xl">
                    <span>★</span>
                    <span>★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                  </div>
                  <span className="text-sm">2.0 - 3 Star</span>
                </Label>
                <RadioGroupItem value="2-3" id="r3" />
              </div>

              <div className="flex items-center space-x-2">
                <Label htmlFor="r4" className="flex items-center">
                  <div className="flex text-yellow-400 mr-2 text-xl">
                    <span>★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                    <span className="text-gray-300">★</span>
                  </div>
                  <span className="text-sm">1.0 - 2 Star</span>
                </Label>
                <RadioGroupItem value="1-2" id="r4" />
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            <div className="relative w-full md:w-64 hidden md:block">
              <Input
                type="text"
                placeholder="Search Product"
                className="w-full border rounded-md pl-3 pr-10 py-2 text-sm"
                defaultValue=""
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="md:text-sm text-xs text-gray-600">{`Showing 1-6 of 44 results for 'Sewing Machine'`}</div>

              <div className="flex items-center gap-2 ">
                <span className=" whitespace-nowrap md:text-sm text-xs">Sort by:</span>
                <Select defaultValue="low-high">
                  <SelectTrigger className="w-[130px] h-9 md:text-sm text-xs border border-gray-300">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low-high">Low To High</SelectItem>
                    <SelectItem value="high-low">High To Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-3">
            {/* Product Card 1 */}
            <ProductCard
              image={Product1}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />

            {/* Product Card 2 */}
            <ProductCard
              image={Product1}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />

            {/* Product Card 3 */}
            <ProductCard
              image={Product1}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />

            {/* Product Card 4 */}
            <ProductCard
              image={Product2}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />

            {/* Product Card 5 */}
            <ProductCard
              image={Product3}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />

            {/* Product Card 6 */}
            <ProductCard
              image={Product3}
              name="Product Name"
              supplier="Supplier Name"
              price={500}
              discount={10}
              rating={5.0}
              reviews={23}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({
  image,
  name,
  supplier,
  price,
  discount,
  rating,
  reviews,
}) {
const router=useRouter()


  return (
    <div onClick={()=>router.push("/products/123")} className=" rounded-lg overflow-hidden group">
      <div className="relative md:h-60 h-44 overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105 "
        />
        <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center">
          <span className="text-[#106C83] mr-1">★</span>
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-[#106C83]">{supplier}</p>
          </div>
          <button className="text-gray-400 hover:text-red-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-2 flex items-center">
          <span className="font-medium">${price}</span>
          <span className="ml-2 text-xs font-medium text-black bg-[#EDC5C5] rounded px-1.5 py-0.5">
            {discount}% OFF
          </span>
        </div>
      </div>
    </div>
  );
}
