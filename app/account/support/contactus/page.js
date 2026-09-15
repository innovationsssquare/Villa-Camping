"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  LifeBuoy,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { BaseUrl } from "@/lib/API/Baseurl";
import { useToast } from "@/components/ui/toast-provider";

const Page = () => {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "booking",
    priority: "medium",
    subject: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.description.trim()) {
      addToast({
        title: "Required Fields Missing",
        description: "Please provide your name, email, and description.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const computedSubject =
        formData.subject.trim() ||
        `${formData.category.toUpperCase()} Inquiry from ${formData.name.trim()}`;

      const res = await fetch(`${BaseUrl}/Support/create-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: computedSubject,
          category: formData.category,
          priority: formData.priority,
          description: formData.description.trim(),
          source: "villa_web",
          senderType: "customer",
          guestDetails: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim() || undefined,
          },
        }),
      });

      const data = await res.json();

      if (res.ok && data?.status === "success") {
        setSubmittedTicket(data.data);
        addToast({
          title: "Support Request Dispatched",
          description: `Ticket #${data.data?.ticketId || ""} created successfully.`,
          variant: "success",
        });
      } else {
        addToast({
          title: "Submission Failed",
          description: data?.message || "Could not submit your request. Please try again.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Network Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 max-w-2xl mx-auto px-4 pt-4">
      <Card className="w-full md:ring-1 ring-gray-200 shadow-sm border-0 md:border rounded-2xl overflow-hidden bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 cursor-pointer rounded-xl hover:bg-gray-100"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </Button>
            <div>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <LifeBuoy className="w-5 h-5 text-[#106C83]" />
                Customer Support Service
              </CardTitle>
              <p className="text-xs text-gray-500 mt-0.5">
                Reach out to our 24/7 guest relations and reservation team.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {submittedTicket ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Support Ticket Raised</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                  Thank you for reaching out. Your request has been assigned to our hospitality desk.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="text-gray-500">Ticket Reference:</span>
                  <span className="font-mono font-bold text-[#106C83] text-sm">
                    {submittedTicket.ticketId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subject:</span>
                  <span className="font-semibold text-gray-800 truncate max-w-[200px]">
                    {submittedTicket.subject}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Priority:</span>
                  <span className="uppercase font-bold text-xs text-amber-600">
                    {submittedTicket.priority}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Response Window:
                  </span>
                  <span className="font-semibold text-gray-700">Within 24 Hours</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button
                  onClick={() => {
                    setSubmittedTicket(null);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      category: "booking",
                      priority: "medium",
                      subject: "",
                      description: "",
                    });
                  }}
                  variant="outline"
                  className="rounded-xl text-xs"
                >
                  Submit Another Inquiry
                </Button>
                <Button
                  onClick={() => router.push("/account/support")}
                  className="bg-[#106C83] hover:bg-[#0c5365] text-white rounded-xl text-xs font-semibold"
                >
                  Back to Help Center
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Have a question about your booking, property access, or payment? Fill out this ticket and our guest support team will review and reply.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Full Name *</label>
                  <Input
                    placeholder="Your Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="email@domain.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Phone Number (Optional)</label>
                  <Input
                    placeholder="+91 8669186483"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-700">Issue Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full h-11 rounded-xl bg-gray-50 border border-gray-200 text-xs px-3 font-medium text-gray-700 outline-none"
                  >
                    <option value="booking">Booking & Reservations</option>
                    <option value="cancellation">Cancellation & Refunds</option>
                    <option value="payment">Payment Issue</option>
                    <option value="property">Property Amenities / Access</option>
                    <option value="technical">Website / Technical Bug</option>
                    <option value="general">General Question</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Subject (Optional)</label>
                <Input
                  placeholder="e.g., Question about check-in time at Villa Serenity"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className="h-11 rounded-xl bg-gray-50 border-gray-200 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Detailed Description *</label>
                <Textarea
                  placeholder="Describe your issue or question in detail..."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[120px] rounded-xl bg-gray-50 border-gray-200 text-xs p-3"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#106C83] hover:bg-[#0d596c] text-white font-bold h-12 rounded-xl text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  "Submitting Your Ticket..."
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    Submit Support Ticket
                  </span>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
