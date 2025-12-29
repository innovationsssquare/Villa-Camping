"use client";

import { useState } from "react";
import { Star, Camera, X, Check } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Writereview } from "@/lib/API/Booking/Booking";
import { addToast, Button } from "@heroui/react";

const REVIEW_CATEGORIES = [
  "All",
  "Amenities",
  "Stay",
  "Food",
  "Service",
  "View",
];

export function ReviewDrawer({ isOpen, onClose, booking }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

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
      alert("You can only upload up to 5 images.");
      return;
    }

    files.forEach((file) => {
      // Preview (UI)
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });

    // Actual files (for API upload)
    setImageFiles((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAllImages = async () => {
    if (imageFiles.length === 0) return [];

    const uploadPromises = imageFiles.map((file) => uploadImage(file));
    return await Promise.all(uploadPromises);
  };

  const handleSubmit = async () => {
    if (!rating) {
      addToast({
        title: "failed",
        description: `Please select a rating`,
        color: "danger",
      });
      return;
    }

    try {
      setLoading(true);
      const uploadedImageUrls = await uploadAllImages();

      // 2️⃣ Payload
      const reviewPayload = {
        bookingId: booking._id,
        userId:booking.customerId,
        rating,
        comment,
        categories: selectedCategories,
        images: uploadedImageUrls,
      };
      const result = await Writereview(reviewPayload);
      if (result?.success) {
        addToast({
          title: "Done!",
          description: `Review submitted successfully `,
          color: "success",
        });
        resetForm();
        onClose();
      } else {
        addToast({
          title: "failed",
          description: `Please select a rating`,
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Review submit failed:", error);

      toast.error(error?.response?.data?.message || "Failed to submit review", {
        id: "review",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setSelectedCategories([]);
    setImages([]);
  };

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
      <DrawerContent className="max-h-[90vh]">
        <ScrollArea className="px-3 h-[90vh] pb-20">
          <div className="mx-auto w-full max-w-lg flex flex-col h-full">
            <DrawerHeader className="shrink-0">
              <DrawerTitle className="text-lg font-bold text-center">
                Write a Review
              </DrawerTitle>
              <DrawerDescription className="text-center">
                Share your experience at{" "}
                {booking?.propertyId?.name || "the hotel"}
              </DrawerDescription>
            </DrawerHeader>

            <div className="py-2 space-y-8">
              {/* Star Rating */}
              <div className="space-y-3 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Overall Rating
                </p>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="transition-transform active:scale-95"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 transition-colors",
                          (hoveredRating || rating) >= star
                            ? "fill-amber-500 text-amber-500"
                            : "text-gray-400/30 fill-gray-200/10"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  What did you like most?
                </p>
                <div className="flex flex-wrap gap-2">
                  {REVIEW_CATEGORIES.map((category) => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                      <Badge
                        key={category}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer px-4 py-2 text-sm transition-all border-2",
                          isSelected
                            ? "bg-orange-100 border-orange-300 text-orange-500"
                            : "bg-transparent border-muted-foreground/20 text-muted-foreground hover:border-hotel-primary/40"
                        )}
                        onClick={() => toggleCategory(category)}
                      >
                        {isSelected && <Check className="w-3 h-3 mr-1" />}
                        {category}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Comment Section */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Your Experience
                </p>
                <Textarea
                  placeholder="Tell us about your stay, what did you love?"
                  className="min-h-[120px] resize-none focus-visible:ring-primary"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Add Photos (Optional)
                </p>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-muted"
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt="Review"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <label className="w-20 h-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted hover:border-hotel-primary hover:bg-hotel-primary/5 transition-all cursor-pointer">
                      <Camera className="w-6 h-6 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground mt-1 font-medium">
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
                <p className="text-[10px] text-muted-foreground">
                  Up to 5 high-quality photos (JPG, PNG)
                </p>
              </div>
            </div>

            <DrawerFooter className="shrink-0 border-t mt-2">
              <Button
                size="lg"
                className="w-full text-lg bg-black text-white h-12"
                onPress={handleSubmit}
                disabled={rating === 0 || loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>

              <DrawerClose asChild>
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
