"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Tag, Clock } from "lucide-react"
import { setSelectedCategory, } from "@/Redux/Slices/bookingSlice"
import Image from "next/image"


export function CategorySearch({ onCategorySelect, isMobile = false }) {
  const [searchTerm, setSearchTerm] = useState("")
  const dispatch = useDispatch()
  const { categories, loading, error } = useSelector((state) => state.category)




  const filteredCategories =
    categories?.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())) || []

  const handleCategorySelect = (categoryId, categoryName) => {
    dispatch(setSelectedCategory(categoryId))
    onCategorySelect(categoryId,categoryName)
  }

  if (loading) {
    return (
      <div className="relative">
        <div
          className={`absolute -top-1.5 md:-top-2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
            isMobile
              ? "w-3 h-3 left-1/4 transform -translate-x-1/2"
              : "w-3 h-3 md:w-4 md:h-4 left-1/2 transform -translate-x-1/2"
          }`}
        ></div>
        <div
          className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
            isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
          }`}
        >
          <div className="text-center py-4 text-gray-500">Loading categories...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Tooltip Arrow - Responsive sizing and positioning */}
      <div
        className={`absolute -top-1.5 md:-top-2 bg-white border-l border-t border-gray-200 rotate-45 z-10 ${
          isMobile
            ? "w-3 h-3 left-1/4 transform -translate-x-1/2"
            : "w-3 h-3 md:w-4 md:h-4 left-1/2 transform -translate-x-1/2"
        }`}
      ></div>

      <div
        className={`bg-white border border-gray-200 rounded-2xl shadow-lg relative z-20 ${
          isMobile ? "p-4 w-72" : "p-4 md:p-6 w-72 md:w-80"
        }`}
      >
        <input
          type="text"
          placeholder="Search categories"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
            isMobile ? "p-2.5 text-sm" : "p-2.5 md:p-3 text-sm md:text-base"
          }`}
        />

        {searchTerm === "" && (
          <>
          
            <div className={isMobile ? "mt-4" : "mt-4 md:mt-6"}>
              <h4 className={`font-medium text-gray-900 mb-2 md:mb-3 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                All categories
              </h4>
              {categories?.slice(0, 4).map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategorySelect(category._id, category.name)}
                  className={`flex items-center w-full hover:bg-gray-50 rounded-lg transition-colors ${
                    isMobile ? "p-1.5" : "p-1.5 md:p-2"
                  }`}
                >
                  <Image height={40} width={40} src={category?.image} alt={category.name} className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-2 md:mr-3" />
                  <div className="text-left">
                    <div className={`text-gray-700 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                      {category.name}
                    </div>
                   
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {searchTerm !== "" && (
          <div className={isMobile ? "mt-3" : "mt-3 md:mt-4"}>
            {filteredCategories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategorySelect(category._id, category.name)}
                className={`flex items-center w-full hover:bg-gray-50 rounded-lg transition-colors ${
                  isMobile ? "p-1.5" : "p-1.5 md:p-2"
                }`}
              >
                <Tag className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mr-2 md:mr-3" />
                <div className="text-left">
                  <div className={`text-gray-700 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                    {category.name}
                  </div>
                  {category.description && (
                    <div className={`text-gray-500 ${isMobile ? "text-xs" : "text-xs md:text-sm"}`}>
                      {category.description}
                    </div>
                  )}
                </div>
              </button>
            ))}
            {filteredCategories.length === 0 && (
              <div className={`text-gray-500 text-center py-4 ${isMobile ? "text-sm" : "text-sm md:text-base"}`}>
                No categories found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
