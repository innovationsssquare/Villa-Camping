"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Menu,
  Lightbulb,
  UtensilsCrossed,
  Calendar,
  Users,
  Compass,
  ChevronRight,
  X,
  Home,
  ConciergeBell,
} from "lucide-react";
import { FaHome, FaCalendarCheck } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";

import { DualDatePicker } from "./dual-date-picker";
import { GuestSelector } from "./guest-selector";
import { CategorySearch } from "./category-dropdown";
import {
  setSelectedCategory,
  setCheckin,
  setCheckout,
  updateGuestCount,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import Logo from "../../public/Productasset/mainlogo_clean.png";
import Image from "next/image";
import { fetchAllCategories } from "@/Redux/Slices/categorySlice";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import ButtonLoader from "../Loadercomponents/button-loader";
import { fetchAllProperties } from "@/Redux/Slices/propertiesSlice";
import { ProfileSheet } from "./ProfileSheet";
import { NotificationSheet } from "./Notificationsheet";
import { addToast } from "@heroui/react";

export default function AirbnbNavbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category' | 'checkin' | 'checkout' | 'guests' | null
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [focusedSide, setFocusedSide] = useState("checkin");
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const navbarRef = useRef(null);

  const { categories } = useSelector((state) => state.category);
  const {
    selectedCategoryId,
    checkin,
    checkout,
    selectedGuest,
    selectedCategoryName,
  } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categories?.length > 0 && !selectedCategoryId) {
      dispatch(setSelectedCategory(categories[0]._id));
      dispatch(setSelectedCategoryname(categories[0].name));
    }
  }, [dispatch, selectedCategoryId, categories]);

  const scrolledRef = useRef(false);

  // Responsive Listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Butter-smooth Scroll Listener (Zero Lag)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollThreshold = 60;
          const scrolled = window.scrollY > scrollThreshold;
          if (scrolled !== scrolledRef.current) {
            scrolledRef.current = scrolled;
            setIsScrolled(scrolled);
            if (scrolled && !activeDropdown) {
              setIsExpanded(false);
            } else if (!scrolled) {
              setIsExpanded(true);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeDropdown]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setActiveDropdown(null);
        if (isScrolled) {
          setIsExpanded(false);
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        if (isScrolled) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isScrolled]);

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTotalGuests = () => {
    const total = (selectedGuest.adults || 1) + (selectedGuest.childrenn || 0);
    const infants = selectedGuest.infants || 0;
    const pets = selectedGuest.pets || 0;

    let parts = [`${total} guest${total > 1 ? "s" : ""}`];
    if (infants > 0) parts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
    if (pets > 0) parts.push(`${pets} pet${pets > 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  const handleGuestChange = (type, value) => {
    dispatch(updateGuestCount({ type, value }));
  };

  const handleCheckinSelect = (date) => {
    dispatch(setCheckin(date));
    dispatch(setCheckout(null));
    setFocusedSide("checkout");
    setActiveDropdown("checkout");
  };

  const handleCheckoutSelect = (date) => {
    if (!date) {
      dispatch(setCheckout(null));
      return;
    }
    dispatch(setCheckout(date));
    setActiveDropdown("guests");
  };

  const handleCheckinClick = () => {
    setActiveDropdown(activeDropdown === "checkin" ? null : "checkin");
    setFocusedSide("checkin");
  };

  const handleCheckoutClick = () => {
    if (!checkin) {
      addToast({
        title: "Select check-in date first",
        description: "Please choose your check-in date before selecting check-out",
        color: "warning",
      });
      setActiveDropdown("checkin");
      setFocusedSide("checkin");
      return;
    }
    setActiveDropdown(activeDropdown === "checkout" ? null : "checkout");
    setFocusedSide("checkout");
  };

  const handleGuestsClick = () => {
    if (!checkin) {
      addToast({
        title: "Select check-in date first",
        description: "Please choose your arrival date before adding guests",
        color: "warning",
      });
      setActiveDropdown("checkin");
      setFocusedSide("checkin");
      return;
    }
    if (!checkout) {
      addToast({
        title: "Select check-out date first",
        description: "Please choose your departure date before proceeding to guest selection",
        color: "warning",
      });
      setActiveDropdown("checkout");
      setFocusedSide("checkout");
      return;
    }
    setActiveDropdown(activeDropdown === "guests" ? null : "guests");
  };

  // Enforce validation: Never allow "guests" dropdown to stay active if check-out date is missing
  useEffect(() => {
    if (activeDropdown === "guests" && (!checkin || !checkout)) {
      if (!checkin) {
        setActiveDropdown("checkin");
        setFocusedSide("checkin");
      } else {
        setActiveDropdown("checkout");
        setFocusedSide("checkout");
      }
    }
  }, [activeDropdown, checkin, checkout]);

  const handleSearch = async () => {
    if (checkin && !checkout) {
      addToast({
        title: "Select check-out date",
        description: "Please choose a check-out date to complete your search dates",
        color: "warning",
      });
      setActiveDropdown("checkout");
      setFocusedSide("checkout");
      return;
    }

    setIsSearching(true);
    setActiveDropdown(null);
    if (isScrolled) {
      setIsExpanded(false);
    }

    try {
      const params = new URLSearchParams();
      if (checkin) params.set("checkin", checkin);
      if (checkout) params.set("checkout", checkout);
      if (selectedGuest?.adults) params.set("adults", selectedGuest.adults.toString());
      if (selectedGuest?.childrenn) params.set("children", selectedGuest.childrenn.toString());
      const queryStr = params.toString();

      const targetSlug =
        selectedCategoryName && selectedCategoryName !== "All Stays"
          ? selectedCategoryName.toLowerCase()
          : "all";

      router.push(`/category/${targetSlug}${queryStr ? `?${queryStr}` : ""}`);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Only show expanded search bar on homepage and category/stay search routes
  const isSearchPage =
    pathname === "/" ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/products");

  const showExpandedSearch = isSearchPage && (!isScrolled || isExpanded);

  // Condition to check if any dropdown is open
  const isAnyDropdownOpen = activeDropdown !== null;

  return (
    <>
      <header
        ref={navbarRef}
        className={`fixed top-0 hidden md:block left-0 right-0 z-50 bg-white transition-[height,box-shadow,border-color] duration-200 ease-out ${
          showExpandedSearch
            ? "border-b border-neutral-200/60 h-[136px]"
            : "shadow-xs border-b border-neutral-200/80 h-16"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar: Logo, Navigation Tabs, Host/Profile */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer transition-transform hover:scale-[1.02] shrink-0"
            >
              <Image
                src={Logo}
                alt="TheVillaCamp"
                width={100}
                height={6}
                priority
                className="h-8 sm:h-10 md:h-8 object-cover w-auto "
              />
            </div>

            {/* Center: Search pill if search page and scrolled, else category navigation tabs */}
            <AnimatePresence mode="wait">
              {isSearchPage && isScrolled && !isExpanded ? (
                <motion.div
                  key="compact-search-pill"
                  initial={{ opacity: 0, scale: 0.94, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  onClick={() => {
                    setIsExpanded(true);
                    setActiveDropdown(checkin && !checkout ? "checkout" : "checkin");
                  }}
                  className="hidden md:flex items-center h-11 bg-white rounded-full border border-neutral-300 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-md cursor-pointer pl-4 pr-1.5 transition-shadow"
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 pr-3 border-r border-neutral-200">
                    <Home className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span>{selectedCategoryName || "Any category"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 px-3 border-r border-neutral-200">
                    <Calendar className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span>
                      {checkin && checkout
                        ? `${formatDate(checkin)} – ${formatDate(checkout)}`
                        : checkin
                        ? `${formatDate(checkin)} – Add checkout`
                        : "Any week"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 pl-3 pr-2">
                    <Users className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span>
                      {selectedGuest?.adults > 1 || selectedGuest?.childrenn > 0
                        ? getTotalGuests()
                        : "Add guests"}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#ff6900] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                </motion.div>
              ) : (
                /* Center: When Expanded -> Airbnb Category Tabs with Icons */
                <motion.div
                  key="navigation-tabs"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="hidden md:flex items-center gap-7 text-sm font-medium"
                >
                  {/* Stays Tab */}
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className={`group relative flex items-center gap-2 py-2 px-2 transition-colors cursor-pointer ${pathname === "/"
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-500 hover:text-neutral-900"
                      }`}
                  >
                    <Home
                      className={`w-4.5 h-4.5 transition-colors ${pathname === "/" ? "text-[#ff6900]" : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                    />
                    <span>Stays</span>
                    {pathname === "/" && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#ff6900] rounded-full shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Experiences Tab */}
                  <button
                    type="button"
                    onClick={() => router.push("/experiences")}
                    className={`group relative flex items-center gap-2 py-2 px-2 transition-colors cursor-pointer ${pathname.startsWith("/experiences")
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-500 hover:text-neutral-900"
                      }`}
                  >
                    <Compass
                      className={`w-4.5 h-4.5 transition-colors ${pathname.startsWith("/experiences")
                        ? "text-[#ff6900]"
                        : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                    />
                    <span>Experiences</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                    {pathname.startsWith("/experiences") && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#ff6900] rounded-full shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Services Tab */}
                  <button
                    type="button"
                    onClick={() => router.push("/services")}
                    className={`group relative flex items-center gap-2 py-2 px-2 transition-colors cursor-pointer ${pathname.startsWith("/services")
                      ? "text-neutral-950 font-bold"
                      : "text-neutral-500 hover:text-neutral-900"
                      }`}
                  >
                    <ConciergeBell
                      className={`w-4.5 h-4.5 transition-colors ${pathname.startsWith("/services")
                        ? "text-[#ff6900]"
                        : "text-neutral-400 group-hover:text-neutral-700"
                        }`}
                    />
                    <span>Services</span>
                    <span className="text-[10px] font-bold bg-neutral-150 text-neutral-700 px-1.5 py-0.5 rounded-full">
                      New
                    </span>
                    {pathname.startsWith("/services") && (
                      <motion.div
                        layoutId="activeNavTab"
                        className="absolute -bottom-2 left-0 right-0 h-[3px] bg-[#ff6900] rounded-full shadow-xs"
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                      />
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right Action Menu: Become a host, NotificationSheet, Profile */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => router.push("/become-host")}
                className="hidden bg-orange-300  lg:block text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-orange-200 text-neutral-800 transition-colors cursor-pointer"
              >
                Become a host
              </button>

              <NotificationSheet />

              <ProfileSheet />
            </div>
          </div>

          {/* Expanded Airbnb Search Bar */}
          <AnimatePresence>
            {showExpandedSearch && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="pb-4"
              >
                <div className="max-w-[760px] mx-auto relative">
                  {/* Outer Search Pill */}
                  <div
                    className={`relative flex items-center rounded-full border transition-all duration-200 ${isAnyDropdownOpen
                      ? "bg-[#EBEBEB] border-transparent shadow-lg"
                      : "bg-white border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-md"
                      }`}
                  >
                    {/* Segment 1: Where / Category */}
                    <div
                      onClick={() =>
                        setActiveDropdown(activeDropdown === "category" ? null : "category")
                      }
                      onMouseEnter={() => setHoveredSegment("category")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className={`relative flex-[1.2] pl-5 pr-3 py-2.5 rounded-full cursor-pointer transition-colors duration-150 ${activeDropdown === "category" ? "z-20" : "z-10"
                        }`}
                    >
                      {activeDropdown === "category" && (
                        <motion.div
                          layoutId="searchBarActivePill"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.14)] z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {hoveredSegment === "category" && activeDropdown !== "category" && (
                        <motion.div
                          layoutId="searchBarHoverPill"
                          className="absolute inset-0 bg-black/[0.04] rounded-full z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <div className="relative z-10 select-none">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-800 uppercase leading-tight">
                          <FaHome className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                          <span>Where</span>
                        </div>
                        <div className="text-xs text-neutral-500 font-medium truncate mt-0.5">
                          {selectedCategoryName || "Search destinations"}
                        </div>
                      </div>
                    </div>

                    {/* Divider 1 */}
                    {activeDropdown !== "category" &&
                      activeDropdown !== "checkin" &&
                      hoveredSegment !== "category" &&
                      hoveredSegment !== "checkin" && (
                        <div className="w-px h-7 bg-neutral-300 shrink-0 relative z-0" />
                      )}

                    {/* Segment 2: Check in */}
                    <div
                      onClick={handleCheckinClick}
                      onMouseEnter={() => setHoveredSegment("checkin")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className={`relative flex-1 px-4 py-2.5 rounded-full cursor-pointer transition-colors duration-150 ${activeDropdown === "checkin" ? "z-20" : "z-10"
                        }`}
                    >
                      {activeDropdown === "checkin" && (
                        <motion.div
                          layoutId="searchBarActivePill"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.14)] z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {hoveredSegment === "checkin" && activeDropdown !== "checkin" && (
                        <motion.div
                          layoutId="searchBarHoverPill"
                          className="absolute inset-0 bg-black/[0.04] rounded-full z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <div className="relative z-10 select-none">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-800 uppercase leading-tight">
                          <FaCalendarCheck className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                          <span>Check in</span>
                        </div>
                        <div className="text-xs font-medium text-neutral-500 truncate mt-0.5">
                          {checkin ? formatDate(checkin) : "Add dates"}
                        </div>
                      </div>
                    </div>

                    {/* Divider 2 */}
                    {activeDropdown !== "checkin" &&
                      activeDropdown !== "checkout" &&
                      hoveredSegment !== "checkin" &&
                      hoveredSegment !== "checkout" && (
                        <div className="w-px h-7 bg-neutral-300 shrink-0 relative z-0" />
                      )}

                    {/* Segment 3: Check out */}
                    <div
                      onClick={handleCheckoutClick}
                      onMouseEnter={() => setHoveredSegment("checkout")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className={`relative flex-1 px-4 py-2.5 rounded-full cursor-pointer transition-colors duration-150 ${activeDropdown === "checkout" ? "z-20" : "z-10"
                        }`}
                    >
                      {activeDropdown === "checkout" && (
                        <motion.div
                          layoutId="searchBarActivePill"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.14)] z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {hoveredSegment === "checkout" && activeDropdown !== "checkout" && (
                        <motion.div
                          layoutId="searchBarHoverPill"
                          className="absolute inset-0 bg-black/[0.04] rounded-full z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <div className="relative z-10 select-none">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-800 uppercase leading-tight">
                          <FaCalendarCheck className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                          <span>Check out</span>
                        </div>
                        <div className="text-xs font-medium text-neutral-500 truncate mt-0.5">
                          {checkout ? formatDate(checkout) : "Add dates"}
                        </div>
                      </div>
                    </div>

                    {/* Divider 3 */}
                    {activeDropdown !== "checkout" &&
                      activeDropdown !== "guests" &&
                      hoveredSegment !== "checkout" &&
                      hoveredSegment !== "guests" && (
                        <div className="w-px h-7 bg-neutral-300 shrink-0 relative z-0" />
                      )}

                    {/* Segment 4: Who / Guests & Search Button */}
                    <div
                      onClick={handleGuestsClick}
                      onMouseEnter={() => setHoveredSegment("guests")}
                      onMouseLeave={() => setHoveredSegment(null)}
                      className={`relative flex-[1.1] pl-4 pr-1.5 py-1.5 rounded-full cursor-pointer transition-colors duration-150 flex items-center justify-between ${activeDropdown === "guests" ? "z-20" : "z-10"
                        }`}
                    >
                      {activeDropdown === "guests" && (
                        <motion.div
                          layoutId="searchBarActivePill"
                          className="absolute inset-0 bg-white rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.14)] z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      {hoveredSegment === "guests" && activeDropdown !== "guests" && (
                        <motion.div
                          layoutId="searchBarHoverPill"
                          className="absolute inset-0 bg-black/[0.04] rounded-full z-0 pointer-events-none"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <div className="min-w-0 pr-2 relative z-10 select-none">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-neutral-800 uppercase leading-tight">
                          <MdPeopleAlt className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                          <span>Who</span>
                        </div>
                        <div className="text-xs font-medium text-neutral-500 truncate mt-0.5">
                          {selectedGuest?.adults > 1 || selectedGuest?.childrenn > 0
                            ? getTotalGuests()
                            : "Add guests"}
                        </div>
                      </div>

                      {/* Airbnb Dynamic Search Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSearch();
                        }}
                        disabled={isSearching}
                        className={`h-11 rounded-full bg-[#ff6900] hover:bg-[#e05d00] text-white flex items-center justify-center gap-2 px-3.5 shadow-md transition-all duration-200 cursor-pointer relative z-20 ${isAnyDropdownOpen ? "w-24" : "w-11"
                          }`}
                      >
                        {isSearching ? (
                          <ButtonLoader />
                        ) : (
                          <>
                            <Search className="w-4 h-4 shrink-0" />
                            {isAnyDropdownOpen && (
                              <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-xs font-bold whitespace-nowrap overflow-hidden"
                              >
                                Search
                              </motion.span>
                            )}
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Dropdown 1: Category / Where Popover */}
                  <AnimatePresence>
                    {activeDropdown === "category" && (
                      <div className="absolute top-full left-0 mt-3 z-50">
                        <CategorySearch
                          onCategorySelect={(categoryId, categoryName) => {
                            dispatch(setSelectedCategory(categoryId === "all" ? null : categoryId));
                            dispatch(setSelectedCategoryname(categoryName));
                            setActiveDropdown("checkin");
                            setFocusedSide("checkin");
                          }}
                          isMobile={isMobile}
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Dropdown 2 & 3: Checkin & Checkout Popover (Dual Date Picker with Indian Holidays) */}
                  <AnimatePresence>
                    {(activeDropdown === "checkin" || activeDropdown === "checkout") && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50">
                        <DualDatePicker
                          checkinDate={checkin}
                          checkoutDate={checkout}
                          onCheckinSelect={handleCheckinSelect}
                          onCheckoutSelect={handleCheckoutSelect}
                          onComplete={() => setActiveDropdown("guests")}
                          onClose={() => setActiveDropdown(null)}
                          focusedSide={focusedSide}
                          setFocusedSide={setFocusedSide}
                          isMobile={isMobile}
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Dropdown 4: Who / Guest Selector Popover */}
                  <AnimatePresence>
                    {activeDropdown === "guests" && (
                      <div className="absolute top-full right-0 mt-3 z-50">
                        <GuestSelector
                          adults={selectedGuest?.adults || 1}
                          childrenn={selectedGuest?.childrenn || 0}
                          infants={selectedGuest?.infants || 0}
                          pets={selectedGuest?.pets || 0}
                          onGuestChange={handleGuestChange}
                          onClose={() => setActiveDropdown(null)}
                          isMobile={isMobile}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Dim Background Backdrop (Airbnb Signature) */}
      <AnimatePresence>
        {isAnyDropdownOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActiveDropdown(null)}
            className="fixed inset-0 bg-black/25 backdrop-blur-[2px] z-40"
            style={{
              top: isScrolled && !isExpanded ? "64px" : "136px",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
