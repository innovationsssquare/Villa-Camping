"use client";

import Link from "next/link";
import { Highlighter } from "@/components/magicui/highlighter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white md:pt-40 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-black mb-6 text-center">
          About <Highlighter action="underline" color={"#ff8904"}>The Villa Camp</Highlighter>
        </h1>
        
        <div className="prose prose-lg text-gray-700 space-y-6 leading-relaxed">
          <p>
            Welcome to <strong>The Villa Camp</strong>, your premium handpicked destination for booking unmatched stays in Lonavala, Malavli, Kamshet, and Pawna Lake. We connect you with top-rated private villas, beautiful camping tents, rustic cottages, and premium hotels.
          </p>

          <p>
            Whether you are planning a grand family get-together, a quiet couples getaway, or an adventurous nature escapade with friends, we curate locations that match high standards of cleanliness, safety, and scenic luxury.
          </p>

          <div className="border-l-4 border-black pl-4 my-6 italic text-gray-600">
            "Stays nestled in the lap of nature, enriched with modern comforts."
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-black mt-8 mb-4">
            Our Offerings
          </h2>
          
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Luxury Villas:</strong> Stunning private pools, lawns, and state-of-the-art amenities.</li>
            <li><strong>Pawna Tents:</strong> Cozy outdoor camping with lake-view bonfires and stargazing.</li>
            <li><strong>Rustic Cottages:</strong> Perfect blend of simplicity and comfort in offbeat areas.</li>
            <li><strong>Premium Hotels:</strong> Excellent room service and curated hospitality.</li>
          </ul>

          <div className="mt-12 text-center">
            <Link
              href="/category/all"
              className="inline-block bg-black text-white px-8 py-3.5 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg"
            >
              Explore All Properties
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
