"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  Compass,
  Sparkles,
  ArrowRight,
  Home,
  Share2,
  Search,
  SlidersHorizontal,
  MapPin,
  Check,
} from "lucide-react";
import { fetchmyWishlists } from "@/Redux/Slices/wishlistSlice";
import { PropertyCard } from "@/components/Availableweekend/Weekendcard";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import ButtonLoader from "@/components/Loadercomponents/button-loader";
import { Button } from "@/components/ui/button";
import { addToast } from "@heroui/react";

export default function WishlistPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { wishlists, wishloading } = useSelector((state) => state.wishlist || {});
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    dispatch(fetchmyWishlists());
  }, [dispatch]);

  const validWishlistItems = useMemo(() => {
    return (wishlists || []).filter(
      (item) => item?.propertyId && typeof item.propertyId === "object"
    );
  }, [wishlists]);

  // Extract unique category names from wishlist items
  const categoryFilters = useMemo(() => {
    const cats = new Set(["All"]);
    validWishlistItems.forEach((item) => {
      const cat = item.propertyId?.category?.name || item.propertyId?.propertyType;
      if (cat) cats.add(cat);
    });
    return Array.from(cats);
  }, [validWishlistItems]);

  // Filter items by category & search query
  const filteredItems = useMemo(() => {
    return validWishlistItems.filter((item) => {
      const prop = item.propertyId;
      const catName = prop?.category?.name || prop?.propertyType || "";
      const matchesFilter = selectedFilter === "All" || catName.toLowerCase() === selectedFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        prop?.name?.toLowerCase().includes(q) ||
        prop?.location?.toLowerCase().includes(q) ||
        prop?.city?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [validWishlistItems, selectedFilter, searchQuery]);

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: "My Wishlist on ThevillaCamp",
          text: "Check out the luxury villas and stays I saved on ThevillaCamp!",
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        addToast({
          title: "Link Copied!",
          description: "Wishlist link copied to your clipboard.",
          color: "success",
        });
        setTimeout(() => setCopied(false), 2500);
      }
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50/60 pb-24 pt-0 md:pt-28">
      {/* Mobile Sticky Header - Flush at top-0 with 0px top margin */}
      <section className="w-full sticky top-0 bg-white/95 backdrop-blur-md px-4 py-3 z-40 border-b border-neutral-150 md:hidden flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <UserSidebar />
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#ff6900] fill-[#ff6900]" />
            <span className="text-sm font-bold text-neutral-900">My Wishlist</span>
            {validWishlistItems.length > 0 && (
              <span className="text-[10px] font-bold bg-orange-100 text-[#ff6900] px-1.5 py-0.2 rounded-full">
                {validWishlistItems.length}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShareWishlist}
            className="p-2 rounded-full text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Share Wishlist"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <NotificationSheet />
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Desktop Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-400 mb-4">
          <Link href="/" className="hover:text-neutral-900 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-neutral-800 font-semibold">Wishlist</span>
        </div>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#ff6900] mb-2">
              <Heart className="w-3.5 h-3.5 fill-[#ff6900]" />
              <span>Saved Luxury Escapes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 tracking-tight">
              Your Saved Stays
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Private villas, luxury glamping sites & retreats handpicked for your next getaway
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWishlist}
              className="rounded-full text-xs font-semibold text-neutral-700 border-neutral-200 hover:bg-neutral-100 gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Share"}
            </Button>
            <Link
              href="/category/all"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-[#ff6900] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Compass className="w-3.5 h-3.5" /> Explore Stays
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        {validWishlistItems.length > 0 && (
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-neutral-200/80 shadow-2xs mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedFilter.toLowerCase() === cat.toLowerCase()
                      ? "bg-[#ff6900] text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search saved stays..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-full border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#ff6900] transition-all"
              />
            </div>
          </div>
        )}

        {/* Wishlist Items Grid */}
        {wishloading ? (
          <div className="flex flex-col items-center justify-center min-h-[45vh] space-y-3">
            <ButtonLoader />
            <p className="text-xs text-neutral-400 font-medium">Fetching your saved luxury stays...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4">
            {filteredItems.map((item, idx) => (
              <div key={item._id || item.propertyId?._id || idx} className="h-full">
                <PropertyCard property={item.propertyId} />
              </div>
            ))}
          </div>
        ) : validWishlistItems.length > 0 ? (
          /* Search/Filter Empty Result */
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-200/80 max-w-md mx-auto my-8 space-y-3">
            <Search className="w-8 h-8 text-neutral-300 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No properties matched your search</h3>
            <p className="text-xs text-neutral-500">Try adjusting your keywords or clearing the category filter.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFilter("All");
                setSearchQuery("");
              }}
              className="rounded-full text-xs font-semibold text-[#ff6900] border-orange-200 hover:bg-orange-50 cursor-pointer"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          /* Empty State - No Wishlisted Items */
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200/90 text-center max-w-xl mx-auto shadow-2xs space-y-4 my-8">
            <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#ff6900] mx-auto shadow-xs">
              <Heart className="w-8 h-8 text-[#ff6900] fill-orange-100" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
                Explore private pools, cliffside villas, and serene glamping tents in Lonavala and beyond. Tap the heart on any property to keep them handy here.
              </p>
            </div>

            {/* Category Quick Discover */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <Link
                href="/category/all"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] transition-colors"
              >
                🏊 Private Pool Villas
              </Link>
              <Link
                href="/category/all"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] transition-colors"
              >
                ⛺ Pawana Camping
              </Link>
              <Link
                href="/category/all"
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-100 hover:bg-orange-50 hover:text-[#ff6900] transition-colors"
              >
                ⛰️ Mountain View Stays
              </Link>
            </div>

            <div className="pt-4">
              <Button
                onClick={() => router.push("/category/all")}
                className="bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 mr-2" /> Browse Stays
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
