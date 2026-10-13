"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@heroui/react";
import { Card } from "@/components/ui/card";
import { MinusIcon, PlusIcon, X, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCottages } from "@/Redux/Slices/bookingSlice";
import ButtonLoader from "../Loadercomponents/button-loader";
import { getCottageDayDetailsThunk } from "@/Redux/Slices/cottageSlice";

export default function CottageSelectionDrawer({
  isOpen,
  onClose,
  cottages = [],
  totalGuests = 0,
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

  /* --------------------------------------------------
   * 1️⃣ Stabilize date (PREVENTS useEffect LOOP)
   * -------------------------------------------------- */
  const formattedDate = useMemo(() => {
    if (!dateStr) return null;

    const d = new Date(dateStr);
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(d); // en-CA gives YYYY-MM-DD
  }, [dateStr]);

  /* --------------------------------------------------
   * 2️⃣ Fetch day details ONCE per date
   * -------------------------------------------------- */
  useEffect(() => {
    if (!id || !formattedDate || !isOpen) return;

    dispatch(
      getCottageDayDetailsThunk({
        id,
        date: formattedDate,
      })
    );
  }, [id, formattedDate, isOpen, dispatch]);

  const cottagesForDay = useMemo(() => {
    return (
      dayDetails?.cottages ||
      dayDetails?.data?.cottages ||
      []
    );
  }, [dayDetails]);

  const safeCottages = useMemo(() => {
    if (!Array.isArray(cottages)) return [];
    const map = new Map();

    cottages.forEach((c, idx) => {
      const rawType = c.cottageType || c.name || `Cottage ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();

      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...c,
          cottageType: typeKey,
          totalCottages: Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totalCottages =
          (Number(existing.totalCottages) || 0) +
          Number(c.totalcottage ?? c.totaltents ?? c.totalCottages ?? 1);
        const hasImages =
          existing.cottageimages?.length ||
          existing.images?.length ||
          existing.tentimages?.length;
        if (
          !hasImages &&
          (c.cottageimages?.length || c.images?.length || c.tentimages?.length)
        ) {
          existing.cottageimages = c.cottageimages || c.images || c.tentimages;
        }
      }
    });

    return Array.from(map.values());
  }, [cottages]);

  const getCottageConfig = (cottageType) =>
    safeCottages.find(
      (c) =>
        (c.cottageType || c.name || "").trim().toLowerCase() ===
        (cottageType || "").trim().toLowerCase()
    );

  const getCottageCapacity = (cottageType) =>
    getCottageConfig(cottageType)?.maxCapacity || 0;

  /* --------------------------------------------------
   * 3️⃣ Availability from dayDetails (SOURCE OF TRUTH)
   * -------------------------------------------------- */
  const getAvailabilityForCottage = (cottage) => {
    const typeKey = (cottage.cottageType || cottage.name || "").trim().toLowerCase();
    const summary = cottagesForDay.find(
      (c) => (c.cottageType || c.name || "").trim().toLowerCase() === typeKey
    );

    const configuredTotal =
      cottage.totalCottages || cottage.totalcottage || cottage.totaltents || 1;

    if (!summary) {
      return {
        total: configuredTotal,
        booked: 0,
        available: configuredTotal,
        weekdayPrice: cottage.pricing?.weekdayPrice || 0,
        weekendPrice:
          cottage.pricing?.weekendPrice || cottage.pricing?.weekdayPrice || 0,
      };
    }

    const availableCount =
      summary.available !== undefined
        ? Math.max(0, Number(summary.available))
        : Math.max(
            0,
            (Number(summary.total) || configuredTotal) - (Number(summary.booked) || 0)
          );

    return {
      total: summary.total ?? configuredTotal,
      booked: summary.booked ?? 0,
      available: availableCount,
      weekdayPrice:
        summary.price?.weekday ?? cottage.pricing?.weekdayPrice ?? 0,
      weekendPrice:
        summary.price?.weekend ??
        cottage.pricing?.weekendPrice ??
        summary.price?.weekday ??
        0,
    };
  };

  const displayCottages = useMemo(() => {
    if (Array.isArray(cottagesForDay) && cottagesForDay.length > 0) {
      const map = new Map();
      cottagesForDay.forEach((c) => {
        const typeKey = (c.cottageType || "Cottage").trim();
        const lowerKey = typeKey.toLowerCase();
        if (!map.has(lowerKey)) {
          map.set(lowerKey, {
            ...c,
            cottageType: typeKey,
          });
        }
      });
      return Array.from(map.values());
    }
    return safeCottages.map((c) => {
      const avail = getAvailabilityForCottage(c);
      return {
        cottageType: c.cottageType,
        total: avail.total,
        booked: avail.booked,
        available: avail.available,
        price: {
          weekday: avail.weekdayPrice,
          weekend: avail.weekendPrice,
        },
      };
    });
  }, [cottagesForDay, safeCottages]);

  const allCottagesSoldOut = useMemo(() => {
    if (!displayCottages || displayCottages.length === 0) return false;
    return displayCottages.every((c) => (c.available ?? 0) <= 0);
  }, [displayCottages]);

  /* --------------------------------------------------
   * 4️⃣ Sync local state when drawer opens & auto-clamp
   * -------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const mapped = {};
    Object.entries(reduxSelectedCottages || {}).forEach(([cottageType, t]) => {
      const cfg = getCottageConfig(cottageType);
      const avail = getAvailabilityForCottage(cfg || { cottageType });
      const qty = t.quantity || 0;
      mapped[cottageType] = Math.max(0, Math.min(avail.available, qty));
    });

    setLocalSelected(mapped);
    setCottageError("");
  }, [isOpen, reduxSelectedCottages, cottagesForDay, safeCottages]);

  /* --------------------------------------------------
   * 5️⃣ Quantity handler
   * -------------------------------------------------- */
  const handleCottageQtyChange = (cottageType, qty, available) => {
    if (qty < 0 || qty > available) return;

    setLocalSelected((prev) => ({
      ...prev,
      [cottageType]: qty,
    }));

    if (cottageError) setCottageError("");
  };

  /* --------------------------------------------------
   * 6️⃣ Helpers
   * -------------------------------------------------- */
  const formatRupee = (amount) =>
    `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount || 0)}`;

  const applySelection = () => {
    const totalSelected = Object.values(localSelected).reduce(
      (s, q) => s + q,
      0
    );

    if (totalSelected === 0) {
      setCottageError("Please select at least one cottage");
      return;
    }

    // Availability validation
    for (const [cottageType, qty] of Object.entries(localSelected)) {
      if (qty <= 0) continue;
      const cfg = getCottageConfig(cottageType);
      const avail = getAvailabilityForCottage(cfg || { cottageType });
      if (avail.available <= 0) {
        setCottageError(
          `${cottageType} is sold out for this date. Please choose another cottage.`
        );
        return;
      }
      if (qty > avail.available) {
        setCottageError(
          `Only ${avail.available} unit(s) of ${cottageType} available, but ${qty} selected.`
        );
        return;
      }
    }

    const totalCap = Object.entries(localSelected).reduce(
      (sum, [cottageType, qty]) => sum + getCottageCapacity(cottageType) * qty,
      0
    );

    if (totalGuests > 0 && totalGuests > totalCap) {
      setCottageError(
        `Selected cottages allow ${totalCap} guests, but you have ${totalGuests} guests.`
      );
      return;
    }

    const payload = {};
    Object.entries(localSelected).forEach(([cottageType, qty]) => {
      if (qty <= 0) return;

      const cfg = getCottageConfig(cottageType);
      const day = cottagesForDay.find(
        (t) => (t.cottageType || "").trim().toLowerCase() === cottageType.trim().toLowerCase()
      );

      payload[cottageType] = {
        unitType: "Cottage",
        unitId: cfg?._id,
        typeName: cottageType,
        quantity: qty,
        weekdayPrice: day?.price?.weekday || cfg?.pricing?.weekdayPrice || 0,
        weekendPrice: day?.price?.weekend || cfg?.pricing?.weekendPrice || 0,
        maxCapacity: cfg?.maxCapacity || 0,
      };
    });

    dispatch(setSelectedCottages(payload));
    setCottageError("");
    onClose();
  };

  const totalSelectedCottages = Object.values(localSelected).reduce(
    (s, q) => s + q,
    0
  );

  const totalCapacity = Object.entries(localSelected).reduce(
    (sum, [cottageType, qty]) => sum + getCottageCapacity(cottageType) * qty,
    0
  );

  /* --------------------------------------------------
   * 7️⃣ UI
   * -------------------------------------------------- */
  return (
    <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[95vh] border-none">
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <DrawerTitle className="text-xl font-bold">
              Select Cottages
            </DrawerTitle>
            <Button isIconOnly variant="light" onPress={onClose}>
              <X size={16} />
            </Button>
          </div>
        </DrawerHeader>

        {dayDetailsLoading ? (
          <div className="flex justify-center items-center h-[30vh] bg-white">
            <div className="bg-black rounded-full flex justify-center items-center">
              <ButtonLoader />
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* SUMMARY */}
              <Card className="p-3 bg-blue-50 border-blue-200 shadow-none">
                <div className="flex justify-between text-sm">
                  <span>Total Guests</span>
                  <span className="font-semibold">{totalGuests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Selected Cottages</span>
                  <span className="font-semibold">{totalSelectedCottages}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Capacity</span>
                  <span
                    className={`font-semibold ${
                      totalCapacity >= totalGuests
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {totalCapacity}
                  </span>
                </div>
              </Card>

              {allCottagesSoldOut && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>All cottages are completely sold out for this date. Please select different dates.</span>
                </div>
              )}

              {cottageError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {cottageError}
                </div>
              )}

              {/* COTTAGES FROM BACKEND */}
              {displayCottages.map((tent) => {
                const selectedQty = localSelected[tent.cottageType] || 0;
                const maxCapacity = getCottageCapacity(tent.cottageType);
                const isSoldOut = (tent.available ?? 0) <= 0;

                return (
                  <div
                    key={tent.cottageType}
                    className={`p-3 border shadow-none rounded-2xl transition-all ${
                      selectedQty > 0
                        ? "border-blue-500 bg-blue-50"
                        : isSoldOut
                        ? "border-red-100 bg-red-50/30 opacity-75"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-base text-gray-900">{tent.cottageType}</p>
                      {isSoldOut ? (
                        <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide border border-red-200">
                          Sold Out
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded text-[11px]">
                          Available: {tent.available} of {tent.total}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {formatRupee(tent.price?.weekday)} / night (weekday)
                    </p>
                    <p className="text-xs text-gray-500">
                      Weekend: {formatRupee(tent.price?.weekend)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        disabled={selectedQty <= 0}
                        onPress={() =>
                          handleCottageQtyChange(
                            tent.cottageType,
                            selectedQty - 1,
                            tent.available
                          )
                        }
                      >
                        <MinusIcon size={12} />
                      </Button>

                      <div className="text-center">
                        <span className="font-bold text-lg">{selectedQty}</span>
                        <p className="text-xs text-gray-500">
                          {selectedQty * maxCapacity} guests capacity
                        </p>
                      </div>

                      <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        disabled={isSoldOut || selectedQty >= tent.available}
                        onPress={() =>
                          handleCottageQtyChange(
                            tent.cottageType,
                            selectedQty + 1,
                            tent.available
                          )
                        }
                      >
                        <PlusIcon size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t">
              <Button
                className="w-full h-12 bg-black text-white font-bold disabled:opacity-40"
                disabled={totalSelectedCottages === 0 || allCottagesSoldOut}
                onPress={applySelection}
              >
                {allCottagesSoldOut ? "Sold Out" : `Apply Selection (${totalSelectedCottages})`}
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
