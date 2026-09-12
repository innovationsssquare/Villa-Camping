"use client";

import { ChevronLeft, ShieldCheck, Lock, EyeOff, FileText, ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      <div className="max-w-2xl mx-auto bg-white min-h-screen border-x border-neutral-200/80 shadow-xs">
        {/* Sticky Mobile/Tablet Header */}
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
              <h1 className="text-base font-bold text-neutral-900">Privacy Policy</h1>
              <p className="text-[11px] text-neutral-500">ThevillaCamp Data Protection</p>
            </div>
          </div>
          <Link
            href="/privacy-policy"
            className="text-[11px] font-semibold text-[#ff6900] hover:underline flex items-center gap-0.5"
          >
            Full Version <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          {/* Privacy Overview Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-xs space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-400 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Your Privacy Matters</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Transparent, Encrypted & Secure
            </h2>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Last updated: September 2025. We collect only what is necessary to process your luxury villa reservations and provide reliable guest support.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
              <Lock className="w-4 h-4 text-[#ff6900] mb-1" />
              <p className="font-bold text-neutral-900">256-Bit SSL</p>
              <p className="text-[11px] text-neutral-500">Encrypted transmission</p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70 text-xs">
              <EyeOff className="w-4 h-4 text-emerald-600 mb-1" />
              <p className="font-bold text-neutral-900">Zero Selling</p>
              <p className="text-[11px] text-neutral-500">No third-party marketing</p>
            </div>
          </div>

          {/* Privacy Accordion */}
          <Accordion type="single" collapsible className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs divide-y divide-neutral-100 overflow-hidden">
            <AccordionItem value="collection" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                1. Information We Collect
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• <strong>Personal Details:</strong> Name, phone number, and email address for account creation and reservation delivery.</p>
                <p>• <strong>Stay History:</strong> Dates, guest counts, and preferences for wishlisted properties.</p>
                <p>• <strong>Payment Tokens:</strong> Handled securely via RBI-licensed gateways (Razorpay). No CVV or full card numbers are stored.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="usage" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                2. How We Use Your Information
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• Confirmation vouchers, directions, and host arrival coordination via SMS/WhatsApp.</p>
                <p>• Customer support and on-ground emergency assistance.</p>
                <p>• Fraud detection and community safety compliance.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sharing" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                3. Information Sharing
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• We share essential check-in details (name and phone) solely with your assigned property host.</p>
                <p>• We never share your data with advertisers or lead-generation brokers.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                4. Data Security & Storage
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• All communication channels utilize TLS 1.3 encryption.</p>
                <p>• Regular security assessments and restricted server access.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rights" className="border-none">
              <AccordionTrigger className="px-5 py-3.5 hover:bg-neutral-50 text-xs sm:text-sm font-semibold text-neutral-900">
                5. Your Rights & Account Controls
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-4 text-xs text-neutral-600 leading-relaxed space-y-2">
                <p>• You may edit profile information or request permanent data deletion at any time by contacting our support team.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Contact Assistance Card */}
          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/70 text-xs text-neutral-800 space-y-2">
            <h3 className="font-bold text-neutral-900">Have Privacy Inquiries?</h3>
            <p className="text-neutral-600">
              For any questions regarding your data or to request account deletion, reach our privacy team at <span className="font-semibold text-neutral-900">privacy@thevillacamp.com</span>.
            </p>
            <Link
              href="/account/support"
              className="inline-flex items-center text-[#ff6900] font-semibold hover:underline"
            >
              Contact Support Desk →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;