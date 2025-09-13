import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import { DestinationHighlights } from "@/components/Homecomponets/DestinationHighlights";
import { Experiences } from "@/components/Homecomponets/Experiences";
import FeaturedVillas from "@/components/Homecomponets/FeaturedVillas";
import Hero from "@/components/Homecomponets/Hero";

import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
import { SpecialOffers } from "@/components/Homecomponets/SpecialOffers";
import {Testimonials} from "@/components/Homecomponets/Testimonials";
import { WhyChooseUs } from "@/components/Homecomponets/WhyChooseUs";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <ShopbyCategory />
      <AvailableThisWeekend />
      <WhyChooseUs/>
      <DestinationHighlights/>
      <Experiences/>
      <SpecialOffers/>
      <Testimonials/>

    </main>
  );
}
