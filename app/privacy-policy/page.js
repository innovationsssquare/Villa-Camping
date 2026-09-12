"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileText,
  Mail,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Server,
  Cookie,
  RefreshCw,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState("info-collect");

  const sections = [
    { id: "info-collect", title: "1. Information We Collect" },
    { id: "info-usage", title: "2. How We Use Your Information" },
    { id: "info-sharing", title: "3. Information Sharing & Third Parties" },
    { id: "security", title: "4. Data Security & Storage" },
    { id: "cookies", title: "5. Cookies & Tracking Technologies" },
    { id: "user-rights", title: "6. Your Rights & Data Controls" },
    { id: "retention", title: "7. Retention & Account Deletion" },
    { id: "contact", title: "8. Data Protection Officer & Contact" },
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
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Transparency & Data Security</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed">
            At ThevillaCamp, we believe trust is the cornerstone of luxury hospitality. This policy explains what personal data we collect, how it is safeguarded, and how you retain complete control over your information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[11px] sm:text-xs text-neutral-400">
            <span>Last Updated: September 2025</span>
            <span>•</span>
            <span>Applies to Web & Mobile Platform</span>
            <span>•</span>
            <span>Governed under Indian IT Laws & DPDP Act</span>
          </div>
        </div>
      </section>

      {/* Trust Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">256-Bit SSL Encryption</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                All booking transactions and identity documents are encrypted end-to-end.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Zero Data Reselling</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                We never sell, lease, or monetize your contact or booking information to any third party.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Full Access Rights</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                You can download your data, modify preferences, or delete your account anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sticky Sidebar Table of Contents */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-4 border border-neutral-200/90 shadow-xs space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-1 mb-1">
                Table of Contents
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
                  href="/account/support"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  <HelpCircle className="w-4 h-4 text-[#ff6900]" />
                  <span>Have questions? Contact Support</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Legal Document Sections */}
          <div className="lg:col-span-3 space-y-8">
            {/* Section 1 */}
            <section
              id="info-collect"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  1. Information We Collect
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                When you access or use ThevillaCamp platform, we collect information necessary to fulfill your travel bookings and ensure a smooth stay experience.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <h4 className="text-xs font-bold text-neutral-900">Personal & Account Information</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Name, verified phone number, email address, profile photo (if provided), government-issued ID (collected only when mandated by local hospitality compliance for check-in verification).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <h4 className="text-xs font-bold text-neutral-900">Reservation & Preference Data</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Check-in and check-out dates, guest count (adults and children), special meal or celebration requests, booking history, and wishlisted villas or campsites.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <h4 className="text-xs font-bold text-neutral-900">Payment & Transaction Information</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Payments are processed via RBI-compliant licensed payment gateways (such as Razorpay / Cashfree). We store transaction reference IDs and payment status tokens. We never store credit/debit card numbers or CVVs on our servers.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="info-usage"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  2. How We Use Your Information
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We use the information we collect for the following legitimate purposes:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Processing Bookings:</strong> To verify villa availability, confirm reservations, and send booking vouchers and invoices.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Guest Communication:</strong> To send WhatsApp and SMS updates regarding directions, gate access codes, and property manager contacts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Customer Support:</strong> To resolve booking inquiries, date alterations, cancellations, or refund requests.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff6900] mt-1.5 shrink-0" />
                  <span><strong>Security & Fraud Prevention:</strong> To detect unauthorized account activity, safeguard host property, and maintain community safety.</span>
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section
              id="info-sharing"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  3. Information Sharing & Third Parties
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We strictly limit data disclosure to verified entities necessary to complete your travel experience:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
                  <h4 className="text-xs font-bold text-neutral-900 mb-1">With Property Hosts</h4>
                  <p className="text-xs text-neutral-600">
                    Your name, phone number, check-in date, and guest count are shared with your assigned villa host so they can prepare the stay.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <h4 className="text-xs font-bold text-neutral-900 mb-1">Licensed Service Providers</h4>
                  <p className="text-xs text-neutral-600">
                    Trusted cloud infrastructure (AWS/GCP), SMS/WhatsApp gateways, and payment partners bound by confidentiality agreements.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section
              id="security"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  4. Data Security & Storage
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We employ industry-standard technical and organizational security measures:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
                <li className="flex items-start gap-2">
                  <Server className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                  <span>Encrypted data in transit via Transport Layer Security (TLS 1.3).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                  <span>Strict role-based access control (RBAC) preventing unauthorized employee access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <RefreshCw className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
                  <span>Automated vulnerability monitoring and routine penetration testing.</span>
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section
              id="cookies"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  5. Cookies & Tracking Technologies
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Cookies are small files stored in your browser to maintain session login, store recent search preferences, and measure website speed. You can disable non-essential cookies in your browser settings at any time without impacting basic villa browsing.
              </p>
            </section>

            {/* Section 6 & 7 */}
            <section
              id="user-rights"
              className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-xs space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
                <h2 className="text-xl font-bold text-neutral-900">
                  6. Your Rights & Data Controls
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Under relevant data protection laws, you maintain explicit control over your personal records:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-700">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong>Right to Access:</strong> View all bookings and personal details from your profile screen.
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong>Right to Rectification:</strong> Correct phone number, email, or guest details anytime.
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong>Right to Erasure:</strong> Request full permanent account deletion by contacting support.
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <strong>Marketing Opt-out:</strong> Unsubscribe from promotional WhatsApp messages with one click.
                </div>
              </div>
            </section>

            {/* Section 8: Contact */}
            <section
              id="contact"
              className="bg-neutral-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 border border-neutral-800"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#ff6900]" />
                <h2 className="text-xl font-bold text-white">
                  7. Contact Our Grievance & Privacy Officer
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                If you have any questions, concerns, or requests regarding this Privacy Policy or your personal records, please reach out directly:
              </p>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1 text-xs text-neutral-200">
                <p><strong>Entity:</strong> ThevillaCamp Hospitality Pvt. Ltd.</p>
                <p><strong>Email:</strong> privacy@thevillacamp.com / support@thevillacamp.com</p>
                <p><strong>Address:</strong> Lonavala & Mumbai Operations Office, Maharashtra, India</p>
              </div>
              <div className="pt-2 flex gap-3">
                <Link
                  href="/account/support"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Contact Support Desk
                </Link>
                <Link
                  href="/terms-of-service"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
                >
                  View Terms of Service
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
