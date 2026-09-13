"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  Users,
  Tent,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCampingDayDetailsThunk } from "@/Redux/Slices/campingSlice";
import { setSelectedTents } from "@/Redux/Slices/bookingSlice";
import Image from "next/image";

export default function TentSelectionModal({
  isOpen,
  onClose,
  tents = [],
  totalGuests = 1,
  dateStr,
  id,
}) {
  const dispatch = useDispatch();
  const { dayDetails, dayDetailsLoading } = useSelector(
    (state) => state.camping
  );
  const reduxSelectedTents = useSelector(
    (state) => state.booking.selectedTents
  );

  const [tentError, setTentError] = useState("");
  const [localSelected, setLocalSelected] = useState({});

  // 1. Stabilize date (YYYY-MM-DD for IST)
  const formattedDate = useMemo(() => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d);
  }, [dateStr]);

  // 2. Fetch day details when modal opens
  useEffect(() => {
    if (!id || !formattedDate || !isOpen) return;
    dispatch(
      getCampingDayDetailsThunk({
        id,
        date: formattedDate,
      })
    );
  }, [id, formattedDate, isOpen, dispatch]);

  // 3. Sync Redux state to local on open
  useEffect(() => {
    if (!isOpen) return;
    const mapped = {};
    Object.entries(reduxSelectedTents || {}).forEach(([tentType, t]) => {
      mapped[tentType] = t.quantity || 0;
    });
    setLocalSelected(mapped);
    setTentError("");
  }, [isOpen, reduxSelectedTents]);

  const tentsForDay = useMemo(() => {
    return dayDetails?.data?.tents || dayDetails?.tents || [];
  }, [dayDetails]);

  const safeTents = useMemo(() => {
    if (!Array.isArray(tents)) return [];
    const map = new Map();

    tents.forEach((t, idx) => {
      const rawType = t.tentType || t.name || `Tent ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();

      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...t,
          tentType: typeKey,
          totaltents: Number(t.totaltents ?? t.totalUnits ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totaltents = (Number(existing.totaltents) || 0) + Number(t.totaltents ?? t.totalUnits ?? 1);
        const hasImages = existing.tentimages?.length || existing.images?.length;
        if (!hasImages && (t.tentimages?.length || t.images?.length)) {
          existing.tentimages = t.tentimages || t.images;
        }
      }
    });

    return Array.from(map.values());
  }, [tents]);

  const getTentConfig = (tentType) =>
    safeTents.find(
      (t) =>
        (t.tentType || t.name || "").trim().toLowerCase() ===
        (tentType || "").trim().toLowerCase()
    );

  const getTentCapacity = (tentType) =>
    getTentConfig(tentType)?.maxCapacity || 2;

  // 4. Availability & Price lookup
  const getAvailabilityForTent = (tent) => {
    const typeKey = (tent.tentType || tent.name || "").trim();
    const summary = tentsForDay.find(
      (t) =>
        (t.tentType || t.name || "").trim().toLowerCase() ===
        typeKey.toLowerCase()
    );
    const configuredTotal = tent.totaltents || 0;
    if (!summary) {
      return {
        total: configuredTotal,
        booked: 0,
        available: configuredTotal,
        weekdayPrice: tent.pricing?.weekdayPrice || 0,
        weekendPrice:
          tent.pricing?.weekendPrice || tent.pricing?.weekdayPrice || 0,
      };
    }
    const availableCount =
      summary.available ??
      Math.max(0, (summary.total ?? configuredTotal) - (summary.booked ?? 0));
    return {
      total: summary.total ?? configuredTotal,
      booked: summary.booked ?? 0,
      available: availableCount,
      weekdayPrice: summary.price?.weekday ?? tent.pricing?.weekdayPrice ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        tent.pricing?.weekendPrice ??
        summary.price?.weekday ??
        0,
    };
  };

  const handleTentQtyChange = (tentType, qty, available) => {
    if (qty < 0 || qty > available) return;
    setLocalSelected((prev) => ({
      ...prev,
      [tentType]: qty,
    }));
    if (tentError) setTentError("");
  };

  const totalSelectedTents = Object.values(localSelected).reduce(
    (s, q) => s + (q || 0),
    0
  );

  const totalCapacity = Object.entries(localSelected).reduce(
    (sum, [tentType, qty]) => sum + getTentCapacity(tentType) * (qty || 0),
    0
  );

  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const applySelection = () => {
    if (totalSelectedTents === 0) {
      setTentError("Please select at least one tent unit to proceed.");
      return;
    }

    if (totalGuests > 0 && totalGuests > totalCapacity) {
      setTentError(
        `Selected tents can accommodate up to ${totalCapacity} guests, but you have ${totalGuests} guests. Please select additional tents.`
      );
      return;
    }

    const payload = {};
    Object.entries(localSelected).forEach(([tentType, qty]) => {
      if (qty <= 0) return;
      const cfg = getTentConfig(tentType);
      const day = tentsForDay.find(
        (t) =>
          (t.tentType || t.name || "").trim().toLowerCase() ===
          tentType.trim().toLowerCase()
      );

      payload[tentType] = {
        unitType: "Tent",
        unitId: cfg?._id,
        typeName: tentType,
        quantity: qty,
        weekdayPrice: day?.price?.weekday || cfg?.pricing?.weekdayPrice || 0,
        weekendPrice:
          day?.price?.weekend ||
          cfg?.pricing?.weekendPrice ||
          cfg?.pricing?.weekdayPrice ||
          0,
        maxCapacity: cfg?.maxCapacity || 2,
      };
    });

    dispatch(setSelectedTents(payload));
    setTentError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl sm:max-w-2xl w-[94vw] sm:w-[90vw] md:w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl z-[150] my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 via-white to-amber-50/50 p-4 sm:p-5 border-b border-gray-100 relative flex-shrink-0">
          <div className="flex items-start justify-between pr-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6900] text-[11px] sm:text-xs font-semibold tracking-wide uppercase">
                <Tent className="w-3.5 h-3.5" />
                <span>Campsite Accommodation</span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                Select Your Tents
              </DialogTitle>
              <p className="text-xs text-gray-500">
                Choose the tent types and quantities needed for your group ({totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}).
              </p>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mt-3 p-2.5 sm:p-3 bg-white/80 backdrop-blur rounded-xl border border-gray-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#ff6900] flex-shrink-0" />
              <span className="font-medium text-gray-700">
                Capacity: <strong className="text-gray-900">{totalCapacity}</strong> / {totalGuests} guests needed
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs">
              {totalCapacity >= totalGuests && totalSelectedTents > 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Capacity Satisfied
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Need {Math.max(0, totalGuests - totalCapacity)} more capacity
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tent Cards List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {safeTents.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No tent configurations found for this campsite.
            </div>
          ) : (
            safeTents.map((tent) => {
              const availability = getAvailabilityForTent(tent);
              const qty = localSelected[tent.tentType] || 0;
              const isAvailable = availability.available > 0;
              const tentImg =
                (tent.tentimages && tent.tentimages[0]) ||
                tent.images?.[0] ||
                "/placeholder.svg";

              return (
                <div
                  key={tent._id || tent.tentType}
                  className={`p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    qty > 0
                      ? "border-[#ff6900] bg-orange-50/20 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-100">
                      <Image
                        src={tentImg}
                        alt={tent.tentType}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 text-base truncate">
                          {tent.tentType}
                        </h4>
                        <Badge
                          variant="secondary"
                          className="text-[11px] bg-gray-100 text-gray-600 font-medium px-2 py-0.5 rounded-full"
                        >
                          Up to {tent.maxCapacity || 2} Guests / tent
                        </Badge>
                      </div>

                      {/* Pricing */}
                      <div className="mt-1 flex items-baseline gap-1.5 text-xs text-gray-600">
                        <span className="text-base font-bold text-gray-900">
                          {formatRupee(availability.weekdayPrice)}
                        </span>
                        <span className="text-gray-500 font-normal">
                          / tent / night
                        </span>
                        {availability.weekendPrice !== availability.weekdayPrice && (
                          <span className="text-[10px] text-gray-400">
                            (Weekend: {formatRupee(availability.weekendPrice)})
                          </span>
                        )}
                      </div>

                      {/* Availability status */}
                      <div className="mt-1 text-[11px]">
                        {dayDetailsLoading ? (
                          <span className="text-gray-400">Checking availability...</span>
                        ) : isAvailable ? (
                          <span className="text-emerald-600 font-medium">
                            ✓ {availability.available} units available
                          </span>
                        ) : (
                          <span className="text-red-500 font-medium">
                            Sold Out for selected date
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Stepper */}
                  <div className="flex items-center gap-3 sm:self-center ml-auto">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() =>
                          handleTentQtyChange(
                            tent.tentType,
                            qty - 1,
                            availability.available
                          )
                        }
                        disabled={qty <= 0}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff6900] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center font-bold text-sm text-gray-900">
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleTentQtyChange(
                            tent.tentType,
                            qty + 1,
                            availability.available
                          )
                        }
                        disabled={!isAvailable || qty >= availability.available}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[#ff6900] hover:bg-orange-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          </div>
        </ScrollArea>

        {/* Error Notification */}
        {tentError && (
          <div className="mx-4 sm:mx-6 mb-2 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600 flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span>{tentError}</span>
          </div>
        )}

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-gray-50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 flex-shrink-0">
          <div className="text-xs text-center sm:text-left">
            <p className="font-semibold text-gray-900">
              {totalSelectedTents} {totalSelectedTents === 1 ? "Tent" : "Tents"} selected
            </p>
            <p className="text-gray-500 text-[11px] sm:text-xs">
              Total Capacity: {totalCapacity} guests
            </p>
          </div>
          <div className="flex items-center gap-2.5 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 hover:bg-gray-100 text-xs font-semibold px-4 h-9 flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={applySelection}
              className="rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c55000] text-white text-xs font-semibold px-5 h-9 shadow-md transition-all cursor-pointer flex-1 sm:flex-initial"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
