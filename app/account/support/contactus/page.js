"use client"
import React from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Facebook, Instagram, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation";

const Page = () => {
    const router=useRouter()
    
  return (
    <div className="pb-8">
      <Card className="w-full md:ring-1 ring-gray-300 md:shadow-md shadow-none">
        <CardHeader className="flex flex-row items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 hidden md:block cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-lg font-medium">
            Customer Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#B5B5B5]">
          {`  Fill Required Details, We'll Contact You In 24 Hours!`}
          </p>

          <Input placeholder="First Name" className={"h-12 "}/>
          <Input placeholder="Email ID" className={"h-12 "}/>
          <Input placeholder="Phone Number" className={"h-12 "}/>
          <Textarea
            placeholder="Problem Description"
            className="min-h-[150px]"
          />

          <Button
            variant="outline"
            className="text-[#106C83] flex items-center gap-2 pl-0"
          >
            <PlusCircle className="h-5 w-5" />
            Add Media
          </Button>

          <Button className="w-full bg-[#106C83] text-white font-semibold">
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
