"use client";

import { useState, useEffect, useRef } from "react";
import {
  CalendarIcon,
  Users,
  Home,
  ChevronDown,
  Star,
  Gift,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import confetti from "canvas-confetti";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateRange } from "react-day-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  setCheckin,
  setCheckout,
  setSelectedGuest,
  updateGuestCount,
  setAppliedCoupon,
  removeCoupon,
  setPropertyId,
  setcategoryId,
  setOwnerId,
  setPropertyType,
} from "@/Redux/Slices/bookingSlice";
import { useVilla } from "@/lib/context/VillaContext";
import { calculateBookingPrice } from "@/lib/bookingUtils";
import { useRouter } from "next/navigation";

export default function StickyBookingWidget() {
  const [stickyState, setStickyState] = useState("normal");
  const [dateRange, setDateRange] = useState();
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const [rooms, setRooms] = useState(5);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const villa = useVilla();
  const router = useRouter();
  const dispatch = useDispatch();
  const { checkin, checkout, selectedGuest, selectedSubtype, appliedCoupon } =
    useSelector((state) => state.booking);

  const checkInDate = checkin ? new Date(checkin) : new Date();
  const checkOutDate = checkout
    ? new Date(checkout)
    : new Date(Date.now() + 24 * 60 * 60 * 1000);

  const msPerDay = 1000 * 60 * 60 * 24;
  const nights = Math.max(
    1,
    Math.round((+checkOutDate - +checkInDate) / msPerDay)
  );

  const { discountAmount, finalTotal } = calculateBookingPrice(
    villa?.basePricePerNight,
    nights,
    appliedCoupon
  );

  const totalGuests = selectedGuest?.adults + selectedGuest?.childrenn;

  const widgetRef = useRef(null);
  const containerRef = useRef(null);

  const availableCoupons = [
    {
      code: "VILLACAMP10",
      title: "Book your dreamy getaway",
      description:
        "Book your dreamy getaway for a minimum of 2 nights and get 10% off upto 3000 Rs. Use the code STAYVISTA at check-out.",
      discount: 10,
      type: "percentage",
      maxDiscount: 10000,
      validUntil: "31 December 2025",
    },
    {
      code: "VILLACAMP102025",
      title: "Instant Discount",
      description:
        "Get an instant 10% off, up to Rs. 4,000. This offer is applicable on bookings of 3 or more nights only.",
      discount: 4000,
      type: "fixed",
      maxDiscount: 15000,
      validUntil: "31 December 2025",
    },
    {
      code: "VILLACAMPWEEKEND15",
      title: "Weekend Special",
      description: "15% off on weekend bookings",
      discount: 15,
      type: "percentage",
      maxDiscount: 15000,
      validUntil: "31 December 2025",
    },
  ];

  const applyCoupon = async (code) => {
    setIsApplyingCoupon(true);
    setCouponError("");

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === code.toLowerCase()
    );

    if (!coupon) {
      setCouponError("Invalid coupon code");
      setIsApplyingCoupon(false);
      return;
    }

    if (coupon.minAmount && villa?.basePricePerNight < coupon.minAmount) {
      setCouponError(
        `Minimum booking amount ₹${coupon.minAmount.toLocaleString()} required`
      );
      setIsApplyingCoupon(false);
      return;
    }

    dispatch(setAppliedCoupon(coupon)); // 🔥 Redux
    setCouponCode("");
    setIsApplyingCoupon(false);

    const couponInputElement =
      document.querySelector("[data-coupon-input]") ||
      document.querySelector("[data-main-coupon-input]");
    let targetElement = { x: 0.5, y: 0.4 };

    if (couponInputElement) {
      const rect = couponInputElement.getBoundingClientRect();
      targetElement = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: targetElement,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
        "#5f27cd",
      ],
      shapes: ["circle", "square"],
      scalar: 1.2,
      drift: 0,
      gravity: 0.8,
      ticks: 250,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: targetElement,
        colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#feca57", "#ff9ff3"],
        shapes: ["star"],
        scalar: 0.8,
      });
    }, 200);
  };

  const removeCouponHandler = () => {
    dispatch(removeCoupon());
    setCouponError("");
  };

  const applyCouponFromSheet = (coupon) => {
    dispatch(setAppliedCoupon(coupon)); // 🔥 Redux
    setCouponCode("");
    setIsApplyingCoupon(false);

    const sheetInputElement =
      document.querySelector("[data-coupon-input] input") ||
      document.querySelector("[data-sheet-content]");
    let targetElement = { x: 0.8, y: 0.3 };

    if (sheetInputElement) {
      const rect = sheetInputElement.getBoundingClientRect();
      targetElement = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      };
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: targetElement,
      colors: [
        "#ff6b6b",
        "#4ecdc4",
        "#45b7d1",
        "#96ceb4",
        "#feca57",
        "#ff9ff3",
        "#54a0ff",
        "#5f27cd",
      ],
      shapes: ["circle", "square"],
      scalar: 1.0,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!widgetRef.current || !containerRef.current) return;

      const widgetRect = widgetRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const footerElement =
        document.querySelector("footer") ||
        document.querySelector("[data-footer]");

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const widgetHeight = widgetRef.current.offsetHeight;

      const stickyStartPoint = 600;

      let footerTop = document.body.scrollHeight;
      if (footerElement) {
        footerTop = footerElement.getBoundingClientRect().top + scrollY;
      }

      const stickyWidgetBottom = scrollY + windowHeight - 24;
      const widgetWouldHitFooter =
        stickyWidgetBottom + widgetHeight > footerTop;

      let newState;
      if (scrollY < stickyStartPoint) {
        newState = "normal";
      } else if (widgetWouldHitFooter) {
        newState = "bottom";
      } else {
        newState = "sticky";
      }

      if (newState !== stickyState) {
        setStickyState(newState);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [stickyState]);

  const getWidgetStyles = () => {
    switch (stickyState) {
      case "sticky":
        return {
          position: "fixed",
          top: "120px",
          right: "0px",
          width: "400px",
          zIndex: 30,
        };
      case "bottom":
        return {
          position: "absolute",
          bottom: "0",
          right: "0",
          width: "100%",
        };
      default:
        return {
          position: "relative",
          width: "100%",
        };
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={widgetRef}
        style={getWidgetStyles()}
        className="transition-all duration-500 ease-out transform"
      >
        <Card
          className={`shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm transition-all duration-500 ease-out ${
            stickyState === "sticky"
              ? "shadow-none transform scale-100 bg-white/98"
              : "shadow-none transform scale-100"
          }`}
        >
          <CardContent className="px-4">
            {/* Date Selection */}
            <div className="mb-2">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="border-2 border-gray-300 rounded-lg p-2 cursor-pointer hover:border-black transition-all duration-300 hover:shadow-md bg-white">
                    <label className="text-xs font-bold text-black uppercase block mb-2 transition-all duration-300">
                      Select Dates
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="w-5 h-5 text-black transition-all duration-300" />
                        <div className="flex items-center space-x-2">
                          {checkin ? (
                            <>
                              <span className="text-sm font-medium text-black">
                                {format(new Date(checkin), "MMM dd")}
                              </span>
                              {checkout && (
                                <>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-sm font-medium text-black">
                                    {format(new Date(checkout), "MMM dd, yyyy")}
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Check-in → Check-out
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-black" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border-2 border-gray-200"
                  align="start"
                >
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: checkin ? new Date(checkin) : undefined,
                      to: checkout ? new Date(checkout) : undefined,
                    }}
                    onSelect={(range) => {
                      if (range?.from)
                        dispatch(setCheckin(range.from.toISOString()));
                      if (range?.to)
                        dispatch(setCheckout(range.to.toISOString()));
                    }}
                    disabled={(date) => date < new Date()}
                    numberOfMonths={2}
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Guests and Rooms Selection */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="border-2 border-gray-300 rounded-lg p-3 cursor-pointer hover:border-black transition-all duration-300 hover:shadow-md bg-white">
                    <label className="text-xs font-bold text-black uppercase block mb-1 transition-all duration-300">
                      Guests
                    </label>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-black transition-all duration-300" />
                        <span className="text-sm font-medium text-black transition-all duration-300">
                          {selectedGuest.adults} Adults,{" "}
                          {selectedGuest.childrenn} Children
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-black transition-transform duration-300" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 bg-white border-2 border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-bold text-black">Adults</Label>
                        <p className="text-sm text-gray-600">
                          Ages 13 or above
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch(
                              updateGuestCount({
                                type: "adults",
                                value: Math.max(1, selectedGuest.adults - 1),
                              })
                            )
                          }
                          disabled={selectedGuest.adults <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span>{selectedGuest.adults}</span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch(
                              updateGuestCount({
                                type: "adults",
                                value: selectedGuest.adults + 1,
                              })
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="font-bold text-black">Children</Label>
                        <p className="text-sm text-gray-600">Ages 2-12</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch(
                              updateGuestCount({
                                type: "childrenn",
                                value: Math.max(0, selectedGuest.childrenn - 1),
                              })
                            )
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>

                        <span>{selectedGuest.childrenn}</span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            dispatch(
                              updateGuestCount({
                                type: "childrenn",
                                value: selectedGuest.childrenn + 1,
                              })
                            )
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Coupon Code Section */}
            <div className="mb-4">
              {!appliedCoupon && (
                <div
                  className="mb-3 p-4 bg-gray-900 border border-gray-700 rounded-xl flex items-center justify-between"
                  data-main-coupon-input
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-sm">%</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">
                        VILLACAMP10
                      </div>
                      <div className="text-gray-300 text-sm">
                        Apply to save upto ₹4,000
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-4 py-2"
                    onClick={() => applyCoupon("VILLACAMP10")}
                  >
                    Apply
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-black hover:text-gray-700 p-0 font-bold"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      View more coupons →
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-[400px] sm:w-[540px] bg-white border-l-2 border-gray-200 p-0"
                    data-sheet-content
                  >
                    <div className="flex flex-col h-full">
                      <SheetHeader className="border-b-2 border-gray-200 p-6 pb-4 bg-white">
                        <SheetTitle className="text-lg font-bold text-black">
                          Coupons and Offers
                        </SheetTitle>
                      </SheetHeader>

                      <ScrollArea className="flex-1 px-6 bg-white h-[80vh]">
                        <div className="py-3 space-y-6">
                          <div className="space-y-4" data-coupon-input>
                            <div className="relative">
                              <Input
                                placeholder="Enter coupon code"
                                value={couponCode}
                                onChange={(e) =>
                                  setCouponCode(e.target.value.toUpperCase())
                                }
                                className="h-12 text-base border-2 border-gray-300 bg-white text-black rounded-xl focus:border-black focus:ring-2 focus:ring-gray-200 transition-all duration-200 shadow-sm placeholder:text-gray-500"
                              />
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <Gift className="w-5 h-5 text-gray-400" />
                              </div>
                            </div>
                            <Button
                              className="w-full bg-black  text-white h-10 text-base font-bold rounded-xl  transition-all hover:bg-black"
                              onClick={() => applyCoupon(couponCode)}
                              disabled={!couponCode || isApplyingCoupon}
                            >
                              {isApplyingCoupon ? (
                                <div className="flex items-center space-x-2">
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>APPLYING...</span>
                                </div>
                              ) : (
                                "APPLY"
                              )}
                            </Button>
                            {couponError && (
                              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600 font-medium">
                                  {couponError}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="border-t-2 border-gray-200 pt-6">
                            <div className="flex items-center space-x-4 mb-6">
                              <h3 className="text-sm font-bold text-black">
                                Offers Available
                              </h3>
                              <div className="flex items-center space-x-3 text-sm">
                                <span className="px-3  bg-gray-100 text-black rounded-full font-bold border-2 border-gray-200">
                                  Prime Discounts
                                </span>
                              </div>
                            </div>

                            <div className="space-y-4 pb-6">
                              {availableCoupons.map((coupon, index) => (
                                <Card
                                  key={coupon.code}
                                  className="p-6 border border-white bg-gray-200 rounded-xl hover:border-black hover:shadow-lg transition-all duration-200 "
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                                          <span className="text-white font-bold text-sm">
                                            %
                                          </span>
                                        </div>
                                        <div>
                                          <h4 className="font-bold text-black text-sm">
                                            {coupon.title}
                                          </h4>
                                          <p className="text-xs text-gray-600">
                                            valid till: {coupon.validUntil}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-bold text-black">
                                          {coupon.type === "percentage"
                                            ? `${coupon.discount}% OFF`
                                            : `₹${coupon.discount} OFF`}
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-200">
                                      {coupon.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                      <div className="bg-white border-2 border-dashed border-gray-400 px-4 py-2 rounded-lg">
                                        <span className="font-mono text-sm font-bold text-black">
                                          {coupon.code}
                                        </span>
                                      </div>
                                      <Button
                                        className={`px-6 py-2 rounded-lg font-bold transition-all duration-200 ${
                                          appliedCoupon?.code === coupon.code
                                            ? "bg-gray-100 text-gray-500 border-2 border-gray-300"
                                            : "bg-black hover:bg-gray-800 text-white shadow-md hover:shadow-lg transform hover:scale-105"
                                        }`}
                                        onClick={() =>
                                          applyCouponFromSheet(coupon)
                                        }
                                        disabled={
                                          appliedCoupon?.code === coupon.code
                                        }
                                      >
                                        {appliedCoupon?.code === coupon.code ? (
                                          <div className="flex items-center space-x-1">
                                            <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                                              <span className="text-white text-xs">
                                                ✓
                                              </span>
                                            </div>
                                            <span>APPLIED</span>
                                          </div>
                                        ) : (
                                          "APPLY"
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold text-sm">%</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-white">
                        {appliedCoupon.code}
                      </div>
                      <div className="text-gray-300 text-sm">
                        ₹{discountAmount.toLocaleString()} Discount applied!
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeCouponHandler}
                    className="text-red-400 hover:text-red-300 font-medium hover:bg-red-900/20"
                  >
                    Remove
                  </Button>
                </div>
              ) : null}
            </div>

            {/* Best Price Banner */}
            <div className="flex items-center justify-between transition-all duration-300">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 line-through text-sm transition-all duration-300">
                    ₹58,750
                  </span>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-xl font-bold text-black transition-all duration-300">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                  <span className="text-gray-600 text-sm transition-all duration-300">
                    {` (for ${totalGuests} guest)`}
                  </span>
                </div>
                <span className="text-gray-500 text-xs transition-all duration-300">
                  Per Night + Taxes
                </span>
                {appliedCoupon && (
                  <div className="text-green-600 text-xs font-medium">
                    Saved ₹{discountAmount.toLocaleString()} with{" "}
                    {appliedCoupon.code}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 text-sm transition-all duration-300">
                <Star className="w-4 h-4 fill-current text-yellow-400 transition-all duration-300" />
                <span className="font-medium text-black">4.8</span>
                <span className="text-gray-500">/5</span>
              </div>
            </div>

            {/* Reserve Button */}
            <Button
              onClick={() => {
                dispatch(setPropertyId(villa?._id));
                dispatch(setcategoryId(villa?.category));
                dispatch(setOwnerId(villa?.owner));
                dispatch(setPropertyType("Villa"));
                router.push("/checkout");
              }}
              className="w-full mt-2 bg-black hover:bg-gray-800 text-white  py-4 rounded-lg mb-4 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 active:scale-95"
            >
              Reserve Now
            </Button>
          </CardContent>
        </Card>

        {/* Sticky state indicator */}
        <div
          className={`absolute -top-1 left-0 right-0 h-0.5 rounded-full transition-all duration-500 ease-out ${
            stickyState === "sticky"
              ? "opacity-100 transform scale-x-100"
              : "opacity-0 transform scale-x-0"
          }`}
          style={{ transformOrigin: "center" }}
        />
      </div>
    </div>
  );
}
