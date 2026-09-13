"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Calendar,
  Info,
  Check,
  Plus,
  Minus,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function PropertyEventSection({
  events = [],
  selectedEventId,
  onToggleSelect,
  onOpenDetails,
  attendees = 1,
  setAttendees,
  maxGuests = 10,
  formatRupee = (val) => `₹${Number(val || 0).toLocaleString("en-IN")}`,
}) {
  if (!events || events.length === 0) return null;

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className="p-5 sm:p-6 bg-white border border-neutral-200/80 rounded-3xl shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900">
              Special Events & Experiences
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            Add an exclusive property experience to your stay
          </p>
        </div>
        <Badge className="bg-orange-50 text-[#ff6900] border-orange-200 font-bold px-3 py-1 rounded-full text-xs shrink-0">
          {events.length} Available
        </Badge>
      </div>

      <div className="space-y-3.5">
        {events.map((event) => {
          const isSelected = selectedEventId === event._id;
          const isFree =
            event.isIncludedInStay ||
            !event.pricePerPerson ||
            event.pricePerPerson === 0;
          const unitPrice = Number(event.pricePerPerson) || 0;
          const totalEventCharge = isFree ? 0 : unitPrice * attendees;

          return (
            <div
              key={event._id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isSelected
                  ? "border-[#ff6900] bg-orange-50/20 shadow-sm"
                  : "border-neutral-200/90 bg-white hover:border-neutral-300"
              }`}
            >
              <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5 w-full sm:w-auto">
                  {event.bannerImage ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200">
                      <Image
                        src={event.bannerImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-[#ff6900]">
                      <Sparkles className="w-7 h-7" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                        {event.eventType ? event.eventType.replace("_", " ") : "Special Event"}
                      </span>
                      {isFree ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Included Free
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded-full">
                          {formatRupee(unitPrice)} / guest
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 truncate">
                      {event.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {formatDate(event.startDate)}
                      </span>
                      {event.discountText && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                          <Tag className="w-3 h-3" />
                          {event.discountText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenDetails(event)}
                    className="rounded-xl border-neutral-200 text-xs font-bold px-3 hover:bg-neutral-100 text-neutral-700 flex items-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5 text-[#ff6900]" />
                    Details
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => onToggleSelect(event._id)}
                    className={`rounded-xl text-xs font-bold px-4 transition-all ${
                      isSelected
                        ? "bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-xs"
                        : "bg-neutral-900 hover:bg-black text-white"
                    }`}
                  >
                    {isSelected ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Added
                      </span>
                    ) : (
                      "Add to Stay"
                    )}
                  </Button>
                </div>
              </div>

              {/* Extra Bar if Selected */}
              {isSelected && (
                <div className="bg-orange-50/70 border-t border-orange-100 px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-neutral-800">
                      {isFree ? "Experience included at no extra cost" : "Select attending guests:"}
                    </span>
                    {!isFree && (
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => setAttendees(Math.max(1, attendees - 1))}
                          disabled={attendees <= 1}
                          className="text-neutral-500 hover:text-neutral-900 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-neutral-900 text-xs px-1">
                          {attendees}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttendees(
                              Math.min(event.maxAttendees || maxGuests || 20, attendees + 1)
                            )
                          }
                          className="text-neutral-500 hover:text-neutral-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {!isFree && (
                      <span className="font-bold text-[#ff6900] text-xs">
                        +{formatRupee(totalEventCharge)} added to total
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
