import { Send, DollarSign } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import backgroundhero from "@/public/Homeasset/backgroundhero.png"
import Store from "@/public/Homeasset/Store.png"
import toggle from "@/public/Homeasset/toggle.png"

export default function Home() {
  return (
    <div className="min-h-screen md:pt-44 pt-24 bg-cover bg-center" style={{ backgroundImage: "url(/Homeasset/backgroundhero.png)" }}>
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center space-x-2 mb-6 ring-1 ring-gray-200 shadow-md w-96 h-10 rounded-full">
          <div className="sellerbutton text-white text-xs px-3 py-1.5 h-10 rounded-full flex items-center">
            <span>Become a Seller</span>
          </div>
          <span className="text-sm text-gray-600">List, Sell & Earn from your store!</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl sm:text-5xl font-medium leading-tight">
              Become a Power <br></br> Seller &{" "}
              <div className="inline-flex items-center">
                <div className="relative h-10  w-24">
                  <div className="absolute inset-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center ">
                    <Image src={toggle} alt="Become a Seller List, Sell & Earn from your store!" className="h-10 w-24 object-contain  text-teal-600" />
                  </div>
                </div>
                Grow
              </div>
            </h1>
            <h2 className="text-4xl sm:text-5xl font-bold mt-2 relative">
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-[#106C83] via-[#E6A5A5] to-[#106C83]"
                style={{
                  backgroundImage: "linear-gradient(270.05deg, #106C83 13.99%, #E6A5A5 44.84%, #106C83 93.98%)",
                }}
              >
                Your Business Faster!
              </span>
            </h2>

            <p className="mt-6 text-gray-600 max-w-lg">
              List products effortlessly, or provide unique services, and grow your business! Unlock exclusive benefits,
              bulk orders, and marketing support to grow your brand.
            </p>

            <div className="mt-8">
              <Link
                href="#"
                className="bg-[#106C83] hover:bg-[#106C83]  text-white font-medium px-8 py-3 rounded-lg w-60 text-center inline-block transition-colors"
              >
                Start Selling
              </Link>
            </div>

            <div className="mt-16">
              <p className="font-medium mb-4">Be a trusted seller</p>
              <div className="flex flex-wrap items-center gap-8">
                <div className="h-8 w-20 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                  LOGO
                </div>
                <div className="h-8 w-32 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                  LOGOIPSUM
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                  LOGO IPSUM
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded flex items-center justify-center text-xs font-bold">
                  LOGO
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src={Store}
              width={600}
              height={500}
              alt="E-commerce illustration showing a storefront with people exchanging goods"
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
