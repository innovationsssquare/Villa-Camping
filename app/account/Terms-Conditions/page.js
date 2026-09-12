"use client";

import { ChevronLeft, Scale, Home, CreditCard, AlertTriangle, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const TermsConditions = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-2xl mx-auto bg-white min-h-screen border-x border-neutral-200/80 shadow-xs">
        {/* Sticky Mobile Header */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-150 px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors text-neutral-800"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold text-neutral-900">Terms & Conditions</h1>
              <p className="text-[11px] text-neutral-500">Booking & Stay Guidelines</p>
            </div>
          </div>
          <Link
            href="/terms-of-service"
            className="text-[11px] font-semibold text-[#ff6900] hover:underline flex items-center gap-0.5"
          >
            Full Version <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Agreement Overview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-400 text-[10px] font-bold">
              <Scale className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Platform Agreement</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Guest Guidelines & Stay Terms
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Last updated: September 2025. By confirming any reservation with ThevillaCamp, you agree to these standard house rules and platform policies.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
              <Home className="w-4 h-4 text-[#ff6900] mb-1" />
              <p className="font-bold text-neutral-900">Verified Stays</p>
              <p className="text-[11px] text-neutral-500">Audited quality</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
              <CreditCard className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="font-bold text-neutral-900">Secure Payments</p>
              <p className="text-[11px] text-neutral-500">No hidden costs</p>
            </div>
          </div>

          {/* Terms Accordion */}
          <Accordion type="single" collapsible className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden">
            <AccordionItem value="booking" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                1. Booking & Reservation Confirmation
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• Bookings are subject to availability and payment completion.</p>
                <p>• Confirmation vouchers with GPS directions are issued within minutes via email/WhatsApp.</p>
                <p>• You must be at least 18 years old to make a booking.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="house-rules" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                2. Check-In & House Rules
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• Standard Check-in: 2:00 PM | Standard Check-out: 11:00 AM.</p>
                <p>• All adult guests must submit valid government photo IDs at check-in.</p>
                <p>• Outdoor music systems must be lowered after 10:00 PM per residential noise norms.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="cancellation" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                3. Cancellation & Refunds
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• Cancellation refund windows are specified on the voucher (typically flexible up to 7 days prior to check-in).</p>
                <p>• Refunds are processed back to the original source in 5-7 business days.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="damages" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                4. Security Deposits & Damages
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• A refundable security deposit may be collected at check-in by the host.</p>
                <p>• The deposit is refunded within 24 hours of check-out post property inspection.</p>
                <p>• Guests are responsible for any intentional damage caused to villa assets.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Contact Card */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-800 space-y-2">
            <h3 className="font-bold text-neutral-900">Questions Regarding Terms?</h3>
            <p className="text-neutral-600">
              Our team is happy to clarify any property policies or booking guidelines before your arrival.
            </p>
            <Link
              href="/account/support"
              className="inline-flex items-center text-[#ff6900] font-semibold hover:underline"
            >
              Contact Support Team →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;