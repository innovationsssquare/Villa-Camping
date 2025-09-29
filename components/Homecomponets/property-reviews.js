"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Star } from "lucide-react";

const propertyReviews = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
    review:
      "Amazing beachfront villa in Goa! The infinity pool overlooking the ocean was breathtaking. Perfect for a romantic getaway.",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    userImage: "/indian-woman-profile.png",
    propertyName: "Ocean View Villa, Goa",
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    rating: 4,
    review:
      "Stunning mountain retreat in Manali. Woke up to snow-capped peaks every morning. The wooden interiors were so cozy!",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",

    userImage: "/travel-blogger-profile.jpg",
    propertyName: "Mountain Lodge, Manali",
  },
  {
    name: "Anita Desai",
    location: "Bangalore",
    rating: 5,
    review:
      "Heritage palace stay in Rajasthan exceeded all expectations. The royal treatment and authentic cuisine made it unforgettable.",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    userImage: "/young-woman-smiling.png",
    propertyName: "Royal Palace, Udaipur",
  },
  {
    name: "Vikram Singh",
    location: "Chennai",
    rating: 4,
    review:
      "Peaceful backwater resort in Kerala. The houseboat experience and Ayurvedic spa treatments were incredibly relaxing.",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/1bbfc3f9-181b-4015-858c-4f650f6b453f_qd0fep.jpg",

    userImage: "/travel-blogger-profile.jpg",
    propertyName: "Backwater Resort, Alleppey",
  },
  {
    name: "Meera Patel",
    location: "Pune",
    rating: 5,
    review:
      "Adventure camp in Ladakh was life-changing! Clear night skies, Buddhist monasteries, and the most welcoming hosts.",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875530/villas/8a570db4-22b1-4d16-ae65-06aec4745c2c_etvwiw.jpg",

    userImage: "/indian-woman-profile.png",
    propertyName: "Adventure Camp, Ladakh",
  },
  {
    name: "Arjun Reddy",
    location: "Hyderabad",
    rating: 4,
    review:
      "Historic ruins exploration in Hampi with comfortable accommodation. The sunrise over the boulder landscape was magical.",
    propertyImage:
      "https://res.cloudinary.com/db60uwvhk/image/upload/v1753875525/villas/e4ab61e9-ac3c-4c5f-a7fc-c2f5211014ad_c3y9cj.jpg",

    userImage: "/travel-blogger-profile.jpg",
    propertyName: "Heritage Stay, Hampi",
  },
];

const firstRow = propertyReviews.slice(0, propertyReviews.length / 2);
const secondRow = propertyReviews.slice(propertyReviews.length / 2);

const PropertyReviewCard = ({
  name,
  location,
  rating,
  review,
  propertyImage,
  userImage,
  propertyName,
}) => {
  return (
    <figure
      className={cn(
        "relative h-full md:w-80 w-40 cursor-pointer overflow-hidden rounded-xl border p-0",
        // light styles
        "border-gray-200 bg-white hover:shadow-lg",
        // dark styles
        "dark:border-gray-800 dark:bg-gray-900"
      )}
    >
      {/* Property Image */}
      <div className="relative md:h-48 h-24 w-full overflow-hidden">
        <img
          src={propertyImage || "/placeholder.svg"}
          alt={propertyName}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}.0</span>
        </div>
      </div>

      {/* Content */}
      <div className="md:p-4 p-2">
        {/* Property Name */}
        <h3 className="font-semibold md:text-sm text-xs text-gray-900 dark:text-white mb-2 line-clamp-1">
          {propertyName}
        </h3>

        {/* Review Text */}
        <blockquote className="md:text-sm text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
          {review}
        </blockquote>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <img
            className="rounded-full h-8 w-8 object-cover"
            src={userImage || "/placeholder.svg"}
            alt={name}
          />
          <div className="flex-1 min-w-0">
            <p className="md:text-sm text-xs font-medium text-gray-900 dark:text-white truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {location}
            </p>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default function PropertyReviews() {
  return (
    <div className="w-full px-4 mx-auto py-4 md:py-8">
      <div className="md:mb-6 mb-4 text-center">
          <h2 className="md:text-4xl  font-medium text-foreground">
          Guest Reviews
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          See what our travelers are saying about their stays
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-lg">
        <Marquee pauseOnHover className="[--duration:25s]">
          {firstRow.map((review, index) => (
            <PropertyReviewCard key={`first-${index}`} {...review} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:25s] hidden">
          {secondRow.map((review, index) => (
            <PropertyReviewCard key={`second-${index}`} {...review} />
          ))}
        </Marquee>
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-gray-50 dark:from-gray-950"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-gray-50 dark:from-gray-950"></div> */}
      </div>
    </div>
  );
}
