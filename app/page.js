import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import BrindahInstagram from "@/components/Homecomponets/brindah-instagram";
import Hero from "@/components/Homecomponets/Hero";
import Newsletter from "@/components/Homecomponets/Newsletter";
import Ourblogs from "@/components/Homecomponets/Ourblogs";
import ProductListing from "@/components/Homecomponets/Product-list";
import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";
import SustainableStitchingPage from "@/components/Homecomponets/sustainable-stitching";
import TestimonialCarousel from "@/components/Homecomponets/testimonial-carousel";
import { Separator } from "@/components/ui/separator";

export default function Home() {

  return (
    <main>
      <Hero />
      <ShopbyCategory />
     <AvailableThisWeekend/>
    </main>
  );
}
