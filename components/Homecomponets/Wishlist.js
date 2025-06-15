"use client";

import { useState } from "react";
import { Heart, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Product1 from "@/public/Homeasset/Product1.png";
import Product2 from "@/public/Homeasset/Product2.png";
import Product3 from "@/public/Homeasset/Product3.png";
import Product4 from "@/public/Homeasset/Product4.png";
import Image from "next/image";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetFooter,
  SheetClose,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function WishlistDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      productName: "Product Name",
      supplierName: "Supplier Name",
      originalPrice: 80,
      discountedPrice: 60,
      discountPercentage: 10,
      imageUrl: Product1,
      isFavorite: true,
    },
    {
      id: "2",
      productName: "Product Name",
      supplierName: "Supplier Name",
      originalPrice: 80,
      discountedPrice: 60,
      discountPercentage: 10,
      imageUrl: Product2,
      isFavorite: true,
    },
    {
      id: "3",
      productName: "Product Name",
      supplierName: "Supplier Name",
      originalPrice: 80,
      discountedPrice: 60,
      discountPercentage: 10,
      imageUrl: Product3,
      isFavorite: true,
    },
  ]);

  const toggleFavorite = (id) => {
    setWishlistItems(
      wishlistItems.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div
          variant="outline"
          className="flex cursor-pointer flex-col text-gray-700 items-center"
        >
          <Heart className="h-6 w-6" />
          <SheetTitle className="text-xs font-normal mt-1">
            Wish List
          </SheetTitle>
        </div>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md md:max-w-md p-0 gap-0 rounded-l-2xl overflow-hidden bg-white ml-auto">
        <div className="relative p-6 pb-4">
          <h2 className="text-lg font-bold text-center">Wishlist</h2>
        </div>

        <div className="max-h-[400px] overflow-y-auto px-6">
          {wishlistItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-center gap-4 py-4">
                <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                  <Image
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.productName}</h3>
                  <p className="text-teal-600 text-xs">{item.supplierName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 line-through">
                      ${item.originalPrice}
                    </span>
                    <span className="font-bold text-lg">
                      ${item.discountedPrice}
                    </span>
                    <span className="text-xs font-medium bg-[#EDC5C5] text-black px-2 py-0.5 rounded">
                      {item.discountPercentage}% OFF!
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="p-2"
                  aria-label={
                    item.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <Heart
                    className={`h-6 w-6 ${
                      item.isFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              </div>
              {index < wishlistItems.length - 1 && <Separator />}
            </div>
          ))}
        </div>

        <SheetFooter>
          <SheetClose asChild>
          <Button
            className="w-full bg-[#106C83] rounded-lg text-white py-6 cursor-pointer"
            onClick={() =>router.push("/wishlist")}
          >
            View all Wishlist
          </Button>
          </SheetClose>
        </SheetFooter>

        {/* <div className="p-6 pt-4">
          <Button
            className="w-full bg-[#106C83] rounded-lg text-white py-6 cursor-pointer"
            onClick={() =>router.push("/wishlist")}
          >
            View all Wishlist
          </Button>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}
