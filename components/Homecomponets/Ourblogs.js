import React from "react";
import Blog1 from "@/public/Homeasset/Blog1.png"
import Blog2 from "@/public/Homeasset/Blog2.png"
import Blog3 from "@/public/Homeasset/Blog3.png"
import Image from "next/image"
import { Heart } from "lucide-react"

const Ourblogs = () => {
  return (
    <div className="w-full mx-auto md:px-8 px-4 md:py-12 py-4">
      <h1 className="md:text-4xl font-medium text-center mb-6">
       Our Blogs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 gap-4">
        {/* Product Card 1 */}
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Blog1}
              alt="Vintage Singer sewing machine"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
            <h3 className="font-medium text-gray-800">This is a demo title</h3>
              <p className="text-gray-500 text-xs">This is a demo subtitle, acting as a placeholder.</p>
            
            </div>
           
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Blog2}
              alt="Vintage Singer sewing machine"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-800">This is a demo title</h3>
              <p className="text-gray-500 text-xs">This is a demo subtitle, acting as a placeholder.</p>
            
            </div>
           
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden">
          <div className="relative">
            <Image
              src={Blog3}
              alt="Vintage Singer sewing machine"
              width={400}
              height={400}
              className="w-full md:h-80 object-cover rounded-lg"
            />
          </div>

          <div className="mt-3 flex justify-between items-start">
            <div>
            <h3 className="font-medium text-gray-800">This is a demo title</h3>
            <p className="text-gray-500 text-xs">This is a demo subtitle, acting as a placeholder.</p>
            
            </div>
           
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
  );
};

export default Ourblogs;
