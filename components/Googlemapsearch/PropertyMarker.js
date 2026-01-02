import React from 'react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';



export const PropertyMarker = ({
  price,
  isHot,
  isDeal,
  has3DTour,
  onClick,
  image
}) => {
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)}M`;
    }
    return `${(price / 1000).toFixed(0)}K`;
  };

  const getMarkerClass = () => {
    let baseClass = "villa-marker cursor-pointer hover:scale-105 transition-transform";
    if (isHot) baseClass += " hot";
    if (isDeal) baseClass += " deal";
    if (has3DTour) baseClass += " tour-3d";
    return baseClass;
  };

  return (
    <div className="relative" onClick={onClick}>
      {/* Modern pill-shaped marker */}
      <div className="relative">
        {/* Main price marker */}
        <div className={`
          ${getMarkerClass()} 
          bg-orange-200 text-orange-500 border border-orange-500  rounded-full h-10 w-8 p-2  shadow-lg hover:shadow-xl 
          transition-all duration-300 hover:scale-105 cursor-pointer
          flex items-center gap-2 min-w-[80px] justify-end
         
        `}>
          <Image
            src={image}
            height={20}
            width={20}
            className='absolute left-0 rounded-l-full h-10 w-10'
            unoptimized
          />

          
          <span className="font-bold text-xs text-left whitespace-nowrap">
           ₹{formatPrice(price)}
          </span>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-orange-300"></div>
      </div>
    </div>
  );
};