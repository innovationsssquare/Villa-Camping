import Image from "next/image"
import Scissors from "@/public/Aboutusasset/Scissors.png"
import  ShieldCheck from "@/public/Aboutusasset/Award.png"
import  Truck from "@/public/Aboutusasset/Truck.png"
import  Award  from "@/public/Aboutusasset/ShieldCheck.png"

import Tail from "@/public/Aboutusasset/Tail.png"
import Tail2 from "@/public/Aboutusasset/Tail2.png"
export default function TailoringHero() {
  return (
    <div className="w-11/12 mx-auto min-h-screen bg-white">
      <div className=" mx-auto w-full py-16 grid grid-cols-2 items-center gap-8 lg:gap-16">
        {/* Left side - Images */}
        <div className="relative w-full  h-[400px] lg:h-[500px]">
          <div className="absolute top-0 left-0 w-[80%] h-[80%] rounded-lg overflow-hidden">
            <Image
              src={Tail}
              alt="Tailor working with sewing machine"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-lg overflow-hidden border-8 border-white">
            <Image
              src={Tail2}
              alt="Hands stitching fabric"
              fill
              className="object-cover object-right"
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="w-full  space-y-6">
          <h1 className="text-xl lg:text-3xl font-semibold text-gray-800 leading-tight">
            Empowering Tailors & Boutique Owners with the Best Stitching Essentials!
          </h1>

          <p className="text-md text-gray-600">
           {` Brindah is a one-stop destination for boutique owners, tailors, and stitching professionals. We provide
            premium tailoring essentials, including fabrics, sewing tools, and accessories. Our platform makes bulk
            ordering easy and hassle-free, ensuring you get the best quality at the best prices.`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full categorygradient flex items-center justify-center">
                <Image src={Scissors} alt="High-Quality Products" className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-800">High-Quality Products</span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full categorygradient flex items-center justify-center">
                <Image src={ShieldCheck} alt="Easy & Secure Payments" className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Easy & Secure Payments</span>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full categorygradient flex items-center justify-center">
              <Image src={Truck} alt="Fast & Reliable Delivery" className="object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Fast & Reliable Delivery</span>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full categorygradient flex items-center justify-center ">
              <Image src={Award} alt="Trusted by Boutique Owners & Tailors" className="object-contain" />
              </div>
              <span className="text-xs font-semibold text-gray-800">Trusted by Boutique Owners & Tailors</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

