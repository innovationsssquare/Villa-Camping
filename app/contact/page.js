import Aboutusheader from "@/components/Aboutuscomponets/Aboutusheader";
import ContactForm from "@/components/Contactuscomponents/contact-form";
import Newsletter from "@/components/Homecomponets/Newsletter";
import React from "react";
import Conatctus from "@/public/Homeasset/Conatctus.png"
import Contactus2 from "@/public/Homeasset/Contactus2.png"
const page = () => {
  return (
    <div>
      <Aboutusheader
        image1={Conatctus}
        image2={Contactus2}
        title={"Contact Us"}
      />
      <ContactForm />
      <Newsletter />
    </div>
  );
};

export default page;
