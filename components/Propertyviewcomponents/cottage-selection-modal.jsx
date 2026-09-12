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
  Trees,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCottageDayDetailsThunk } from "@/Redux/Slices/cottageSlice";
import { setSelectedCottages } from "@/Redux/Slices/bookingSlice";
import Image from "next/image";

export default function CottageSelectionModal({
  isOpen,
  onClose,
  cottages = [],
  totalGuests = 1,
  dateStr,
  id,
}) {
  const dispatch = useDispatch();
  const { dayDetails, dayDetailsLoading } = useSelector(
    (state) => state.cottage
  );
  const reduxSelectedCottages = useSelector(
    (state) => state.booking.selectedCottages
  );

  const [cottageError, setCottageError] = useState("");
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
      getCottageDayDetailsThunk({
        id,
        date: formattedDate,
      })
    );
  }, [id, formattedDate, isOpen, dispatch]);

  // 3. Sync Redux state to local on open
  useEffect(() => {
    if (!isOpen) return;
    const mapped = {};
    Object.entries(reduxSelectedCottages || {}).forEach(([cottageType, c]) => {
      mapped[cottageType] = c.quantity || 0;
    });
    setLocalSelected(mapped);
    setCottageError("");
  }, [isOpen, reduxSelectedCottages]);

  const cottagesForDay = useMemo(() => {
    return dayDetails?.data?.tents || dayDetails?.data?.cottages || dayDetails?.cottages || [];
  }, [dayDetails]);

  const safeCottages = useMemo(() => (Array.isArray(cottages) ? cottages : []), [cottages]);

  const getCottageConfig = (cottageType) =>
    safeCottages.find((c) => (c.cottageType || c.name) === cottageType);

  const getCottageCapacity = (cottageType) =>
    getCottageConfig(cottageType)?.maxCapacity || 2;

  // 4. Availability & Price lookup
  const getAvailabilityForCottage = (cottage) => {
    const typeKey = cottage.cottageType || cottage.name;
    const summary = cottagesForDay.find(
      (c) => (c.cottageType || c.name) === typeKey
    );
    if (!summary) {
      const defaultTotal = cottage.totalcottage ?? cottage.totaltents ?? cottage.totalCottages ?? 1;
      return {
        total: defaultTotal,
        booked: 0,
        available: defaultTotal,
        weekdayPrice: cottage.pricing?.weekdayPrice || 0,
        weekendPrice:
          cottage.pricing?.weekendPrice || cottage.pricing?.weekdayPrice || 0,
      };
    }
    const fallbackTotal = cottage.totalcottage ?? cottage.totaltents ?? cottage.totalCottages ?? 1;
    return {
      total: summary.total ?? fallbackTotal,
      booked: summary.booked ?? 0,
      available: summary.available ?? fallbackTotal,
      weekdayPrice: summary.price?.weekday ?? cottage.pricing?.weekdayPrice ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        cottage.pricing?.weekendPrice ??
        summary.price?.weekday ??
        0,
    };
  };

  const handleCottageQtyChange = (cottageType, qty, available) => {
    if (qty < 0 || qty > available) return;
    setLocalSelected((prev) => ({
      ...prev,
      [cottageType]: qty,
    }));
    if (cottageError) setCottageError("");
  };

  const totalSelectedCottages = Object.values(localSelected).reduce(
    (s, q) => s + (q || 0),
    0
  );

  const totalCapacity = Object.entries(localSelected).reduce(
    (sum, [cottageType, qty]) => sum + getCottageCapacity(cottageType) * (qty || 0),
    0
  );

  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const applySelection = () => {
    if (totalSelectedCottages === 0) {
      setCottageError("Please select at least one cottage unit to proceed.");
      return;
    }

    if (totalGuests > 0 && totalGuests > totalCapacity) {
      setCottageError(
        `Selected cottages can accommodate up to ${totalCapacity} guests, but you have ${totalGuests} guests. Please select additional cottages.`
      );
      return;
    }

    const payload = {};
    Object.entries(localSelected).forEach(([cottageType, qty]) => {
      if (qty <= 0) return;
      const cfg = getCottageConfig(cottageType);
      const day = cottagesForDay.find((c) => (c.cottageType || c.name) === cottageType);

      payload[cottageType] = {
        quantity: qty,
        cottageType,
        maxCapacity: cfg?.maxCapacity || 2,
        weekdayPrice: day?.price?.weekday ?? cfg?.pricing?.weekdayPrice ?? 0,
        weekendPrice:
          day?.price?.weekend ??
          cfg?.pricing?.weekendPrice ??
          day?.price?.weekday ??
          0,
        available: day?.available ?? cfg?.totaltents ?? cfg?.totalCottages ?? 1,
        totalCottages: cfg?.totaltents ?? cfg?.totalCottages ?? 1,
        images: cfg?.tentimages || cfg?.images || [],
        amenities: cfg?.amenities || [],
      };
    });

    dispatch(setSelectedCottages(payload));
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl lg:max-w-3xl w-[94vw] sm:w-[90vw] md:w-full max-h-[85vh] sm:max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-gray-100 shadow-2xl z-[150] my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50/60 via-white to-amber-50/40 flex items-start justify-between relative flex-shrink-0">
          <div className="pr-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[#ff6900] text-[11px] sm:text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Trees className="w-3.5 h-3.5" />
              <span>Cottage Selection</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Select Your Cottages
            </DialogTitle>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose your preferred cottage units for your stay.
              {formattedDate ? ` Viewing live availability for ${formattedDate}.` : ""}
            </p>
          </div>
        </div>

        {/* Guest capacity notice banner */}
        <div className="bg-amber-50/80 border-b border-amber-100/80 px-4 sm:px-5 py-2.5 flex items-center justify-between text-xs text-amber-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span>
              Guests: <strong>{totalGuests}</strong> · Selected Capacity:{" "}
              <strong>{totalCapacity}</strong>
            </span>
          </div>
          {totalCapacity < totalGuests ? (
            <span className="text-amber-700 font-semibold text-[11px]">
              Need +{totalGuests - totalCapacity} more capacity
            </span>
          ) : (
            <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Capacity met
            </span>
          )}
        </div>

        {/* Scrollable Cottage List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {cottageError && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{cottageError}</span>
            </div>
          )}

          {dayDetailsLoading && (
            <div className="py-2 text-center text-xs text-gray-500 animate-pulse">
              Checking real-time live availability...
            </div>
          )}

          {safeCottages.map((c, index) => {
            const typeKey = c.cottageType || c.name || `Cottage ${index + 1}`;
            const { available, total, weekdayPrice } = getAvailabilityForCottage(c);
            const currentQty = localSelected[typeKey] || 0;
            const isSoldOut = available <= 0;
            const cottageImg =
              c.cottageimages?.[0] ||
              c.images?.[0] ||
              c.tentimages?.[0] ||
              "/placeholder.svg";

            return (
              <div
                key={c._id || index}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 ${
                  currentQty > 0
                    ? "border-[#ff6900] bg-orange-50/20 shadow-sm"
                    : isSoldOut
                    ? "border-gray-100 bg-gray-50/60 opacity-60"
                    : "border-gray-200/90 bg-white hover:border-orange-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                      <Image
                        src={cottageImg}
                        alt={typeKey}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm sm:text-base text-gray-900 tracking-tight">
                          {typeKey}
                        </h4>
                        {isSoldOut ? (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                            Sold Out
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-2 py-0.5 h-5 bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            {available} of {total} left
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          Up to {c.maxCapacity || 2} guests
                        </span>
                      </div>

                      <div className="mt-1.5 flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-bold text-gray-900">
                          {formatRupee(weekdayPrice)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 font-normal">
                          / night + taxes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quantity Stepper */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      type="button"
                      disabled={currentQty === 0 || isSoldOut}
                      onClick={() => handleCottageQtyChange(typeKey, currentQty - 1, available)}
                      className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all cursor-pointer text-gray-700"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center font-bold text-sm text-gray-900">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      disabled={currentQty >= available || isSoldOut}
                      onClick={() => handleCottageQtyChange(typeKey, currentQty + 1, available)}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-gray-100 bg-gray-50/90 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <div className="text-xs text-gray-500 text-center sm:text-left">
            Total Units: <strong>{totalSelectedCottages}</strong> · Accommodates{" "}
            <strong>{totalCapacity}</strong> guests
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-gray-200 text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-initial"
            >
              Cancel
            </Button>
            <Button
              onClick={applySelection}
              className="rounded-xl bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white text-xs sm:text-sm font-bold px-6 shadow-md shadow-orange-500/20 h-9 sm:h-10 flex-1 sm:flex-initial"
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
