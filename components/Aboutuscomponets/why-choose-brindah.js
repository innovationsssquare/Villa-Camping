import Image from "next/image"
import Whybrindha from "@/public/Aboutusasset/Whybrindha.png"
import Why1 from "@/public/Aboutusasset/Why1.png"
import Why2 from "@/public/Aboutusasset/Why2.png"
import Why3 from "@/public/Aboutusasset/Why3.png"

export default function WhyChooseBrindah() {
  return (
    <div className="w-full categorygradient2 my-14 relative">
      {/* Stats Banner */}
      <div className="w-11/12 mx-auto px-4 py-8 absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 ">
        <div className="bg-[#f8c8c8] rounded-xl p-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center divide-y md:divide-y-0 md:divide-x divide-gray-400">
            <div className="px-4 py-2 md:py-0 w-full">
              <h3 className="text-3xl font-bold text-gray-800">10K+</h3>
              <p className="text-gray-700 text-sm">Products Available</p>
            </div>
            <div className="px-4 py-2 md:py-0 w-full">
              <h3 className="text-3xl font-bold text-gray-800">50K+</h3>
              <p className="text-gray-700 text-sm">Happy Customers</p>
            </div>
            <div className="px-4 py-2 md:py-0 w-full">
              <h3 className="text-3xl font-bold text-gray-800">100%</h3>
              <p className="text-gray-700 text-sm">Quality-Assured Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="w-11/12 mx-auto  pt-28">
        <div className="grid grid-cols-2 justify-items-center gap-12 items-center">
          <div className="w-full  space-y-6">
            <div>
              <h2 className="text-3xl md:text-3xl font-medium text-gray-800 mb-4">
                {`Why Choose Brindah? – The Best Marketplace for Tailoring Essentials!`}
              </h2>
              <p className="text-gray-600">
               {` We understand the needs of boutique owners, tailors, and stitching professionals. At Brindah, we provide
                a seamless shopping experience, premium quality products, and exclusive benefits designed just for you.`}
              </p>
            </div>

            {/* Feature 1 */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 ">
               <Image src={Why1} alt="Wide Range of Tailoring Essentials" className="w-12 h-12 object-contain"/>
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-800">Wide Range of Tailoring Essentials</h3>
                <p className="text-gray-600 text-sm">
                  From sewing machines and fabrics to threads, needles, and accessories, we offer everything you need in
                  one place.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center gap-4 ">
              <div className="flex-shrink-0">
              <Image src={Why2} alt="Exclusive Bulk Discounts for Businesses" className="w-12 h-12 object-contain"/>

              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-800">Exclusive Bulk Discounts for Businesses</h3>
                <p className="text-gray-600 text-sm">
                  Buy in bulk and save more with our special pricing for boutique owners and tailor shops.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
              <Image src={Why3} alt="Eco-Friendly & Sustainable Options" className="w-12 h-12 object-contain"/>
              </div>
              <div>
                <h3 className="text-md font-semibold text-gray-800">Eco-Friendly & Sustainable Options</h3>
                <p className="text-gray-600 text-sm">
                  Support sustainability with our biodegradable tailoring materials that help reduce environmental
                  impact.
                </p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="w-full flex justify-end items-end ">
            <div className="flex  overflow-hidden">
              <Image
              src={Whybrindha}
                alt="Tailor working with fabric"
                className="object-contain w-full h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

