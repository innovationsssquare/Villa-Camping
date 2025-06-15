import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';



const AccountTypeOption = ({
  id,
  title,
  imageSrc,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "option-card bg-white border border-gray-200 rounded-xl p-4 cursor-pointer flex flex-col h-full animate-fade-in",
        isSelected ? "selected border-[#EDC5C5] border-2" : ""
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-navy md:text-sm text-xs">{title}</h3>
        <div className={cn("custom-radio", isSelected ? "selected" : "")} />
      </div>
      <div className={cn("flex-grow flex items-center justify-center p-4", isSelected ? "selected grayscale-0 transform scale-110 duration-500" : "grayscale transform scale-100 duration-500")}>
        <Image 
          src={imageSrc} 
          alt={title} 
          className="md:h-[140px] md:w-auto object-contain" 
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default AccountTypeOption;
