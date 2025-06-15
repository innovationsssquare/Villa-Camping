import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Product1 from "@/public/Homeasset/Product1.png"
import Product2 from "@/public/Homeasset/Product2.png"
import Product3 from "@/public/Homeasset/Product3.png"
import Product4 from "@/public/Homeasset/Product4.png"

export default function WishlistPage() {
  return (
    <div className="w-full mx-auto md:px-8 px-4 md:py-8 py-20 md:pt-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center md:mb-6 mb-2">
        <h1 className="md:text-3xl  font-medium text-gray-800 mb-2 md:mb-0">
          You have <span className="font-bold">{`'3'`}</span> Products in your Wishlist!
        </h1>

        {/* <div className="flex  item center  flex-row gap-3">
          <div className="flex items-center">
            <span className="mr-2 text-gray-700 text-xs md:text-sm">Category:</span>
            <Select defaultValue="All">
              <SelectTrigger className="md:w-[140px] ring-1 ring-gray-300 border-0 text-xs md:text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className={"text-xs md:text-sm"}>
                <SelectItem className={"text-xs md:text-sm"} value="All">All</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="Sewing">Sewing</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="Fabrics">Fabrics</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="Tools">Tools</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-gray-700 text-xs md:text-sm">Sort by:</span>
            <Select defaultValue="Recent">
              <SelectTrigger className="md:w-[140px] ring-1 ring-gray-300 border-0 text-xs md:text-sm">
                <SelectValue placeholder="Select sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className={"text-xs md:text-sm"} value="Recent">Recent</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="LowToHigh"> Low to High</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="HighToLow"> High to Low</SelectItem>
                <SelectItem className={"text-xs md:text-sm"} value="Rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div> */}
      </div>

      <hr className="border-gray-200 md:mb-8 mb-4" />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 md:gap-8 gap-4">
        {/* Product 1 */}
        <div className="flex flex-col">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={Product1}
              alt="Colorful thread spools"
              width={320}
              height={320}
              className="w-full md:h-80 h-44 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 fill-[#106C83] stroke-[#106C83] mr-1" />
              <span className="font-medium md:text-sm text-xs">5.0</span>
              <span className="text-gray-600 ml-1 md:text-sm text-xs">(23)</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium md:text-lg text-sm">Product Name</h3>
              <p className="text-[#106C83] text-xs md:text-sm">Supplier Name</p>

              <div className="mt-2 flex items-cente ">
                <span className="text-gray-400 line-through mr-2">$80</span>
                <span className="font-bold md:text-xl text-sm">$60</span>
                <span className="ml-2 md:text-xs text-[0.7rem] font-medium text-black bg-[#EDC5C5] md:px-2 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600">
              <Heart className="w-6 h-6 stroke-2" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={Product2}
              alt="Colorful thread spools"
              width={320}
              height={320}
              className="w-full md:h-80 h-44 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 fill-[#106C83] stroke-[#106C83] mr-1" />
              <span className="font-medium md:text-sm text-xs">5.0</span>
              <span className="text-gray-600 ml-1 md:text-sm text-xs">(23)</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium md:text-lg text-sm">Product Name</h3>
              <p className="text-[#106C83] text-xs md:text-sm">Supplier Name</p>

              <div className="mt-2 flex items-cente ">
                <span className="text-gray-400 line-through mr-2">$80</span>
                <span className="font-bold md:text-xl text-sm">$60</span>
                <span className="ml-2 md:text-xs text-[0.7rem] font-medium text-black bg-[#EDC5C5] md:px-2 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600">
              <Heart className="w-6 h-6 stroke-2" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={Product3}
              alt="Colorful thread spools"
              width={320}
              height={320}
              className="w-full md:h-80 h-44 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 fill-[#106C83] stroke-[#106C83] mr-1" />
              <span className="font-medium md:text-sm text-xs">5.0</span>
              <span className="text-gray-600 ml-1 md:text-sm text-xs">(23)</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium md:text-lg text-sm">Product Name</h3>
              <p className="text-[#106C83] text-xs md:text-sm">Supplier Name</p>

              <div className="mt-2 flex items-cente ">
                <span className="text-gray-400 line-through mr-2">$80</span>
                <span className="font-bold md:text-xl text-sm">$60</span>
                <span className="ml-2 md:text-xs text-[0.7rem] font-medium text-black bg-[#EDC5C5] md:px-2 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600">
              <Heart className="w-6 h-6 stroke-2" />
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="relative rounded-lg overflow-hidden mb-4">
            <Image
              src={Product3}
              alt="Colorful thread spools"
              width={320}
              height={320}
              className="w-full md:h-80 h-44 object-cover"
            />
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
              <Star className="w-4 h-4 fill-[#106C83] stroke-[#106C83] mr-1" />
              <span className="font-medium md:text-sm text-xs">5.0</span>
              <span className="text-gray-600 ml-1 md:text-sm text-xs">(23)</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium md:text-lg text-sm">Product Name</h3>
              <p className="text-[#106C83] text-xs md:text-sm">Supplier Name</p>

              <div className="mt-2 flex items-cente ">
                <span className="text-gray-400 line-through mr-2">$80</span>
                <span className="font-bold md:text-xl text-sm">$60</span>
                <span className="ml-2 md:text-xs text-[0.7rem] font-medium text-black bg-[#EDC5C5] md:px-2 px-1 py-0.5 rounded">10% OFF!</span>
              </div>
            </div>

            <button className="text-gray-400 hover:text-gray-600">
              <Heart className="w-6 h-6 stroke-2" />
            </button>
          </div>
        </div>

      
      
      </div>
    </div>
  )
}

