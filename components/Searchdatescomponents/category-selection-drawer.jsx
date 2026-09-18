"use client";

import { useMemo } from "react";
import { X, Check, Home, Tent, Trees, Hotel, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import {
  setSelectedCategory,
  setSelectedCategoryImage,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";

const DEFAULT_METADATA = {
  villa: {
    icon: Home,
    description: "Private pools & luxury estates",
    defaultImg: "/Productasset/Villaimg.png",
  },
  camping: {
    icon: Tent,
    description: "Lakeside tents & bonfire nights",
    defaultImg: "/Productasset/Campimg.png",
  },
  cottage: {
    icon: Trees,
    description: "Cozy nature & hill retreats",
    defaultImg: "/Productasset/Villaimg.png",
  },
  hotel: {
    icon: Hotel,
    description: "Resorts & boutique suites",
    defaultImg: "/Productasset/Campimg.png",
  },
};

export function CategorySelectionDrawer({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const { selectedCategoryId, selectedCategoryName } = useSelector(
    (state) => state.booking
  );

  // Merge API categories with rich descriptions and fallback icons
  const categoryList = useMemo(() => {
    const list = [];

    if (categories && categories.length > 0) {
      categories.forEach((cat) => {
        const key = cat.name?.toLowerCase();
        const meta = DEFAULT_METADATA[key] || {
          icon: Home,
          description: "Curated stays & weekend getaways",
          defaultImg: "/Productasset/Villaimg.png",
        };

        list.push({
          _id: cat._id,
          name: cat.name,
          description: meta.description,
          icon: meta.icon,
          image: cat.image || meta.defaultImg,
        });
      });
    } else {
      // Fallbacks if API is loading or empty
      Object.keys(DEFAULT_METADATA).forEach((key) => {
        const meta = DEFAULT_METADATA[key];
        list.push({
          _id: key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          description: meta.description,
          icon: meta.icon,
          image: meta.defaultImg,
        });
      });
    }

    return list;
  }, [categories]);

  const handleSelect = (category) => {
    dispatch(setSelectedCategory(category._id));
    dispatch(setSelectedCategoryname(category.name));
    dispatch(setSelectedCategoryImage(category.image));
  };

  const isSelected = (cat) => {
    return (
      selectedCategoryId === cat._id ||
      (selectedCategoryName &&
        selectedCategoryName.toLowerCase().startsWith(cat.name.toLowerCase().slice(0, 4)))
    );
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[88vh] rounded-t-3xl border-none bg-white p-0 overflow-hidden">
        {/* Handle Bar */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1" />

        <DrawerHeader className="text-left px-5 pt-2 pb-3 border-b border-neutral-150">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-lg font-bold text-neutral-900">
                Choose Stay Type
              </DrawerTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Explore handpicked properties for your getaway
              </p>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8">
                <X className="h-4 w-4 text-neutral-600" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {/* Categories List */}
        <div className="px-5 py-3 space-y-2.5 max-h-[60vh] overflow-y-auto no-scrollbar">
          {categoryList.map((category) => {
            const selected = isSelected(category);
            const IconComponent = category.icon;

            return (
              <button
                key={category._id}
                type="button"
                onClick={() => handleSelect(category)}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all duration-150 select-none cursor-pointer text-left ${
                  selected
                    ? "border-[#ff6900] bg-orange-50/50 shadow-xs ring-2 ring-[#ff6900]/20"
                    : "border-neutral-200/90 bg-white hover:border-neutral-300 active:bg-neutral-50"
                }`}
              >
                {/* Category Thumbnail / Icon */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden relative bg-neutral-100/80 border border-neutral-200/60">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <IconComponent
                      className={`w-5 h-5 ${
                        selected ? "text-[#ff6900]" : "text-neutral-700"
                      }`}
                    />
                  )}
                </div>

                {/* Text Details */}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm text-neutral-900 leading-snug">
                    {category.name}
                  </div>
                  <div className="text-xs text-neutral-500 truncate mt-0.5">
                    {category.description}
                  </div>
                </div>

                {/* Selection Radio / Checkmark */}
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    selected
                      ? "bg-[#ff6900] text-white"
                      : "border-2 border-neutral-300"
                  }`}
                >
                  {selected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer with Done Button */}
        <DrawerFooter className="px-5 py-3 border-t border-neutral-150 bg-white">
          <Button
            onClick={onClose}
            className="w-full py-3 h-12 text-sm font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
          >
            Apply Stay Type
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
