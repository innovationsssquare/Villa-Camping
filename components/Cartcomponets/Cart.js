"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Prod1 from "@/public/Productasset/Prod1.png";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CheckoutPage() {
  const [quantities, setQuantities] = useState([2, 2, 2]);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 md:py-12 py-20 md:px-8 px-4 w-full mx-auto">
      <div className="flex-1">
        {/* Delivery Address */}
        <div className="bg-[#106C83] text-white p-4 rounded-lg mb-6 flex justify-between items-center">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 mt-0.5" />
            <div>
              <div className="font-medium">Home</div>
              <div className="text-sm opacity-90">
                This will be a sample address acting as a filler.
              </div>
            </div>
          </div>
          <Button variant="ghost" className="text-white  hover:text-white">
            Change
          </Button>
        </div>

        {/* Product Items */}
        <div className="space-y-4">
          {[0, 1, 2].map((index) => (
            <div key={index} className="border-b border-[#DCDCDC] pb-4">
              <div className="flex items-start gap-4">
                <div className="relative  rounded-md overflow-hidden ">
                  <Image
                    src={Prod1}
                    alt="Product image"
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-lg">Product Name</h3>
                  </div>
                  <p className="text-sm text-[#106C83]">Supplier Name</p>

                  {/* <Select defaultValue="Small">
                      <SelectTrigger className="w-[120px] border border-gray-300">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Small">Small</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Large">Large</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="Teal">
                      <SelectTrigger className="w-[120px] border border-gray-300">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teal">Teal</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                      </SelectContent>
                    </Select> */}

                  <div className="flex flex-wrap gap-3 mt-3">
                    <div className="flex items-center">
                      <button
                        className="w-8 h-8 flex ring-1 items-center justify-center ring-[#106C83] rounded-md"
                        onClick={() =>
                          updateQuantity(index, quantities[index] - 1)
                        }
                      >
                        −
                      </button>
                      <span className="w-8 text-center">
                        {quantities[index]}
                      </span>
                      <button
                        className="w-8 h-8 flex items-center justify-center border rounded-md bg-[#0a7a8d] text-white"
                        onClick={() =>
                          updateQuantity(index, quantities[index] + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                   
                  </div>
                </div>
                <div className="text-xl  font-semibold flex  flex-col justify-between items-center h-24">
                  <button className="text-gray-400 ring-1 p-2 ring-gray-200 rounded-full hover:text-gray-600">
                    <X size={20} />
                  </button>
                  <span className="mt-auto">$60</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mt-6">
          <h3 className="font-medium mb-2">Coupons</h3>
          <div className="flex gap-2 border border-gray-200 rounded-lg p-1">
            <Input
              placeholder="Enter Coupon Code"
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button className="bg-white font-bold text-[#106C83] hover:bg-gray-50 hover:text-[#106C83] border-0">
              Apply
            </Button>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="w-full md:w-80 bg-[#F4F4F4] p-6 rounded-lg h-fit">
        <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Order</span>
            <span>$67</span>
          </div>

          <div className="flex border-t border-[#C6C6C6] pt-2 justify-between">
            <span>Delivery</span>
            <span>$8</span>
          </div>

          <div className="flex border-t border-[#C6C6C6] pt-2 justify-between">
            <span>Discount</span>
            <span>-7$</span>
          </div>

          <div className="flex border-t border-[#C6C6C6] pt-2 justify-between">
            <span>Tax</span>
            <span>28$</span>
          </div>

          <div className="pt-4 border-t border-[#C6C6C6] flex justify-between font-semibold">
            <span>Total</span>
            <span>128$</span>
          </div>
        </div>

        <Button className="w-full text-white mt-6 bg-[#106C83] hover:bg-[#106C83]">
          Pay Now
        </Button>
      </div>
    </div>
  );
}
