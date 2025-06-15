import Image from "next/image"
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProductDetail() {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-white">
      {/* Navigation */}
      <div className="flex justify-between items-center mb-6">
        <a href="#" className="flex items-center text-sm font-medium text-gray-700">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Browse Products
        </a>
        <a href="#" className="flex items-center text-sm font-medium text-gray-700">
          See Similar Products
          <ChevronRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="relative">
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
              alt="Product Image"
              width={500}
              height={500}
              className="w-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex mt-4 space-x-2">
            <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
                alt="Thumbnail 1"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
                alt="Thumbnail 2"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
                alt="Thumbnail 3"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
                alt="Thumbnail 4"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 border border-gray-200 rounded-md overflow-hidden relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sCzA8PD9SdEt81jGJNIeoAlzQb2SBE.png"
                alt="Thumbnail 5"
                width={64}
                height={64}
                className="w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-medium">
                +5
              </div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="inline-block px-2 py-1 bg-[#0d6efd] text-white text-xs font-medium rounded">
            Product Category
          </div>

          <h1 className="text-2xl font-bold mt-2">Product Name</h1>
          <p className="text-gray-600">Seller Name</p>

          <div className="flex items-center mt-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-gray-600">5.0</span>
            <span className="ml-1 text-gray-500">(349)</span>
          </div>

          <div className="flex items-center mt-4">
            <span className="text-2xl font-bold">$60</span>
            <span className="ml-2 text-gray-500 line-through">$80</span>
            <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">10% OFF</span>
          </div>

          {/* Product Details */}
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium">Product Details</h3>
            <p className="text-sm text-gray-600 mt-1">
              Upgrade your stitching with this powerful heavy-duty sewing machine, designed for boutique owners and
              tailors. It features multiple stitch patterns, an automatic thread cutter, and a durable metal frame for
              precision and More...
            </p>
          </div>

          {/* Features */}
          <div className="mt-6">
            <h3 className="font-medium">Features</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                12 built-in stitch patterns
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Compact & easy to use</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                High-speed stitching (1,100 stitches per minute)
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                Works on light & heavy fabrics
              </span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-6">
            <h3 className="font-medium">Select Size</h3>
            <div className="flex gap-2 mt-2">
              <button className="px-4 py-2 bg-[#0d6efd] text-white text-sm rounded-md">Small - 5 KG</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md">Medium - 7 KG</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 text-sm rounded-md">Large - 9 KG</button>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mt-6">
            <h3 className="font-medium">Select Color</h3>
            <div className="flex gap-3 mt-2">
              <button className="w-8 h-8 rounded-full bg-yellow-300 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-blue-300 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-green-400 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-pink-400 border border-gray-300"></button>
              <button className="w-8 h-8 rounded-full bg-teal-500 border-2 border-teal-600 ring-2 ring-teal-300"></button>
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center mt-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button className="px-3 py-1 border-r border-gray-300">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <input
                  type="text"
                  value="1"
                  className="w-12 text-center py-1 border-none focus:outline-none"
                  readOnly
                />
                <button className="px-3 py-1 border-l border-gray-300">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button className="ml-4 px-6 py-2 w-full bg-white border border-[#0d6efd] text-[#0d6efd] font-medium rounded-md">
                Add to Bag
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description and Reviews */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="border-b border-gray-200 w-full justify-start">
            <TabsTrigger
              value="description"
              className="px-6 py-2 text-gray-800 font-medium data-[state=active]:border-b-2 data-[state=active]:border-gray-800"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="px-6 py-2 text-gray-500 font-medium data-[state=active]:border-b-2 data-[state=active]:border-gray-800"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-6">
            <h3 className="text-lg font-medium">Lorem ipsum dolor sit amet elit.</h3>
            <p className="mt-2 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
            </p>
            <p className="mt-4 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem, totam rem
              aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
              explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
              consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
              dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
              incidunt ut labore et dolore magnam.
            </p>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

