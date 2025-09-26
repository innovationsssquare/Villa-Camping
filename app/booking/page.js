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
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { MyBooking } from "@/lib/API/User/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";
import { IoBag } from "react-icons/io5";
import { IoMdBookmarks } from "react-icons/io";
import { useRouter } from "next/navigation";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "booked":
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

const BookingCard = ({ booking }) => {
  const {
    RoomId,
    CheckinDate,
    CheckOutDate,
    Status,
    TotalAmount,
    BookingId,
    bookingtype,
    Numberofchildren,
    Tax,
    UserInformation,
    PaymentId,
    BranchId,
  } = booking;

  const hotel = RoomId?.RoomName || "Room";
  const branchName = BranchId?.Branchname || "Hotel";
  const checkIn = new Date(CheckinDate).toLocaleDateString();
  const checkOut = new Date(CheckOutDate).toLocaleDateString();
  const images = RoomId?.Image || [];
  const nights = Math.ceil(
    (new Date(CheckOutDate).getTime() - new Date(CheckinDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="overflow-hidden shadow-card hover:shadow-hotel transition-all duration-300 border-0 bg-card">
      <CardContent className="p-0">
        {/* Hotel Image */}
        <div className="relative">
          <div className="p-4 bg-gradient-surface">
            {images.length > 0 ? (
              <div className="relative">
                <img
                  src={images[0]}
                  alt={hotel}
                  className="w-full h-48 object-cover rounded-xl border-2 border-white shadow-card"
                />
                <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <div className="flex items-center gap-1 text-white text-xs">
                    <Star className="w-3 h-3 fill-hotel-secondary text-hotel-secondary" />
                    <span>4.8</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Landmark className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Status Badge - Floating */}
          <div className="absolute top-4 right-4">
            <StatusBadge status={Status} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Hotel Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">{hotel}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{branchName}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Separator />

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
                  {checkIn} - {checkOut}
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
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-hotel-primary text-white">
                      {UserInformation?.Name?.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-foreground">
                    {UserInformation?.Name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Age {UserInformation?.Age} • {UserInformation?.Phonenumber}
                </p>
                {Numberofchildren > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {Numberofchildren} child
                    {Numberofchildren !== 1 ? "ren" : ""}
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
                <p className="font-mono text-xs">{BookingId}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="capitalize">{bookingtype}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <BadgeDollarSign className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Transaction</p>
                <p className="font-mono text-xs">
                  {PaymentId?.merchantTransactionId}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Pricing & Actions */}
          <div className="flex items-center justify-between">
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
              {Status === "Booked" && (
                <>
                  <Button variant="outline" size="sm">
                    Modify
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </>
              )}
              {Status === "Completed" && (
                <Button variant="golden" size="sm">
                  Review
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function BookingScreen() {
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    GetMybookingRooms();
  }, []);

  const GetMybookingRooms = async () => {
    try {
      setLoading(true);
      const phone = Cookies.get("phone") || "9876543210";
      const res = await MyBooking(phone);
      if (res.status) {
        setBookings(res.data);
        setFiltered(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    const q = value.toLowerCase();
    const filteredResults = bookings.filter(
      (b) =>
        b.BookingId.toLowerCase().includes(q) ||
        b.Status.toLowerCase().includes(q) ||
        b.RoomId?.RoomName.toLowerCase().includes(q) ||
        b.BranchId?.Branchname.toLowerCase().includes(q)
    );
    setFiltered(filteredResults);
  };

  const getTabCount = (filter) => {
    switch (filter) {
      case "upcoming":
        return filtered.filter((b) => new Date(b.CheckinDate) > new Date())
          .length;
      case "completed":
        return filtered.filter((b) => new Date(b.CheckOutDate) < new Date())
          .length;
      default:
        return filtered.length;
    }
  };

  const cartItemCount = 3;

  return (
    <div className="min-h-screen bg-gradient-surface ">
    
      <header
        className={cn(
          " w-full sticky top-0  bg-white  rounded-b-2xl px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserSidebar />
            My Booking
          </div>

          <div className="flex items-center gap-2">
            <NotificationSheet />

            {/* <Button
                 onClick={() => router.push("/bag")}
                 variant="outline"
                 size="icon"
                 className="rounded-md  border-gray-300 relative bg-[#FFFFFF4D]"
               >
                 <IoBag className="h-5 w-5" />
                 {cartItemCount > 0 && (
                   <Badge
                     className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-black text-white border-1 border-white min-w-[1.25rem] h-5"
                     variant="default"
                   >
                     {cartItemCount}
                   </Badge>
                 )}
                 <span className="sr-only">Shopping cart</span>
               </Button> */}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-gray-300 shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by booking ID, hotel, status..."
              className="pl-10 bg-background/50 backdrop-blur-sm border-gray-300 h-10"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full mx-auto ">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-200 shadow-card">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-black/80 data-[state=active]:text-white"
            >
              All ({getTabCount("all")})
            </TabsTrigger>
            <TabsTrigger
              value="upcoming"
              className="data-[state=active]:bg-black/80 data-[state=active]:text-white"
            >
              Upcoming ({getTabCount("upcoming")})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-black data-[state=active]:text-white"
            >
              Completed ({getTabCount("completed")})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-5 h-5 border-2 border-hotel-primary border-t-transparent rounded-full animate-spin" />
                Loading your bookings...
              </div>
            </div>
          ) : (
            <>
              <TabsContent value="all" className="space-y-6">
                {filtered.length === 0 ? (
                  <div className="text-center py-16">
                    <IoMdBookmarks className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No bookings found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Start planning your next getaway!
                    </p>
                    <Button
                      onClick={() => router.push("/category/all")}
                      variant="luxury"
                      size="lg"
                      className="bg-black/80 text-white"
                    >
                      Explore
                    </Button>
                  </div>
                ) : (
                  filtered.map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                {filtered
                  .filter((b) => new Date(b.CheckinDate) > new Date())
                  .map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                {filtered
                  .filter((b) => new Date(b.CheckOutDate) < new Date())
                  .map((booking) => (
                    <BookingCard key={booking._id} booking={booking} />
                  ))}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
}
