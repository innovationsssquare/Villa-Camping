"use client";

import Image from "next/image";
import {
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  HomeIcon,
  Search,
  Map,
  RefreshCcw,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchdestination,
  setselectedLocationId,
} from "@/Redux/Slices/propertiesSlice";
import { Button, Skeleton } from "@heroui/react";
import { PropertySkeleton } from "../Availableweekend/Property-skeleton";
import { useRouter } from "next/navigation";
import { Highlighter } from "../magicui/highlighter";
import { CarouselIndicator } from "../Availableweekend/carousel-indicators";

function DestinationCard({ destination }) {
  const router = useRouter();
  const dispatch = useDispatch();
  return (
    <div
      onClick={() => {
        dispatch(setselectedLocationId(destination._id)),
          router.push("/search-your-gateway");
      }}
      className="group w-full md:w-auto  rounded-2xl overflow-hidden shadow-none hover:shadow-2xl transition-all duration-300  h-full border border-gray-200"
    >
      <div className="relative md:h-56 h-36  overflow-hidden">
        <Image
          src={destination?.coverImage || "/placeholder.svg"}
          alt={destination.name}
          unoptimized
          height={40}
          width={40}
          className="object-fill w-full h-36 md:h-48  group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-orange-100 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-orange-500 fill-current" />
          <span className="text-sm font-medium ">{destination.rating}</span>
        </div>
      </div>

      <div className="p-2 sm:p-4">
        <div className="flex  items-center text-sm text-gray-400 mb-2">
          <MapPin className="w-4 h-4 mr-1 text-red-400 " />
          <h3 className="text-md sm:text-xl  text-black ">
            {destination.name}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-2 truncate">
          {destination.description}
        </p>
        <div className="flex items-center justify-between">
          <Highlighter
            color="#fed5a6"
            className="flex  items-center text-xs text-gray-400 w-full"
          >
            <HomeIcon className="w-4 h-4 mr-1 text-black inline-block" />
            <p className="text-xs md:text-sm inline-block">
              {destination.properties} properties
            </p>
          </Highlighter>
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
            <svg
              className="w-4 h-4 text-white group-hover:text-gray-900 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

function DestinationSkeleton() {
  return (
    <Card className="group w-full rounded-3xl overflow-hidden border-none shadow-md bg-white">
      <Skeleton className="md:h-64 h-48 w-full rounded-none" />
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

function EmptyDestinationState() {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 text-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center animate-bounce duration-[3000ms]">
          <Map className="w-12 h-12 text-primary/30" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Search className="w-5 h-5 text-primary" />
        </div>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">
        No destinations found
      </h3>
      <p className="text-gray-500 max-w-sm mb-10 leading-relaxed">
        We couldn't find any destinations matching your current search. Try
        refreshing or exploring other categories.
      </p>
      <Button
        onClick={() => dispatch(fetchdestination())}
        variant="outline"
        className="rounded-full px-8 py-6 h-auto text-lg hover:bg-primary hover:text-white transition-all duration-300"
      >
        <RefreshCcw className="mr-2 h-5 w-5" />
        Refresh List
      </Button>
    </div>
  );
}

export function DestinationHighlights() {
  const [isMobile, setIsMobile] = useState(false);
  const dispatch = useDispatch();
  const { destinationLoading, destinationData, destinationError } = useSelector(
    (state) => state.properties
  );

  const [api, setApi] = useState();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const onApiChange = (api) => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  };

  const handleDotClick = (index) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    dispatch(fetchdestination());
  }, [dispatch]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);
  //  if (!destinationLoading) {
  //     return (
  //       <div className="flex gap-4 overflow-x-hidden md:px-4 px-2 py-8 ">
  //                 {[...Array(4)].map((_, i) => (
  //                   <div key={i} className=" flex-shrink-0">
  //                     <PropertySkeleton />
  //                   </div>
  //                 ))}
  //               </div>
  //     )
  //   }

  // if (destinationError) {
  //   return (
  //     <section className="py-24 text-center">
  //       <div className="container mx-auto px-6 max-w-2xl">
  //         <div className="bg-red-50 text-red-600 p-10 rounded-[2.5rem] border border-red-100">
  //           <h3 className="text-2xl font-bold mb-4">Connection Issue</h3>
  //           <p className="mb-8 opacity-80 leading-relaxed">
  //             We're having trouble reaching our travel guide database. Please
  //             check your internet connection and try again.
  //           </p>
  //           <Button
  //             onClick={() => dispatch(fetchdestination())}
  //             variant="destructive"
  //             className="rounded-full px-10 py-6 h-auto text-lg shadow-xl shadow-red-200"
  //           >
  //             Retry Connection
  //           </Button>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // }

  // if (!destinationData || destinationData.length === 0) {
  //   return (
  //     <section className="py-12 md:py-20">
  //       <div className="container mx-auto px-6">
  //         <EmptyDestinationState />
  //       </div>
  //     </section>
  //   );
  // }

  return (
    <section className="py-4 sm:py-6 md:py-12 ">
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center  sm:mb-12 md:mb-4">
          <h2 className="md:text-4xl text-center font-medium text-foreground">
            Choose Your Destination
          </h2>
          <p className="text-xs sm:text-base md:text-sm text-gray-400 max-w-3xl mx-auto text-pretty">
            {` Discover the perfect getaway in Lonavala's most beautiful hill stations`}
          </p>
        </div>

        {destinationLoading ? (
          <div className="flex gap-4 overflow-x-hidden md:px-4  py-6 ">
            {[...Array(4)].map((_, i) => (
              <div key={i} className=" flex-shrink-0">
                <PropertySkeleton />
              </div>
            ))}
          </div>
        ) : destinationError ? (
          <section className="py-24 text-center">
            <div className="container mx-auto px-6 max-w-2xl">
              <div className="bg-red-50 text-red-600 p-10 rounded-[2.5rem] border border-red-100">
                <h3 className="text-2xl font-bold mb-4">Connection Issue</h3>
                <p className="mb-8 opacity-80 leading-relaxed">
                  We're having trouble reaching our travel guide database.
                  Please check your internet connection and try again.
                </p>
                <Button
                  onClick={() => dispatch(fetchdestination())}
                  variant="destructive"
                  className="rounded-full px-10 py-6 h-auto text-lg shadow-xl shadow-red-200"
                >
                  Retry Connection
                </Button>
              </div>
            </div>
          </section>
        ) : !destinationData || destinationData.length === 0 ? (
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-6">
              <EmptyDestinationState />
            </div>
          </section>
        ) : (
          <div className=" relative">
            <Carousel
              setApi={(api) => {
                setApi(api);
                onApiChange(api);
              }}
              opts={{
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {destinationData.map((destination, index) => (
                  <CarouselItem
                    key={destination.name}
                    className="pl-2 md:pl-4 basis-3/5 md:basis-4/16"
                  >
                    <Card className="border-0 border-gray-200 shadow-none bg-transparent">
                      <CardContent className="p-0">
                        <DestinationCard destination={destination} />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <CarouselIndicator
              current={current}
              count={count}
              variant="lines"
              onDotClick={handleDotClick}
            />
          </div>
        )}
      </div>
    </section>
  );
}
