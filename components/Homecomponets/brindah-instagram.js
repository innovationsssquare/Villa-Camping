import Image from "next/image"
import Link from "next/link"
import Insta1 from "@/public/Homeasset/Insta1.png"
import Insta2 from "@/public/Homeasset/Insta2.png"
import Insta3 from "@/public/Homeasset/Insta3.png"
import Insta4 from "@/public/Homeasset/Insta4.png"
import Insta5 from "@/public/Homeasset/Insta5.png"
import Insta6 from "@/public/Homeasset/Insta6.png"
import Insta7 from "@/public/Homeasset/Insta7.png"
export default function BrindahInstagram() {
  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="text-center md:py-8 py-4">
        <h1 className="md:text-4xl text-xl font-medium text-gray-800">Brindah On Instagram</h1>
        <Link href="#" className="text-teal-600 md:text-xl hover:underline">
          #brindah
        </Link>
      </div>

      {/* Image Gallery */}
      <div className="flex w-full h-24 md:h-44 overflow-hidden">
        <div className="flex-1">
          <Image
            src={Insta1}
            alt="Sewing materials"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Image
            src={Insta2}
            alt="Thread spools"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Image
            src={Insta3}
            alt="Thread rack"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Image
            src={Insta4}
            alt="Sewing basket"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Image
            src={Insta5}
            alt="Mannequin"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Image
            src={Insta6}
            alt="Sewing machine"
            width={256}
            height={256}
            className="w-full h-full object-cover"
          />
        </div>
      </div>    
    </div>
  )
}

