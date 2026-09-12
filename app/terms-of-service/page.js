"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  ChevronRight,
  HelpCircle,
  Home,
  CreditCard,
  UserX,
} from "lucide-react";

export default function TermsOfServicePage() {
  const [activeSection, setActiveSection] = useState("acceptance");

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "booking-payments", title: "2. Bookings & Payment Policies" },
    { id: "checkin-rules", title: "3. Check-in & Property House Rules" },
    { id: "cancellations", title: "4. Cancellation & Refund Policy" },
    { id: "damage-conduct", title: "5. Guest Conduct & Damage Liability" },
    { id: "intermediary", title: "6. Platform Scope & Limitation" },
    { id: "governing-law", title: "7. Governing Law & Dispute Resolution" },
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-24 md:pt-28 pb-16">
      <section className="relative overflow-hidden bg-neutral-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 mx-3 sm:mx-6 rounded-3xl mb-12 shadow-xl">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
            <Scale className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Platform Agreement & Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed">
            These terms set the standard for a safe, transparent, and enjoyable luxury stay experience for guests and hosts across ThevillaCamp.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] sm:text-xs text-neutral-400">
            <span>Effective Date: September 2025</span>
            <span>•</span>
            <span>Applicable to all Reservations</span>
            <span>•</span>
            <span>ThevillaCamp Hospitality Pvt. Ltd.</span>
          </div>
        </div>
      </section>

      {/* Value Guarantee Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Verified Luxury Properties</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Every villa, camp, and cottage is physically audited for hygiene, power backup, and amenities.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Transparent Pricing</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                No hidden convenience charges. Taxes, cleaning, and inclusions are presented upfront.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">24/7 Guest Assistance</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Dedicated on-call concierge support before, during, and after your stay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Legal Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1">
                Sections
              </p>
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                    activeSection === sec.id
                      ? "bg-orange-50 text-[#ff6900] font-bold"
                      : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  <ChevronRight className="w-3 h-3 shrink-0 ml-1 opacity-50" />
                </button>
              ))}

              <div className="pt-4 mt-2 border-t border-neutral-100">
                <Link
                  href="/privacy-policy"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <ShieldCheck className="w-4 h-4 text-[#ff6900]" />
                  <span>View Privacy Policy</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Clauses Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section 1 */}
            <section
              id="acceptance"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  1. Acceptance of Terms & Eligibility
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                By browsing, registering, or booking an accommodation through ThevillaCamp website or mobile application, you agree to comply with and be legally bound by these Terms of Service.
              </p>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700 leading-relaxed space-y-1">
                <p>• You must be at least 18 years of age to make a reservation.</p>
                <p>• You confirm all guest details provided during the booking process are accurate and truthful.</p>
                <p>• Unauthorized commercial sub-leasing or secondary resale of confirmed bookings is strictly prohibited.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="booking-payments"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  2. Bookings & Payment Terms
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                All reservations are subject to property availability and prompt payment receipt.
              </p>
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <h4 className="text-xs font-bold text-neutral-900 mb-1">Confirmation Vouchers</h4>
                  <p className="text-xs text-neutral-600">
                    A booking is only deemed confirmed once a valid payment authorization is achieved and you receive a confirmation email/WhatsApp voucher with booking ID.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-900 mb-1">Pricing & Inclusions</h4>
                  <p className="text-xs text-neutral-600">
                    Prices displayed are in Indian Rupees (INR) and include applicable GST unless explicitly indicated otherwise. Extra guest fees apply beyond base capacity.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section
              id="checkin-rules"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  3. Check-In, Check-Out & House Rules
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To respect property staff and local residential tranquility in villa neighborhoods:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Standard Timings:</strong> Check-in is typically from 2:00 PM, and check-out is by 11:00 AM to allow deep sanitization. Early check-in or late check-out is subject to availability and host approval.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Government Photo IDs:</strong> Valid physical or Digilocker government ID (Aadhar / Passport / Driving License) must be presented for every adult guest at check-in.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Noise & Pool Regulations:</strong> In accordance with local Maharashtra government quiet hours, outdoor music systems must be lowered or moved indoors after 10:00 PM. No glassware is permitted near swimming pools.</span>
                </li>
              </ul>
            </section>

            {/* Section 4 */}
            <section
              id="cancellations"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  4. Cancellation, Rescheduling & Refund Policy
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Cancellation terms vary based on the specific policy chosen at the time of reservation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="font-bold text-emerald-700 block mb-1">Standard Flexible Policy</span>
                  <p className="text-neutral-600">
                    Full refund (minus standard gateway fee) for cancellations made 7 or more days prior to check-in.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <span className="font-bold text-amber-700 block mb-1">Peak & Festive Season</span>
                  <p className="text-neutral-600">
                    Non-refundable during high-demand dates (Diwali, Christmas, New Year, Long Weekends) unless rescheduled 15 days ahead.
                  </p>
                </div>
              </div>
              <p className="text-xs text-neutral-500 italic">
                Approved refunds are initiated within 48 hours and typically credit to your original payment method in 5 to 7 business days.
              </p>
            </section>

            {/* Section 5 */}
            <section
              id="damage-conduct"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  5. Guest Conduct, Security Deposits & Damages
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Some properties require a refundable security deposit at check-in (processed digitally or via UPI). This deposit is refunded within 24 hours of check-out after property inspection.
              </p>
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Important Guest Liability</span>
                </div>
                <p>
                  Guests are financially responsible for any intentional or reckless damage caused to furniture, audio systems, swimming pool filters, or property structures during their occupancy.
                </p>
              </div>
            </section>

            {/* Section 6 & 7 */}
            <section
              id="intermediary"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  6. Platform Scope & Limitation of Liability
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                ThevillaCamp operates as a premium booking platform connecting discerning travelers with independent villa and campsite hosts. While we rigorously curate properties and audit standards, hosts remain independently responsible for daily on-ground housekeeping and caretaker services.
              </p>
            </section>

            <section
              id="governing-law"
              className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 border border-neutral-800"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#ff6900]" />
                <h2 className="text-xl font-bold text-white">
                  7. Governing Law & Dispute Resolution
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of reservations shall be subject to the exclusive jurisdiction of the competent courts in Mumbai/Pune, Maharashtra.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/account/support"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Contact Legal Support
                </Link>
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  Privacy Policy
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
