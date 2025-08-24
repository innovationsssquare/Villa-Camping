"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Calendar, Users, Home, Phone } from "lucide-react";
import { Button } from "@heroui/react";
import { SearchInputCard } from "./search-input-card";
import { GuestSelectionDrawer } from "./guest-selection-drawer";
import { CategorySelectionDrawer } from "./category-selection-drawer";
import { RoomSelectionDrawer } from "./room-selection-drawer";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { setSelectedSubtype } from "@/Redux/Slices/bookingSlice";
import moment from "moment";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";
import ButtonLoader from "../Loadercomponents/button-loader";
import { useRouter } from "next/navigation";

export default function SearchStayPage() {
  const [isGuestDrawerOpen, setIsGuestDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isRoomDrawerOpen, setIsRoomDrawerOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
const router=useRouter()
  const { categories } = useSelector((state) => state.category);
  const {
    selectedCategoryId,
    selectedCategoryName,
    selectedSubtype, // ✅ now from Redux
    checkin,
    checkout,
    selectedGuest,
  } = useSelector((state) => state.booking);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // ✅ Guest summary directly from Redux
  const guestSummary = useMemo(() => {
    const totalGuests = selectedGuest.adults + selectedGuest.childrenn; // 🔹 fix childrenn typo
    const parts = [];

    if (totalGuests > 0) {
      parts.push(`${totalGuests} Guest${totalGuests > 1 ? "s" : ""}`);
    }
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

    return parts.length > 0 ? parts.join(", ") : "Add Guests";
  }, [selectedGuest]);

  // ✅ Room summary
  const roomSummary = useMemo(() => {
    const roomTypeMap = {
      "2bhk": "2BHK",
      "3bhk": "3BHK",
      "4bhk": "4BHK",
      "5bhk": "5BHK",
      "6bhk": "6BHK",
      "single-tent": "Single Tent",
      "couple-tent": "Couple Tent",
      "family-tent": "Family Tent",
      "single-cottage": "Single Cottage",
      "couple-cottage": "Couple Cottage",
      "family-cottage": "Family Cottage",
      "standard-room": "Standard Room",
      "deluxe-room": "Deluxe Room",
      suite: "Suite",
      "presidential-suite": "Presidential Suite",
    };

    const roomName = roomTypeMap[selectedSubtype?.type] || "Select Room";

    return selectedSubtype?.quantity > 1
      ? `${selectedSubtype.quantity} ${roomName}s`
      : `${selectedSubtype?.quantity || 1} ${roomName}`;
  }, [selectedSubtype]);

  // ✅ Category display
  const categoryDisplay = useMemo(() => {
    const categoryMap = {
      cottage: { name: "Cottage", icon: "🏡" },
      camping: { name: "Camping", icon: "⛺" },
      villa: { name: "Villa", icon: "🏖️" },
      hotel: { name: "Hotel", icon: "🏨" },
    };
    return (
      categoryMap[selectedCategoryName?.toLowerCase()] || categoryMap.villa
    );
  }, [selectedCategoryName]);

  // ✅ Room save uses Redux
  const handleSaveRoom = (newRoom) => {
    dispatch(setSelectedSubtype(newRoom)); // expects { type, quantity }
    setIsRoomDrawerOpen(false);
  };

  const nights = useMemo(() => {
    const checkInDate = moment(checkin);
    const checkOutDate = moment(checkout);
    return checkOutDate.diff(checkInDate, "days");
  }, [checkin, checkout]);

  const handleSearch = async () => {
    if (!selectedCategoryId || !selectedCategoryName) {
      console.log("No category selected");
      return;
    }

    setIsSearching(true);

    try {
      console.log("Search:", {
        selectedCategoryId,
        selectedCategoryName,
        checkin,
        checkout,
        selectedGuest,
      });

      // Navigate to category page

      // Dispatch async action to fetch properties
      await dispatch(
        fetchAllProperties({
          categoryId: selectedCategoryId,
          checkIn: checkin,
          checkOut: checkout,
          subtype: "",
          page: 1,
          limit: 20,
        })
      ).unwrap();

      console.log("Search completed successfully");
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      router.push(`/category/${selectedCategoryName.toLowerCase()}`);
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ChevronLeft className="h-5 w-5 text-gray-800" />
          <h1 className="text-lg font-semibold text-gray-800">
            Search your Stay
          </h1>
        </div>
      </header>

      {/* Search Inputs */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <SearchInputCard
          icon={<span className="text-xl">{categoryDisplay.icon}</span>}
          label="Category"
          value={categoryDisplay.name}
          onClick={() => setIsCategoryDrawerOpen(true)}
        />

        <Link href="/date-selection" passHref>
          <SearchInputCard
            icon={<Calendar className="h-5 w-5" />}
            label="Check-in Date"
            value={moment(checkin).format("DD MMM ddd YYYY")}
            badge={`${nights} Night${nights > 1 ? "s" : ""}`}
            className="relative"
          />
        </Link>

        <SearchInputCard
          icon={<Users className="h-5 w-5" />}
          label="Total Guests"
          value={guestSummary}
          onClick={() => setIsGuestDrawerOpen(true)}
        />

        {/* <SearchInputCard
          icon={<Home className="h-5 w-5" />}
          label="Room Selection"
          value={roomSummary}
          onClick={() => setIsRoomDrawerOpen(true)}
        /> */}

        <Button
          onPress={handleSearch}
          className="w-full py-3 text-sm font-semibold bg-black text-white rounded-lg mt-6"
        >
          {isSearching ? <ButtonLoader /> : "SEARCH STAYS"}
        </Button>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center border-t border-gray-200 mb-12">
        <p className="text-sm text-gray-600 mb-2">
          Finding your ideal vacation spot should be easy, we're here to help!
        </p>
        <Button variant="ghost" className="text-black text-sm font-semibold">
          <Phone className="h-4 w-4 mr-2" />
          Request Callback
        </Button>
        <div className="text-center text-xs text-gray-500 mt-3">
          <span className="mr-1">🔒</span>
          www.thevillacamp.com
        </div>
      </footer>

      {/* ✅ Drawer components */}
      <GuestSelectionDrawer
        isOpen={isGuestDrawerOpen}
        onClose={() => setIsGuestDrawerOpen(false)}
      />

      <CategorySelectionDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />

      {/* <RoomSelectionDrawer
        isOpen={isRoomDrawerOpen}
        onClose={() => setIsRoomDrawerOpen(false)}
        category={selectedCategoryName}
        initialRoom={selectedSubtype?.type}
        onSave={handleSaveRoom}
      /> */}
    </div>
  );
}
