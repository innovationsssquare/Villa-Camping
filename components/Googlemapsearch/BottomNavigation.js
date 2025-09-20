import React from "react";
import { Button } from "@/components/ui/button";
import { Search, Home, DollarSign, Heart, User } from "lucide-react";

export const BottomNavigation = ({ activeTab = "search", onTabChange }) => {
  const tabs = [
    { id: "search", label: "Search", icon: Search },
    { id: "homes", label: "My Homes", icon: Home },
    { id: "list-sell", label: "List & Sell", icon: DollarSign },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
                isActive ? "text-primary" : "text-gray-600"
              }`}
              onClick={() => onTabChange?.(tab.id)}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
              <span
                className={`text-xs font-medium ${
                  isActive ? "text-primary" : "text-gray-600"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 bg-primary rounded-full mt-1" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Property count */}
      <div className="text-center py-2 border-t border-gray-100 mt-2">
        <span className="text-sm font-semibold text-gray-900">
          Over 191K Homes
        </span>
      </div>
    </div>
  );
};
