"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Camera, X, Check, ShieldAlert, IndianRupee } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateDisputeAPI } from "@/lib/API/Dispute/Dispute";
import { addToast, Button } from "@heroui/react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { useIsMobile } from "@/hooks/use-mobile";

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
  { id: "LOW", label: "Low", activeClass: "bg-neutral-800 text-white border-neutral-800" },
  { id: "MEDIUM", label: "Medium", activeClass: "bg-blue-600 text-white border-blue-600" },
  { id: "HIGH", label: "High", activeClass: "bg-amber-600 text-white border-amber-600" },
  { id: "URGENT", label: "Urgent", activeClass: "bg-rose-600 text-white border-rose-600" },
];

function DisputeFormBody({
  category,
  setCategory,
  priority,
  setPriority,
  disputedAmount,
  setDisputedAmount,
  totalBookingAmount,
  title,
  setTitle,
  description,
  setDescription,
  images,
  handleImageUpload,
  removeImage,
  errorMessage,
  successMessage,
}) {
  return (
    <div className="space-y-5">
      {/* 1. Category Selector */}
      <div>
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-2">
          What is the issue related to?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DISPUTE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer",
                category === cat.id
                  ? "bg-orange-50 border-[#ff6900] text-[#ff6900] shadow-xs"
                  : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Disputed Amount & Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
            Disputed Amount (₹)
          </label>
          <div className="relative">
            <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <Input
              type="number"
              value={disputedAmount}
              onChange={(e) => setDisputedAmount(e.target.value)}
              placeholder="Amount to refund/claim"
              className="pl-9 h-11 text-sm font-bold border-neutral-300 rounded-xl"
            />
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">
            Total paid for booking: ₹{Number(totalBookingAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
            Urgency / Priority
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {PRIORITIES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriority(p.id)}
                className={cn(
                  "py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                  priority === p.id
                    ? p.activeClass
                    : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Summary / Title */}
      <div>
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
          Summary / Headline
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g., Air conditioning not cooling and pool had restricted access"
          className="h-11 border-neutral-300 rounded-xl text-sm font-medium"
        />
      </div>

      {/* 4. Detailed Description */}
      <div>
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block mb-1.5">
          Detailed Explanation
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explain what happened, interactions with the host on site, and what resolution you expect..."
          rows={4}
          className="border-neutral-300 rounded-xl text-sm resize-none leading-relaxed"
        />
      </div>

      {/* 5. Photo Evidence Upload */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
            Upload Evidence Photos <span className="text-neutral-400 font-normal">(Optional, max 4)</span>
          </label>
          <span className="text-[11px] text-neutral-400 font-medium">
            {images.length}/4 photos
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {images.map((src, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-300 shadow-2xs"
            >
              <img
                src={src}
                alt={`Evidence ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white rounded-full p-1 transition-all cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {images.length < 4 && (
            <label className="w-20 h-20 border-2 border-dashed border-neutral-300 hover:border-[#ff6900] rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all bg-neutral-50 hover:bg-orange-50/40">
              <Camera className="w-5 h-5 text-neutral-500" />
              <span className="text-[10px] text-neutral-600 font-semibold mt-1">Add Photo</span>
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
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
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

      {/* Notice Banner */}
      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
        <strong>Notice:</strong> When you submit this concern, an instant alert is dispatched directly to the property host and the Villa Guest Protection desk for prompt resolution.
      </div>
    </div>
  );
}

export function DisputeDrawer({ isOpen, onClose, booking, onSuccess }) {
  const isMobile = useIsMobile();
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
  const hotelName =
    booking?.propertyId?.name ||
    booking?.propertyId?.campName ||
    booking?.propertyId?.cottageTitle ||
    booking?.propertyId?.hotelName ||
    booking?.items?.[0]?.typeName ||
    "Property Stay";

  useEffect(() => {
    if (booking && isOpen) {
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
  }, [booking, totalBookingAmount, isOpen]);

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
      return `Claim amount cannot exceed total paid amount (₹${totalBookingAmount.toLocaleString("en-IN")})`;
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

      let uploadedUrls = [];
      try {
        uploadedUrls = await uploadAllImages();
      } catch (uploadErr) {
        console.warn("Evidence photo upload warning:", uploadErr);
      }

      const payload = {
        bookingId: booking?._id,
        raisedBy: "customer",
        raisedById: booking?.customerId,
        raisedByName:
          `${booking?.customerDetails?.firstName || ""} ${booking?.customerDetails?.lastName || ""}`.trim() || "Guest",
        raisedByEmail: booking?.customerDetails?.email || "",
        raisedByPhone: booking?.customerDetails?.mobile || "",
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
        disputedAmount: Number(disputedAmount),
        evidence: (uploadedUrls || []).map((url, idx) => ({
          url,
          fileType: "image",
          name: `evidence_${idx + 1}`,
        })),
      };

      const result = await CreateDisputeAPI(payload);

      if (result?.success) {
        setSuccessMessage("✅ Concern logged successfully. Support and Host have been notified.");
        addToast({
          title: "Dispute Logged",
          description: `Case ${result.data?.disputeId || ""} opened. Support desk notified.`,
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

  const formProps = {
    category,
    setCategory,
    priority,
    setPriority,
    disputedAmount,
    setDisputedAmount,
    totalBookingAmount,
    title,
    setTitle,
    description,
    setDescription,
    images,
    handleImageUpload,
    removeImage,
    errorMessage,
    successMessage,
  };

  // -------------------------------------------------------------
  // Mobile View: Bottom Drawer
  // -------------------------------------------------------------
  if (isMobile) {
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
        <DrawerContent className="max-h-[92vh] bg-white rounded-t-3xl">
          <ScrollArea className="px-4 h-[88vh] pb-24">
            <div className="mx-auto w-full max-w-xl flex flex-col h-full pt-3">
              <DrawerHeader className="shrink-0 text-left px-0 pb-3">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs tracking-wider uppercase">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Guest Protection &amp; Resolution</span>
                </div>
                <DrawerTitle className="text-xl font-black text-neutral-900 mt-1">
                  Report an Issue or Concern
                </DrawerTitle>
                <DrawerDescription className="text-neutral-500 text-xs mt-0.5">
                  Booking: <span className="font-mono font-bold text-neutral-800">{booking?._id?.slice(-8).toUpperCase()}</span> • {hotelName}
                </DrawerDescription>
              </DrawerHeader>

              <div className="py-2">
                <DisputeFormBody {...formProps} />
              </div>

              <DrawerFooter className="shrink-0 px-0 pt-4 pb-2">
                <div className="flex gap-2.5 items-center w-full">
                  <Button
                    type="button"
                    variant="flat"
                    className="flex-1 h-12 rounded-xl font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                    onPress={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    disabled={loading}
                    onPress={handleSubmit}
                    className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold shadow-md shadow-rose-600/20"
                  >
                    {loading ? <ButtonLoader /> : "Submit Concern"}
                  </Button>
                </div>
              </DrawerFooter>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  // -------------------------------------------------------------
  // Desktop View: Centered Modal Dialog
  // -------------------------------------------------------------
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setErrorMessage("");
          setSuccessMessage("");
        }
      }}
    >
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-150 shrink-0">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-1.5 text-rose-600 font-bold text-xs tracking-wider uppercase mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Guest Protection &amp; Resolution</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Report an Issue or Concern
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              Booking: <span className="font-mono font-bold text-neutral-800">#{booking?._id?.slice(-8).toUpperCase()}</span> • {hotelName}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1 max-h-[calc(92vh-160px)]">
          <DisputeFormBody {...formProps} />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-150 bg-neutral-50/80 shrink-0 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="flat"
            onPress={onClose}
            className="px-5 h-11 rounded-xl text-neutral-700 font-bold hover:bg-neutral-200 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={loading}
            onPress={handleSubmit}
            className="px-6 h-11 rounded-xl font-extrabold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <ButtonLoader /> : "Submit Concern"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
