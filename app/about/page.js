import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
import TailoringHero from "@/components/Aboutuscomponets/tailoring-hero";
import WhyChooseBrindah from "@/components/Aboutuscomponets/why-choose-brindah";
import BrindahInstagram from "@/components/Homecomponets/brindah-instagram";
import Newsletter from "@/components/Homecomponets/Newsletter";
import Ourblogs from "@/components/Homecomponets/Ourblogs";
import TestimonialCarousel from "@/components/Homecomponets/testimonial-carousel";
import React from "react";
import Aboutus from "@/public/Aboutusasset/Aboutus.png"
import Aboutbrindah from "@/public/Aboutusasset/Aboutbrindah.png"

const page = () => {
  return (
    <div>
      <Aboutusheader image1={Aboutus} image2={Aboutbrindah} title={"About Brindah"}/>
      <TailoringHero/>
      <WhyChooseBrindah/>
      <TestimonialCarousel/>
      <Ourblogs />
      <BrindahInstagram />
      <Newsletter />
    </div>
  );
};

export default page;
