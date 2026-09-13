"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalFooter,
} from "@heroui/react";
import {
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Plus,
  Minus,
  X,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const formatEventDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getEventTypeLabel = (type) => {
  switch (type) {
    case "pool_party":
      return "Pool Party & Sundowner";
    case "acoustic_night":
      return "Live Acoustic Night";
    case "bbq_night":
      return "Barbecue & Grill Night";
    case "festive":
      return "Festive Celebration";
    case "sundowner":
      return "Sunset Session";
    case "workshop":
      return "Creative Workshop";
    default:
      return "Special Experience";
  }
};

const getEventDefaultBanner = (type) => {
  switch (type) {
    case "bbq_night":
      return "/Homeasset/nearby-villa.jpg";
    case "pool_party":
    case "sundowner":
      return "/Homeasset/nearby-villa.jpg";
    case "acoustic_night":
      return "/Aboutusasset/Campbanner.jpg";
    case "festive":
      return "/Aboutusasset/Villabanner.jpg";
    default:
      return "/Homeasset/nearby-villa.jpg";
  }
};

export default function EventDetailsModal({
  isOpen,
  onClose,
  event,
  isSelected,
  onToggleSelect,
  attendees,
  setAttendees,
  maxGuests = 10,
  formatRupee = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`,
}) {
  if (!event) return null;

  const isFree = event.isIncludedInStay || !event.pricePerPerson || event.pricePerPerson === 0;
  const unitPrice = Number(event.pricePerPerson) || 0;
  const totalCharge = isFree ? 0 : unitPrice * attendees;
  const bannerSrc =
    event.bannerImage ||
    event.banner ||
    event.image ||
    getEventDefaultBanner(event.eventType);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      size="2xl"
      hideCloseButton={true}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-white rounded-3xl max-h-[92vh] overflow-hidden shadow-2xl border border-neutral-200/80 mx-3 sm:mx-4 p-0",
        body: "p-0",
        footer: "border-t border-neutral-100 p-4 sm:p-5 bg-neutral-50/80 shrink-0",
      }}
    >
      <ModalContent className="flex flex-col max-h-[92vh] overflow-hidden">
        {() => (
          <>
            {/* 1. Hero Banner at Top */}
            <div className="relative w-full h-48 sm:h-60 overflow-hidden bg-neutral-900 shrink-0 select-none">
              <img
                src={bannerSrc}
                alt={event.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/Homeasset/nearby-villa.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/25" />

              {/* Floating Top Header Controls */}
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-white/95 text-neutral-900 border-none font-bold px-2.5 py-1 rounded-full text-xs flex items-center gap-1 shadow-md backdrop-blur-md">
                    <Flame className="w-3.5 h-3.5 text-[#ff6900]" />
                    {getEventTypeLabel(event.eventType)}
                  </Badge>

                  {isFree ? (
                    <Badge className="bg-emerald-500 text-white border-none font-bold px-2.5 py-1 rounded-full text-xs shadow-md">
                      Included Free With Stay
                    </Badge>
                  ) : (
                    <Badge className="bg-[#ff6900] text-white border-none font-bold px-2.5 py-1 rounded-full text-xs shadow-md">
                      {formatRupee(unitPrice)} / guest
                    </Badge>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Overlay Event Title & Date Info */}
              <div className="absolute bottom-3.5 left-4 right-4 sm:left-6 sm:right-6 z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md">
                  {event.title}
                </h2>
                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200 mt-2 flex-wrap">
                  {event.startDate && (
                    <span className="flex items-center gap-1.5 backdrop-blur-md bg-black/50 px-3 py-1 rounded-full text-[11px] text-orange-300">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatEventDate(event.startDate)}
                      {event.endDate && event.endDate !== event.startDate
                        ? ` – ${formatEventDate(event.endDate)}`
                        : ""}
                    </span>
                  )}
                  {event.maxAttendees > 0 && (
                    <span className="flex items-center gap-1.5 backdrop-blur-md bg-black/40 px-3 py-1 rounded-full text-[11px] text-neutral-200">
                      <Users className="w-3.5 h-3.5 text-orange-400" />
                      Max {event.maxAttendees} Guests
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Scrollable Body using Radix ScrollArea Component */}
            <ScrollArea className="flex-1 min-h-0 max-h-[calc(92vh-260px)] overflow-y-auto px-5 sm:px-6 py-5">
              <div className="space-y-5">
                {/* About This Experience */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    About This Experience
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {event.description ||
                      "Enjoy an exclusive event hosted directly on the property grounds. Crafted to give you and your fellow guests unforgettable moments with bespoke ambiance, curated hospitality, and authentic local vibes."}
                  </p>
                </div>

                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-neutral-400 block uppercase">
                        Schedule
                      </span>
                      <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                        {formatEventDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate
                          ? ` – ${formatEventDate(event.endDate)}`
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-neutral-400 block uppercase">
                        Pricing
                      </span>
                      <span className="text-xs font-bold text-neutral-900 block mt-0.5">
                        {isFree ? "Free for Staying Guests" : `${formatRupee(unitPrice)} per person`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Inclusions & Highlights */}
                <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
                  <span className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#ff6900]" />
                    Event Highlights & Host Inclusions
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hosted exclusively on-site at the booked property.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Curated ambiance with premium sound, lighting, and hospitality support.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Synchronized with your stay dates for effortless check-in integration.</span>
                    </li>
                  </ul>
                </div>

                {/* Attendee Counter (If event has a per-person charge) */}
                {!isFree && (
                  <div className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block">
                        Attending Guests
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {formatRupee(unitPrice)} × {attendees} {attendees === 1 ? "guest" : "guests"} ={" "}
                        <strong className="text-neutral-900">{formatRupee(totalCharge)}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAttendees(Math.max(1, attendees - 1))}
                        disabled={attendees <= 1}
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-neutral-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-black text-neutral-900 w-5 text-center">
                        {attendees}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setAttendees(Math.min(event.maxAttendees || maxGuests || 20, attendees + 1))
                        }
                        className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-neutral-900 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* 3. Sticky Modal Footer */}
            <ModalFooter className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-neutral-200 text-xs font-bold px-4 hover:bg-neutral-100"
              >
                Close
              </Button>

              <Button
                type="button"
                onClick={() => {
                  onToggleSelect(event._id);
                  onClose();
                }}
                className={`rounded-xl text-xs font-bold px-5 py-2.5 transition-all shadow-sm ${
                  isSelected
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-neutral-900 hover:bg-black text-white"
                }`}
              >
                {isSelected
                  ? "Remove from Stay"
                  : isFree
                  ? "Add to Stay (Included Free)"
                  : `Add to Stay (+${formatRupee(totalCharge)})`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
