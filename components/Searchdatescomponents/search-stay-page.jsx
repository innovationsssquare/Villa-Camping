"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Users, Phone, Sparkles, Search, RotateCcw } from "lucide-react";
import { FaHome, FaCalendarCheck } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { Button, addToast } from "@heroui/react";
import { SearchInputCard } from "./search-input-card";
import { GuestSelectionDrawer } from "./guest-selection-drawer";
import { CategorySelectionDrawer } from "./category-selection-drawer";
import { HolidayCard } from "./holiday-card";
import { useIndianHolidays } from "@/hooks/useIndianHolidays";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import {
  setSelectedCategory,
  setSelectedCategoryImage,
  setSelectedCategoryname,
  setCheckin,
  setCheckout,
  updateGuestCount,
} from "@/Redux/Slices/bookingSlice";
import moment from "moment-timezone";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";
import ButtonLoader from "../Loadercomponents/button-loader";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchStayPage() {
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.category);
  const {
    selectedCategoryId,
    selectedCategoryName,
    checkin,
    checkout,
    selectedGuest,
    selectedCategoryImage,
  } = useSelector((state) => state.booking);

  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const { longWeekends, allHolidays } = useIndianHolidays(currentYear);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Default to first category only if nothing is selected yet
  useEffect(() => {
    if (categories && categories.length > 0 && !selectedCategoryId && !selectedCategoryName) {
      const firstCategory = categories[0];
      dispatch(setSelectedCategory(firstCategory?._id));
      dispatch(setSelectedCategoryname(firstCategory?.name));
      dispatch(setSelectedCategoryImage(firstCategory?.image));
    }
  }, [categories, selectedCategoryId, selectedCategoryName, dispatch]);

  // Guest summary calculation
  const guestSummary = useMemo(() => {
    const totalGuests = (selectedGuest.adults || 1) + (selectedGuest.childrenn || 0);
    const parts = [`${totalGuests} Guest${totalGuests > 1 ? "s" : ""}`];

    if (selectedGuest.infants > 0) {
      parts.push(
        `${selectedGuest.infants} Infant${selectedGuest.infants > 1 ? "s" : ""}`
      );
    }
    if (selectedGuest.pets > 0) {
      parts.push(
        `${selectedGuest.pets} Pet${selectedGuest.pets > 1 ? "s" : ""}`
      );
    }

    return parts.join(", ");
  }, [selectedGuest]);

  // Nights count
  const nights = useMemo(() => {
    if (!checkin || !checkout) return 0;
    const checkInDate = moment(checkin);
    const checkOutDate = moment(checkout);
    const diff = checkOutDate.diff(checkInDate, "days");
    return diff > 0 ? diff : 0;
  }, [checkin, checkout]);

  // Formatted date display string
  const dateDisplay = useMemo(() => {
    if (checkin && checkout) {
      const inStr = moment(checkin).format("MMM DD");
      const outStr = moment(checkout).format("MMM DD, YYYY");
      return `${inStr} – ${outStr}`;
    }
    if (checkin) {
      return `${moment(checkin).format("MMM DD")} (Select checkout)`;
    }
    return "Select Check-in & Check-out";
  }, [checkin, checkout]);

  // Combined upcoming holidays & long weekends for quick mobile selection
  const upcomingHolidayCards = useMemo(() => {
    const todayStr = moment().tz("Asia/Kolkata").format("YYYY-MM-DD");
    const cards = [];

    // Add long weekends
    (longWeekends || []).forEach((lw) => {
      if (lw.endDate >= todayStr) {
        cards.push({
          id: lw.id,
          name: lw.holidayNames?.[0] || lw.title,
          type: `${lw.totalDays} Days in a row`,
          totalDays: lw.totalDays,
          startDate: lw.startDate,
          endDate: lw.endDate,
          dateRange: `${moment(lw.startDate).format("MMM DD")} – ${moment(lw.endDate).format("MMM DD")}`,
          isLw: true,
        });
      }
    });

    // Add individual upcoming gazetted holidays (if not already covered)
    (allHolidays || []).forEach((h) => {
      if (h.date >= todayStr && cards.length < 8) {
        const alreadyInLw = cards.some(
          (c) => c.startDate <= h.date && c.endDate >= h.date
        );
        if (!alreadyInLw) {
          const mDate = moment(h.date).tz("Asia/Kolkata");
          const mNext = mDate.clone().add(1, "day");
          cards.push({
            id: `hol-${h.date}`,
            name: h.name,
            type: "Gazetted Holiday",
            totalDays: 1,
            startDate: h.date,
            endDate: mNext.format("YYYY-MM-DD"),
            dateRange: `${mDate.format("MMM DD")} – ${mNext.format("MMM DD")}`,
            isLw: false,
          });
        }
      }
    });

    return cards.slice(0, 7);
  }, [longWeekends, allHolidays]);

  // Handle tapping a holiday card
  const handleSelectHolidayCard = (card) => {
    const s = moment.tz(card.startDate, "Asia/Kolkata").startOf("day").format();
    const e = moment.tz(card.endDate, "Asia/Kolkata").startOf("day").format();

    // Toggle off if already selected
    if (checkin && checkout && moment(checkin).isSame(s, "day") && moment(checkout).isSame(e, "day")) {
      dispatch(setCheckin(null));
      dispatch(setCheckout(null));
    } else {
      dispatch(setCheckin(s));
      dispatch(setCheckout(e));
    }
  };

  // Reset all filters
  const handleResetAll = () => {
    dispatch(setSelectedCategory(null));
    dispatch(setSelectedCategoryname("All Stays"));
    dispatch(setSelectedCategoryImage(null));
    dispatch(setCheckin(null));
    dispatch(setCheckout(null));
    dispatch(updateGuestCount({ type: "adults", value: 1 }));
    dispatch(updateGuestCount({ type: "childrenn", value: 0 }));
    dispatch(updateGuestCount({ type: "infants", value: 0 }));
    dispatch(updateGuestCount({ type: "pets", value: 0 }));
  };

  const handleSearch = () => {
    if (checkin && !checkout) {
      addToast({
        title: "Select check-out date",
        description: "Please choose your departure date to complete search dates",
        color: "warning",
      });
      router.push("/date-selection");
      return;
    }

    setIsSearching(true);

    try {
      const targetSlug =
        selectedCategoryName && selectedCategoryName !== "All Stays"
          ? selectedCategoryName.toLowerCase()
          : "all";

      const params = new URLSearchParams();
      if (checkin) params.set("checkin", checkin);
      if (checkout) params.set("checkout", checkout);
      if (selectedGuest?.adults) params.set("adults", selectedGuest.adults.toString());
      if (selectedGuest?.childrenn) params.set("children", selectedGuest.childrenn.toString());
      const queryStr = params.toString();

      router.push(`/category/${targetSlug}${queryStr ? `?${queryStr}` : ""}`);
    } catch (error) {
      console.error("Search error:", error);
      const targetSlug =
        selectedCategoryName && selectedCategoryName !== "All Stays"
          ? selectedCategoryName.toLowerCase()
          : "all";
      router.push(`/category/${targetSlug}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/70 text-neutral-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Button
            onPress={() => router.back()}
            isIconOnly
            variant="light"
            className="w-9 h-9 min-w-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-base font-bold text-neutral-900 leading-tight">
              Search your Stay
            </h1>
            <p className="text-[11px] text-neutral-500">
              Personalize dates, guests & stay type
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetAll}
          className="text-xs font-bold text-neutral-500 hover:text-[#ff6900] active:scale-95 transition-all cursor-pointer px-2.5 py-1.5 rounded-lg flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </header>

      {/* Main Search Configuration Body */}
      <main className="flex-1 p-4 max-w-lg mx-auto w-full space-y-3.5">
        {/* Card 1: Stay Type / Category */}
        <SearchInputCard
          icon={
            selectedCategoryImage ? (
              <Image
                src={selectedCategoryImage}
                height={40}
                width={40}
                alt={selectedCategoryName || "Category"}
                className="h-6 w-6 object-contain rounded-md"
              />
            ) : (
              <FaHome className="w-5 h-5 text-[#ff6900]" />
            )
          }
          label="Stay Type"
          value={selectedCategoryName || "All Stays"}
          subtitle="Villas, Campings, Cottages & Hotels"
          onClick={() => setIsCategoryDrawerOpen(true)}
        />

        {/* Card 2: Check-in & Check-out Dates */}
        <Link href="/date-selection" passHref className="block">
          <SearchInputCard
            icon={<FaCalendarCheck className="w-5 h-5 text-[#ff6900]" />}
            label="Dates"
            value={dateDisplay}
            subtitle={
              nights > 0
                ? `${nights} Night${nights > 1 ? "s" : ""} selected`
                : "Flexible or custom weekend dates"
            }
            badge={nights > 0 ? `${nights} Night${nights > 1 ? "s" : ""}` : null}
          />
        </Link>

        {/* Upcoming Indian Long Weekends & Holidays Strip (Invisible Scrollbar) */}
        {upcomingHolidayCards.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Upcoming Indian Holidays & Long Weekends</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/90 px-2 py-0.5 rounded-full">
                Tap to select
              </span>
            </div>

            {/* Horizontal Scroll with completely invisible scrollbar */}
            <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {upcomingHolidayCards.map((h) => {
                const isSelected =
                  checkin &&
                  checkout &&
                  moment(checkin).isSame(moment(h.startDate), "day") &&
                  moment(checkout).isSame(moment(h.endDate), "day");

                return (
                  <HolidayCard
                    key={h.id}
                    type={h.type}
                    totalDays={h.totalDays}
                    dateRange={h.dateRange}
                    name={h.name}
                    isSelected={isSelected}
                    onClick={() => handleSelectHolidayCard(h)}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Card 3: Guests & Capacity */}
        <SearchInputCard
          icon={<MdPeopleAlt className="w-5 h-5 text-[#ff6900]" />}
          label="Total Guests"
          value={guestSummary}
          subtitle="Adults, children, infants & pets"
          onClick={() => {
            if (!checkin) {
              addToast({
                title: "Select check-in date first",
                description: "Please choose your stay dates before customizing guests",
                color: "warning",
              });
              router.push("/date-selection");
              return;
            }
            if (!checkout) {
              addToast({
                title: "Select check-out date first",
                description: "Please choose your departure date before customizing guests",
                color: "warning",
              });
              router.push("/date-selection");
              return;
            }
            setIsGuestDrawerOpen(true);
          }}
        />

        {/* Search CTA Button */}
        <div className="pt-2">
          <Button
            onPress={handleSearch}
            disabled={isSearching}
            className="w-full h-13 text-sm font-bold bg-gradient-to-r from-[#ff6900] to-[#e05d00] hover:from-[#e05d00] hover:to-[#c84d00] text-white rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSearching ? (
              <ButtonLoader />
            ) : (
              <>
                <Search className="w-4.5 h-4.5 stroke-[2.5]" />
                <span>SEARCH STAYS</span>
              </>
            )}
          </Button>
        </div>
      </main>

      {/* Footer Support Section */}
      <footer className="p-4 text-center border-t border-neutral-200/80 bg-white mt-auto">
        <p className="text-xs text-neutral-500 mb-2.5">
          Finding your ideal vacation spot should be easy, we're here to help!
        </p>
        <a
          href="tel:+919876543210"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-[#ff6900] hover:bg-orange-100 font-bold text-xs border border-orange-200/80 transition-colors shadow-2xs"
        >
          <Phone className="h-3.5 w-3.5" />
          <span>Talk to Booking Concierge</span>
        </a>
        <div className="text-center text-[11px] text-neutral-400 mt-2.5 font-medium">
          www.thevillacamp.com
        </div>
      </footer>

      {/* Category Selection Bottom Sheet Drawer */}
      <CategorySelectionDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />

      {/* Guest Selection Bottom Sheet Drawer */}
      <GuestSelectionDrawer
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
      />
    </div>
  );
}
