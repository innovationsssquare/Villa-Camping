"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"

const categories = [
  { id: "cottage", name: "Cottage", icon: "🏡" },
  { id: "camping", name: "Camping", icon: "⛺" },
  { id: "villa", name: "Villa", icon: "🏖️" },
  { id: "hotel", name: "Hotel", icon: "🏨" },
]

export function CategorySelectionDrawer({ isOpen, onClose, initialCategory, onSave }) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(initialCategory)
    }
  }, [isOpen, initialCategory])

  const handleSave = () => {
    onSave(selectedCategory)
    onClose()
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader className="text-left">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold text-gray-800">Select Category</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <X className="h-5 w-5 text-gray-600" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="px-4 py-2 space-y-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedCategory === category.id ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-800">{category.name}</div>
              </div>
              {selectedCategory === category.id && (
                <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </button>
          ))}
        </div>

        <DrawerFooter>
          <Button onClick={handleSave} className="w-full py-3 text-lg font-semibold bg-black text-white rounded-lg">
            DONE
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
