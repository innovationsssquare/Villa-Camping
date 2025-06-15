"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AccountPage() {
  const [addressType, setAddressType] = useState("home")

  return (
    <div className="w-full mx-auto overflow-hidden">
      <Card className="ring-1 ring-gray-200 shadow-md md:p-4 ">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Update Personal Details</h2>
          <div className="space-y-8">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Anita Sharma" className="mt-2 h-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email ID</Label>
                <Input id="email" type="email" defaultValue="anita.sharma@example.com" className="mt-2 h-12" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="mt-2 h-12" />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Set Address</h3>
              <Button variant="outline" size="sm" className="h-8 ring-1 ring-[#EDC5C5] border-0">
                + Add Address
              </Button>
            </div>

            <Tabs defaultValue="home" onValueChange={setAddressType} className="w-full">
              <TabsList className="w-full justify-start border-b border-gray-200 rounded-none h-auto p-0 bg-white">
                <TabsTrigger
                  value="home"
                  className={`rounded-none text-[#106C83] font-bold  border-b-2 px-4 py-2 ${
                    addressType === "home" ? "border-b-[#106C83]" : "border-transparent"
                  }`}
                >
                  Home
                </TabsTrigger>
                <TabsTrigger
                  value="office"
                  className={`rounded-none border-b-2 px-4 py-2 ${
                    addressType === "office" ? "border-b-[#106C83]" : "border-transparent"
                  }`}
                >
                  Office
                </TabsTrigger>
                <TabsTrigger
                  value="shop"
                  className={`rounded-none border-b-2 px-4 py-2 ${
                    addressType === "shop" ? "border-b-[#106C83]" : "border-transparent"
                  }`}
                >
                  Shop
                </TabsTrigger>
                <TabsTrigger
                  value="friend"
                  className={`rounded-none border-b-2 px-4 py-2 ${
                    addressType === "friend" ? "border-b-[#106C83]" : "border-transparent"
                  }`}
                >
                  Friend&apos;s House
                </TabsTrigger>
              </TabsList>

              <TabsContent value="home" className="mt-4">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="building">Apartment/Suite/Building No.</Label>
                    <Input id="building" className="mt-2 h-12" placeholder="Apartment/Suite/Building No." />
                  </div>

                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input id="street" className="mt-2 h-12" placeholder="Street Address" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" className="mt-2 h-12" placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Province/Region</Label>
                      <Input id="state" className="mt-2 h-12" placeholder="State/Province/Region" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postal">Postal Code/ZIP Code</Label>
                      <Input id="postal" className="mt-2 h-12" placeholder="Postal Code/ZIP Code" />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" className="mt-2 h-12" placeholder="Country" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox id="shipping" />
                    <label
                      htmlFor="shipping"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      This is my shipping address
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="office" className="mt-4">
                <div className="h-64 flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">No office address added yet</p>
                </div>
              </TabsContent>

              <TabsContent value="shop" className="mt-4">
                <div className="h-64 flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">No shop address added yet</p>
                </div>
              </TabsContent>

              <TabsContent value="friend" className="mt-4">
                <div className="h-64 flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">{`No friend's house address added yet`}</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button className="flex-1 bg-[#106C83] cursor-pointer text-white ">Save Address</Button>
              <Button
                variant="outline"
                className="flex-1 text-[#F1000B] border-[#F1000B] hover:bg-red-50 hover:text-red-600"
              >
                Delete Address
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

