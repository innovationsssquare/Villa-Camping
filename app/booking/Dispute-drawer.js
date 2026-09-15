"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Camera, X, Check, ShieldAlert, IndianRupee } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateDisputeAPI } from "@/lib/API/Dispute/Dispute";
import { addToast, Button } from "@heroui/react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";

const DISPUTE_CATEGORIES = [
  { id: "cleanliness", label: "Cleanliness & Hygiene" },
  { id: "amenities_missing", label: "Amenities Missing / Broken" },
  { id: "cancellation_refund", label: "Cancellation / Refund Issue" },
  { id: "billing_issue", label: "Incorrect Charges / Billing" },
  { id: "property_mismatch", label: "Property Mismatch" },
  { id: "host_unresponsive", label: "Host Issue / Denied Entry" },
  { id: "other", label: "Other Concern" },
];

const PRIORITIES = [
  { id: "LOW", label: "Low", color: "bg-gray-100 text-gray-700 border-gray-300" },
  { id: "MEDIUM", label: "Medium", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "HIGH", label: "High", color: "bg-amber-50 text-amber-700 border-amber-300" },
  { id: "URGENT", label: "Urgent", color: "bg-red-50 text-red-700 border-red-300" },
];

export function DisputeDrawer({ isOpen, onClose, booking, onSuccess }) {
  const [category, setCategory] = useState("cleanliness");
  const [priority, setPriority] = useState("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [disputedAmount, setDisputedAmount] = useState("");
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const totalBookingAmount = booking?.pricing?.totalAmount || 0;
  const hotelName = booking?.propertyId?.name || booking?.items?.[0]?.typeName || "Property Stay";

  useEffect(() => {
    if (booking) {
      setDisputedAmount(String(totalBookingAmount));
      setTitle("");
      setDescription("");
      setCategory("cleanliness");
      setPriority("MEDIUM");
      setImages([]);
      setImageFiles([]);
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [booking, totalBookingAmount]);

  const uploadImage = async (file) => {
    if (!file) return null;
    const reader = new FileReader();
    const base64 = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: base64 }),
    });

    const data = await res.json();
    if (!data.success) throw new Error("Upload failed");
    return data.url;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      addToast({
        title: "Upload Limit",
        description: "You can upload up to 4 photos as evidence.",
        color: "warning",
      });
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllImages = async () => {
    if (imageFiles.length === 0) return [];
    const uploadPromises = imageFiles.map((file) => uploadImage(file));
    return await Promise.all(uploadPromises);
  };

  const validateForm = () => {
    if (!title.trim() || title.trim().length < 5) {
      return "Please enter a clear summary title (at least 5 characters)";
    }
    if (!description.trim() || description.trim().length < 15) {
      return "Please provide a detailed description of what happened (at least 15 characters)";
    }
    if (!disputedAmount || Number(disputedAmount) <= 0) {
      return "Please enter a valid claim amount";
    }
    if (Number(disputedAmount) > totalBookingAmount && totalBookingAmount > 0) {
      return `Claim amount cannot exceed total paid amount (₹${totalBookingAmount.toLocaleString()})`;
    }
    return null;
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const err = validateForm();
    if (err) {
      setErrorMessage(err);
      return;
    }

    try {
      setLoading(true);

      // Upload evidence photos if any
      let uploadedUrls = [];
      try {
        uploadedUrls = await uploadAllImages();
      } catch (uploadErr) {
        console.warn("Evidence photo upload warning:", uploadErr);
      }

      const payload = {
        bookingId: booking._id,
        raisedBy: "customer",
        raisedById: booking.customerId,
        raisedByName: `${booking.customerDetails?.firstName || ""} ${booking.customerDetails?.lastName || ""}`.trim() || "Guest",
        raisedByEmail: booking.customerDetails?.email || "",
        raisedByPhone: booking.customerDetails?.mobile || "",
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
        disputedAmount: Number(disputedAmount),
        evidence: uploadedUrls,
      };

      const result = await CreateDisputeAPI(payload);

      if (result?.success) {
        setSuccessMessage("✅ Concern raised successfully. The property host and support team have been notified.");
        addToast({
          title: "Dispute Logged",
          description: `Case ${result.data?.disputeId || ""} opened. Support and Host notified.`,
          color: "success",
        });

        if (onSuccess) onSuccess();

        setTimeout(() => {
          onClose();
          setSuccessMessage("");
        }, 1500);
      } else {
        setErrorMessage(result?.message || "Failed to raise concern. Please try again.");
      }
    } catch (error) {
      setErrorMessage(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setErrorMessage("");
          setSuccessMessage("");
        }
      }}
    >
      <DrawerContent className="max-h-[92vh] bg-white">
        <ScrollArea className="px-4 h-[90vh] pb-24">
          <div className="mx-auto w-full max-w-xl flex flex-col h-full pt-4">
            <DrawerHeader className="shrink-0 text-left px-0 pb-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm tracking-wider uppercase">
                <ShieldAlert className="w-5 h-5" />
                <span>Guest Protection & Resolution</span>
              </div>
              <DrawerTitle className="text-xl font-black text-gray-900 mt-1">
                Report an Issue or Raise Concern
              </DrawerTitle>
              <DrawerDescription className="text-gray-600 text-xs">
                Booking: <span className="font-mono font-bold text-gray-900">{booking?._id?.slice(-8)}</span> • {hotelName}
              </DrawerDescription>
            </DrawerHeader>

            <div className="space-y-4">
              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  What is the issue related to?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DISPUTE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold text-left transition-all",
                        category === cat.id
                          ? "bg-orange-50 border-orange-500 text-orange-700 shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority & Claimed Amount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Disputed Amount (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input
                      type="number"
                      value={disputedAmount}
                      onChange={(e) => setDisputedAmount(e.target.value)}
                      placeholder="Amount to refund/claim"
                      className="pl-9 h-11 text-sm font-bold border-gray-300"
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Total paid: ₹{totalBookingAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                    Urgency / Priority
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPriority(p.id)}
                        className={cn(
                          "py-2.5 rounded-lg border text-xs font-bold transition-all",
                          priority === p.id
                            ? "bg-black text-white border-black"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title / Summary */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  Summary / Headline
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., AC not functioning and pool was inaccessible"
                  className="h-11 border-gray-300 text-sm font-medium"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5">
                  Detailed Explanation
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what happened, any communication with the host on site, and what resolution you expect..."
                  rows={4}
                  className="border-gray-300 text-sm resize-none"
                />
              </div>

              {/* Photos / Evidence */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
                  Upload Evidence Photos (Optional, max 4)
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {images.map((src, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-300 shadow-sm"
                    >
                      <img
                        src={src}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {images.length < 4 && (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 hover:border-orange-500 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-gray-50 hover:bg-orange-50/40">
                      <Camera className="w-5 h-5 text-gray-500" />
                      <span className="text-[10px] text-gray-500 font-semibold mt-1">Add Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Error and Success Notices */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Host Notification Notice */}
              <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
                <strong>Notice:</strong> When you submit this concern, an instant real-time alert and notification will be dispatched directly to the property host and the Villa Admin dispute desk to investigate.
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="flat"
                  className="flex-1 h-12 rounded-xl font-bold text-gray-700"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex-1 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black shadow-lg shadow-orange-500/20"
                >
                  {loading ? <ButtonLoader /> : "Submit Concern"}
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
