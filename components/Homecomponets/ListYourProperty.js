"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";

const features = [
  {
    id: 1,
    title: "Higher revenue, low maintenance",
    description:
      "Dynamic pricing, design upgrades, and a dedicated sales manager working for your villa.",
  },
  {
    id: 2,
    title: "Access 8L+ verified travellers",
    description:
      "80% book directly with us, not through third-party platforms.",
  },
  {
    id: 3,
    title: "Hassle-free, end-to-end management",
    description:
      "Onboarding, staff training, marketing, and F&B, all handled.",
  },
  {
    id: 4,
    title: "Curated experiences",
    description:
      "Tailored F&B and celebratory experiences that turn guests into repeat bookers.",
  },
];

export default function ListYourProperty() {
  return (
    <section className="w-full py-10 sm:py-14 md:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column: Luxury Villa Image */}
          <div className="lg:col-span-6 w-full">
            <div className="relative aspect-[4/3] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-neutral-100 group">
              <Image
                src="/Homeasset/list-your-property.jpg"
                alt="Luxury Villa with Pool - List Your Property With Us"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                priority={false}
              />
              {/* Subtle Ambient Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Right Column: Content & Features */}
          <div className="lg:col-span-6 w-full flex flex-col justify-center">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-neutral-900 tracking-tight leading-snug mb-6 sm:mb-8">
              List Your Property With Us
            </h2>

            {/* Feature List */}
            <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-9">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-start gap-3.5 sm:gap-4">
                  {/* Coral Circular Check Badge */}
                  <div className="w-6 h-6 rounded-full bg-[#ff8566] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    <Check className="w-3.5 h-3.5 stroke-[3] text-white" />
                  </div>

                  {/* Feature Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-neutral-900 text-[15px] sm:text-base leading-snug">
                      {feature.title}
                    </h3>
                    <p className="text-neutral-500 text-xs sm:text-[14px] leading-relaxed mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/become-host"
                className="inline-flex items-center justify-center gap-2.5 bg-[#181a20] hover:bg-black text-white px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 group active:scale-98"
              >
                <span>List your villa now</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
