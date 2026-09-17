"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Calendar,
  X,
  ExternalLink,
  MessageSquare,
  FileText,
  HelpCircle,
  Camera,
  ChevronRight,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@heroui/react";
import { useIsMobile } from "@/hooks/use-mobile";

const STATUS_CONFIG = {
  OPEN: {
    label: "Under Review",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    dotColor: "bg-amber-500",
    description: "Your concern has been registered and dispatched to the property host and support desk.",
    stepIndex: 1,
  },
  UNDER_INVESTIGATION: {
    label: "Under Investigation",
    color: "bg-blue-50 text-blue-800 border-blue-200",
    dotColor: "bg-blue-500",
    description: "The support desk is reviewing evidence and communicating with the property host.",
    stepIndex: 2,
  },
  AWAITING_EVIDENCE: {
    label: "Awaiting Additional Info",
    color: "bg-orange-50 text-orange-800 border-orange-200",
    dotColor: "bg-orange-500",
    description: "Additional details or counter-evidence are being gathered to reach a resolution.",
    stepIndex: 2,
  },
  RESOLVED_REFUND_CUSTOMER: {
    label: "Refund Approved",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotColor: "bg-emerald-500",
    description: "Resolution complete. A full or partial refund has been approved for this stay.",
    stepIndex: 3,
  },
  RESOLVED_PAYOUT_OWNER: {
    label: "Case Closed",
    color: "bg-purple-50 text-purple-800 border-purple-200",
    dotColor: "bg-purple-500",
    description: "Case concluded following property review.",
    stepIndex: 3,
  },
  RESOLVED_SPLIT: {
    label: "Split Resolution",
    color: "bg-indigo-50 text-indigo-800 border-indigo-200",
    dotColor: "bg-indigo-500",
    description: "Case resolved with a mutual compromise and partial adjustment.",
    stepIndex: 3,
  },
  DISMISSED: {
    label: "Dismissed / Closed",
    color: "bg-neutral-100 text-neutral-800 border-neutral-200",
    dotColor: "bg-neutral-500",
    description: "Claim was reviewed and concluded with no further action required.",
    stepIndex: 3,
  },
};

function DisputeTrackerBody({ dispute }) {
  const [selectedImage, setSelectedImage] = useState(null);

  if (!dispute) return null;

  const currentStatus = dispute.status || "OPEN";
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.OPEN;
  const currentStep = config.stepIndex;

  const timelineEvents = Array.isArray(dispute.timeline) && dispute.timeline.length > 0
    ? [...dispute.timeline].reverse()
    : [
        {
          status: dispute.status || "OPEN",
          note: dispute.description || "Claim opened by customer",
          changedBy: dispute.raisedByName || "Guest",
          timestamp: dispute.createdAt || new Date(),
        },
      ];

  const evidencePhotos = Array.isArray(dispute.evidence) ? dispute.evidence : [];
  const propertyTitle = dispute.propertyId?.name || dispute.propertyName || "Stay Experience";
  const disputeCode = dispute.disputeId || (dispute._id ? `DSP-${dispute._id.slice(-6).toUpperCase()}` : "DSP");
  const refundAmount = dispute.resolution?.amountRefunded || 0;

  return (
    <div className="space-y-6">
      {/* 1. Header Status Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-50 to-neutral-100/70 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-neutral-500">
              #{disputeCode}
            </span>
            <Badge className={cn("text-[10px] font-bold border px-2 py-0.5", config.color)}>
              <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse", config.dotColor)} />
              {config.label}
            </Badge>
          </div>
          <h4 className="text-sm font-extrabold text-neutral-900 leading-tight">
            {dispute.title || "Guest Concern"}
          </h4>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Property: <strong className="text-neutral-700">{propertyTitle}</strong>
          </p>
        </div>

        <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-200/80">
          <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400 block">
            Claimed Amount
          </span>
          <span className="text-base sm:text-lg font-black text-rose-600">
            ₹{Number(dispute.disputedAmount || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* 2. Visual 3-Stage Progress Stepper */}
      <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-4">
          Resolution Lifecycle
        </p>

        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200 -z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-[#ff6900] transition-all duration-500 -z-0"
            style={{
              width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
            }}
          />

          {/* Stepper Dots */}
          <div className="relative flex justify-between z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xs transition-all",
                  currentStep >= 1
                    ? "bg-[#ff6900] text-white border-[#ff6900]"
                    : "bg-white text-neutral-400 border-neutral-300"
                )}
              >
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-xs font-bold text-neutral-900 mt-2">Filed</span>
              <span className="text-[10px] text-neutral-400">Concern Logged</span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xs transition-all",
                  currentStep > 2
                    ? "bg-[#ff6900] text-white border-[#ff6900]"
                    : currentStep === 2
                    ? "bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100"
                    : "bg-white text-neutral-400 border-neutral-300"
                )}
              >
                {currentStep > 2 ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : currentStep === 2 ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  "2"
                )}
              </div>
              <span className="text-xs font-bold text-neutral-900 mt-2">Investigation</span>
              <span className="text-[10px] text-neutral-400">Host &amp; Support Review</span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 shadow-xs transition-all",
                  currentStep === 3
                    ? "bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100"
                    : "bg-white text-neutral-400 border-neutral-300"
                )}
              >
                {currentStep === 3 ? <CheckCircle2 className="w-4 h-4" /> : "3"}
              </div>
              <span className="text-xs font-bold text-neutral-900 mt-2">Resolution</span>
              <span className="text-[10px] text-neutral-400">
                {refundAmount > 0 ? "Refund Settled" : "Completed"}
              </span>
            </div>
          </div>
        </div>

        {/* Current Step Description Callout */}
        <div className="mt-5 p-3 rounded-xl bg-orange-50/70 border border-orange-200/60 text-xs text-orange-950 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#ff6900] shrink-0 mt-0.5" />
          <span>{config.description}</span>
        </div>
      </div>

      {/* 3. Refund / Resolution Settlement Card (if resolved) */}
      {refundAmount > 0 && (
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Refund Processed</span>
            </div>
            <span className="text-base font-black text-emerald-700">
              ₹{refundAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {dispute.resolution?.summary || "Refund approved and credited back to original payment method."}
          </p>
          {dispute.resolution?.resolvedAt && (
            <p className="text-[10px] text-emerald-700 font-medium">
              Settled on: {new Date(dispute.resolution.resolvedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </p>
          )}
        </div>
      )}

      {/* 4. Claim Summary & Evidence */}
      <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-3">
        <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
          Claim Details
        </h5>

        <div className="text-xs text-neutral-700 bg-neutral-50 p-3 rounded-xl border border-neutral-150 leading-relaxed">
          <p className="font-semibold text-neutral-900 mb-1">Guest Explanation:</p>
          {dispute.description || "No description provided."}
        </div>

        {/* Uploaded Evidence Gallery */}
        {evidencePhotos.length > 0 && (
          <div>
            <span className="text-[11px] font-bold text-neutral-700 block mb-2">
              Uploaded Evidence Photos ({evidencePhotos.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {evidencePhotos.map((ev, idx) => {
                const imgUrl = typeof ev === "string" ? ev : ev?.url;
                if (!imgUrl) return null;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(imgUrl)}
                    className="relative w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 hover:border-[#ff6900] shadow-2xs hover:scale-105 transition-all cursor-pointer group"
                    title="Click to expand"
                  >
                    <img
                      src={imgUrl}
                      alt={`Evidence ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. Activity Timeline / Audit Trail */}
      <div className="p-4 rounded-2xl border border-neutral-200 bg-white space-y-3">
        <h5 className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-neutral-400" />
          <span>Activity Log</span>
        </h5>

        <div className="space-y-3 pl-2 border-l-2 border-neutral-200">
          {timelineEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-4 text-xs">
              {/* Dot */}
              <div className="absolute -left-[9px] top-1 w-2.5 h-2.5 rounded-full bg-[#ff6900] ring-2 ring-white" />
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-neutral-900">
                  {evt.status ? evt.status.replace(/_/g, " ") : "Update"}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                  {evt.timestamp
                    ? new Date(evt.timestamp).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
              <p className="text-neutral-600 text-[11px] mt-0.5 leading-normal">
                {evt.note || "Status updated"}
              </p>
              {evt.changedBy && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  By {evt.changedBy}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal for Photo */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl bg-black">
            <img
              src={selectedImage}
              alt="Expanded Evidence"
              className="max-h-[80vh] w-auto object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function DisputeTrackerModal({ isOpen, onClose, dispute }) {
  const isMobile = useIsMobile();

  if (!dispute) return null;

  const disputeCode = dispute.disputeId || (dispute._id ? `DSP-${dispute._id.slice(-6).toUpperCase()}` : "DSP");

  // Mobile View: Bottom Drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className="max-h-[92vh] bg-white rounded-t-3xl">
          <ScrollArea className="px-4 h-[88vh] pb-24">
            <div className="mx-auto w-full max-w-xl flex flex-col h-full pt-3">
              <DrawerHeader className="shrink-0 text-left px-0 pb-3">
                <div className="flex items-center gap-1.5 text-[#ff6900] font-bold text-xs tracking-wider uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Case Tracking</span>
                </div>
                <DrawerTitle className="text-xl font-black text-neutral-900 mt-0.5">
                  Track Claim #{disputeCode}
                </DrawerTitle>
                <DrawerDescription className="text-neutral-500 text-xs mt-0.5">
                  Live updates on your concern review and resolution status
                </DrawerDescription>
              </DrawerHeader>

              <div className="py-2">
                <DisputeTrackerBody dispute={dispute} />
              </div>

              <DrawerFooter className="shrink-0 px-0 pt-4 pb-2">
                <Button
                  type="button"
                  variant="flat"
                  className="w-full h-12 rounded-xl font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
                  onPress={onClose}
                >
                  Close Tracker
                </Button>
              </DrawerFooter>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop View: Centered Modal Dialog
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl p-0 bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-neutral-150 shrink-0">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-1.5 text-[#ff6900] font-bold text-xs tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4 text-[#ff6900]" />
              <span>Case Resolution Tracking</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              Dispute Status: #{disputeCode}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 mt-0.5">
              Live updates, host communications, and settlement progress
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 flex-1 max-h-[calc(92vh-140px)]">
          <DisputeTrackerBody dispute={dispute} />
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-150 bg-neutral-50/80 shrink-0 flex items-center justify-end">
          <Button
            type="button"
            variant="flat"
            onPress={onClose}
            className="px-6 h-11 rounded-xl text-neutral-700 font-bold hover:bg-neutral-200 transition-all cursor-pointer"
          >
            Close Tracker
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
