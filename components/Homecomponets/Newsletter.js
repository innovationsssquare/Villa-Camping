import React from 'react'
import Image from "next/image"
import Link from "next/link"
import Appstore from "@/public/Homeasset/Appstore.png"
import Googleplay from "@/public/Homeasset/Googleplay.png"

const Newsletter = () => {
  return (
    <div className='w-full md:px-8  mx-auto md:py-4 py-2'>
          <div className="bg-[#FFE4E4] md:p-8 p-4 md:my-8 my-4 rounded-lg w-full mx-auto justify-center items-center flex flex-col md:flex-row ">
        {/* Newsletter Section */}
        <div className="flex-1  mb-2 md:mb-0">
          <h2 className="md:text-2xl font-semibold text-[#106C83] md:mb-4 ">Newsletter</h2>
          <p className="text-gray-700 md:mb-4 mb-2 md:text-sm text-xs ">
            This will be a sample sub content acting as a <br></br>placeholder, will be updated later.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border bg-white border-gray-300 rounded-l-md px-4 py-2 focus:outline-none"
            />
            <button className="bg-[#106C83] text-white px-4 py-2 rounded-r-md hover:bg-[#106C83] text-sm font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* App Download Section */}
        <div className="flex-1 text-right">
          <h2 className="md:text-2xl font-semibold text-[#106C83] md:mb-2">Download App</h2>
          <p className="text-gray-700 mb-4 md:text-sm text-xs">
            This will be a sample sub content acting as a <br></br>placeholder, will be updated later.
          </p>
          <div className="flex justify-end space-x-4">
            <Link href="#" className="inline-block">
              <Image
                src={Appstore}
                alt="Download on the App Store"
                width={135}
                height={40}
                className="h-10"
              />
            </Link>
            <Link href="#" className="inline-block">
              <Image
                src={Googleplay}
                alt="Get it on Google Play"
                width={135}
                height={40}
                className="h-10"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Newsletter