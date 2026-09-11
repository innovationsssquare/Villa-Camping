import React from "react";

export const PropertyMarker = ({
  price,
  isHot,
  isDeal,
  has3DTour,
  onClick,
  image,
}) => {
  function formatRupee(amount) {
    if (amount == null || Number.isNaN(Number(amount))) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(Number(amount))}`;
  }

  const getMarkerClass = () => {
    let baseClass =
      "villa-marker group relative cursor-pointer select-none transition-all duration-200 hover:scale-110 active:scale-95";
    if (isHot) baseClass += " hot";
    if (isDeal) baseClass += " deal";
    return baseClass;
  };

  return (
    <div className="relative group/marker" onClick={onClick}>
      <div className="relative flex flex-col items-center">
        {/* Main price marker pill */}
        <div
          className={`
            ${getMarkerClass()}
            bg-white text-neutral-900 border border-neutral-300/80 rounded-full
            h-8 px-2.5 shadow-[0_3px_10px_rgba(0,0,0,0.18)]
            flex items-center gap-1.5
          `}
        >
          {image && (
            <img
              src={image}
              alt=""
              className="w-5 h-5 rounded-full object-cover border border-black/10 shrink-0"
              loading="lazy"
            />
          )}

          <span className="font-extrabold text-xs tracking-tight whitespace-nowrap text-neutral-900">
            {formatRupee(price)}
          </span>
        </div>

        {/* Pointer bubble tail */}
        <div className="marker-tail w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white -mt-[1px] filter drop-shadow-[0_2px_1px_rgba(0,0,0,0.1)] transition-colors duration-200" />
      </div>
    </div>
  );
};