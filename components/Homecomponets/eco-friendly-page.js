import Image from "next/image"
import { Tag, CheckCircle, Globe, Shield } from "lucide-react"
import Ecofriendly from "@/public/Homeasset/Ecofriendly.png"
import recycle2 from "@/public/Homeasset/recycle2.png"

import eco1 from "@/public/Homeasset/eco1.png"
import eco2 from "@/public/Homeasset/eco2.png"
import eco3 from "@/public/Homeasset/eco3.png"
import eco4 from "@/public/Homeasset/eco4.png"

export default function EcoFriendlyProducts() {
  return (
    <div className="w-full md:px-8 mx-auto px-4 md:py-12">
      {/* Header Section */}
      <div className="flex flex-col-reverse md:flex-row gap-6 my-16">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#106C83] mb-3">
            <Image src={recycle2} alt="Sustainable stitching for a better tomorrow!" className="h-5 w-5" />
            <span className="text-sm italic">Sustainable stitching for a better tomorrow!</span>
          </div>

          <h1 className="text-xl md:text-4xl font-medium text-gray-800 mb-4">
            Benefits of Choosing
            <br className="" />
            Eco-Friendly Products!
          </h1>

          <p className="text-[#6F6F6F] mb-6 text-justify">
            Eco-friendly tailoring essentials are made from biodegradable, organic, or recycled materials, ensuring
            minimal environmental impact. From natural fiber fabrics to biodegradable sewing accessories, these products
            help reduce waste and promote sustainable fashion.
          </p>

          <div className="inline-flex items-center gap-2 text-[#106C83] font-bold">
            <Tag className="h-4 w-4" />
            <span>I am a Seller</span>
          </div>
        </div>

        <div className="flex-1">
          <Image
            src={Ecofriendly}
            alt="Eco-friendly sewing materials including teal and blue threads, fabric swatches, and buttons arranged with green plant elements"
            width={450}
            height={300}
            className="rounded-lg w-full h-auto"
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-8">
        <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-10">
          Benefits of Choosing Eco-Friendly Products
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Benefit Card 1 */}
          <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4">
            <div className="bg-white ring-1 ring-gray-300 p-3 rounded-md">
              <Image src={eco1} alt="Sustainable & Biodegradable" className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="md:text-xl font-semibold text-gray-800 mb-1">Sustainable & Biodegradable</h3>
              <p className="text-gray-600 text-sm">Reduces textile waste and pollution.</p>
            </div>
          </div>

          {/* Benefit Card 2 */}
          <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4">
            <div className="bg-white ring-1 ring-gray-300 p-3 rounded-md">
            <Image src={eco2} alt="Healthier for You & the Planet" className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="md:text-xl font-semibold text-gray-800 mb-1">Healthier for You & the Planet</h3>
              <p className="text-gray-600 text-sm">Free from harmful chemicals and toxins.</p>
            </div>
          </div>

          {/* Benefit Card 3 */}
          <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4">
            <div className="bg-white ring-1 ring-gray-300 p-3 rounded-md">
            <Image src={eco3} alt="Durable & High-Quality" className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="md:text-xl font-semibold text-gray-800 mb-1">Durable & High-Quality</h3>
              <p className="text-gray-600 text-sm">Made to last while being eco-conscious.</p>
            </div>
          </div>

          {/* Benefit Card 4 */}
          <div className="border border-gray-200 rounded-lg p-6 flex items-start gap-4">
            <div className="bg-white ring-1 ring-gray-300 p-3 rounded-md">
            <Image src={eco4} alt="Supports Ethical Practices" className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="md:text-xl font-semibold text-gray-800 mb-1">Supports Ethical Practices</h3>
              <p className="text-gray-600 text-sm">Encourages responsible sourcing and fair labor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

