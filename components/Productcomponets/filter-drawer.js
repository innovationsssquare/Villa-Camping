"use client"
import React from "react"
import { X } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger, DrawerTitle} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import Fillter from "@/public/Homeasset/Fillter.png"
import Image from "next/image"
export function FilterDrawer() {
  const [open, setOpen] = React.useState(false)
  const [sortOption, setSortOption] = React.useState("popular")
  const [priceValue, setPriceValue] = React.useState([8000])
  const [selectedColor, setSelectedColor] = React.useState("teal")
  const [selectedRating, setSelectedRating] = React.useState("4-5")

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Image src={Fillter} className="object-contain h-10" alt="fillter-icon"/>
      </DrawerTrigger>
      <DrawerContent className="h-[90vh] rounded-t-xl bg-white border-none">
        <div className="mx-auto w-full ">
          <DrawerHeader className="flex justify-between items-center px-4 pt-4 pb-0 w-full">
            <div className="flex items-center gap-4 w-full justify-between">
            <DrawerTitle className="text-xl font-medium">Filter</DrawerTitle>
              <Button variant="link" className="text-[#106C83] font-semibold underline p-0 h-auto">
                Clear All
              </Button>
             
            </div>
          </DrawerHeader>

          <ScrollArea className="h-[calc(80vh-80px)] pb-8">
            <div className="p-4 space-y-6">
              {/* Sort By */}
              <div className="space-y-2">
                <h3 className="text-sm text-gray-500">Sort By</h3>
                <div className="flex gap-2">
                  <Button
                    variant={sortOption === "popular" ? "default" : "outline"}
                    className={
                      sortOption === "popular"
                        ? "bg-[#106C83] text-white hover:bg-teal-700"
                        : "bg-[#E8E8E8] hover:bg-gray-200 text-gray-700 border-0 border-none"
                    }
                    onClick={() => setSortOption("popular")}
                  >
                    Popular
                  </Button>
                  <Button
                    variant={sortOption === "recent" ? "default" : "outline"}
                    className={
                      sortOption === "recent"
                         ? "bg-[#106C83] text-white hover:bg-teal-700"
                        : "bg-[#E8E8E8] hover:bg-gray-200 text-gray-700 border-0 border-none"
                    }
                    onClick={() => setSortOption("recent")}
                  >
                    Recent
                  </Button>
                  <Button
                    variant={sortOption === "highRated" ? "default" : "default"}
                    className={
                      sortOption === "highRated"
                        ? "bg-[#106C83] text-white hover:bg-teal-700"
                        : "bg-[#E8E8E8] hover:bg-gray-200 text-gray-700 border-0 border-none"
                    }
                    onClick={() => setSortOption("highRated")}
                  >
                    High Rated
                  </Button>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-sm text-gray-500">Price Range</h3>
                <div className="px-1">
                  <Slider
                    defaultValue={[8000]}
                    max={10000}
                    min={50}
                    step={50}
                    value={priceValue}
                    onValueChange={setPriceValue}
                    className="[&>.sliderTrack]:bg-teal-100 [&>.sliderRange]:bg-teal-500 [&>.sliderThumb]:border-teal-500"
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">$50</span>
                  {/* <div className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                    ${priceValue[0].toLocaleString()}
                  </div> */}
                  <span className="text-sm font-medium">$10,000+</span>
                </div>
              </div>

              {/* Select Color */}
              <div className="space-y-3">
                <h3 className="text-sm text-gray-500">Select Color</h3>
                <div className="flex gap-3">
                  {[
                    { id: "yellow", color: "bg-yellow-200" },
                    { id: "blue", color: "bg-blue-300" },
                    { id: "green", color: "bg-green-400" },
                    { id: "pink", color: "bg-pink-300" },
                    { id: "teal", color: "bg-teal-500" },
                  ].map((color) => (
                    <button
                      key={color.id}
                      className={`w-10 h-10 rounded-full ${color.color} flex items-center justify-center`}
                      onClick={() => setSelectedColor(color.id)}
                    >
                      {selectedColor === color.id && (
                        <div className="w-6 h-6 rounded-full bg-white/80 flex items-center justify-center">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20 6L9 17L4 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review */}
              <div className="space-y-3">
                <h3 className="text-sm text-gray-500">Review</h3>
                <RadioGroup value={selectedRating} onValueChange={setSelectedRating} className="space-y-3">
                  {[
                    { value: "4-5", label: "4.0 - 5 Star", stars: 4 },
                    { value: "3-4", label: "3.0 - 4 Star", stars: 3 },
                    { value: "2-3", label: "2.0 - 3 Star", stars: 2 },
                    { value: "1-2", label: "1.0 - 2 Star", stars: 1 },
                  ].map((rating) => (
                    <div key={rating.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill={i < rating.stars ? "currentColor" : "none"}
                              stroke="currentColor"
                              className={i < rating.stars ? "text-yellow-400" : "text-gray-300"}
                            >
                              <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm">{rating.label}</span>
                      </div>
                      <RadioGroupItem
                        value={rating.value}
                        id={rating.value}
                        className={selectedRating === rating.value ? "border-teal-500 text-teal-500" : ""}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Apply Button */}
              <Button className="w-11/12 mx-auto rounded-lg absolute left-0 right-0  bottom-0 bg-[#106C83] hover:bg-teal-700 text-white py-3" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

