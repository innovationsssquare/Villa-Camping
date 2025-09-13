import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import Footerlogo from "@/public/Loginasset/Logo2.png"
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black/90 text-white overflow-hidden hidden text-xs md:block">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-serif text-white mb-4">
              The Villa Camp
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              {" "}
              {`Discover the perfect escape with Thevilla Camp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake. Whether you're planning a relaxing family vacation, a romantic weekend, or an adventurous trip with friends, we offer handpicked stays nestled in nature with modern comforts`}
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-300 text-black transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-300 text-black transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-300 text-black transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-300 text-black transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="">
            <h4 className="text-lg font-medium mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#destinations"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Destinations
                </a>
              </li>
              <li>
                <a
                  href="#experiences"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Experiences
                </a>
              </li>
              <li>
                <a
                  href="#gallery"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="#offers"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Special Offers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-lg font-medium mb-6">Destinations</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Lonavala Villas
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Pawna Lake Camps
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Kamshet Cottages
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  Malavli Retreats
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  All Properties
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h4 className="text-lg font-medium mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-gray-300 mr-3 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  <p>123 Hill Station Road</p>
                  <p>Lonavala, Maharashtra 410401</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-gray-300 mr-3" />
                <a
                  href="tel:+919876543210"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-300 mr-3" />
                <a
                  href="mailto:info@thevillacamp.com"
                  className="text-gray-300 hover:text-gray-300 transition-colors"
                >
                  info@thevillacamp.com
                </a>
              </div>
            </div>

           
          </div>


            <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end  ">
          <div className=" mb-4">
            <Image
              src={Footerlogo || "/placeholder.svg"}
              alt="Brindah Logo"
              width={128}
              height={128}
              className="h-40 w-40"
            />
          </div>
        </div>
        </div>

      

        {/* Newsletter signup */}
        <div className="py-8 border-t border-gray-800 hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-xl font-serif mb-2">Stay Updated</h4>
              <p className="text-gray-300">
                Get the latest offers and travel tips delivered to your inbox
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500"
              />
              <button className="px-6 py-3 bg-gray-300 hover:bg-gray-300 text-black text-white rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">
            © 2025 The Villa Camp. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Cancellation Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// import Link from "next/link"
// import Image from "next/image"
// import { Circle } from "lucide-react"
// import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
// import { Card, CardFooter } from "@heroui/react"
// import Footerlogo from "@/public/Loginasset/Logo2.png"
// import Footerimg from "@/public/Productasset/Footerimg.jpg"

// export default function Footer() {
//   return (
//     <Card as="footer"  className="rounded-none border-none shadow-none md:h-[350px] hidden md:block relative ">
//       <div
//         className="absolute inset-0 bg-black opacity-90"
//         // style={{
//         //   backgroundImage: `url(${Footerimg.src})`,
//         //   backgroundSize: "cover",
//         //   backgroundPosition: "center",
//         // }}
//       />

//       <CardFooter className="absolute bg-black/40 bottom-0 top-0 z-10 border-t-1 border-white/20 w-full">
//         <div className="w-full mx-auto px-8 py-4">
//           <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
//             {/* About Brindah Column */}
//             <div className="col-span-2">
//               <h3 className="text-xl font-bold mb-4 text-gray-400">The Camp Villa</h3>
//               <p className="text-gray-400 leading-relaxed text-sm">
//                 {`Discover the perfect escape with Thevilla Camp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake. Whether you're planning a relaxing family vacation, a romantic weekend, or an adventurous trip with friends, we offer handpicked stays nestled in nature with modern comforts`}
//               </p>
//             </div>

//             {/* Quick Links Column */}
//             <div className="text-gray-400">
//               <h3 className="text-xl text-gray-400 font-bold mb-6">Quick Links</h3>
//               <ul className="space-y-2">
//                 {["Home", "About us", "Categories", "Contact Us"].map((item) => (
//                   <li key={item} className="flex items-center">
//                     <Circle className="h-2 w-2 mr-3 fill-black " />
//                     <Link href="#" className="hover:underline text-sm">
//                       {item}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Legal and Logo Column */}
//             <div className="flex flex-col justify-between text-gray-400">
//               <div>
//                 <h3 className="text-xl font-bold mb-6">Legal</h3>
//                 <ul className="space-y-2">
//                   {["Privacy & Policy", "Terms & Condition"].map((item) => (
//                     <li key={item} className="flex items-center">
//                       <Circle className="h-2 w-2 mr-3 fill-black" />
//                       <Link href="#" className="hover:underline text-sm">
//                         {item}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//             <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end col-span-2">
//               <div className="mt-auto  relative mb-4">
//                 <Image
//                   src={Footerlogo || "/placeholder.svg"}
//                   alt="Brindah Logo"
//                   width={128}
//                   height={128}
//                   className="h-40 w-40"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Divider */}
//           <div className="border-t border-white my-4"></div>

//           {/* Bottom Section */}
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             {/* Social Media Icons */}
//             <div className="flex space-x-4 mb-4 md:mb-0">
//               <Link href="#" className="bg-white/30 p-2 rounded-md hover:bg-white/20 transition-colors">
//                 <Instagram className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="bg-white/30 p-2 rounded-md hover:bg-white/20 transition-colors">
//                 <Facebook className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="bg-white/30 p-2 rounded-md hover:bg-white/20 transition-colors">
//                 <Linkedin className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="bg-white/30 p-2 rounded-md hover:bg-white/20 transition-colors">
//                 <Twitter className="h-5 w-5" />
//               </Link>
//               <Link href="#" className="bg-white/30 p-2 rounded-md hover:bg-white/20 transition-colors">
//                 <Youtube className="h-5 w-5" />
//               </Link>
//             </div>

//             {/* Copyright Text */}
//             <div className="text-center text-gray-500 text-sm mb-4 md:mb-0">
//               <p>© Copyrights 2025 TheVillaCamp . All Rights Reserved.</p>
//             </div>

//             {/* Language Selector */}
//           </div>
//         </div>
//       </CardFooter>
//     </Card>
//   )
// }
