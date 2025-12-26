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

  /* --------------------------------------------------
   * 3️⃣ Sync local state when drawer opens
   * -------------------------------------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const mapped = {};
    Object.entries(reduxSelectedRooms || {}).forEach(
      ([roomType, t]) => (mapped[roomType] = t.quantity)
    );

    setLocalSelected(mapped);
    setTentError("");
  }, [isOpen, reduxSelectedRooms]);

  const roomsForDay = useMemo(() => {
    return dayDetails?.rooms || [];
  }, [dayDetails]);

  const getTentConfig = (roomType) =>
    rooms.find((t) => t.roomType === roomType);

  const getTentCapacity = (roomType) =>
    getTentConfig(roomType)?.maxCapacity || 0;

  /* --------------------------------------------------
   * 4️⃣ Availability from dayDetails (SOURCE OF TRUTH)
   * -------------------------------------------------- */
  const getAvailabilityForTent = (tent) => {
    const summary = dayDetails?.data?.rooms?.find(
      (t) => t.roomType === tent.roomType
    );

    if (!summary) {
      return {
        total: tent.totaltents || 0,
        booked: 0,
        available: tent.totaltents || 0,
        weekdayPrice: tent.pricing?.weekdayPrice || 0,
        weekendPrice:
          tent.pricing?.weekendPrice || tent.pricing?.weekdayPrice || 0,
      };
    }

    return {
      total: summary.total,
      booked: summary.booked,
      available: summary.available,
      weekdayPrice: summary.price.weekday,
      weekendPrice: summary.price.weekend,
    };
  };

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
   * 6️⃣ Validation + Apply
   * -------------------------------------------------- */
  const validateAndApply = () => {
    const totalSelected = Object.values(localSelectedTents).reduce(
      (s, q) => s + q,
      0
    );

    if (totalSelected === 0) {
      setTentError("Please select at least one tent");
      return;
    }

    const totalCapacity = Object.entries(localSelectedTents).reduce(
      (sum, [tentType, qty]) => sum + getTentCapacity(tentType) * qty,
      0
    );

    if (totalGuests > totalCapacity) {
      setTentError(
        `Selected tents allow ${totalCapacity} guests, but you selected ${totalGuests}`
      );
      return;
    }

    onTentSelectionChange(localSelectedTents);
    setTentError("");
    onClose();
  };

  /* --------------------------------------------------
   * 7️⃣ Helpers
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
      setTentError("Please select at least one room");
      return;
    }

    let totalCapacity = 0;
    Object.entries(localSelected).forEach(([roomType, qty]) => {
      totalCapacity += getTentCapacity(roomType) * qty;
    });

    if (totalGuests > totalCapacity) {
      setTentError(
        `Selected tents allow ${totalCapacity} guests, but you selected ${totalGuests}`
      );
      return;
    }

    const payload = {};
    Object.entries(localSelected).forEach(([roomType, qty]) => {
      if (qty <= 0) return;

      const cfg = getTentConfig(roomType);
      const day = roomsForDay.find((t) => t.roomType === roomType);

      payload[roomType] = {
        unitType: "Room",
        unitId: cfg?._id,
        typeName: roomType,
        quantity: qty,
        weekdayPrice: day?.price?.weekday || 0,
        weekendPrice: day?.price?.weekend || 0,
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
   * 8️⃣ UI
   * -------------------------------------------------- */
  return (
    <Drawer open={isOpen} onOpenChange={onClose} shouldScaleBackground={false}>
      <DrawerContent className="max-h-[95vh] border-none">
        <DrawerHeader className="p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <DrawerTitle className="text-xl font-bold">
              Select Tents
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
                  <span>Selected Tents</span>
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

              {tentError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {tentError}
                </div>
              )}

              {/* TENTS FROM BACKEND */}
              {roomsForDay.map((tent) => {
                const selectedQty = localSelected[tent.roomType] || 0;
                const maxCapacity = getTentCapacity(tent.roomType);

                return (
                  <div
                    key={tent.roomType}
                    className={`p-2 border shadow-none rounded-2xl ${
                      selectedQty > 0
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <p className="font-semibold text-md">{tent.roomType}</p>

                    <p className="text-sm text-gray-600">
                      {formatRupee(tent.price.weekday)} / night (weekday)
                    </p>
                    <p className="text-xs text-gray-500">
                      Weekend: {formatRupee(tent.price.weekend)}
                    </p>

                    <div className="flex gap-2 mt-2 text-xs">
                      <span className="bg-red-100 px-2 py-1 rounded">
                        Booked: {tent.booked}
                      </span>
                      <span className="bg-green-100 px-2 py-1 rounded">
                        Available: {tent.available}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        Total: {tent.total}
                      </span>
                    </div>

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
                        disabled={selectedQty >= tent.available}
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
                className="w-full h-12 bg-black text-white"
                onPress={applySelection}
              >
                Apply Selection ({totalSelectedTents})
              </Button>
            </div>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
