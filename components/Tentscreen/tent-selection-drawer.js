"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
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
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCampingDayDetailsThunk } from "@/Redux/Slices/campingSlice";
import { setSelectedTents } from "@/Redux/Slices/bookingSlice";
import Image from "next/image";

export default function TentSelectionDrawer({
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

  // 2. Fetch day details when drawer opens
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
      setTentError("Please select at least one tent unit.");
      return;
    }

    if (totalGuests > 0 && totalGuests > totalCapacity) {
      setTentError(
        `Selected tents hold ${totalCapacity} guests, but you have ${totalGuests} guests.`
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
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[92vh] p-0 rounded-t-3xl bg-white border-t border-gray-100">
        {/* Handle */}
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-3" />

        {/* Header */}
        <div className="px-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#ff6900] uppercase tracking-wider">
              <Tent className="w-3 h-3" />
              <span>Choose Accommodation</span>
            </div>
            <DrawerTitle className="text-xl font-bold text-gray-900">
              Select Tents
            </DrawerTitle>
            <p className="text-xs text-gray-500">
              Group size: {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capacity Indicator */}
        <div className="px-5 pt-3">
          <div className="p-2.5 rounded-xl bg-orange-50/70 border border-orange-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-medium text-gray-700">
              <Users className="w-3.5 h-3.5 text-[#ff6900]" />
              <span>
                Capacity: <strong>{totalCapacity}</strong> / {totalGuests} guests
              </span>
            </div>
            <div>
              {totalCapacity >= totalGuests && totalSelectedTents > 0 ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              ) : (
                <span className="text-amber-600 font-medium text-[11px]">
                  Need {Math.max(0, totalGuests - totalCapacity)} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tent list */}
        <div className="overflow-y-auto px-5 py-3 space-y-3 max-h-[calc(92vh-220px)]">
          {safeTents.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-xs">
              No tents available for this campsite.
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
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    qty > 0
                      ? "border-[#ff6900] bg-orange-50/20 shadow-2xs"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    <Image src={tentImg} alt="" fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {tent.tentType}
                    </h4>
                    <div className="text-[11px] text-gray-500">
                      Up to {tent.maxCapacity || 2} Guests
                    </div>
                    <div className="mt-0.5 flex items-baseline gap-1 text-xs">
                      <span className="font-bold text-gray-900">
                        {formatRupee(availability.weekdayPrice)}
                      </span>
                      <span className="text-[10px] text-gray-400">/ night</span>
                    </div>
                    <div className="text-[10px] mt-0.5">
                      {dayDetailsLoading ? (
                        <span className="text-gray-400">Checking...</span>
                      ) : isAvailable ? (
                        <span className="text-emerald-600 font-medium">
                          {availability.available} left
                        </span>
                      ) : (
                        <span className="text-red-500 font-medium">Sold Out</span>
                      )}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-white overflow-hidden shadow-2xs">
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
                      className="w-8 h-8 flex items-center justify-center text-gray-600 active:bg-orange-100 disabled:opacity-25"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-gray-900">
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
                      className="w-8 h-8 flex items-center justify-center text-gray-600 active:bg-orange-100 disabled:opacity-25"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Error notification */}
        {tentError && (
          <div className="mx-5 mb-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
            <span>{tentError}</span>
          </div>
        )}

        {/* Fixed Footer */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-gray-900">
              {totalSelectedTents} {totalSelectedTents === 1 ? "Tent" : "Tents"}
            </div>
            <div className="text-[11px] text-gray-500">
              Capacity: {totalCapacity} guests
            </div>
          </div>
          <Button
            type="button"
            onClick={applySelection}
            className="rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-semibold px-6 h-11 shadow-md cursor-pointer"
          >
            Apply Tents
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
