"use client";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { BaseUrl } from "@/lib/API/Baseurl";
import {
  Calendar,
  Sparkles,
  Ticket,
  Tag,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  PartyPopper,
  Info,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MobileEventsSection({ property, propertyType = "villa" }) {
  const [events, setEvents] = useState(property?.events || []);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (property?.events && Array.isArray(property.events) && property.events.length > 0) {
      setEvents(property.events);
    }
    const pId = property?._id || property?.id;
    if (!pId) return;

    fetch(`${BaseUrl}/PropertyEvent/property/${propertyType}/${pId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json?.success && Array.isArray(json?.events)) {
          setEvents(json.events);
        }
      })
      .catch(() => {});
  }, [property?._id, property?.id, propertyType, property?.events]);

  const activeEvents = useMemo(() => {
    return (events || []).filter(
      (e) => e.isActive !== false && (!e.endDate || new Date(e.endDate) >= new Date())
    );
  }, [events]);

  return (
    <section
      id="events"
      className="p-3.5 space-y-4 scroll-mt-24 border-t border-neutral-100"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="text-base font-bold border-l-4 border-[#ff6900] pl-2.5 text-gray-900 flex items-center gap-2">
            Property Events
          </h3>

          {activeEvents.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-[#ff6900] to-rose-500 text-white shadow-xs animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              {activeEvents.length} {activeEvents.length > 1 ? "Events" : "Event"} Live
            </span>
          ) : (
            <span className="text-[11px] font-medium text-neutral-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Special Occasions
            </span>
          )}
        </div>

        {activeEvents.length > 0 ? (
          <div className="space-y-3.5">
            {activeEvents.map((evt, idx) => {
              const startFormatted = evt.startDate
                ? new Date(evt.startDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })
                : null;
              const endFormatted = evt.endDate
                ? new Date(evt.endDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : null;

              const eventImg =
                evt.bannerImage ||
                evt.image ||
                (Array.isArray(property?.images) && property.images[0]) ||
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80";

              return (
                <div
                  key={evt._id || idx}
                  className="bg-white rounded-2xl overflow-hidden border border-neutral-200/90 shadow-2xs transition-all active:scale-[0.99]"
                >
                  {/* Event Banner */}
                  <div className="relative h-40 w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={eventImg}
                      alt={evt.title || "Property Event"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-gray-900 shadow-xs">
                        <PartyPopper className="w-3 h-3 text-[#ff6900]" />
                        {evt.eventType || "Exclusive Event"}
                      </span>

                      {evt.price !== undefined && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#ff6900] text-white shadow-xs">
                          {Number(evt.price) > 0 ? `₹${evt.price} / person` : "Included with Stay"}
                        </span>
                      )}
                    </div>

                    {/* Bottom Title on Image */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <h4 className="text-white text-sm font-bold leading-snug line-clamp-1 drop-shadow-sm">
                        {evt.title}
                      </h4>
                      {(startFormatted || endFormatted) && (
                        <div className="flex items-center gap-1.5 text-orange-200 text-[10px] font-medium mt-0.5">
                          <Calendar className="w-3 h-3 text-[#ff994d]" />
                          <span>
                            {startFormatted}
                            {endFormatted && endFormatted !== startFormatted ? ` - ${endFormatted}` : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 space-y-2.5">
                    {evt.description && (
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                    )}



                    {/* Action */}
                    <div className="pt-1 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(evt)}
                        className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Ticket className="w-3.5 h-3.5 text-amber-400" />
                        View Event Details & Inclusions
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-orange-50/40 via-white to-neutral-50 rounded-2xl p-4 border border-neutral-200/90 shadow-2xs space-y-3 text-center">
            <div className="w-10 h-10 rounded-full bg-orange-100/80 text-[#ff6900] flex items-center justify-center mx-auto">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">
                Seasonal Gatherings & Custom Events
              </h4>
              <p className="text-[11px] text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                No public ticketed events are currently scheduled for this property. We frequently host live acoustic sessions, barbecues, and private celebrations!
              </p>
            </div>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold bg-white border border-orange-200 text-neutral-700">
                <Sparkles className="w-3 h-3 text-[#ff6900]" />
                Custom party setup available upon request
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={Boolean(selectedEvent)} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="max-w-lg w-[92vw] sm:w-[88vw] max-h-[82vh] sm:max-h-[85vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl z-[150] my-auto">
          {selectedEvent && (
            <>
              {/* Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-orange-50/50 via-white to-amber-50/40 flex items-start justify-between relative flex-shrink-0">
                <div className="pr-8">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6900] text-[10px] font-semibold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{selectedEvent.eventType || "Exclusive Event"}</span>
                  </div>
                  <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {selectedEvent.title}
                  </DialogTitle>
                  {selectedEvent.price !== undefined && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-neutral-900 text-white">
                      {Number(selectedEvent.price) > 0 ? `₹${selectedEvent.price} / person` : "Included with Stay"}
                    </span>
                  )}
                </div>
              </div>

              {/* Scrollable Body */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-4 space-y-3.5">
                  {/* Event Image */}
                  <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-neutral-900 flex-shrink-0">
                    <Image
                      src={
                        selectedEvent.bannerImage ||
                        selectedEvent.image ||
                        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80"
                      }
                      alt={selectedEvent.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Details card */}
                  <div className="bg-neutral-50 rounded-2xl p-3.5 space-y-2 border border-neutral-200/80 text-xs">
                    {selectedEvent.startDate && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-[#ff6900] shrink-0" />
                        <span>
                          {new Date(selectedEvent.startDate).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                          {selectedEvent.endDate &&
                            ` - ${new Date(selectedEvent.endDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                            })}`}
                        </span>
                      </div>
                    )}


                  </div>

                  {/* Description */}
                  {selectedEvent.description && (
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-gray-900">About This Event</h5>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Inclusions / Perks if available */}
                  {Array.isArray(selectedEvent.perks) && selectedEvent.perks.length > 0 && (
                    <div className="space-y-1.5">
                      <h5 className="text-xs font-bold text-gray-900">What's Included:</h5>
                      <div className="grid grid-cols-1 gap-1.5">
                        {selectedEvent.perks.map((p, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Close & Continue Viewing Stay
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
