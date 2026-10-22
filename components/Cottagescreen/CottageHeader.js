"use client";
import React, { useState } from "react";
import { ArrowLeft, Share, Bell, User, Check } from "lucide-react";
import { Button, addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useCottage } from "@/lib/context/CottageContext";

const CottageHeader = () => {
  const cottage = useCottage();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const shareUrl = window.location.href;
    const propName = cottage?.name || "Cozy Cottage";
    const cityName = cottage?.address?.city || "Destination";
    const shareData = {
      title: `${propName} | ThevillaCamp`,
      text: `Check out ${propName} in ${cityName} on ThevillaCamp!`,
      url: shareUrl,
    };

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.warn("Share failed:", err);
        }
      }
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const textArea = document.createElement("textarea");
          textArea.value = shareUrl;
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        addToast({
          title: "Link Copied!",
          description: "Property link copied to clipboard",
          color: "success",
        });
      } catch (err) {
        console.error("Clipboard copy failed:", err);
        addToast({
          title: "Copy Failed",
          description: "Could not copy link to clipboard",
          color: "danger",
        });
      }
    }
  };

  return (
    <header className="flex items-center justify-between px-3 h-12 bg-white border-b border-gray-100 sticky top-0 z-50 w-full shadow-2xs">
      <div className="flex items-center w-2/3 overflow-hidden">
        <Button
          isIconOnly
          variant="light"
          onPress={() => router.back()}
          className="p-1.5 -ml-1 text-gray-700 hover:text-[#ff6900] rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="ml-1.5 flex items-center truncate">
          <span className="text-sm font-bold text-gray-900 truncate">
            {cottage?.name}
          </span>
          <span className="text-xs text-gray-400 mx-1">•</span>
          <span className="text-xs text-gray-500 truncate">
            {cottage?.address?.city || "Destination"}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <Button
          isIconOnly
          variant="light"
          onPress={handleShare}
          aria-label="Share property"
          className="p-1.5 text-gray-600 hover:text-[#ff6900] rounded-full transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share className="w-4 h-4" />}
        </Button>
        <Button
          onPress={() => router.push("/notifications")}
          isIconOnly
          variant="light"
          className="p-1.5 relative text-gray-600 hover:text-[#ff6900] rounded-full"
        >
          <Bell className="w-4 h-4" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-[#ff6900] ring-2 ring-white rounded-full"></div>
        </Button>
        <Button
          onPress={() => router.push("/account")}
          isIconOnly
          radius="full"
          variant="light"
          className="p-1"
        >
          <div className="w-7 h-7 bg-gradient-to-br from-[#ff8533] to-[#ff6900] rounded-full flex items-center justify-center shadow-xs">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default CottageHeader;
