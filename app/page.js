import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import { DestinationHighlights } from "@/components/Homecomponets/DestinationHighlights";
import DiscoverOffBeat from "@/components/Homecomponets/discover-off-beat";
import { Experiences } from "@/components/Homecomponets/Experiences";
import FeaturedVillas from "@/components/Homecomponets/FeaturedVillas";
import Hero from "@/components/Homecomponets/Hero";
import PropertyReviews from "@/components/Homecomponets/property-reviews";

import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
import RecentlyVisited from "@/components/Homecomponets/RecentlyVisited";
import AnnouncementModal from "@/components/Homecomponets/announcement-modal";
import { SpecialOffers } from "@/components/Homecomponets/SpecialOffers";
import {Testimonials} from "@/components/Homecomponets/Testimonials";
import TrendingVideos from "@/components/Homecomponets/Trendingvideos";
import WeekendGetaway from "@/components/Homecomponets/weekend-getaway";
import { WhyChooseUs } from "@/components/Homecomponets/WhyChooseUs";
import ListYourProperty from "@/components/Homecomponets/ListYourProperty";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Home() {
  return (
    <main className="overflow-hidden w-full">
      {/* Active Promotional / Event Visitor Popup */}
      <AnnouncementModal />

      <Hero />
      <ShopbyCategory />

      <AvailableThisWeekend />
      <DestinationHighlights/>
      {/* <WeekendGetaway/> */}
      {/* <DiscoverOffBeat/> */}
      <TrendingVideos/>
      <PropertyReviews/>
      <WhyChooseUs/>
      <ListYourProperty />
      {/* <Experiences/>
      <Testimonials/> */}

      {/* Recently Visited Properties (Browsing History with Property Type Tabs) */}
      <RecentlyVisited />
    </main>
  );
}
