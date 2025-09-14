import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import { DestinationHighlights } from "@/components/Homecomponets/DestinationHighlights";
import DiscoverOffBeat from "@/components/Homecomponets/discover-off-beat";
import { Experiences } from "@/components/Homecomponets/Experiences";
import FeaturedVillas from "@/components/Homecomponets/FeaturedVillas";
import Hero from "@/components/Homecomponets/Hero";
import PropertyReviews from "@/components/Homecomponets/property-reviews";

import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
import { SpecialOffers } from "@/components/Homecomponets/SpecialOffers";
import {Testimonials} from "@/components/Homecomponets/Testimonials";
import TrendingVideos from "@/components/Homecomponets/Trendingvideos";
import WeekendGetaway from "@/components/Homecomponets/weekend-getaway";
import { WhyChooseUs } from "@/components/Homecomponets/WhyChooseUs";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Home() {
  return (
    <main className="overflow-hidden w-full">
      <Hero />
      <ShopbyCategory />
      <AvailableThisWeekend />
      <DestinationHighlights/>
      <WeekendGetaway/>
      {/* <DiscoverOffBeat/> */}
      <TrendingVideos/>
      <WhyChooseUs/>
      <PropertyReviews/>
      {/* <Experiences/>
      <SpecialOffers/>
      <Testimonials/> */}

    </main>
  );
}
