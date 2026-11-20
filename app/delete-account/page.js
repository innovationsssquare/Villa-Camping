"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserX,
  Mail,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Clock,
  Trash2,
  Lock,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Building2,
  UserCheck,
  CheckCircle2,
} from "lucide-react";

export default function DeleteAccountPage() {
  const [copied, setCopied] = useState(false);

  const SUPPORT_EMAIL = "thevillacampteam@thevillacamp.in";
  const EMAIL_SUBJECT = "Account and Data Deletion Request";
  const EMAIL_BODY = `Dear ThevillaCamp Support Team,

I am writing to formally request the permanent deletion of my ThevillaCamp account and all associated personal data from your platform and mobile applications.

My registered account details are:
- Full Name: [Enter Your Name]
- Registered Mobile Number: [Enter 10-digit Phone]
- Registered Email Address: [Enter Your Email]
- Account Type: [Guest / Property Owner (Host)]

I confirm that I have no pending bookings or unpaid dues. Please process this deletion and confirm once completed.

Thank you.`;

  const mailtoLink = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    EMAIL_SUBJECT
  )}&body=${encodeURIComponent(EMAIL_BODY)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <main className="min-h-screen bg-neutral-50/50 pt-24 md:pt-28 pb-16">
      {/* =========================================================================
          HERO BANNER (Matches ThevillaCamp Luxury Theme)
         ========================================================================= */}
      <section className="relative overflow-hidden bg-neutral-950 text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 mx-3 sm:mx-6 rounded-3xl mb-12 shadow-xl">
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 bottom-0 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400 backdrop-blur-md">
            <UserX className="w-3.5 h-3.5 text-[#ff6900]" />
            <span>Data Autonomy & User Rights</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Delete Account & Personal Data
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-neutral-300 leading-relaxed">
            We value your privacy and give you full control over your personal records. If you wish to permanently delete your ThevillaCamp guest account, property host profile, or app data, you can submit a deletion request anytime.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] sm:text-xs text-neutral-400">
            <span>• Applies to ThevillaCamp Web, Guest App & Host App</span>
            <span>• Compliant with Google Play & App Store Policies</span>
            <span>• Governed under Indian DPDP Act</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* =========================================================================
            PRIMARY ACTION CARD: REACH OUT TO SUPPORT
           ========================================================================= */}
        <div className="relative overflow-hidden bg-white rounded-3xl border-2 border-orange-200/80 p-6 sm:p-10 shadow-lg">
          <div className="absolute -right-16 -top-16 w-52 h-52 bg-orange-100/50 rounded-full blur-2xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#ff6900]">
                <Mail className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>Direct Deletion Channel</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                Request Account Deletion via Email
              </h2>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                To protect against unauthorized account deletion, please email our dedicated privacy team at{" "}
                <span className="font-semibold text-neutral-900 underline decoration-[#ff6900] underline-offset-4">
                  {SUPPORT_EMAIL}
                </span>{" "}
                from your registered email address or provide your registered phone number.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-1">
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Clock className="w-3.5 h-3.5" />
                  Processed within 7 business days
                </span>
                <span className="inline-flex items-center gap-1.5 text-neutral-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#ff6900]" />
                  Identity verification required
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <a
                href={mailtoLink}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold text-sm transition-all shadow-md hover:shadow-orange-500/25 active:scale-95 text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Send Deletion Email</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-all border border-neutral-300/80 active:scale-95 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-neutral-600" />
                    <span>Copy Support Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            HOW THE DELETION PROCESS WORKS (3 STEPS)
           ========================================================================= */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900">
              How the Account Deletion Process Works
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Follow these three simple steps to complete your account removal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 text-[#ff6900] flex items-center justify-center font-extrabold text-sm mb-3">
                1
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Submit Request
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Send an email to{" "}
                <strong className="text-neutral-800">{SUPPORT_EMAIL}</strong> with the subject line <em>&quot;Account and Data Deletion Request&quot;</em>.
              </p>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-orange-100 border border-orange-200 text-[#ff6900] flex items-center justify-center font-extrabold text-sm mb-3">
                2
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Ownership Verification
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our support team will verify your registered phone number / email and confirm you have no active ongoing reservations or pending payouts.
              </p>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 flex flex-col items-start">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center font-extrabold text-sm mb-3">
                3
              </div>
              <h4 className="text-sm font-bold text-neutral-900 mb-1">
                Permanent Purge
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your profile, login credentials, and stored personal information are permanently deleted from our active database. You receive confirmation via email.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            WHAT GETS DELETED VS WHAT IS RETAINED
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* What is permanently deleted */}
          <div className="bg-white rounded-3xl border border-red-100 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 text-red-600 mb-4">
              <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center">
                <Trash2 className="w-4 h-4 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Data Permanently Deleted
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Full name, email address, phone number, and avatar image</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Saved addresses, location preferences, and wishlisted stays</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Authentication tokens, passwords, and active device sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Expo push notification tokens and device tracking IDs</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Host property drafts and unverified listings (for hosts)</span>
              </li>
            </ul>
          </div>

          {/* What must be retained by law */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-7 shadow-xs">
            <div className="flex items-center gap-2.5 text-amber-600 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Statutory Retention (Legal Basis)
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-3 leading-relaxed">
              Under Indian Income Tax Act, GST regulations, and financial audit standards, certain historical financial records cannot be instantly purged:
            </p>
            <ul className="space-y-2.5 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>
                  <strong>Tax Invoices & GST Bills:</strong> Retained securely for statutory audit compliance (7 years).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>
                  <strong>Payment Gateways Logs:</strong> Razorpay transaction IDs retained for fraud prevention and refund accounting.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>
                  <strong>Active Bookings:</strong> Cannot delete accounts with upcoming stays until check-out or completed cancellation.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* =========================================================================
            EMAIL TEMPLATE COPY BOX
           ========================================================================= */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900">
                Suggested Email Template
              </h3>
              <p className="text-xs text-neutral-500">
                You can copy this template into your email client for fastest turnaround.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(EMAIL_BODY);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Template</span>
            </button>
          </div>

          <pre className="bg-neutral-900 text-neutral-200 p-4 sm:p-5 rounded-2xl text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-neutral-800">
            {EMAIL_BODY}
          </pre>
        </div>

        {/* =========================================================================
            FREQUENTLY ASKED QUESTIONS
           ========================================================================= */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#ff6900]" />
            <h3 className="text-lg font-bold text-neutral-900">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">
                Can I reactivate or undo account deletion later?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                No. Account deletion is permanent and irreversible. Once processed, your account credentials and history cannot be restored. If you wish to use ThevillaCamp again in the future, you will need to create a new account.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">
                What if I am a property owner or host on ThevillaCamp?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hosts must ensure all guest reservations are completed and all pending payouts have been disbursed before submitting a deletion request. All your active listings will be unlisted and archived upon deletion.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">
                How do I know my account is deleted?
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Our team will reply directly to your request email confirming that your account credentials and personal records have been removed from our system.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FOOTER ASSURANCE / RELATED LEGAL LINKS
           ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-100 border border-neutral-200/80 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ff6900] shrink-0" />
            <span>ThevillaCamp • Committed to user privacy & transparency</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/privacy-policy"
              className="font-semibold text-neutral-800 hover:text-[#ff6900] transition-colors"
            >
              Privacy Policy
            </Link>
            <span>•</span>
            <Link
              href="/terms-of-service"
              className="font-semibold text-neutral-800 hover:text-[#ff6900] transition-colors"
            >
              Terms of Service
            </Link>
            <span>•</span>
            <Link
              href="/cancellation-policy"
              className="font-semibold text-neutral-800 hover:text-[#ff6900] transition-colors"
            >
              Cancellations
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
