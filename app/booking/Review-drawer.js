"use client";

import { useState, useEffect } from "react";
import { Star, Camera, X, Check, Sparkles } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Writereview } from "@/lib/API/Booking/Booking";
import { addToast, Button } from "@heroui/react";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { useIsMobile } from "@/hooks/use-mobile";

const REVIEW_CATEGORIES = [
  "All",
  "Amenities",
  "Stay",
  "Food",
  "Service",
  "View",
  "Cleanliness",
  "Location",
  "Hospitality",
];

const RATING_LABELS = {
  1: "Poor Experience",
  2: "Below Expectations",
  3: "Average Stay",
  4: "Very Good Experience",
  5: "Exceptional Luxury Stay!",
};

function ReviewFormBody({
  rating,
  setRating,
  hoveredRating,
  setHoveredRating,
  selectedCategories,
  toggleCategory,
  comment,
  setComment,
  images,
  handleImageUpload,
  removeImage,
  errorMessage,
  successMessage,
}) {
  const activeRating = hoveredRating || rating;

  return (
    <div className="space-y-6">
      {/* 1. Interactive Star Rating Card */}
      <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-b from-amber-50/70 to-orange-50/40 rounded-2xl border border-amber-200/60 shadow-2xs">
        <p className="text-[11px] font-extrabold text-amber-900/80 uppercase tracking-widest mb-2.5">
          Overall Guest Rating
        </p>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = activeRating >= star;
            return (
              <button
                key={star}
                type="button"
                className="transition-transform active:scale-90 hover:scale-115 p-1 cursor-pointer focus:outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5 stars`}
              >
                <Star
                  className={cn(
                    "w-9 h-9 sm:w-10 sm:h-10 transition-all duration-200",
                    isFilled
                      ? "fill-amber-400 text-amber-500 drop-shadow-sm"
                      : "text-neutral-300 fill-neutral-100 hover:text-amber-300"
                  )}
                />
              </button>
            );
          })}
        </div>
        <p className="text-xs font-bold text-amber-950 mt-2.5 h-4 transition-all">
          {activeRating ? RATING_LABELS[activeRating] : "Tap a star to rate your stay"}
        </p>
      </div>

      {/* 2. Highlight Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
          What did you like most? <span className="text-neutral-400 font-normal">(Optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {REVIEW_CATEGORIES.map((category) => {
            const isSelected = selectedCategories.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={cn(
                  "cursor-pointer px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all border flex items-center gap-1.5",
                  isSelected
                    ? "bg-[#ff6900] text-white border-[#ff6900] shadow-2xs"
                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300"
                )}
              >
                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Review Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
            Your Experience &amp; Feedback
          </label>
          <span className="text-[11px] font-medium text-neutral-400">
            {comment.trim().length}/10 min chars
          </span>
        </div>
        <Textarea
          placeholder="Share your stay experience, cleanliness, staff hospitality, and anything future guests should know..."
          className="min-h-[120px] rounded-xl border-neutral-200 focus-visible:ring-[#ff6900] focus-visible:border-[#ff6900] resize-none text-sm leading-relaxed"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* 4. Photos Upload */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
            Add Photos <span className="text-neutral-400 font-normal">(Optional, max 5)</span>
          </label>
          <span className="text-[11px] text-neutral-400 font-medium">
            {images.length}/5 uploaded
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 shadow-2xs group"
            >
              <img
                src={img || "/placeholder.svg"}
                alt={`Uploaded photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <label className="w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 hover:border-[#ff6900] hover:bg-orange-50/40 transition-all cursor-pointer bg-neutral-50/80">
              <Camera className="w-5 h-5 text-neutral-500 group-hover:text-[#ff6900]" />
              <span className="text-[10px] text-neutral-600 font-semibold mt-1">
                Add Photo
              </span>
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

      {/* Status Messages */}
      {errorMessage && (
        <div className="px-3.5 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="px-3.5 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
          {successMessage}
        </div>
      )}
    </div>
  );
}

export function ReviewDrawer({ isOpen, onClose, booking }) {
  const isMobile = useIsMobile();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const propertyName =
    booking?.propertyId?.name ||
    booking?.propertyId?.campName ||
    booking?.propertyId?.cottageTitle ||
    booking?.propertyId?.hotelName ||
    booking?.items?.[0]?.typeName ||
    "Property Stay";

  useEffect(() => {
    if (isOpen) {
      setErrorMessage("");
      setSuccessMessage("");
    }
  }, [isOpen]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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

    if (files.length + images.length > 5) {
      addToast({
        title: "Upload Limit",
        description: "You can only upload up to 5 images.",
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
    if (!rating) {
      return "Please select a star rating";
    }

    if (!comment.trim() || comment.trim().length < 10) {
      return "Please write at least 10 characters about your experience";
    }

    return null;
  };

  const resetForm = () => {
    setRating(0);
    setHoveredRating(0);
    setComment("");
    setSelectedCategories([]);
    setImages([]);
    setImageFiles([]);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);

      // 1. Upload images
      const uploadedImageUrls = await uploadAllImages();

      // 2. Payload
      const reviewPayload = {
        bookingId: booking?._id,
        userId: booking?.customerId,
        rating,
        comment,
        categories: selectedCategories,
        images: uploadedImageUrls,
      };

      // 3. API call
      const result = await Writereview(reviewPayload);

      if (result?.success) {
        setSuccessMessage("✅ Review submitted successfully");
        addToast({
          title: "Thank You!",
          description: "Your review has been submitted successfully.",
          color: "success",
        });

        setTimeout(() => {
          onClose();
          resetForm();
        }, 1200);
      } else {
        setErrorMessage(result?.message || "Failed to submit review");
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const formProps = {
    rating,
    setRating,
    hoveredRating,
    setHoveredRating,
    selectedCategories,
    toggleCategory,
    comment,
    setComment,
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
            resetForm();
          }
        }}
      >
        <DrawerContent className="max-h-[92vh] bg-white rounded-t-3xl">
          <ScrollArea className="px-4 h-[88vh] pb-24">
            <div className="mx-auto w-full max-w-lg flex flex-col h-full pt-3">
              <DrawerHeader className="shrink-0 text-center px-0 pb-3">
                <div className="flex items-center justify-center gap-1.5 text-[#ff6900] font-bold text-xs tracking-wider uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Verified Stay Review</span>
                </div>
                <DrawerTitle className="text-xl font-black text-neutral-900">
                  Write a Review
                </DrawerTitle>
                <DrawerDescription className="text-xs text-neutral-500 mt-0.5">
                  Share your experience at <span className="font-semibold text-neutral-800">{propertyName}</span>
                </DrawerDescription>
              </DrawerHeader>

              <div className="py-2">
                <ReviewFormBody {...formProps} />
              </div>

              <DrawerFooter className="shrink-0 px-0 pt-4 pb-2">
                <div className="flex gap-2.5 items-center w-full">
                  <Button
                    type="button"
                    variant="flat"
                    className="flex-1 h-12 rounded-xl font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                    onPress={() => {
                      onClose();
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 h-12 rounded-xl font-extrabold text-sm bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-md shadow-orange-500/20"
                    onPress={handleSubmit}
                    disabled={rating === 0 || loading}
                  >
                    {loading ? <ButtonLoader /> : "Submit Review"}
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
          resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-150 shrink-0">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-1.5 text-[#ff6900] font-bold text-xs tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-[#ff6900]" />
              <span>Verified Stay Review</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Rate &amp; Review Your Stay
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-1">
              Share your feedback for <span className="font-bold text-neutral-800">{propertyName}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1 max-h-[calc(92vh-160px)]">
          <ReviewFormBody {...formProps} />
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-150 bg-neutral-50/80 shrink-0 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="flat"
            onPress={() => {
              onClose();
              resetForm();
            }}
            className="px-5 h-11 rounded-xl text-neutral-700 font-bold hover:bg-neutral-200 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onPress={handleSubmit}
            disabled={rating === 0 || loading}
            className="px-6 h-11 rounded-xl font-extrabold text-sm bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <ButtonLoader /> : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
