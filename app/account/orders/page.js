"use client"

import { useState } from "react"
import { CheckCircle, Circle } from "lucide-react"
import Image from "next/image"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import Prod1 from "@/public/Productasset/Prod1.png";

export default function OrdersUI() {
  const [activeTab, setActiveTab] = useState("active")

  return (
    <div className="w-full h-full md:p-6 p-3 mx-auto md:rounded-xl border border-gray-200 md:shadow-sm overflow-hidden bg-white">
      <div className="p-4">
        <h1 className="text-lg font-medium mb-4">My Orders</h1>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`pb-2 mr-6 text-sm font-medium ${
              activeTab === "active" ? "text-[#106C83] border-b-2 border-[#106C83]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("active")}
          >
            Active Orders
          </button>
          <button
            className={`pb-2 text-sm font-medium ${
              activeTab === "again" ? "text-[#106C83] border-b-2 border-[#106C83]" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("again")}
          >
            Order Again
          </button>
        </div>

        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="order-1" className="border-0">
              <AccordionTrigger className="p-0 hover:no-underline">
                <div className="flex items-center w-full">
                  <div className="md:h-28 md:w-28 rounded-md overflow-hidden mr-3">
                    <Image
                      src={Prod1}
                      alt="Product image"
                      width={64}
                      height={64}
                      className="object-cover md:h-28 md:w-28"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">Product Name</h3>
                    <p className="md:text-sm text-xs text-gray-500">Size: Small</p>
                    <p className="md:text-sm text-xs text-gray-500">Color: Teal</p>
                    <p className="font-medium mt-1">$60</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full md:mr-2">Delivery Today</div>
                  </div>
                </div>
              </AccordionTrigger>
              <Separator className="w-full mt-2"/>
              <AccordionContent>
                <div className="pt-4 pb-2">
                  <h3 className="font-medium mb-3">Order Details</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
                    <div className="text-gray-500">Order ID</div>
                    <div className="text-right font-medium">#Order839</div>

                    <div className="text-gray-500">Paid On</div>
                    <div className="text-right">25-02-2025</div>

                    <div className="text-gray-500">Payment Method</div>
                    <div className="text-right">UPI</div>

                    <div className="text-gray-500">Tracking ID</div>
                    <div className="text-right font-medium">#Track728</div>
                  </div>
                  <Separator className="w-full my-2"/>

                  <h3 className="font-medium mb-3">Status</h3>

                  <div className="relative mb-4">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Order Placed */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-500">24-02-2025</p>
                      </div>
                    </div>

                    {/* In Transit */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-gray-500">28-02-2025</p>
                      </div>
                    </div>

                    {/* Product Shipped */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">Product Shipped</p>
                        <p className="text-sm text-gray-500">2-03-2025</p>
                      </div>
                    </div>

                    {/* Out for Delivery */}
                    <div className="flex relative">
                      <div className="mr-4">
                        <Circle className="h-6 w-6 text-gray-400 stroke-2" />
                      </div>
                      <div>
                        <p className="font-medium">Out for Delivery</p>
                        <p className="text-sm text-gray-500">4-03-2025</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-[#EA4335] text-white py-2 rounded-md hover:bg-red-600 transition-colors">
                    Cancel Order
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="order-2" className="border-0 mt-4">
              <AccordionTrigger className="p-0 hover:no-underline">
                <div className="flex items-center w-full">
                <div className="md:h-28 md:w-28 rounded-md overflow-hidden mr-3">
                    <Image
                      src={Prod1}
                      alt="Product image"
                      width={64}
                      height={64}
                      className="object-cover md:h-28 md:w-28"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium">Product Name</h3>
                    <p className="md:text-sm text-xs text-gray-500">Size: Small</p>
                    <p className="md:text-sm text-xs text-gray-500">Color: Teal</p>
                    <p className="font-medium mt-1">$60</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full mr-2">In Transit</div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-4 pb-2">
                  <h3 className="font-medium mb-3">Order Details</h3>

                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-6">
                    <div className="text-gray-500">Order ID</div>
                    <div className="text-right font-medium">#Order840</div>

                    <div className="text-gray-500">Paid On</div>
                    <div className="text-right">28-02-2025</div>

                    <div className="text-gray-500">Payment Method</div>
                    <div className="text-right">UPI</div>

                    <div className="text-gray-500">Tracking ID</div>
                    <div className="text-right font-medium">#Track729</div>
                  </div>

                  <h3 className="font-medium mb-3">Status</h3>

                  <div className="relative mb-4">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    {/* Order Placed */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">Order Placed</p>
                        <p className="text-sm text-gray-500">28-02-2025</p>
                      </div>
                    </div>

                    {/* In Transit */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <CheckCircle className="h-6 w-6 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-medium">In Transit</p>
                        <p className="text-sm text-gray-500">2-03-2025</p>
                      </div>
                    </div>

                    {/* Product Shipped */}
                    <div className="flex mb-4 relative">
                      <div className="mr-4">
                        <Circle className="h-6 w-6 text-gray-400 stroke-2" />
                      </div>
                      <div>
                        <p className="font-medium">Product Shipped</p>
                        <p className="text-sm text-gray-500">Pending</p>
                      </div>
                    </div>

                    {/* Out for Delivery */}
                    <div className="flex relative">
                      <div className="mr-4">
                        <Circle className="h-6 w-6 text-gray-400 stroke-2" />
                      </div>
                      <div>
                        <p className="font-medium">Out for Delivery</p>
                        <p className="text-sm text-gray-500">Pending</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors">
                    Cancel Order
                  </button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

