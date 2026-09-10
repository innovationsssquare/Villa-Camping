"use client";
import {
  Calendar,
  MapPin,
  Search,
  Landmark,
  Users,
  IndianRupee,
  BadgeDollarSign,
  FileText,
  Star,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Receipt,
  Info,
  AlertCircle,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, Tab, Button } from "@heroui/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { EmptyState } from "./empty-states";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "@/Redux/Slices/myBookingSlice";
import { ReviewDrawer } from "./Review-drawer";
import { DisputeDrawer } from "./Dispute-drawer";
import { GetCustomerDisputesAPI } from "@/lib/API/Dispute/Dispute";
import ButtonLoader from "@/components/Loadercomponents/button-loader";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "booked":
      case "confirmed":
        return {
          variant: "default",
          icon: CheckCircle2,
          color: "text-hotel-success",
        };
      case "completed":
        return {
          variant: "secondary",
          icon: CheckCircle2,
          color: "text-muted-foreground",
        };
      case "cancelled":
        return {
          variant: "destructive",
          icon: XCircle,
          color: "text-destructive",
        };
      default:
        return {
          variant: "secondary",
          icon: Clock,
          color: "text-muted-foreground",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className="flex items-center gap-1 px-3 py-1"
    >
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
};

const BookingCard = ({ booking, onWriteReview, onRaiseDispute }) => {
  const {
    propertyId,
    checkIn,
    checkOut,
    status,
    pricing,
    _id,
    bookingMode,
    guests,
    customerDetails,
    payments,
    items,
  } = booking;

  const hotel = items?.[0]?.typeName || propertyId?.name || "Room";
  const branchLocation = propertyId?.name || "Hotel";
  const checkInDate = new Date(checkIn).toLocaleDateString();
  const checkOutDate = new Date(checkOut).toLocaleDateString();
  const images = propertyId?.images || [];
  const nights = Math.ceil(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const TotalAmount = pricing?.totalAmount || 0;
  const Tax = pricing?.taxAmount || 0;
  const transactionId = payments?.[0]?.transactionId || "N/A";
  const pricingDetails = pricing || {
    subtotal: 0,
    taxAmount: 0,
    totalAmount: 0,
    discountAmount: 0,
  };

  return (
    <Card className="overflow-hidden p-0 shadow-none hover:shadow-hotel transition-all duration-300 border border-gray-300 bg-card">
      <CardContent className="p-0">
        {/* Hotel Image */}
        <div className="relative">
          <div className="p-0 bg-gradient-surface">
            {images.length > 0 ? (
              <div className="relative">
                <img
                  src={images[0] || "/placeholder.svg"}
                  alt={hotel}
                  className="w-full h-48 object-cover rounded-t-xl border-2 border-white shadow-card"
                />
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-t-lg"></div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Landmark className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="p-3 space-y-4">
          {/* Hotel Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{hotel}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{branchLocation}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(status?.toLowerCase() === "booked" ||
                  status?.toLowerCase() === "confirmed") && (
                  <>
                    <Button variant="outline" size="sm">
                      Modify
                    </Button>
                    <Button variant="destructive" size="sm">
                      Cancel
                    </Button>
                  </>
                )}
                {status?.toLowerCase() === "completed" && (
                  <Button
                    onClick={() => onWriteReview(booking)}
                    variant="golden"
                    className={"bg-orange-500 text-white"}
                    size="sm"
                  >
                    Write a Review
                  </Button>
                )}
                <Button
                  onClick={() => onRaiseDispute && onRaiseDispute(booking)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 flex items-center gap-1 text-xs font-bold"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Report Issue
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {items && items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-hotel-primary">
                <Receipt className="w-4 h-4" />
                <span>Accommodation Details</span>
              </div>
              <div className="bg-gray-50/80 rounded-lg p-3 space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{item.typeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.quantity} x ₹{item.pricePerNight} per night
                      </span>
                    </div>
                    <span className="font-semibold text-foreground">
                      ₹{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dates */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-hotel-primary" />
                <span className="font-medium">Stay Duration</span>
              </div>
              <div className="pl-6 space-y-1">
                <p className="text-sm text-foreground">
                  {checkInDate} - {checkOutDate}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nights} night{nights !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-hotel-primary" />
                <span className="font-medium">Guest Information</span>
              </div>
              <div className="pl-6 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">
                    {customerDetails?.firstName} {customerDetails?.lastName}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {customerDetails?.mobile} • {customerDetails?.email}
                </p>
                {guests?.children > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {guests.adults} Adult{guests.adults !== 1 ? "s" : ""},{" "}
                    {guests.children} child
                    {guests.children !== 1 ? "ren" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Separator />
          {/* Booking Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Booking ID</p>
                <p className="font-mono text-xs">{_id?.slice(-8)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="capitalize">{bookingMode}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Transaction</p>
                <p className="font-mono text-xs">
                  {payments?.[0]?.transactionId?.slice(-8) || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-hotel-primary">
                <BadgeDollarSign className="w-4 h-4" />
                <span>Payment Summary</span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] uppercase tracking-wider font-bold border-hotel-success/30 text-hotel-success bg-hotel-success/5"
              >
                {booking.paymentStatus?.replace("_", " ")}
              </Badge>
            </div>

            <div className="bg-orange-200/50 rounded-xl p-4 border border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium text-foreground">
                  ₹{pricingDetails.subtotal}
                </span>
              </div>
              {pricingDetails.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-hotel-success">
                  <span className="flex items-center gap-1 italic">
                    <Info className="w-3 h-3" /> Coupon Discount
                  </span>
                  <span className="font-medium">
                    -₹{pricingDetails.discountAmount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Taxes & Service Fees
                </span>
                <span className="font-medium text-foreground">
                  ₹{pricingDetails.taxAmount}
                </span>
              </div>
              <Separator className="my-1 bg-gray-200" />
              <div className="flex justify-between items-center pt-1">
                <span className="text-md font-bold text-foreground">
                  Total Paid Amount
                </span>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-hotel-success">
                    <IndianRupee className="w-5 h-5" />
                    <span className="md:text-lg text-sm font-black">
                      ₹{pricingDetails.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <Separator /> */}

          {/* Pricing & Actions */}
          {/* <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-hotel-success" />
                <span className="text-lg font-bold text-foreground">
                  ₹{TotalAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Including ₹{Tax} taxes & fees
              </p>
            </div>

            <div className="flex gap-2">
              {(status?.toLowerCase() === "booked" ||
                status?.toLowerCase() === "confirmed") && (
                <>
                  <Button variant="outline" size="sm">
                    Modify
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </>
              )}
              {status?.toLowerCase() === "completed" && (
                <Button variant="golden" size="sm">
                  Write a Review
                </Button>
              )}
            </div>
          </div> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default function BookingScreen() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.myBookings);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Active");
  const [reviewDrawerOpen, setReviewDrawerOpen] = useState(false);
  const [disputeDrawerOpen, setDisputeDrawerOpen] = useState(false);

  const [selectedBookingForReview, setSelectedBookingForReview] =
    useState(null);
  const [selectedBookingForDispute, setSelectedBookingForDispute] =
    useState(null);
  const [customerDisputes, setCustomerDisputes] = useState([]);
  const [disputesLoading, setDisputesLoading] = useState(false);

  const handleWriteReview = (booking) => {
    setSelectedBookingForReview(booking);
    setReviewDrawerOpen(true);
  };

  const handleRaiseDispute = (booking) => {
    setSelectedBookingForDispute(booking);
    setDisputeDrawerOpen(true);
  };

  const getCustomerId = () => {
    try {
      if (typeof window === "undefined") return null;
      // adjust key if you use a different key
      const id =
        localStorage.getItem("thevilla_user_id") ||
        localStorage.getItem("customer_id") ||
        null;
      return id;
    } catch {
      return null;
    }
  };

  const customerId = getCustomerId();

  const loadCustomerDisputes = async (cId) => {
    const id = cId || customerId;
    if (!id) return;
    setDisputesLoading(true);
    try {
      let email = "";
      try {
        const storedUser = localStorage.getItem("thevilla_user");
        if (storedUser) {
          const u = JSON.parse(storedUser);
          email = u?.email || "";
        }
      } catch {}
      const res = await GetCustomerDisputesAPI(id, email);
      if (res?.success) {
        setCustomerDisputes(res.data || []);
      }
    } catch (e) {
      console.error("Failed to load customer disputes:", e);
    } finally {
      setDisputesLoading(false);
    }
  };

  useEffect(() => {
    if (!customerId) return;
    dispatch(fetchMyBookings(customerId));
    loadCustomerDisputes(customerId);
  }, [dispatch, customerId]);

  const isCompletedByCheckout = (checkOut) => {
    if (!checkOut) return false;

    const now = new Date(); // IST (local)
    const checkoutDate = new Date(checkOut); // auto converted to IST

    return checkoutDate < now;
  };

  const isActiveByCheckout = (checkOut) => {
    if (!checkOut) return false;

    const now = new Date();
    const checkoutDate = new Date(checkOut);

    return checkoutDate >= now;
  };

  const getFilteredBookings = () => {
    const q = search.toLowerCase();

    return bookings.filter((b) => {
      const matchesSearch =
        b._id?.toLowerCase().includes(q) ||
        b.status?.toLowerCase().includes(q) ||
        b.propertyId?.name?.toLowerCase().includes(q) ||
        b.customerDetails?.firstName?.toLowerCase().includes(q);

      const isCompleted = isCompletedByCheckout(b.checkOut);
      const isActive = isActiveByCheckout(b.checkOut);

      if (activeTab === "Active") return matchesSearch && isActive;
      if (activeTab === "Completed") return matchesSearch && isCompleted;

      return matchesSearch;
    });
  };

  const filteredResults = getFilteredBookings();

  return (
    <>
      <div className="min-h-screen ">
        <header
          className={cn(
            " w-full sticky top-0 bg-white   rounded-b-2xl px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserSidebar />
              My Booking
            </div>

            <div className="flex items-center gap-2">
              <NotificationSheet />
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="sticky top-12 z-40 bg-card/80 bg-white backdrop-blur-md border-b border-gray-300 shadow-sm">
          <div className="max-w-6xl mx-auto p-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by booking ID, hotel, status..."
                className="pl-10 bg-background/50 backdrop-blur-sm border-gray-300 h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full mx-auto p-2 ">
          <Tabs
            aria-label="Booking Options"
            color="primary"
            variant="bordered"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key)}
            className="w-full md:w-1/2"
            classNames={{
              tabList: "w-full z-30  bg-gray-200  rounded-md p-0 mb-2",
              cursor: "w-full bg-black border border-black",
              tab: " px-0 md:h-10 ",
              tabContent:
                "group-data-[selected=true]:text-white w-full flex justify-center items-center md:font-semibold",
            }}
          >
            <Tab key="Active" title="Active">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                {loading ? (
                  <div className="flex justify-center items-center h-[60vh] bg-white">
                    <div className="bg-black rounded-full flex justify-center items-center">
                      <ButtonLoader />
                    </div>
                  </div>
                ) : filteredResults?.length > 0 ? (
                  filteredResults?.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onWriteReview={handleWriteReview}
                      onRaiseDispute={handleRaiseDispute}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState type="active" />
                  </div>
                )}
              </div>
            </Tab>

            <Tab key="Completed" title="Completed">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {loading ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    Loading your history...
                  </div>
                ) : filteredResults?.length > 0 ? (
                  filteredResults?.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onWriteReview={handleWriteReview}
                      onRaiseDispute={handleRaiseDispute}
                    />
                  ))
                ) : (
                  <div className="col-span-full">
                    <EmptyState type="completed" />
                  </div>
                )}
              </div>
            </Tab>

            <Tab key="Disputes" title={`Claims & Issues (${customerDisputes.length})`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {disputesLoading ? (
                  <div className="col-span-full py-20 text-center text-muted-foreground">
                    Loading your dispute records...
                  </div>
                ) : customerDisputes.length > 0 ? (
                  customerDisputes.map((dispute) => {
                    const statusColorMap = {
                      OPEN: "bg-amber-100 text-amber-800 border-amber-300",
                      UNDER_INVESTIGATION: "bg-blue-100 text-blue-800 border-blue-300",
                      AWAITING_EVIDENCE: "bg-orange-100 text-orange-800 border-orange-300",
                      RESOLVED_REFUND_CUSTOMER: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      RESOLVED_PAYOUT_OWNER: "bg-purple-100 text-purple-800 border-purple-300",
                      RESOLVED_SPLIT: "bg-indigo-100 text-indigo-800 border-indigo-300",
                      DISMISSED: "bg-gray-100 text-gray-800 border-gray-300",
                    };
                    const statusLabelMap = {
                      OPEN: "Under Review by Host & Support",
                      UNDER_INVESTIGATION: "Under Investigation by Villa Admin",
                      AWAITING_EVIDENCE: "Evidence Requested from Host",
                      RESOLVED_REFUND_CUSTOMER: "Refund Approved & Processed",
                      RESOLVED_PAYOUT_OWNER: "Settled with Host",
                      RESOLVED_SPLIT: "Split Resolution Settled",
                      DISMISSED: "Dismissed by Admin",
                    };
                    const hostNote = dispute.adminNotes?.find((n) => n.authorName === "Property Host" || n.note?.startsWith("Host Response:"));

                    return (
                      <Card key={dispute._id} className="border border-gray-300 p-5 rounded-2xl shadow-none bg-white space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs font-bold text-gray-500">
                                #{dispute.disputeId || dispute._id?.slice(-8)}
                              </span>
                              <Badge className={cn("text-[10px] uppercase font-bold border", statusColorMap[dispute.status] || "bg-gray-100 text-gray-700")}>
                                {statusLabelMap[dispute.status] || dispute.status}
                              </Badge>
                            </div>
                            <h4 className="font-bold text-base text-gray-900">
                              {dispute.propertyId?.name || dispute.propertyName || "Villa Stay"}
                            </h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-gray-500 block">Claimed</span>
                            <span className="font-black text-red-600 text-base">
                              ₹{(dispute.disputedAmount || 0).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="bg-orange-50/70 border border-orange-200/70 rounded-xl p-3.5 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-orange-800 text-xs font-bold uppercase tracking-wider">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>Your Claim: {dispute.title}</span>
                          </div>
                          <p className="text-xs text-gray-700 leading-relaxed">
                            "{dispute.description}"
                          </p>
                        </div>

                        {hostNote && (
                          <div className="bg-blue-50/70 border border-blue-200/70 rounded-xl p-3.5 space-y-1.5">
                            <div className="flex items-center gap-1.5 text-blue-800 text-xs font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Host Explanation Submitted</span>
                            </div>
                            <p className="text-xs text-blue-950 leading-relaxed">
                              {hostNote.note.replace(/^Host Response:\s*/, "")}
                            </p>
                          </div>
                        )}

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                          <span>Filed on {new Date(dispute.createdAt).toLocaleDateString()}</span>
                          <span className="font-semibold text-gray-700 capitalize">
                            Category: {dispute.category?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-2xl p-8 bg-gray-50/50">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-900 text-base mb-1">No Active Claims or Concerns</h4>
                    <p className="text-xs text-gray-500 max-w-md mx-auto">
                      All your bookings have completed smoothly. If you ever experience an issue with cleanliness, amenities, or check-in, you can report it directly from the booking card.
                    </p>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
      <ReviewDrawer
        isOpen={reviewDrawerOpen}
        onClose={() => setReviewDrawerOpen(false)}
        booking={selectedBookingForReview}
      />
      <DisputeDrawer
        isOpen={disputeDrawerOpen}
        onClose={() => setDisputeDrawerOpen(false)}
        booking={selectedBookingForDispute}
        onSuccess={() => customerId && loadCustomerDisputes(customerId)}
      />
    </>
  );
}
