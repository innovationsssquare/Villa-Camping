import dynamic from "next/dynamic";
import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import { DestinationHighlights } from "@/components/Homecomponets/DestinationHighlights";
import DiscoverOffBeat from "@/components/Homecomponets/discover-off-beat";
import { Experiences } from "@/components/Homecomponets/Experiences";
import FeaturedVillas from "@/components/Homecomponets/FeaturedVillas";
import Hero from "@/components/Homecomponets/Hero";
import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
import { SpecialOffers } from "@/components/Homecomponets/SpecialOffers";
import { Testimonials } from "@/components/Homecomponets/Testimonials";
import WeekendGetaway from "@/components/Homecomponets/weekend-getaway";
import { WhyChooseUs } from "@/components/Homecomponets/WhyChooseUs";
import ListYourProperty from "@/components/Homecomponets/ListYourProperty";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

// Dynamic imports for below-the-fold modules to minimize initial JavaScript bundle size
const AnnouncementModal = dynamic(() => import("@/components/Homecomponets/announcement-modal"));
const TrendingVideos = dynamic(() => import("@/components/Homecomponets/Trendingvideos"));
const PropertyReviews = dynamic(() => import("@/components/Homecomponets/property-reviews"));
const RecentlyVisited = dynamic(() => import("@/components/Homecomponets/RecentlyVisited"));
const AIConciergeBot = dynamic(() => import("@/components/AIConcierge/AIConciergeBot"), { ssr: false });

// Incremental Static Regeneration: revalidate home page every 60 seconds
export const revalidate = 60;

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

      {/* AI Stay Concierge Floating Mascot & WhatsApp Launcher */}
      <AIConciergeBot />
    </main>
  );
}
