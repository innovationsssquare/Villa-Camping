import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Circle } from "lucide-react"
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react"
import Footerlogo from "@/public/Loginasset/Logo2.png"
export default function Footer() {
  return (
    <footer className="bg-black/90 text-white ">
      <div className="w-full mx-auto px-8 py-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12">
          {/* About Brindah Column */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-4">The Camp Villa</h3>
            <p className="text-white leading-relaxed text-sm">
             {` Brindah helps tailoring businesses reduce waste and embrace sustainable practices. From providing premium
              tools and materials to handling fabric waste management, we enable you to focus on what you do best while
              we handle the rest.`}
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About us", "Categories", "Contact Us"].map((item) => (
                <li key={item} className="flex items-center">
                  <Circle className="h-2 w-2 mr-3 fill-white " />
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
                    <Circle className="h-2 w-2 mr-3 fill-white" />
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
                <Image src={Footerlogo} alt="Brindah Logo" width={128} height={128} className="h-40 w-40" />
              </div>
            </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white my-4"></div>

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
          <div className="text-center text-sm mb-4 md:mb-0">
            <p>© Copyrights 2025 TheVillaCamp . All Rights Reserved.</p>
          </div>

          {/* Language Selector */}
          
        </div>
      </div>
    </footer>
  )
}

