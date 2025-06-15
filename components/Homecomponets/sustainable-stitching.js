import Image from "next/image"
import Link from "next/link"
import { Recycle, ShoppingBag, Shield, Truck, User2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Recycleimage from "@/public/Homeasset/Recycle.png"

export default function SustainableStitchingPage() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <div className="grid md:grid-cols-2 grid-cols-1 w-full items-stretch  justify-items-stretch ">
        {/* Left side - Recycling Image */}
        <div className="w-full ">
          <Image
            src={Recycleimage}
            width={600}
            height={600}
            alt="Recycling symbol made from fabric patches"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Content */}
        <div className="w-full  bg-[#106C83] text-white p-4 md:p-12">
          <div className="w-full">
            <h2 className="text-xl font-normal mb-1">Sustainable Stitching —</h2>
            <h1 className="text-xl md:text-2xl font-bold mb-4">Eco-Friendly Tailor Essentials</h1>

            <p className="mb-4 text-sm">
              At Brindah, we believe in a greener future. Our eco-friendly tailoring essentials are made from
              biodegradable, recycled, and sustainable materials, ensuring that your craft leaves a minimal footprint on
              the environment.
            </p>
             <Separator orientation="horizontal" className="mb-4"/>
            <h3 className="text-xl font-bold mb-4">Why Choose Eco-Friendly Products?</h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="ring-1 ring-white  p-2 rounded-md">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
                <span>Biodegradable & sustainable materials.</span>
              </div>

              <div className="flex items-center gap-4">
              <div className="ring-1 ring-white  p-2 rounded-md">
              <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span>Reduces fabric waste & pollution.</span>
              </div>

              <div className="flex items-center gap-4">
              <div className="ring-1 ring-white  p-2 rounded-md">
              <Shield className="w-5 h-5 text-white" />
                </div>
                <span>Safe for you, better for the planet.</span>
              </div>
            </div>

            <Link href="#" className="inline-block bg-white text-[#106C83] px-6 py-2 rounded-md font-semibold text-sm">
              Explore Now
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {/* Customer Service */}
            <div className="flex flex-col items-center">
              <div className="bg-[#f8d7d7] p-4 rounded-full mb-4">
                <User2 className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">24/7 Customer Service</h3>
              <p className="text-gray-600 text-sm">
               {` We're here to help you with any questions or concerns you have 24/7.`}
              </p>
            </div>

            {/* Guarantee */}
            <div className="flex flex-col items-center">
              <div className="bg-[#f8d7d7] p-4 rounded-full mb-4">
                <Shield className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Our Guarantee</h3>
              <p className="text-gray-600 text-sm">
                We stand behind our products and services and guarantee your satisfaction.
              </p>
            </div>

            {/* Shipping */}
            <div className="flex flex-col items-center">
              <div className="bg-[#f8d7d7] p-4 rounded-full mb-4">
                <Truck className="w-6 h-6 text-[#333333]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-800">Shipping Worldwide</h3>
              <p className="text-gray-600 text-sm">
                We ship our products worldwide, making them accessible to customers everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

