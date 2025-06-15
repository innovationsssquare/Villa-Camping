import { Phone, Mail, Share, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { FaPhoneAlt } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { MdShare } from "react-icons/md";

export default function ContactForm() {
  return (
    <div className="w-full mx-auto md:px-8 px-4 md:p-8 py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column - Contact Form */}
        <div>
          <h1 className="md:text-3xl font-medium text-gray-800 md:mb-3 mb-1">Contact us for service!</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-lg">{`Fill required details, we'll contact you in 24 hours!`}</p>

          <form className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#106C83]"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email ID"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#106C83]"
              />
            </div>

            <div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#106C83]"
              />
            </div>

            <div>
              <textarea
                placeholder="Problem Description"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#106C83] resize-none"
              ></textarea>
            </div>

            <div>
              <button type="button" className="text-[#106C83] underline font-medium hover:text-teal-700 flex items-center">
                +Add Media
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-[#106C83] text-white py-3 px-6 rounded-lg cursor-pointer transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Column - Contact Cards */}
        <div className="space-y-2 rounded-md bg-[#FFE4E4] p-2">
          {/* Talk to Us Card */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <FaPhoneAlt className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-1">Talk to Us</h2>
              <p className="text-gray-600 text-sm mb-3">Need any assistance, we are just a call away!</p>
              <Link href="tel:+917392028393" className="text-[#106C83] underline font-medium hover:text-teal-700">
                +91 7392028393
              </Link>
            </div>
          </div>

          {/* Drop Us a Message Card */}
          <div className="border border-pink-200 rounded-lg p-6 bg-white">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <IoMdMail className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-1">Drop Us a Message</h2>
              <p className="text-gray-600 text-sm mb-3">{`Send us an email, and we'll get back to you promptly.`}</p>
              <Link href="mailto:helpbrindah@gmail.com" className="text-[#106C83] underline font-medium hover:text-teal-700">
                helpbrindah@gmail.com
              </Link>
            </div>
          </div>

          {/* Our Socials Card */}
          <div className="border border-pink-200 rounded-lg p-6 bg-white">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <MdShare className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-xl font-medium text-gray-800 mb-1">Our Socials</h2>
              <p className="text-gray-600 text-sm mb-3">Follow us on social media for updates, news & more.</p>
              <div className="flex gap-4">
                <Link href="#" className="text-[#106C83] underline font-medium hover:text-teal-700 flex items-center">
                  Instagram <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="#" className="text-[#106C83] underline font-medium hover:text-teal-700 flex items-center">
                  Facebook <ArrowUpRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

