"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Facebook, Instagram, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

const Page = () => {
const router=useRouter()
    
  return (
    <div>
      <Card className="w-full ring-1 ring-gray-300 shadow-md">
        <CardHeader className="flex flex-row items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <CardTitle className="text-lg font-medium">Socials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[#B5B5B5]">
            Follow Our Socials To Stay Updated!
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="flex justify-between items-center h-12 ring-1 ring-gray-300 border-0"
            >
              <div className="flex items-center">
                <Instagram className="h-5 w-5 text-pink-500 mr-2" />
                Instagram
              </div>
              <ExternalLink className="h-4 w-4 text-[#106C83]" />
            </Button>

            <Button
              variant="outline"
              className="flex justify-between items-center h-12 ring-1 ring-gray-300 border-0"
            >
              <div className="flex items-center">
                <Facebook className="h-5 w-5 text-blue-600 mr-2" />
                Facebook
              </div>
              <ExternalLink className="h-4 w-4 text-[#106C83]" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
