"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Clock,
  Send,
  AlertTriangle,
  FileText,
  RotateCcw,
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";

const FAQS = [
  {
    q: "How do I check in to my villa or campsite?",
    a: "Standard check-in is 2:00 PM. Once your reservation is confirmed, your booking voucher includes the caretaker's direct phone number, gate PIN, and precise Google Maps location. Caretakers are available on-site for keys and luggage assistance.",
  },
  {
    q: "What is the cancellation and refund timeline?",
    a: "Standard flexible bookings can be cancelled with a full refund up to 7 days before check-in. Approved refunds are initiated within 48 business hours and credit to your original payment method in 5 to 7 business days.",
  },
  {
    q: "Can I request early check-in or late check-out?",
    a: "Early check-in and late check-out are subject to villa availability and prior cleaning schedules. You can coordinate directly with the host or message our Concierge team 24 hours prior to arrival.",
  },
  {
    q: "Are private chefs and meals provided?",
    a: "Most villas offer fully-equipped kitchens and optional private chef services for barbecue and local Maharashtrian meals. You can pre-book chef services through your booking preview or ask the on-site caretaker.",
  },
  {
    q: "What if there is a power cut or Wi-Fi issue during my stay?",
    a: "All curated ThevillaCamp properties are equipped with 100% inverter or diesel generator power backup. High-speed Wi-Fi is provided. In case of local outage, caretakers switch on backup power immediately.",
  },
];

export default function SupportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = FAQS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-neutral-50 pb-24 pt-0 md:pt-28">
      {/* Mobile Top Header */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-40 border-b border-neutral-150 md:hidden flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserSidebar />
          <div className="flex items-center gap-1.5">
            <LifeBuoy className="w-4 h-4 text-[#ff6900]" />
            <span className="text-sm font-bold text-neutral-900">Help & Support</span>
          </div>
        </div>
        <NotificationSheet />
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-8">
        {/* Support Header Card */}
        <section className="bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden border border-neutral-800">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-400 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>24/7 Dedicated Concierge Care</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              How Can We Help You Today?
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              Have questions about your upcoming villa booking, date rescheduling, or on-ground amenities? Our team is available 24/7.
            </p>

            {/* Quick Search */}
            <div className="pt-2">
              <input
                type="text"
                placeholder="Search check-in, refunds, food, wifi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#ff6900]/50 backdrop-blur-md"
              />
            </div>
          </div>
        </section>

        {/* 3 Direct Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="https://wa.me/918669186483?text=Hi%20ThevillaCamp%20Support%2C%20I%20need%20assistance%20with%20my%20stay"
            target="_blank"
            rel="noreferrer"
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-105 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">WhatsApp Live Chat</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Fastest response for active bookings & caretaker coordination.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 mt-3 flex items-center gap-1">
              Chat on WhatsApp <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </a>

          <a
            href="tel:+918669186483"
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-orange-300 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mb-3 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Phone Support</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Speak directly with an on-ground stay coordinator.
              </p>
            </div>
            <span className="text-xs font-semibold text-[#ff6900] mt-3 flex items-center gap-1">
              Call Hotline <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </a>

          <a
            href="mailto:support@thevillacamp.com"
            className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-3 group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-neutral-900">Email Inquiries</h3>
              <p className="text-xs text-neutral-500 mt-1">
                For corporate stays, large event bookings & formal billing.
              </p>
            </div>
            <span className="text-xs font-semibold text-blue-600 mt-3 flex items-center gap-1">
              support@thevillacamp.com <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </a>
        </div>

        {/* FAQs Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#ff6900] uppercase tracking-wider">
                Instant Answers
              </span>
              <h2 className="text-xl font-bold text-neutral-900 mt-0.5">
                Frequently Asked Questions
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-medium">
              {filteredFaqs.length} questions
            </span>
          </div>

          <Accordion type="single" collapsible className="divide-y divide-neutral-100">
            {filteredFaqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`} className="border-none py-1">
                <AccordionTrigger className="text-xs sm:text-sm font-semibold text-neutral-900 hover:text-[#ff6900] text-left hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-neutral-600 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Quick Links Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/cancellation-policy"
            className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between group hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-[#ff6900]" />
              <div>
                <h4 className="text-xs font-bold">Cancellation Policy</h4>
                <p className="text-[10px] text-neutral-400">View refund tiers and terms</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="/terms-of-service"
            className="p-4 rounded-2xl bg-neutral-900 text-white flex items-center justify-between group hover:bg-neutral-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#ff6900]" />
              <div>
                <h4 className="text-xs font-bold">Terms of Service</h4>
                <p className="text-[10px] text-neutral-400">House rules & stay guidelines</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </main>
  );
}
