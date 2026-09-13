import React from "react";
import ContactForm from "@/components/Contactuscomponents/contact-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  HelpCircle,
  MapPin,
  Clock,
  Car,
  Compass,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us & Concierge Support | ThevillaCamp",
  description:
    "Get in touch with ThevillaCamp's 24/7 Concierge team. Inquire about private pool villa bookings, Pawna Lake camping, group retreats, or host partnerships.",
};

const FAQS = [
  {
    q: "How fast will our concierge respond to an inquiry?",
    a: "Our customer support and on-ground concierge team operates 24/7. When you submit a ticket through this form, our team typically responds via WhatsApp or phone call within 15 to 30 minutes during standard hours.",
  },
  {
    q: "Can I request early check-in or late check-out?",
    a: "Early check-in and late check-out depend on villa availability and prior guest cleaning protocols. Please include your requested hours in the inquiry message, and our concierge will coordinate directly with the property caretaker.",
  },
  {
    q: "Are private chefs and meals provided at the villas?",
    a: "Yes! Most of our private villas offer dedicated cook or chef services for traditional Maharashtrian cuisine, North Indian specialties, and live barbecue sessions by the pool. Meal packages can be arranged in advance.",
  },
  {
    q: "How do cancellations and refunds work?",
    a: "Standard bookings enjoy flexible cancellation terms with 100% refund eligibility up to 7 days before check-in. Approved refunds are processed back to your original payment method within 5 to 7 business days.",
  },
  {
    q: "Are pets allowed at the villas and campsites?",
    a: "Over 70% of our properties are 100% pet-friendly with expansive enclosed lawns and safe gardens. When booking, select the 'Pet-Friendly' filter or let us know in your inquiry so we can recommend the best stays for your furry friends.",
  },
  {
    q: "How do I become a host and list my property?",
    a: "We welcome exceptional villas and farmstays! Select 'Host / Property Partnership' in the form category or visit our Become a Host portal. Our property onboarding team will schedule a physical inspection within 48 hours.",
  },
];

export default function ContactPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-neutral-50/60 pb-24 pt-28 md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#ff6900] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>24/7 Guest Care &amp; Support Desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight">
            Contact Concierge
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Have questions about your upcoming getaway, corporate celebrations, or listing a property? Our dedicated helpdesk is at your service.
          </p>
        </div>

        {/* Interactive Contact Form & Contact Channels Component */}
        <section>
          <ContactForm />
        </section>

        {/* Operational Locations & Distance Guide */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#ff6900]">
                Where We Operate
              </span>
              <h2 className="text-2xl font-extrabold text-neutral-900 mt-1">
                Our Destination Hubs
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md">
              Located conveniently between Mumbai and Pune, our properties offer seamless road connectivity and breathtaking Sahyadri views.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Lonavala &amp; Khandala</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Luxury hilltop pool villas, mountain mist, and private estate hideaways.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-neutral-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-neutral-500" /> ~2 hrs from Mumbai &amp; Pune
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Pawna Lake</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Waterfront glamping tents, barbecue bonfires, kayaking &amp; private chalets.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-neutral-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-neutral-500" /> ~2.5 hrs from Mumbai
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Malavli &amp; Kamshet</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Rustic valley cottages, paragliding meadows, and tranquil countryside retreats.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-neutral-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-neutral-500" /> ~1 hr from Pune
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-neutral-900 transition-all">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">Alibaug &amp; Coastal</h3>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Beachside tropical villas, sprawling coconut groves, and private lawns.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-neutral-700 flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-neutral-500" /> ~1 hr via Ro-Ro Ferry
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked Questions (Accordion) */}
        <section className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ff6900] uppercase tracking-wider mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Quick answers to the most common questions about our villas, amenities, and policies.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full space-y-2.5">
              {FAQS.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border border-neutral-200 rounded-2xl px-5 py-1 transition-all data-[state=open]:border-neutral-900 data-[state=open]:bg-neutral-50/50"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-bold text-neutral-900 text-left hover:no-underline py-3.5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-neutral-600 leading-relaxed pb-4 pt-1">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-500">
              Still need assistance?{" "}
              <a
                href="https://wa.me/918669186483?text=Hi%20ThevillaCamp%20Team%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#ff6900] hover:underline"
              >
                Chat with our Concierge directly on WhatsApp &rarr;
              </a>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}