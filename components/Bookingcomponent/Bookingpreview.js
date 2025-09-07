"use client"
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Share2, Calendar, Users, Utensils, Star, CheckCircle, Shield, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import VerifyDetailsDialog from "@/components/Bookingcomponent/VerifyDetailsDialog";
// import villaImage from "@/assets/villa-aerial.jpg";

const PropertyBooking = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);

  return (
    <div className="min-h-screen bg-background hidden md:block w-full">
      {/* Header Breadcrumb */}
      <div className="border- bg-card">
        <div className="w-full mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="text-primary hover:underline cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-primary hover:underline cursor-pointer">Villas in Lonavala</span>
            <span className="mx-2">/</span>
            <span className="text-primary hover:underline cursor-pointer">Vaana in Lonavala</span>
            <span className="mx-2">/</span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="w-full mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Vaana</h1>
                  <p className="text-muted-foreground">Lonavala, Maharashtra</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                    <span className="font-medium">4.8</span>
                    <span className="text-muted-foreground">Like a 5⭐</span>
                  </div>
                  
                </div>
              </div>
              
              {/* <img 
                src={villaImage} 
                alt="Vaana Villa - Aerial view of luxury resort in Lonavala"
                className="w-full h-64 object-cover rounded-lg"
              /> */}
            </Card>

            {/* Meals Included */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Meals Included In Your Booking</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Breakfast</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Lunch</span>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Dinner</span>
                </div>
              </div>
            </Card>

            {/* Booking Details */}
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Check-in */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Check-In</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Thu 11 Sep 2025</p>
                      <p className="text-sm text-muted-foreground">(From 02:00 PM)</p>
                    </div>
                    <Badge variant="secondary" className="ml-auto">For 1 night</Badge>
                  </div>
                </div>

                {/* Check-out */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Check-Out</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-semibold">Fri 12 Sep 2025</p>
                      <p className="text-sm text-muted-foreground">(Until 11:00 AM)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Rooms */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">No. of Rooms</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <span className="font-semibold">1 Room</span>
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <h3 className="font-medium text-muted-foreground mb-2">Guests</h3>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-semibold">2 Guests</span>
                    <span className="text-muted-foreground">(2 Adults)</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Meals Description */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Meals</h2>
              <p className="text-muted-foreground mb-4">
                Wake up to a day full of delicious home-cooked vegetarian and non-vegetarian meals. 
                The package comprises lunch (the first meal after check-in), dinner, followed by breakfast (for the next day).
              </p>
              <Button variant="outline" className="text-primary">View More</Button>
              
              <div className="mt-4 p-4 bg-success-light rounded-lg">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">All meal included in your booking.</span>
                  <Info className="w-4 h-4 ml-auto" />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Price Details */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Price details</h2>
              
              <div className="space-y-4">
                <div className="p-3 bg-success-light rounded-lg">
                  <p className="text-success font-medium text-sm">
                    💚 You pay zero convenience fees on your booking!
                    <Info className="w-4 h-4 inline ml-1" />
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      Rental Charges <Info className="w-4 h-4 inline ml-1" />
                    </span>
                    <span className="font-medium">₹9,986</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-discount">Discount (ESCAPE5)</span>
                    <span className="text-discount font-medium">(-) ₹499</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">
                      GST <span className="text-xs">(As per government guidelines)</span>
                    </span>
                    <span className="font-medium">₹1,708</span>
                  </div>
                </div>

                <Separator />

                <div className="p-3 bg-success-light rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <p className="text-success font-medium text-sm">ESCAPE5</p>
                      <p className="text-success text-xs">Congrats you applied the offer</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive ml-auto">
                      Remove
                    </Button>
                  </div>
                </div>

                <div className="p-3 bg-info-light rounded-lg">
                  <p className="text-info text-sm">
                    🎫 View more coupons/ Apply Future Stay Voucher →
                  </p>
                </div>

                <Separator />

                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Payable</span>
                  <span>₹11,195</span>
                </div>

                <div className="flex items-start gap-2 pt-4">
                  <Checkbox 
                    id="terms" 
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked)}
                  />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-4">
                    I have read and accepted the{" "}
                    <span className="text-primary underline">Terms & Conditions</span>,{" "}
                    <span className="text-primary underline">Privacy Policies</span>,{" "}
                    <span className="text-primary underline">Cancellation Policy</span> and{" "}
                    <span className="text-primary underline">Indemnity Form</span>
                  </label>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={!termsAccepted}
                  onClick={() => setShowVerifyDialog(true)}
                >
                  Continue
                </Button>

                <div className="flex items-center justify-center gap-2 pt-4">
                  <Shield className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium text-success">100% Secure payment</p>
                    <p className="text-xs text-muted-foreground">Trusted by 5Lakh+ guests</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <VerifyDetailsDialog 
        open={showVerifyDialog} 
        onOpenChange={setShowVerifyDialog} 
      />
    </div>
  );
};

export default PropertyBooking;