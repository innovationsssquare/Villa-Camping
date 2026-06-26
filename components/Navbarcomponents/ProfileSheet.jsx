import { Menu, User, Heart, CalendarCheck, ChevronRight, Plus, HelpCircle, Bell, Home as HomeIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const wishlist = [
  {
    id: 1,
    title: "Cliffside Villa, Santorini",
    meta: "Saved 2 days ago",
    img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Forest Cabin, Kyoto",
    meta: "Saved last week",
    img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    title: "Loft in Brooklyn",
    meta: "Saved last month",
    img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=200&h=200&fit=crop",
  },
];

const bookings = [
  {
    id: 1,
    title: "Beachfront Bungalow, Bali",
    dates: "Jul 12 – Jul 18",
    status: "Upcoming",
    img: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    title: "Mountain Chalet, Aspen",
    dates: "Mar 02 – Mar 09",
    status: "Completed",
    img: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=200&h=200&fit=crop",
  },
];

export function ProfileSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 rounded-full border-gray-200 px-3 py-5 shadow-sm hover:shadow-md"
        >
          <Menu className="h-4 w-4 text-gray-700" />
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-gray-800 text-xs text-white">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <SheetHeader className="border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-[#ff6900] text-base font-semibold text-white">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <SheetTitle className="text-base">Santosh Alimkar</SheetTitle>
              <SheetDescription className="text-xs">
                santosh@villacamp.com · Guest
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-110px)] px-6 py-4">
          {/* Wishlist */}
          <section className="mb-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#ff6900]" />
                <h3 className="text-sm font-semibold text-gray-900">Wishlist</h3>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {wishlist.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-600">
                See all <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <ul className="space-y-2">
              {wishlist.map((item) => (
                <li
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">{item.meta}</p>
                  </div>
                  <Heart className="h-4 w-4 fill-[#ff6900] text-[#ff6900]" />
                </li>
              ))}
              <li>
                <button className="flex w-full items-center gap-2 rounded-xl border border-dashed border-gray-200 p-3 text-xs text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700">
                  <Plus className="h-4 w-4" />
                  Create new wishlist
                </button>
              </li>
            </ul>
          </section>

          <Separator />

          {/* My Bookings */}
          <section className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-gray-800" />
                <h3 className="text-sm font-semibold text-gray-900">My bookings</h3>
                <Badge variant="secondary" className="rounded-full text-[10px]">
                  {bookings.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-gray-600">
                See all <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <ul className="space-y-2">
              {bookings.map((b) => (
                <li
                  key={b.id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-2 transition-colors hover:bg-gray-50"
                >
                  <img
                    src={b.img}
                    alt={b.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{b.title}</p>
                    <p className="text-xs text-gray-500">{b.dates}</p>
                  </div>
                  <Badge
                    variant={b.status === "Upcoming" ? "default" : "secondary"}
                    className={
                      b.status === "Upcoming"
                        ? "bg-gray-900 text-[10px] hover:bg-gray-900"
                        : "text-[10px]"
                    }
                  >
                    {b.status}
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          <Separator className="my-6" />

          {/* Quick links */}
          <section className="mb-2">
            <ul className="space-y-1">
              <li>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
                  <HomeIcon className="h-4 w-4 text-gray-700" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">Become a host</p>
                    <p className="text-xs text-gray-500">It's easy to start hosting and earn extra income.</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
              <li>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
                  <Bell className="h-4 w-4 text-gray-700" />
                  <span className="flex-1 text-sm font-medium text-gray-900">Notifications</span>
                  <Badge className="bg-[#ff6900] text-[10px] hover:bg-[#ff6900]">3</Badge>
                </button>
              </li>
              <li>
                <button className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-gray-50">
                  <HelpCircle className="h-4 w-4 text-gray-700" />
                  <span className="flex-1 text-sm font-medium text-gray-900">Help center</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              </li>
            </ul>
          </section>

          <Separator className="my-4" />

          <Button variant="ghost" className="w-full justify-start text-sm text-gray-700">
            Log out
          </Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
