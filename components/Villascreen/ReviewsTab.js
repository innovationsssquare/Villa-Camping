import React, { useState } from 'react';
import { Star, Check } from 'lucide-react';

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    name: "Ishan Bakshi",
    initials: "IB",
    rating: 5,
    categories: ["Stay", "Food", "service", "View", "Amenities"],
    text: "Stayed at Barkat Villa, Ramgarh Memorable Experience! Our stay at Barkat Villa was truly special...",
    isTopReview: true,
    timeAgo: "Most recent"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    initials: "SJ",
    rating: 5,
    categories: ["Amenities", "Stay", "Service"],
    text: "Amazing villa with excellent amenities. The service was outstanding and the location perfect.",
    isTopReview: false,
    timeAgo: "2 days ago"
  },
  {
    id: 3,
    name: "Raj Patel",
    initials: "RP",
    rating: 4,
    categories: ["Food", "View", "Stay"],
    text: "Beautiful views and delicious food. Great place for a weekend getaway with family.",
    isTopReview: false,
    timeAgo: "1 week ago"
  },
  {
    id: 4,
    name: "Emma Wilson",
    initials: "EW",
    rating: 5,
    categories: ["Service", "Amenities", "Food"],
    text: "Exceptional service and top-notch amenities. The food was restaurant quality!",
    isTopReview: true,
    timeAgo: "2 weeks ago"
  }
];

const filterCategories = ["All", "Amenities", "Stay", "Food", "Service", "View"];
const sortOptions = ["Most Popular", "Most Recent"];

const ReviewsTab = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSort, setActiveSort] = useState("Most Popular");

  const filteredReviews = mockReviews.filter(review => 
    activeFilter === "All" || review.categories.includes(activeFilter)
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (activeSort === "Most Recent") {
      return a.id - b.id; // Assuming lower ID means more recent
    }
    return b.rating - a.rating; // Most Popular by rating
  });

  return (
    <div className="p-3 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-2">Guest Reviews</h3>
        
        {/* Rating Summary */}
        <div className="text-center mb-6 ">
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-xl font-bold mb-1">5<span className="text-lg text-villa-text-light">/5</span></div>
          <div className="bg-villa-orange/10 inline-block px-3 py-1 rounded-full mb-2">
            <span className="text-sm font-medium">Guest Favourite</span>
          </div>
          <button className="text-blue-500 text-sm underline">({mockReviews.length} Reviews)</button>
        </div>
        
        {/* Filter Tags - Horizontally Scrollable */}
        <div className="overflow-x-auto scrollbar-hide mb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex gap-2 min-w-max">
            {filterCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  activeFilter === category
                    ? "bg-green-50 text-green-500  border border-green-500"
                    : "bg-gray-50 border border-gray-300 text-gray-500 hover:bg-villa-grey/70"
                }`}
              >
                {activeFilter === category ? "✓ " : ""}{category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-4 mb-4 text-sm">
          <span>Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveSort(option)}
              className={`px-3 py-1 rounded-full ${
                activeSort === option
                  ? "bg-green-50  text-green-500 border border-green-500"
                  : "bg-villa-grey border border-gray-300 text-gray-500 hover:bg-villa-grey/70"
              }`}
            >
              {activeSort === option ? "✓ " : ""}{option}
            </button>
          ))}
        </div>
        
        {/* Review Items */}
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <div key={review.id} className="bg-villa-grey/30 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-medium">
                  {review.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{review.name}</h4>
                    {review.isTopReview && (
                      <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">Top Review</span>
                    )}
                  </div>
                  <p className="text-xs text-villa-text-light mb-2">{review.timeAgo}</p>
                  <div className="flex items-center space-x-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{review.rating}</span>
                    <span className="text-xs text-villa-text-light">/5</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.categories.map((category) => (
                      <span key={category} className="px-2 py-1 bg-green-500/20 text-villa-green rounded text-xs">
                        ✓ {category}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-villa-text-light">{review.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsTab;