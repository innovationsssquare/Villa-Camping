"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Star } from "lucide-react";
import { PropertyReviewSkeleton } from "./PropertyReviewSkeleton";
import { fetchReviewHighlights } from "@/Redux/Slices/propertiesSlice";

const PropertyReviewCard = ({
  username,
  location,
  rating,
  review,
  reviewImage,
  userImage,
  propertyName,
}) => {
  const getInitials = (name = "Guest") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0]?.toUpperCase();
    return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
  };

  return (
    <figure
      className={cn(
        "relative h-full md:w-80 w-40 cursor-pointer overflow-hidden rounded-xl border p-0",
        "border-gray-200 bg-white hover:shadow-lg"
      )}
    >
      <div className="relative md:h-48 h-24 w-full overflow-hidden">
        <img
          src={reviewImage || "/placeholder.svg"}
          alt={propertyName}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-medium">{rating}.0</span>
        </div>
      </div>

      <div className="md:p-4 p-2">
        <h3 className="font-semibold md:text-sm text-xs mb-2 line-clamp-1">
          {propertyName}
        </h3>

        <blockquote className="md:text-sm text-xs text-gray-600 mb-3 line-clamp-3">
          {review}
        </blockquote>

        <div className="flex items-center gap-3">
          <div className="rounded-full bg-orange-200 text-xs p-2">{getInitials(username)}</div>
          <div>
            <p className="md:text-sm text-xs font-medium truncate">
              {username}
            </p>
            <p className="text-xs text-gray-500 truncate">{location}</p>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default function PropertyReviews() {
  const dispatch = useDispatch();
  const { reviewsdata, reviewloading, reviewerror } = useSelector(
    (state) => state.properties
  );
  console.log(reviewsdata);
  useEffect(() => {
    dispatch(fetchReviewHighlights());
  }, [dispatch]);

  const firstRow = reviewloading
    ? Array.from({ length: 6 })
    : reviewsdata.slice(0, reviewsdata.length / 2);

  const secondRow = reviewloading
    ? []
    : reviewsdata.slice(reviewsdata.length / 2);

  return (
    <div className="w-full px-4 mx-auto py-4 md:py-8">
      <div className="md:mb-6 mb-4 text-center">
        <h2 className="md:text-4xl font-medium text-foreground">
          Guest Reviews
        </h2>
        <p className="text-gray-600 text-sm">
          See what our travelers are saying about their stays
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:25s]">
          {reviewloading
            ? firstRow.map((_, i) => <PropertyReviewSkeleton key={i} />)
            : firstRow.map((review, index) => (
                <PropertyReviewCard key={index} {...review} />
              ))}
        </Marquee>

        {!reviewloading && secondRow.length > 0 && (
          <Marquee reverse pauseOnHover className="[--duration:25s] hidden">
            {secondRow.map((review, index) => (
              <PropertyReviewCard key={index} {...review} />
            ))}
          </Marquee>
        )}
      </div>
    </div>
  );
}
