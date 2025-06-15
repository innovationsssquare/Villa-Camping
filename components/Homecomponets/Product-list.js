import Image from "next/image"
import { Heart } from "lucide-react"
import Product1 from "@/public/Homeasset/Product1.png"
import Product2 from "@/public/Homeasset/Product2.png"
import Product3 from "@/public/Homeasset/Product3.png"
import Product4 from "@/public/Homeasset/Product4.png"
export default function ProductListing() {
  return (
    <div className="w-full mx-auto md:px-8 px-4 md:py-12 py-4">
      <h1 className="md:text-4xl font-medium text-center md:mb-6 mb-3">Curated Products!</h1>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-2 md:mb-8 mb-4 text-xs md:text-sm  sm:flex-wrap sm:justify-center" style={{ scrollbarWidth: "none" }}>
  <button className="px-4 py-2 rounded-md md:rounded-full bg-[#106C83] text-white font-medium flex-shrink-0">New Arrivals</button>
  <button className="px-4 py-2 rounded-md md:rounded-full bg-gray-100 text-gray-700 font-medium flex-shrink-0">Popular</button>
  <button className="px-4 py-2 rounded-md md:rounded-full bg-gray-100 text-gray-700 font-medium flex-shrink-0">Best Sellers</button>
  <button className="px-4 py-2 rounded-md md:rounded-full bg-gray-100 text-gray-700 font-medium flex-shrink-0">Eco - Friendly</button>
</div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 md:gap-6 gap-4">
        {/* Product Card 1 */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Product1}
              alt="Vintage Singer sewing machine"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <span className="text-[#106C83]">★</span>
              <span className="font-medium ml-1">5.0</span>
              <span className="text-gray-600 ml-1">(23)</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800 text-sm md:text-lg">Product Name</h3>
              <p className="text-gray-500 text-xs md:text-sm">Supplier Name</p>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 line-through text-sm">$80</span>
                <span className="text-gray-800 font-bold ml-2">$60</span>
                <span className="ml-2 text-xs font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Card 2 */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Product2}
              alt="Colorful thread spools"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <span className="text-[#106C83]">★</span>
              <span className="font-medium ml-1">5.0</span>
              <span className="text-gray-600 ml-1">(23)</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
             <h3 className="font-medium text-gray-800 text-sm md:text-lg">Product Name</h3>
              <p className="text-gray-500 text-xs md:text-sm">Supplier Name</p>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 line-through text-sm">$80</span>
                <span className="text-gray-800 font-bold ml-2">$60</span>
                <span className="ml-2 text-xs font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Card 3 */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Product3}
              alt="Hands cutting fabric"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <span className="text-[#106C83]">★</span>
              <span className="font-medium ml-1">5.0</span>
              <span className="text-gray-600 ml-1">(23)</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
             <h3 className="font-medium text-gray-800 text-sm md:text-lg">Product Name</h3>
              <p className="text-gray-500 text-xs md:text-sm">Supplier Name</p>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 line-through text-sm">$80</span>
                <span className="text-gray-800 font-bold ml-2">$60</span>
                <span className="ml-2 text-xs font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Product Card 4 */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Product4}
              alt="Woman using sewing machine"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
            <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center">
              <span className="text-[#106C83]">★</span>
              <span className="font-medium ml-1">5.0</span>
              <span className="text-gray-600 ml-1">(23)</span>
            </div>
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
             <h3 className="font-medium text-gray-800 text-sm md:text-lg">Product Name</h3>
              <p className="text-gray-500 text-xs md:text-sm">Supplier Name</p>
              <div className="flex items-center mt-1">
                <span className="text-gray-400 line-through text-sm">$80</span>
                <span className="text-gray-800 font-bold ml-2">$60</span>
                <span className="ml-2 text-xs font-bold bg-red-100 text-red-600 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>
            <button className="text-gray-300 hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center md:mt-10 mt-5">
        <button className="px-8 py-2 bg-[#106C83] text-white font-medium rounded-md hover:bg-[#0a5a6d] transition-colors">
          View All
        </button>
      </div>
    </div>
  )
}

