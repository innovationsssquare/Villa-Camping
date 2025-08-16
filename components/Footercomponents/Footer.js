import Link from "next/link"
import Image from "next/image"
import { Circle } from "lucide-react"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
import { Card, CardFooter } from "@heroui/react"
import Footerlogo from "@/public/Loginasset/Logo2.png"
import Footerimg from "@/public/Productasset/Footerimg.jpg"

export default function Footer() {
  return (
    <Card as="footer" isFooterBlurred className="rounded-none border-none shadow-none md:h-[350px] hidden md:block relative">
      <div
        className="absolute inset-0  opacity-90"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1739126602267-d2ef91dfcf5c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <CardFooter className="absolute bg-black/40 bottom-0 top-0 z-10 border-t-1 border-white/20 w-full">
        <div className="w-full mx-auto px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
            {/* About Brindah Column */}
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4">The Camp Villa</h3>
              <p className="text-black leading-relaxed text-sm">
                {`Discover the perfect escape with Thevilla Camp, your one-stop destination for booking the best villas, campsites, cottages, and hotels across Lonavala, Malavli, Kamshet, and Pawna Lake. Whether you're planning a relaxing family vacation, a romantic weekend, or an adventurous trip with friends, we offer handpicked stays nestled in nature with modern comforts`}
              </p>
            </div>

            {/* Quick Links Column */}
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <ul className="space-y-2">
                {["Home", "About us", "Categories", "Contact Us"].map((item) => (
                  <li key={item} className="flex items-center">
                    <Circle className="h-2 w-2 mr-3 fill-black " />
                    <Link href="#" className="hover:underline text-sm">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal and Logo Column */}
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-6">Legal</h3>
                <ul className="space-y-2">
                  {["Privacy & Policy", "Terms & Condition"].map((item) => (
                    <li key={item} className="flex items-center">
                      <Circle className="h-2 w-2 mr-3 fill-black" />
                      <Link href="#" className="hover:underline text-sm">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 md:mt-0 flex flex-col items-center md:items-end col-span-2">
              <div className="mt-auto  relative mb-4">
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

          {/* Divider */}
          <div className="border-t border-black my-4"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Media Icons */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              <Link href="#" className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-white/10 p-2 rounded-md hover:bg-white/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright Text */}
            <div className="text-center text-gray-500 text-sm mb-4 md:mb-0">
              <p>© Copyrights 2025 TheVillaCamp . All Rights Reserved.</p>
            </div>

            {/* Language Selector */}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
