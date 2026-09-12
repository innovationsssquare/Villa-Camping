"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Users,
  Search,
  Phone,
  ChevronDown,
  Home,
  Compass,
  Tent,
  Trees,
  Hotel,
  MessageCircle,
  Sparkles,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  setCheckin,
  setCheckout,
  updateGuestCount,
  setSelectedCategoryname,
} from "@/Redux/Slices/bookingSlice";
import { useVilla } from "@/lib/context/VillaContext";
import Logo from "../../public/Productasset/mainlogo_clean.png";
import { DualDatePicker } from "../Navbarcomponents/dual-date-picker";
import { GuestSelector } from "../Navbarcomponents/guest-selector";

export default function VillaDetailHeader() {
  const router = useRouter();
  const dispatch = useDispatch();
  const villa = useVilla();

  const { checkin, checkout, selectedGuest } = useSelector(
    (state) => state.booking
  );

  const [datePopoverOpen, setDatePopoverOpen] = useState(false);
  const [guestPopoverOpen, setGuestPopoverOpen] = useState(false);
  const [propertyPopoverOpen, setPropertyPopoverOpen] = useState(false);
  const [contactPopoverOpen, setContactPopoverOpen] = useState(false);
  const [focusedSide, setFocusedSide] = useState("checkin");

  const totalGuests = (selectedGuest?.adults || 1) + (selectedGuest?.childrenn || 0);
  const infants = selectedGuest?.infants || 0;
  const pets = selectedGuest?.pets || 0;

  // Display text for location / property name / property type
  const locationText = villa?.address?.city || villa?.address?.area || "Coorg";
  const propertyDisplayName = villa?.name
    ? `${villa.name}, ${locationText}`
    : `${villa?.propertyType || "Villa"}, ${locationText}`;

  // Date selection formatted text
  const getDateDisplayText = () => {
    if (checkin && checkout) {
      return `${format(new Date(checkin), "MMM dd")} – ${format(
        new Date(checkout),
        "MMM dd"
      )}`;
    }
    if (checkin) {
      return `${format(new Date(checkin), "MMM dd")} – Checkout`;
    }
    return "Select Date";
  };

  // Guest selection formatted text with Pets and Infants support
  const getGuestDisplayText = () => {
    let parts = [`${totalGuests} guest${totalGuests > 1 ? "s" : ""}`];
    if (pets > 0) parts.push(`${pets} pet${pets > 1 ? "s" : ""}`);
    if (infants > 0) parts.push(`${infants} infant${infants > 1 ? "s" : ""}`);
    return parts.join(", ");
  };

  // Handle clicking the Search button on the pill
  const handleSearchClick = (e) => {
    e.stopPropagation();
    const targetElement =
      document.getElementById("booking-widget") ||
      document.getElementById("overview");

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      targetElement.classList.add("ring-2", "ring-[#ff6900]", "ring-offset-2");
      setTimeout(() => {
        targetElement.classList.remove("ring-2", "ring-[#ff6900]", "ring-offset-2");
      }, 1500);
    }
  };

  const propertyTypes = [
    { name: "Villas", icon: Home, desc: "Private pools & luxury estates", slug: "villas" },
    { name: "Cottages", icon: Trees, desc: "Cozy nature & hill retreats", slug: "cottages" },
    { name: "Campings", icon: Tent, desc: "Lakeside tents & bonfire nights", slug: "campings" },
    { name: "Hotels", icon: Hotel, desc: "Boutique suites & resorts", slug: "hotels" },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-40 shadow-xs transition-all h-16 md:h-[72px]">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full gap-3">
          
          {/* 1. Left: Brand Logo */}
          <div className="flex items-center space-x-6 shrink-0">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-[1.02]"
            >
              <Image
                src={Logo}
                alt="TheVillaCamp"
                width={120}
                height={32}
                priority
                className="h-8 md:h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* 2. Center: StayVista-style Pill Search Bar (Property Type | Indian Holidays Date | Guests with Pets | Search) */}
          <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl px-2">
            <div className="flex items-center h-11 bg-white rounded-full border border-neutral-300/80 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 pl-4 pr-1.5 py-1">
              
              {/* Segment A: Property Type & Location */}
              <Popover open={propertyPopoverOpen} onOpenChange={setPropertyPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-neutral-50 transition-colors text-left group cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950 truncate max-w-[130px] lg:max-w-[170px]">
                      {propertyDisplayName}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xl"
                  align="start"
                >
                  <div className="space-y-3">
                    <div className="border-b border-neutral-100 pb-3">
                      <div className="text-[11px] font-bold tracking-wider text-[#ff6900] uppercase">
                        Current Stay
                      </div>
                      <div className="text-sm font-bold text-neutral-900 mt-0.5">
                        {villa?.name || "Luxury Villa"}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#ff6900]" />
                        <span>
                          {villa?.address?.area ? `${villa.address.area}, ` : ""}
                          {villa?.address?.city || "Destination"}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-orange-50 text-[#ff6900] text-[11px] font-semibold border border-orange-200/60">
                        <Sparkles className="w-3 h-3" />
                        <span>{villa?.propertyType || "Luxury Villa"}</span>
                        <span>•</span>
                        <span>{villa?.bhkType || "Entire Place"}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold tracking-wider text-neutral-500 uppercase mb-2">
                        Explore Other Property Types
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {propertyTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <button
                              key={type.slug}
                              type="button"
                              onClick={() => {
                                dispatch(setSelectedCategoryname(type.name));
                                router.push(`/category/${type.slug}`);
                                setPropertyPopoverOpen(false);
                              }}
                              className="flex items-center gap-2 p-2 rounded-xl border border-neutral-200/80 hover:border-[#ff6900] hover:bg-orange-50/40 text-left transition-all group cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0 group-hover:bg-[#ff6900] group-hover:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-neutral-800 group-hover:text-[#ff6900] truncate">
                                  {type.name}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-neutral-200 shrink-0" />

              {/* Segment B: Date Selection with Indian Holidays DualDatePicker */}
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    onClick={() => {
                      setFocusedSide(checkin && !checkout ? "checkout" : "checkin");
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-neutral-50 transition-colors text-left group cursor-pointer"
                  >
                    <CalendarIcon className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950 truncate max-w-[140px] lg:max-w-[180px]">
                      {getDateDisplayText()}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-0 bg-transparent shadow-none"
                  align="center"
                  sideOffset={12}
                >
                  <DualDatePicker
                    checkinDate={checkin}
                    checkoutDate={checkout}
                    onCheckinSelect={(date) => {
                      dispatch(setCheckin(date));
                      dispatch(setCheckout(null));
                      setFocusedSide("checkout");
                    }}
                    onCheckoutSelect={(date) => {
                      dispatch(setCheckout(date));
                    }}
                    minDate={new Date()}
                    isMobile={false}
                    timezone="Asia/Kolkata"
                    onClose={() => setDatePopoverOpen(false)}
                    focusedSide={focusedSide}
                    setFocusedSide={setFocusedSide}
                  />
                </PopoverContent>
              </Popover>

              {/* Vertical Divider */}
              <div className="h-4 w-[1px] bg-neutral-200 shrink-0" />

              {/* Segment C: Guest Selection (Including Adults, Children, Infants & Pets) */}
              <Popover open={guestPopoverOpen} onOpenChange={setGuestPopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-neutral-50 transition-colors text-left group cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-[#ff6900] shrink-0" />
                    <span className="text-xs font-semibold text-neutral-800 group-hover:text-neutral-950 truncate max-w-[120px] lg:max-w-[150px]">
                      {getGuestDisplayText()}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 border-0 bg-transparent shadow-none"
                  align="end"
                  sideOffset={12}
                >
                  <GuestSelector
                    adults={selectedGuest?.adults || 1}
                    childrenn={selectedGuest?.childrenn || 0}
                    infants={selectedGuest?.infants || 0}
                    pets={selectedGuest?.pets || 0}
                    onGuestChange={(type, value) => {
                      dispatch(updateGuestCount({ type, value }));
                    }}
                    onClose={() => setGuestPopoverOpen(false)}
                    isMobile={false}
                  />
                </PopoverContent>
              </Popover>

              {/* Segment D: Search Button (Exact round black button from screenshot) */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-[#ff6900] text-white flex items-center justify-center shadow-xs shrink-0 ml-1 transition-all duration-200 hover:scale-105 cursor-pointer"
                title="View booking & availability"
              >
                <Search className="w-3.5 h-3.5 text-white" />
              </button>

            </div>
          </div>

          {/* 3. Right: Account and "Get in touch" Button */}
          <div className="flex items-center space-x-3 shrink-0">
            {/* Become a Host (optional link on wide screens) */}
            <Link href="/BecomeAHost" className="hidden xl:block">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-xs text-neutral-700 hover:text-[#ff6900] hover:bg-orange-50/60 rounded-full px-3.5 transition-colors"
              >
                Become a host
              </Button>
            </Link>

            {/* Profile Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/account")}
              className="rounded-full hover:bg-orange-50/60 hover:text-[#ff6900] transition-colors w-9 h-9"
              title="My Account"
            >
              <Users className="w-4.5 h-4.5 text-neutral-700" />
            </Button>

            {/* "Get in touch" Button with Dropdown (matching screenshot) */}
            <Popover open={contactPopoverOpen} onOpenChange={setContactPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                  <span>Get in touch</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-72 p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xl"
                align="end"
              >
                <div className="space-y-3">
                  <div className="border-b border-neutral-100 pb-2.5">
                    <div className="text-xs font-bold text-neutral-900">
                      Need help booking this stay?
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Our villa concierge is available 24/7 to assist with inquiries.
                    </p>
                  </div>

                  <a
                    href="tel:+919876543210"
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-150 hover:border-[#ff6900] hover:bg-orange-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-[#ff6900] flex items-center justify-center shrink-0 group-hover:bg-[#ff6900] group-hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-[#ff6900]">
                        Call Concierge
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        +91 98765 43210
                      </div>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919876543210?text=Hi%2C%20I%20am%20interested%20in%20booking%20this%20villa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-150 hover:border-green-500 hover:bg-green-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-neutral-900 group-hover:text-green-600">
                        Chat on WhatsApp
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        Instant responses
                      </div>
                    </div>
                  </a>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <Link
                      href="/BecomeAHost"
                      className="text-neutral-600 hover:text-[#ff6900] font-semibold transition-colors"
                    >
                      Host your property
                    </Link>
                    <Link
                      href="/account/support"
                      className="text-[#ff6900] hover:underline font-semibold"
                    >
                      Help Center
                    </Link>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

          </div>

        </div>
      </div>
    </header>
  );
}
