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
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { MinusIcon, PlaneIcon, PlusIcon, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { getCampingDayDetailsThunk } from "@/Redux/Slices/campingSlice";
import { setSelectedRooms, setSelectedTents } from "@/Redux/Slices/bookingSlice";
import ButtonLoader from "../Loadercomponents/button-loader";
import { getHotelDayDetailsThunk } from "@/Redux/Slices/hotelSlice";

export default function RoomSelectionDrawer({
  isOpen,
  onClose,
  rooms = [],
  selectedRooms = {},
  onTentSelectionChange,
  totalGuests = 0,
  dateStr,
  id,
}) {
  const dispatch = useDispatch();
  const { dayDetails, dayDetailsLoading } = useSelector(
    (state) => state.hotel
  );

  const reduxSelectedRooms = useSelector(
    (state) => state.booking.selectedRooms
  );

  const [tentError, setTentError] = useState("");
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
      getHotelDayDetailsThunk({
        id,
        date: formattedDate,
      })
    );
  }, [id, formattedDate, isOpen, dispatch]);

  const roomsForDay = useMemo(() => {
    return dayDetails?.rooms || dayDetails?.data?.rooms || [];
  }, [dayDetails]);

  const safeRooms = useMemo(() => {
    if (!Array.isArray(rooms)) return [];
    const map = new Map();

    rooms.forEach((r, idx) => {
      const rawType = r.roomType || r.name || `Room ${idx + 1}`;
      const typeKey = rawType.trim();
      const lowerKey = typeKey.toLowerCase();

      if (!map.has(lowerKey)) {
        map.set(lowerKey, {
          ...r,
          roomType: typeKey,
          totalRooms: Number(r.totalRooms ?? r.totaltents ?? 1),
        });
      } else {
        const existing = map.get(lowerKey);
        existing.totalRooms = (Number(existing.totalRooms) || 0) + Number(r.totalRooms ?? r.totaltents ?? 1);
        const hasImages = existing.images?.length || existing.roomimages?.length;
        if (!hasImages && (r.images?.length || r.roomimages?.length)) {
          existing.images = r.images || r.roomimages;
        }
      }
    });

    return Array.from(map.values());
  }, [rooms]);

  const getTentConfig = (roomType) =>
    safeRooms.find(
      (t) =>
        (t.roomType || t.name || "").trim().toLowerCase() ===
        (roomType || "").trim().toLowerCase()
    );

  const getTentCapacity = (roomType) =>
    getTentConfig(roomType)?.maxCapacity || 0;

  /* --------------------------------------------------
   * 4️⃣ Availability from dayDetails (SOURCE OF TRUTH)
   * -------------------------------------------------- */
  const getAvailabilityForTent = (tent) => {
    const typeKey = (tent.roomType || "").trim().toLowerCase();
    const summary = roomsForDay.find(
      (t) => (t.roomType || "").trim().toLowerCase() === typeKey
    );

    if (!summary) {
      return {
        total: tent.totalRooms || tent.totaltents || 1,
        booked: 0,
        available: tent.totalRooms || tent.totaltents || 1,
        weekdayPrice: tent.pricing?.weekdayPrice || 0,
        weekendPrice:
          tent.pricing?.weekendPrice || tent.pricing?.weekdayPrice || 0,
      };
    }

    return {
      total: summary.total ?? tent.totalRooms ?? 1,
      booked: summary.booked ?? 0,
      available: summary.available ?? tent.totalRooms ?? 1,
      weekdayPrice: summary.price?.weekday ?? tent.pricing?.weekdayPrice ?? 0,
      weekendPrice: summary.price?.weekend ?? tent.pricing?.weekendPrice ?? 0,
    };
  };

  const displayRooms = useMemo(() => {
    if (Array.isArray(roomsForDay) && roomsForDay.length > 0) {
      const map = new Map();
      roomsForDay.forEach((r) => {
        const typeKey = (r.roomType || "Room").trim();
        const lowerKey = typeKey.toLowerCase();
        if (!map.has(lowerKey)) {
          map.set(lowerKey, {
            ...r,
            roomType: typeKey,
          });
        }
      });
      return Array.from(map.values());
    }
    return safeRooms.map((r) => {
      const avail = getAvailabilityForTent(r);
      return {
        roomType: r.roomType,
        total: avail.total,
        booked: avail.booked,
        available: avail.available,
        price: {
          weekday: avail.weekdayPrice,
          weekend: avail.weekendPrice,
        },
      };
    });
  }, [roomsForDay, safeRooms]);

  const allRoomsSoldOut = useMemo(() => {
    if (!displayRooms || displayRooms.length === 0) return false;
    return displayRooms.every((r) => (r.available ?? 0) <= 0);
  }, [displayRooms]);

  /* --------------------------------------------------
   * 3️⃣ Sync local state when drawer opens
   * -------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const mapped = {};
    Object.entries(reduxSelectedRooms || {}).forEach(([roomType, t]) => {
      const cfg = getTentConfig(roomType);
      const avail = getAvailabilityForTent(cfg || { roomType });
      const qty = t.quantity || 0;
      mapped[roomType] = Math.max(0, Math.min(avail.available, qty));
    });

    setLocalSelected(mapped);
    setTentError("");
  }, [isOpen, reduxSelectedRooms, roomsForDay, safeRooms]);

  /* --------------------------------------------------
   * 5️⃣ Quantity handler
   * -------------------------------------------------- */
  const handleTentQtyChange = (roomType, qty, available) => {
    if (qty < 0 || qty > available) return;

    setLocalSelected((prev) => ({
      ...prev,
      [roomType]: qty,
    }));

    if (tentError) setTentError("");
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
      setTentError("Please select at least one available room");
      return;
    }

    // Validate availability
    for (const [roomType, qty] of Object.entries(localSelected)) {
      if (qty <= 0) continue;
      const cfg = getTentConfig(roomType);
      const avail = getAvailabilityForTent(cfg || { roomType });
      if (avail.available <= 0) {
        setTentError(`${roomType} is sold out for this date. Please choose another room.`);
        return;
      }
      if (qty > avail.available) {
        setTentError(`Only ${avail.available} unit(s) of ${roomType} available, but ${qty} selected.`);
        return;
      }
    }

    let totalCapacity = 0;
    Object.entries(localSelected).forEach(([roomType, qty]) => {
      totalCapacity += getTentCapacity(roomType) * qty;
    });

    if (totalGuests > totalCapacity) {
      setTentError(
        `Selected rooms allow ${totalCapacity} guests, but you selected ${totalGuests}`
      );
      return;
    }

    const payload = {};
    Object.entries(localSelected).forEach(([roomType, qty]) => {
      if (qty <= 0) return;

      const cfg = getTentConfig(roomType);
      const day = roomsForDay.find(
        (t) => (t.roomType || "").trim().toLowerCase() === roomType.toLowerCase()
      );

      payload[roomType] = {
        unitType: "Room",
        unitId: cfg?._id,
        typeName: roomType,
        quantity: qty,
        weekdayPrice: day?.price?.weekday || cfg?.pricing?.weekdayPrice || 0,
        weekendPrice: day?.price?.weekend || cfg?.pricing?.weekendPrice || 0,
        maxCapacity: cfg?.maxCapacity || 0,
      };
    });

    dispatch(setSelectedRooms(payload));
    onClose();
  };

  const totalSelectedTents = Object.values(localSelected).reduce(
    (s, q) => s + q,
    0
  );

  const totalCapacity = Object.entries(localSelected).reduce(
    (sum, [roomType, qty]) => sum + getTentCapacity(roomType) * qty,
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
              Select Rooms
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
                  <span>Selected Rooms</span>
                  <span className="font-semibold">{totalSelectedTents}</span>
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

              {allRoomsSoldOut && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                  All rooms are completely sold out for this date. Please select different dates.
                </div>
              )}

              {tentError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {tentError}
                </div>
              )}

              {/* ROOMS LIST */}
              {displayRooms.map((tent) => {
                const selectedQty = localSelected[tent.roomType] || 0;
                const maxCapacity = getTentCapacity(tent.roomType);
                const isSoldOut = (tent.available ?? 0) <= 0;

                return (
                  <div
                    key={tent.roomType}
                    className={`p-3 border shadow-none rounded-2xl transition-all ${
                      selectedQty > 0
                        ? "border-blue-500 bg-blue-50"
                        : isSoldOut
                        ? "border-red-100 bg-red-50/30 opacity-75"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-base text-gray-900">{tent.roomType}</p>
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
                      {formatRupee(tent.price.weekday)} / night (weekday)
                    </p>
                    <p className="text-xs text-gray-500">
                      Weekend: {formatRupee(tent.price.weekend)}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        disabled={selectedQty <= 0}
                        onPress={() =>
                          handleTentQtyChange(
                            tent.roomType,
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
                          handleTentQtyChange(
                            tent.roomType,
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
                disabled={totalSelectedTents === 0 || allRoomsSoldOut}
                onPress={applySelection}
              >
                {allRoomsSoldOut ? "Sold Out" : `Apply Selection (${totalSelectedTents})`}
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
