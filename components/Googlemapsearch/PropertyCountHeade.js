import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ChevronUp } from 'lucide-react';



export const PropertyCountHeader = ({ 
  count, 
  location, 
  onToggleDrawer, 
  isDrawerOpen 
}) => {
  const formatCount = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="absolute bottom-12 left-0 right-0 z-20">
      <Button
        onClick={onToggleDrawer}
        className="w-full bg-white hover:bg-gray-50 text-villa-text border border-gray-200 shadow-lg rounded-t-2xl p-4 h-auto transition-all duration-300"
        variant="outline"
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-villa-primary/10 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-villa-primary" />
            </div>
            <div className="text-left">
              <div className="text-lg font-bold text-villa-text">
                {formatCount(count)} homes
              </div>
              {location && (
                <div className="text-sm text-villa-text-muted">
                  in {location}
                </div>
              )}
            </div>
          </div>
          <ChevronUp 
            className={`w-5 h-5 text-villa-primary transition-transform duration-200 ${
              isDrawerOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </Button>
    </div>
  );
};