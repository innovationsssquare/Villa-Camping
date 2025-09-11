"use client";
import {
  Settings,
  ChevronRight,
  Calendar,
  MapPin,
  Star,
  User,
  Clock,
  Trophy,
  Edit3,
} from "lucide-react";
import { Button } from "@heroui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { UserSidebar } from "@/components/Navbarcomponents/Sidebar";
import { NotificationSheet } from "@/components/Navbarcomponents/Notificationsheet";

export default function PremiumProfile() {
  return (
    <div className="bg-background min-h-screen">
      <section
        className={cn(
          " w-full sticky top-0  bg-white  rounded-b-2xl px-4 py-3 z-50 transition-transform duration-300 ease-in-out md:hidden "
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserSidebar />
            Profile
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
      </section>
      {/* Premium Header */}
      <header className="bg-black/80 text-white p-4 pb-16 pt-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-16 h-16 border-4 border-white/20 shadow-elevated">
                <AvatarImage
                  src="/placeholder.svg?height=80&width=80"
                  alt="User Avatar"
                />
                <AvatarFallback className="text-luxury-navy text-lg font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
             
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold mb-1">John Doe</h2>

              <Badge
                variant="outline"
                className="border-white/30 text-white bg-white/10"
              >
                Thevillacamp@gmail.com
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-3 -mt-8 relative z-20 space-y-6">
        {/* Current Booking Status */}
        <Card className="bg-gray-200 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center text-foreground">
                <Calendar className="w-6 h-6 mr-3 text-luxury-navy" />
                Current Reservation
              </h3>
              <Badge className="bg-black text-white font-semibold">
                Active
              </Badge>
            </div>
            <div className="bg-background/50 rounded-xl p-4 border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h4 className="font-bold text-md text-foreground">
                    Luxury Suite - Grand Hotel
                  </h4>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-xs">Manhattan, New York</span>
                  </div>
                  <div className="flex items-center text-luxury-navy font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-xs">
                      Aug 15 - Aug 20, 2023 • 5 nights
                    </span>
                  </div>
                </div>
                <Button variant="luxury-outline" size="sm" className="shrink-0">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="personal" className="space-y-4 ">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200 h-12  border border-white">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-black/80 data-[state=active]:text-white"
            >
              Personal Details
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-black/80 data-[state=active]:text-white "
            >
              Wishlist
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            {/* Personal Details */}
            <Card className="shadow-luxury-card border-0 bg-gray-200">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                  <User className="w-6 h-6 mr-3 text-luxury-navy" />
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstName"
                      className="text-sm font-medium text-foreground"
                    >
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      defaultValue="John"
                      className="bg-background border-gray-300 focus:border-luxury-navy/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastName"
                      className="text-sm font-medium text-foreground"
                    >
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      defaultValue="Doe"
                      className="bg-background border-gray-300 focus:border-luxury-navy/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-foreground"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="john.doe@email.com"
                      className="bg-background border-gray-300 focus:border-luxury-navy/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="text-sm font-medium text-foreground"
                    >
                      Mobile Number
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      defaultValue="+1 (555) 123-4567"
                      className="bg-background border-gray-300 focus:border-luxury-navy/50"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label
                      htmlFor="gender"
                      className="text-sm font-medium text-foreground"
                    >
                      Gender
                    </Label>
                    <Input
                      id="gender"
                      defaultValue="Male"
                      className="bg-background border-gray-300 focus:border-luxury-navy/50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist">
            {/* Wishlist */}
            <Card className="shadow-luxury-card border-0 bg-gray-200">
              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-4 flex items-center text-foreground">
                  <Star className="w-6 h-6 mr-3 text-luxury-gold fill-black" />
                  Wishlist
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "The Ritz-Carlton",
                      location: "New York",
                      rating: 4.9,
                    },
                    {
                      name: "Four Seasons Resort",
                      location: "Maldives",
                      rating: 4.8,
                    },
                    {
                      name: "Mandarin Oriental",
                      location: "Tokyo",
                      rating: 4.7,
                    },
                  ].map((hotel, index) => (
                    <div key={index} className="group">
                      <Card className="border border-white hover:border-luxury-navy/30 hover:shadow-luxury-card transition-luxury cursor-pointer">
                        <CardContent className="p-4 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-luxury rounded-xl flex items-center justify-center mr-4 group-hover:scale-105 transition-luxury">
                              <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">
                                {hotel.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {hotel.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-luxury-gold mr-1 fill-current" />
                              <span className="text-sm font-medium">
                                {hotel.rating}
                              </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-luxury-navy transition-luxury" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            variant="luxury-outline"
            size="lg"
            className="w-full font-medium bg-black text-white"
          >
            <User className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </main>
    </div>
  );
}
