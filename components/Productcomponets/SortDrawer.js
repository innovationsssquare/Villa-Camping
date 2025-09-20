import { useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";



const sortOptions = [
  { value: "price-low", label: "Price: Low to High", icon: ArrowUp },
  { value: "price-high", label: "Price: High to Low", icon: ArrowDown },
  { value: "rating-high", label: "Rating: High to Low", icon: ArrowDown },
  { value: "rating-low", label: "Rating: Low to High", icon: ArrowUp },
  { value: "newest", label: "Newest First", icon: ArrowDown },
  { value: "oldest", label: "Oldest First", icon: ArrowUp },
  { value: "name-az", label: "Name: A to Z", icon: ArrowUp },
  { value: "name-za", label: "Name: Z to A", icon: ArrowDown },
];

export function SortDrawer({ onSortChange, currentSort = "" }) {
  const [selectedSort, setSelectedSort] = useState(currentSort);

  const handleSortSelect = (value) => {
    setSelectedSort(value);
  };

  const handleApplySort = () => {
    onSortChange?.(selectedSort);
  };

  const handleClearSort = () => {
    setSelectedSort("");
    onSortChange?.("");
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="bg-white border text-xs border-gray-200 shadow-none text-black hover:bg-gray-50 h-10 px-6 rounded-full flex items-center gap-3  justify-center font-medium"
        >
          <ArrowUpDown className="h-4 w-4" />
          SORT
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Sort Properties</DrawerTitle>
          <DrawerDescription>
           {` Choose how you'd like to sort the properties`}
          </DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="h-[50vh] px-4">
          <div className="space-y-4">
            <RadioGroup value={selectedSort} onValueChange={handleSortSelect}>
              {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label 
                    htmlFor={option.value} 
                    className="flex items-center gap-3 cursor-pointer flex-1 font-medium"
                  >
                    <option.icon className="h-4 w-4 text-gray-600" />
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </ScrollArea>
        <DrawerFooter>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleClearSort}
              className="flex-1 border border-gray-200 bg-gray-50 hover:bg-gray-100"
            >
              Clear Sort
            </Button>
            <DrawerClose asChild>
              <Button 
                onClick={handleApplySort}
                className="flex-1 bg-black text-white hover:bg-gray-800"
              >
                Apply Sort
              </Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}