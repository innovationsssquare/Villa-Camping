import { AvailableThisWeekend } from "@/components/Availableweekend/available-this-weekend";
import Hero from "@/components/Homecomponets/Hero";

import ShopbyCategory from "@/components/Homecomponets/ShopbyCategory";

export default function Home() {
  return (
    <main>
      <Hero />
      <ShopbyCategory />
      <AvailableThisWeekend />
    </main>
  );
}
