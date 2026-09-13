"use client";

import { useState } from "react";
import { ParallaxHero } from "@/components/Becomehostcomponents/parallax-hero";
import { AvailableNowSection } from "@/components/Becomehostcomponents/available-now-section";
import {
  Home,
  TrendingUp,
  Camera,
  CalendarCheck,
  Users,
  CheckCircle2,
  Send,
  Phone,
  Sparkles,
  Award,
  Clock,
  ArrowRight,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BaseUrl } from "@/lib/API/Baseurl";

function ModernHostListingSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    propertyType: "Luxury Villa",
    location: "Lonavala",
    bedrooms: "3 BHK",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setError("Please provide your full name and phone number.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BaseUrl}/HostInquiry/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          propertyType: formData.propertyType,
          location: formData.location,
          bedrooms: formData.bedrooms,
          source: "become_host_page",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to submit property inquiry.");
      }
      setIsSubmitted(true);
    } catch (err) {
      console.error("Host inquiry submission error:", err);
      setError(err.message || "Could not submit inquiry. Please try again or call our helpline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-12 bg-neutral-900 text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#ff6900]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Why Host with ThevillaCamp */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-orange-400">
              <Sparkles className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>Partner with ThevillaCamp</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              List your property with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6900] to-amber-400">
                complete peace of mind
              </span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-lg">
              Join top villa and campsite owners earning steady rental yield. Our hospitality specialists handle marketing, professional photoshoots, and guest vetting while you track income on the Owner App.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Strict Guest Verification</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Government ID audits, party policy enforcement, and group profiling before every check-in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Free Professional Photoshoot & Setup</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    High-definition architectural photography and HDR drone shots included at zero upfront cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct hotline */}
            <div className="pt-4 flex items-center gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#ff6900]" />
                <span>Host Onboarding Helpline: <strong>+91 86691 86483</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern High-Converting Lead Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 text-neutral-900 shadow-2xl border border-neutral-200/90">
            <div className="mb-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ff6900] block mb-1">
                48-Hour Onboarding
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                Get Started as a Host
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                Tell us about your villa or camp and our regional manager will connect via call or WhatsApp.
              </p>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-neutral-900">Submission Received!</h4>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  Thank you, <strong className="text-neutral-800">{formData.fullName}</strong>. Our Lonavala team will contact you at <strong className="text-neutral-800">{formData.phone}</strong> within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="rounded-full text-xs font-semibold text-[#ff6900] border-orange-200 hover:bg-orange-50 mt-3"
                >
                  Submit Another Property
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Property Type Radio Pills */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    What type of stay do you own?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Luxury Villa", "Glamping Tent", "Cottage"].map((type) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setFormData({ ...formData, propertyType: type })}
                        className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                          formData.propertyType === type
                            ? "border-[#ff6900] bg-orange-50/80 text-[#ff6900] shadow-2xs font-bold"
                            : "border-neutral-200 bg-neutral-50/60 text-neutral-700 hover:bg-neutral-100"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Patil"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30 focus:border-[#ff6900] transition-all"
                  />
                </div>

                {/* Location & Configuration Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Location / Area
                    </label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                    >
                      <option value="Lonavala">Lonavala</option>
                      <option value="Pawana Lake">Pawana Lake</option>
                      <option value="Khandala">Khandala</option>
                      <option value="Alibaug">Alibaug</option>
                      <option value="Karjat">Karjat</option>
                      <option value="Mahabaleshwar">Mahabaleshwar</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Configuration
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-neutral-50/60 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                    >
                      <option value="1-2 BHK">1 - 2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5+ BHK">5+ BHK Estate</option>
                      <option value="Glamping Site">Camping Site</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting details...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Property for Review</span>
                    </>
                  )}
                </Button>

                <p className="text-[10px] text-center text-neutral-400 pt-1">
                  Zero listing fees. We only earn a performance commission when your property generates paid bookings.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BecomeHostPage() {
  return (
    <main className="w-full bg-white pt-0 md:pt-16 overflow-x-hidden">
      {/* 1. Original Parallax Hero Banner */}
      <ParallaxHero />

      {/* 2. Available Now with Owner App Mobile Frame */}
      <AvailableNowSection />

      {/* 3. Modernized High-Converting Host Listing Form */}
      <ModernHostListingSection />
    </main>
  );
}
