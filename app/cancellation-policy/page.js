"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RotateCcw,
  CalendarCheck,
  Clock,
  ShieldAlert,
  HelpCircle,
  ChevronRight,
  AlertCircle,
  FileCheck2,
  PhoneCall,
  CheckCircle2,
} from "lucide-react";

export default function CancellationPolicyPage() {
  const [activeTier, setActiveTier] = useState("flexible");

  return (
    <main className="min-h-screen bg-neutral-50 pb-24 pt-24 md:pt-28">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-neutral-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 mx-3 sm:mx-6 rounded-3xl mb-12 shadow-xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
            <RotateCcw className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Transparent Refund Standards</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Cancellation & Refund Policy
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed">
            We understand plans can change unexpectedly. Our cancellation tiers provide clear, transparent options tailored to standard and peak season villa bookings.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] sm:text-xs text-neutral-400">
            <span>Last Updated: September 2025</span>
            <span>•</span>
            <span>Applies to all ThevillaCamp properties</span>
          </div>
        </div>
      </section>

      {/* Core Principles Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Clear Windows</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Exact refund deadlines and percentage amounts are printed clearly on every booking voucher.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">48-Hour Processing</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Approved refunds are initiated within 48 business hours directly to your original payment source.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Extenuating Coverage</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Special consideration for road closures, extreme weather alerts, or verified medical emergencies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tier Cards */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-6">
          <div>
            <span className="text-xs font-bold text-[#ff6900] uppercase tracking-wider">
              Standard Categories
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-0.5">
              Cancellation Tiers Overview
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              The policy applied to your stay depends on whether your booking falls during regular dates or peak festive holidays:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Tier 1: Flexible */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Flexible (Most Villas)
                </span>
                <h4 className="text-base font-bold text-neutral-900">Standard Dates</h4>
                <ul className="text-xs text-neutral-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>100% Refund:</strong> Cancel 7 or more days prior to check-in (minus 3% gateway charge).</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span><strong>50% Refund:</strong> Cancel between 3 and 7 days prior to check-in.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>0% Refund:</strong> Cancellations within 72 hours of check-in time.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 2: Moderate */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Moderate (Estate Villas)
                </span>
                <h4 className="text-base font-bold text-neutral-900">Boutique & Long Stays</h4>
                <ul className="text-xs text-neutral-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>100% Refund:</strong> Cancel 14 or more days prior to check-in.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span><strong>50% Refund:</strong> Cancel between 7 and 14 days prior to check-in.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>0% Refund:</strong> Cancellations under 7 days of arrival.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tier 3: Strict Festive */}
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                  Strict (Peak Festive)
                </span>
                <h4 className="text-base font-bold text-neutral-900">Diwali, Christmas & NYE</h4>
                <ul className="text-xs text-neutral-600 space-y-2">
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span><strong>Full Credit Note:</strong> Cancel 21 or more days prior to check-in.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span><strong>Non-Refundable:</strong> Due to extreme seasonal demand, cancellations under 21 days are non-refundable.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Rescheduling & Date Alterations */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-[#ff6900]" />
            <h2 className="text-xl font-bold text-neutral-900">
              Rescheduling & Date Modification Guidelines
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Need to shift your vacation dates instead of cancelling? We make date alterations smooth and economical:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <span className="font-bold text-neutral-900 block mb-1">Notice 10+ Days Before Check-in</span>
              <p className="text-neutral-600">
                Free date modification within the same villa (subject to calendar availability and tariff differential if moving to higher-priced dates).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
              <span className="font-bold text-neutral-900 block mb-1">Notice Under 10 Days</span>
              <p className="text-neutral-600">
                Rescheduling is subject to property host approval as caretakers and perishables are planned in advance.
              </p>
            </div>
          </div>
        </section>

        {/* Extenuating Circumstances */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-bold text-neutral-900">
              Extenuating Circumstances & Weather Alerts
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            If government weather authorities issue Red Alerts for Western Ghat highways, or in cases of unforeseen landslide closures or documented medical hospitalization:
          </p>
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p>
              • We work directly with the host to provide either a full stay credit voucher valid for 6 months or an expedited refund.
            </p>
            <p>
              • Legitimate documentation (medical summary or highway authority advisory) must be shared with our Concierge team within 24 hours of the occurrence.
            </p>
          </div>
        </section>

        {/* How Refunds are Credited */}
        <section className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 border border-neutral-800">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#ff6900]" />
            <h2 className="text-xl font-bold text-white">
              Refund Disbursal Timeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Upon processing your cancellation via your Bookings page or Support desk:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-[#ff6900] block mb-0.5">Step 1</span>
              <p className="text-neutral-300">Cancellation request verified within 2 to 4 hours.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-[#ff6900] block mb-0.5">Step 2</span>
              <p className="text-neutral-300">Refund released via payment gateway within 48 hours.</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="font-bold text-[#ff6900] block mb-0.5">Step 3</span>
              <p className="text-neutral-300">Bank credit reflected on your account in 5-7 business days.</p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href="/account/support"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Contact Support for Cancellation
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
            >
              Manage My Bookings
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
