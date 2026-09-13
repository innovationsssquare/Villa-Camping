"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { BaseUrl } from "@/lib/API/Baseurl";
import { addToast } from "@heroui/react";

const CATEGORIES = [
  { value: "booking", label: "Booking & Reservations" },
  { value: "property", label: "Villa / Stay Amenities" },
  { value: "payment", label: "Payments & Invoicing" },
  { value: "cancellation", label: "Cancellation & Reschedule" },
  { value: "other", label: "Host / Property Partnership" },
  { value: "general", label: "General Inquiries" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "booking",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setFormData((prev) => ({
        ...prev,
        phone: value.replace(/\D/g, "").slice(0, 10),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.phone || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.subject.trim()) {
      setError("Please provide a subject for your inquiry.");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please enter your message or question.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get logged-in user id if available in localStorage
      let userId = null;
      if (typeof window !== "undefined") {
        userId = localStorage.getItem("thevilla_user_id") || undefined;
      }

      const payload = {
        source: "villa_web",
        senderType: "customer",
        subject: formData.subject.trim(),
        category: formData.category,
        priority: "medium",
        description: formData.description.trim(),
        user: userId,
        guestDetails: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        },
      };

      const res = await fetch(`${BaseUrl}/Support/create-ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      const ticket = data.data || data.ticket || {
        ticketId: data.ticketId || `TCK-${Date.now().toString().slice(-6)}`,
      };

      setSubmittedTicket(ticket);
      addToast({
        title: "Inquiry Submitted!",
        description: `Your ticket ${ticket.ticketId} has been logged with our Concierge team.`,
        color: "success",
      });
    } catch (err) {
      console.error("Support submission error:", err);
      setError(err.message || "Could not submit inquiry. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      category: "booking",
      subject: "",
      description: "",
    });
    setError(null);
  };

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column (5 cols): Direct Contact Channels & Concierge Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Concierge Assurance Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#13141f] text-white relative overflow-hidden shadow-xl border border-neutral-800">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-orange-300 text-xs font-bold tracking-wide backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
                <span>24/7 Dedicated Concierge Desk</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                We’re Here to Perfect Your Staycation
              </h3>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Whether you need help booking a private pool villa, organizing lakeside barbecue feasts, or requesting custom celebrations, our dedicated team is at your service.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-neutral-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Average response time under 15 minutes</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
            {/* Phone Call */}
            <a
              href="tel:+918669186483"
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ff6900] group-hover:bg-[#ff6900] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Direct Helpline</p>
                <p className="text-sm font-bold text-neutral-900 mt-0.5 group-hover:text-[#ff6900] transition-colors">
                  +91 8669186483
                </p>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available 24/7
                </span>
              </div>
            </a>

            {/* WhatsApp Chat */}
            <a
              href="https://wa.me/918669186483?text=Hi%20ThevillaCamp%20Team%2C%20I%20have%20an%20inquiry%20regarding%20a%20stay"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-600 transition-all group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Instant WhatsApp</p>
                <p className="text-sm font-bold text-neutral-900 mt-0.5 group-hover:text-emerald-600 transition-colors">
                  Chat on WhatsApp
                </p>
                <span className="text-[11px] text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                  Fastest for photos &amp; quotes
                </span>
              </div>
            </a>

            {/* Email Address */}
            <a
              href="mailto:info@thevillacamp.com"
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-900 transition-all group shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 group-hover:bg-neutral-900 group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Email Inquiries</p>
                <p className="text-sm font-bold text-neutral-900 mt-0.5 group-hover:text-neutral-950 transition-colors">
                  info@thevillacamp.com
                </p>
                <span className="text-[11px] text-neutral-500 font-medium mt-0.5 block">
                  Official correspondence &amp; partnerships
                </span>
              </div>
            </a>

            {/* Physical Location */}
            <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium">Headquarters &amp; Caretaker Hub</p>
                <p className="text-xs font-semibold text-neutral-800 mt-0.5 leading-relaxed">
                  Apti, Pavananagar, Mawal, Lonavala, Maharashtra 410401
                </p>
                <span className="text-[11px] text-neutral-400 mt-1 block">
                  Operational across Lonavala, Pawna Lake, Kamshet &amp; Alibaug
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Interactive Contact & Support Ticket Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-neutral-200 p-6 sm:p-9 shadow-sm">
          {!submittedTicket ? (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6900]">
                    Direct Support Helpdesk
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                  Send Us a Message
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  Fill out the form below. Your ticket will be assigned directly to our support desk.
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium mb-5 animate-in fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Phone Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center rounded-xl border border-neutral-300 bg-white focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition-all overflow-hidden">
                      <span className="px-3 py-2.5 bg-neutral-50 border-r border-neutral-200 text-xs font-bold text-neutral-700 select-none">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        placeholder="10-digit number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder:text-neutral-400 text-neutral-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Category Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                      Inquiry Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white text-neutral-800 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer font-medium"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Weekend Villa Booking inquiry for 12 guests"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all"
                  />
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Your Message / Question <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Please provide details about preferred dates, guest count, location, or special requests..."
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-300 bg-white placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#1b1c2b] hover:bg-[#12131e] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer pt-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Logging ticket with support desk...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Concierge</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-neutral-400 pt-1">
                  Your ticket connects directly to our Admin Helpdesk. We will contact you via WhatsApp and Email.
                </p>
              </form>
            </div>
          ) : (
            /* Successful Ticket Submission View */
            <div className="py-6 px-2 sm:px-4 text-center space-y-5 animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-[#ff6900] text-xs font-bold tracking-wider uppercase">
                  Ticket #{submittedTicket.ticketId}
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-900">
                  Inquiry Logged Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your request has been dispatched to our <strong>Villa-Admin Support Console</strong>. A dedicated concierge specialist has been assigned.
                </p>
              </div>

              {/* Ticket Details Summary Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 max-w-md mx-auto text-xs">
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Ticket ID</span>
                  <span className="font-mono font-bold text-neutral-900">{submittedTicket.ticketId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Category</span>
                  <span className="font-semibold capitalize text-neutral-800">{formData.category}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-neutral-200">
                  <span className="text-neutral-500">Contact Number</span>
                  <span className="font-semibold text-neutral-800">+91 {formData.phone}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">Subject</span>
                  <span className="font-medium text-neutral-900 truncate max-w-[200px]">{formData.subject}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                <a
                  href={`https://wa.me/918669186483?text=Hi%20ThevillaCamp%20Team%2C%20I%20just%20submitted%20support%20ticket%20${submittedTicket.ticketId}%20regarding%20${encodeURIComponent(formData.subject)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto h-11 px-5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
