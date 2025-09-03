"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Globe,
  Menu,
  User,
  Lightbulb,
  UtensilsCrossed,
  Calendar,
  Users,
} from "lucide-react";
import { FaHome } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";

import { Button } from "@/components/ui/button";
import { DatePicker } from "./date-picker";
import { GuestSelector } from "./guest-selector";
import { CategorySearch } from "./category-dropdown";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import {
  setSelectedCategory,
  setCheckin,
  setCheckout,
  updateGuestCount,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import Logo from "../../public/Loginasset/Logo2.png";
import Image from "next/image";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { useRouter } from "next/navigation";
import ButtonLoader from "../Loadercomponents/button-loader";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";

export default function AirbnbNavbar() {
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { isVisible, setIsVisible } = useScrollDirection();
  const router = useRouter();
  const { categories } = useSelector((state) => state.category);
  const {
    selectedCategoryId,
    checkin,
    checkout,
    selectedGuest,
    selectedCategoryName,
  } = useSelector((state) => state.booking);
  const [isSearching, setIsSearching] = useState(false);

  // Get selected category name for display
  const selectedCategory = categories?.find(
    (cat) => cat.id === selectedCategoryId
  );

  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

useEffect(() => {
  if (categories?.length > 0 && !selectedCategoryId) {
    dispatch(setSelectedCategory(categories[0]._id));
    dispatch(setSelectedCategoryname(categories[0].name));
  }
}, [ dispatch,selectedCategoryId,categories]);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      const threshold = isMobile ? 50 : 100;
      setIsExpanded(currentScrollY < threshold);

      // Close any open dropdown when scrolling
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, activeDropdown]);

  const formatDate = (date) => {
    if (!date) return "Add dates";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTotalGuests = () => {
    const total = selectedGuest.adults + selectedGuest.childrenn;
    if (total === 1) return "1 guest";
    return `${total} guests`;
  };

  const handleGuestChange = (type, value) => {
    dispatch(updateGuestCount({ type, value }));
  };

  const handleSearch = async () => {
    if (!selectedCategoryId || !selectedCategoryName) {
      console.log("No category selected");
      return;
    }

    setIsSearching(true);
    setActiveDropdown(null);

    try {
      console.log("Search:", {
        selectedCategoryId,
        selectedCategoryName,
        checkin,
        checkout,
        selectedGuest,
      });

      // Navigate to category page
      router.push(`/category/${selectedCategoryName.toLowerCase()}`);

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
      setIsSearching(false);
    }
  };

  return (
    <div
      className={`fixed backdrop-blur-2xl top-0 hidden md:block left-0 right-0 z-50  bg-[#FFFFFF4D]  border-b border-gray-200 transition-all duration-300 ease-in-out ${
        isVisible ? (isMobile ? "h-28" : "h-44") : "h-16"
      } overflow-visible`}
    >
      <div className="w-full mx-auto px-3  h-full">
        {/* Top row - Logo and right side menu */}
        <div
          className={`flex items-center justify-between ${
            isMobile ? "h-16" : "h-14"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Image
                src={Logo || "/placeholder.svg"}
                alt="Thevillacamp"
                className="h-14 w-14 object-contain mt-2"
              />
            </div>
          </div>

          {/* Center search - minimized state */}
          <div
            className={`absolute  left-1/2 transform -translate-x-1/2 transition-all duration-300 ease-in-out ${
              !isVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 pointer-events-none translate-y-2 "
            }`}
          >
            <div
              onClick={() => {
                setActiveDropdown("minimized"), setIsVisible(!isVisible);
              }}
              className={`flex items-center bg-[#FFFFFF4D] border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                isMobile ? "scale-90 " : "mt-2"
              }`}
            >
              <div className="flex items-center px-3 md:px-4 py-2">
                <FaHome className="w-3 h-3 md:w-4 md:h-4 text-black mr-1 md:mr-2" />
                <span className="text-xs md:text-sm font-medium text-gray-800">
                  {selectedCategoryName || "Any category"}
                </span>
              </div>
              <div className="border-l border-gray-300 h-4 md:h-6"></div>
              <div className="flex items-center px-3 md:px-4 py-2">
                <FaCalendarCheck className="w-3 h-3 md:w-4 md:h-4 text-black mr-1 md:mr-2" />
                <span className="text-xs md:text-sm font-medium text-gray-800">
                  {checkin && checkout
                    ? `${formatDate(checkin)} - ${formatDate(checkout)}`
                    : "Anytime"}
                </span>
              </div>
              <div className="border-l border-gray-300 h-4 md:h-6"></div>
              <div className="flex items-center px-3 md:px-4 py-2">
                <MdPeopleAlt className="w-3 h-3 md:w-4 md:h-4 text-black mr-1 md:mr-2" />

                <span className="text-xs md:text-sm text-gray-600">
                  {selectedGuest.adults > 1 || selectedGuest.children > 0
                    ? getTotalGuests()
                    : "Add guests"}
                </span>
              </div>
              <div
                onClick={() => setIsVisible(!isVisible)}
                className="bg-black rounded-full p-1.5 md:p-2 m-1"
              >
                <Search className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <span className="text-xs md:text-sm font-medium text-gray-800 hidden lg:block cursor-pointer hover:bg-gray-100 px-2 md:px-3 py-1 md:py-2 rounded-full transition-colors">
              Become a host
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-8 h-8 md:w-10 md:h-10"
            >
              <Globe className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <div className="flex items-center space-x-1 border border-gray-300 rounded-full p-0.5 md:p-1 cursor-pointer hover:shadow-md transition-shadow">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 md:w-8 md:h-8"
              >
                <Menu className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 md:w-8 md:h-8"
              >
                <MdPeopleAlt className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation tabs and expanded search */}
        <div
          className={`transition-all duration-300 ease-in-out -mt-4 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {/* Navigation tabs */}
          <div className="hidden md:flex items-center justify-center space-x-8 pb-2">
            <div className="flex items-center space-x-2 cursor-pointer border-b-2 border-gray-800 pb-3">
              <FaHome className="w-4 h-4" />
              <span className="text-sm font-medium">Homes</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <Lightbulb className="w-4 h-4" />
              <span className="text-sm font-medium">Experiences</span>
              <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded font-medium">
                NEW
              </span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-3 transition-colors">
              <UtensilsCrossed className="w-4 h-4" />
              <span className="text-sm font-medium">Services</span>
              <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded font-medium">
                NEW
              </span>
            </div>
          </div>

          {/* Mobile navigation tabs */}
          <div className="md:hidden flex items-center justify-center space-x-6 pb-2">
            <div className="flex items-center space-x-1 cursor-pointer border-b-2 border-gray-800 pb-2">
              <FaHome className="w-3 h-3" />
              <span className="text-xs font-medium">Homes</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-2 transition-colors">
              <Lightbulb className="w-3 h-3" />
              <span className="text-xs font-medium">Experiences</span>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:border-b-2 hover:border-gray-300 pb-2 transition-colors">
              <UtensilsCrossed className="w-3 h-3" />
              <span className="text-xs font-medium">Services</span>
            </div>
          </div>

          {/* Expanded search form */}
          <div className="pb-2 relative" ref={dropdownRef}>
            <div
              className={`flex items-center bg-[#FFFFFF4D] border border-gray-300 rounded-full shadow-lg mx-auto ${
                isMobile ? "max-w-sm" : "max-w-4xl"
              }`}
            >
              {isMobile ? (
                // Mobile: Simplified layout
                <>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "category" ? null : "category"
                      )
                    }
                    className="flex-1 px-3 py-2 border-r border-gray-300 rounded-l-full hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-0.5 flex items-center">
                      <FaHome className="w-3 h-3 mr-1" />
                      Category
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {selectedCategory?.name || "Select category"}
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "guests" ? null : "guests"
                      )
                    }
                    className="flex-1 px-3 py-2  cursor-pointer transition-colors rounded-r-full"
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-0.5">
                      Who
                    </div>
                    <div className="text-xs text-gray-500">
                      {getTotalGuests()}
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="bg-black rounded-full p-2 m-1 cursor-pointer hover:bg-black transition-colors"
                  >
                    <Search className="w-4 h-4 text-white" />
                  </button>
                </>
              ) : (
                // Desktop: Full layout
                <>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "category" ? null : "category"
                      )
                    }
                    className={`flex-1 ml-4 px-4 py-3 border-r border-gray-300 rounded-l-full  cursor-pointer transition-colors ${
                      activeDropdown === "category" ? "" : ""
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <FaHome className="w-4 h-4 mr-1" />
                      Category
                    </div>
                    <div className="text-sm text-gray-700 truncate">
                      {selectedCategoryName || "Select category"}
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "checkin" ? null : "checkin"
                      )
                    }
                    className={`flex-1 px-4 py-3 border-r border-gray-300 cursor-pointer transition-colors ${
                      activeDropdown === "checkin" ? "" : ""
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <FaCalendarCheck className="w-4 h-4 mr-1" />
                      Check in
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(checkin)}
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "checkout" ? null : "checkout"
                      )
                    }
                    className={`flex-1 px-4 py-3 border-r border-gray-300  cursor-pointer transition-colors ${
                      activeDropdown === "checkout" ? "" : ""
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <FaCalendarCheck className="w-4 h-4 mr-1" />
                      Check out
                    </div>
                    <div className="text-sm text-gray-700">
                      {formatDate(checkout)}
                    </div>
                  </div>
                  <div
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === "guests" ? null : "guests"
                      )
                    }
                    className={`flex-1 px-4 py-3  cursor-pointer transition-colors rounded-r-full ${
                      activeDropdown === "guests" ? " rounded-r-none" : ""
                    }`}
                  >
                    <div className="text-xs font-semibold text-gray-800 mb-1 flex items-center">
                      <MdPeopleAlt className="w-4 h-4 mr-1" />
                      Who
                    </div>
                    <div className="text-sm text-gray-700">
                      {getTotalGuests()}
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    className={
                      isSearching
                        ? `bg-black rounded-full  m-2 cursor-pointer hover:bg-black transition-colors`
                        : `bg-black rounded-full p-2.5  m-2 cursor-pointer hover:bg-black transition-colors`
                    }
                  >
                    {isSearching ? (
                      <div className="flex   justify-center items-center">
                        <ButtonLoader />
                      </div>
                    ) : (
                      <Search className="w-5 h-5  text-white" />
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Dropdowns with mobile-optimized positioning */}
            {activeDropdown === "category" && (
              <div
                className={`absolute top-full mt-1 z-50 ${
                  isMobile ? "left-0" : "left-24"
                }`}
              >
                <CategorySearch
                  onCategorySelect={(categoryId, categoryName) => {
                    dispatch(setSelectedCategory(categoryId));
                    dispatch(setSelectedCategoryname(categoryName));
                    setActiveDropdown(null);
                  }}
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "checkin" && (
              <div
                className={`absolute top-full mt-1 z-50 ${
                  isMobile ? "left-0" : "left-1/4"
                }`}
              >
                <DatePicker
                  selectedDate={checkin}
                  onDateSelect={(date) => {
                    dispatch(setCheckin(date));
                    setActiveDropdown("checkout");
                  }}
                  placeholder="Check in"
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "checkout" && (
              <div
                className={`absolute top-full mt-1 z-50 ${
                  isMobile ? "left-0" : "left-[45%]"
                }`}
              >
                <DatePicker
                  selectedDate={checkout}
                  onDateSelect={(date) => {
                    dispatch(setCheckout(date));
                    setActiveDropdown(null);
                  }}
                  minDate={checkin || new Date()}
                  placeholder="Check out"
                  isMobile={isMobile}
                />
              </div>
            )}

            {activeDropdown === "guests" && (
              <div
                className={`absolute top-full mt-1 z-50 ${
                  isMobile ? "right-0" : "right-32"
                }`}
              >
                <GuestSelector
                  adults={selectedGuest.adults}
                  childrenn={selectedGuest.childrenn}
                  infants={selectedGuest.infants}
                  pets={selectedGuest.pets}
                  onGuestChange={handleGuestChange}
                  isMobile={isMobile}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
