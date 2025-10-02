"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { useSelector, useDispatch } from "react-redux"
import Image from "next/image"
import { setSelectedCategory, setSelectedCategoryImage, setSelectedCategoryname } from "@/Redux/Slices/bookingSlice"

export function CategorySelectionDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const { categories } = useSelector((state) => state.category)
  const { selectedCategoryId } = useSelector((state) => state.booking)

  useEffect(() => {
    // optional: could reset state when drawer opens if needed
  }, [isOpen])

  const handleSelect = (category) => {
    dispatch(setSelectedCategory(category?._id))
    dispatch(setSelectedCategoryname(category?.name))
    dispatch(setSelectedCategoryImage(category?.image))
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh] border-none">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold text-gray-800">
              Select Category
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-3">
          {categories?.slice(0,4)?.map((category) => (
            <button
              key={category._id}
              onClick={() => handleSelect(category)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedCategoryId === category._id
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Image
                height={40}
                width={40}
                src={category?.image}
                alt={category?.name}
              />
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800">
                  {category?.name}
                </div>
              </div>
              {selectedCategoryId === category._id && (
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        <DrawerFooter>
          <Button
            onClick={onClose}
            className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg"
          >
            DONE
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
