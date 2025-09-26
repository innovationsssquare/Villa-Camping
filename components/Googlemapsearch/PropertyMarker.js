import React from 'react';
import { Badge } from '@/components/ui/badge';



export const PropertyMarker = ({
  price,
  isHot,
  isDeal,
  has3DTour,
  onClick
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
          bg-white text-black border border-gray-300  rounded-full px-4 py-2 shadow-lg hover:shadow-xl 
          transition-all duration-300 hover:scale-105 cursor-pointer
          flex items-center gap-2 min-w-[80px] justify-center
         
        `}>
          {/* Status icon inside marker */}
          {isHot && <span className="text-orange-400">🔥</span>}
          {has3DTour && <span className="text-purple-400">📦</span>}
          
          <span className="font-bold text-xs whitespace-nowrap">
            ₹{formatPrice(price)}
          </span>
        </div>
        
        {/* Speech bubble tail */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"></div>
      </div>
    </div>
  );
};