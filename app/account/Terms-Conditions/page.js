"use client"
import { ChevronLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const TermsConditions = () => {
  const navigate = useRouter();

  const handleBackClick = () => {
    navigate.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-200">
          <div className="flex items-center gap-4 px-mobile py-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Terms & Conditions</h1>
          </div>
        </div>

        <div className="px-2 py-2 space-y-6">
          {/* Last Updated Card */}
          <Card className="border border-gray-300">
            <CardHeader>
              <CardTitle className="text-lg">Agreement Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Last updated: September 21, 2025
              </p>
              <p className="text-foreground text-sm leading-relaxed mt-2">
                By using our travel booking platform, you agree to these terms and conditions. 
                Please read them carefully before using our services.
              </p>
            </CardContent>
          </Card>

          {/* Terms Accordion */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <Accordion type="single" collapsible className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <AccordionItem value="acceptance" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">1. Acceptance of Terms</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      By accessing and using this travel booking platform, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                    <p>
                      If you do not agree to abide by the above, please do not use this service.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="booking" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">2. Booking & Reservations</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      All bookings are subject to availability and confirmation of the booking price.
                    </p>
                    <p>
                      We reserve the right to refuse any booking request for any reason at our sole discretion.
                    </p>
                    <p>
                      Booking confirmations will be sent via email within 24 hours of your reservation.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">3. Payment Terms</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      Payment is required at the time of booking unless otherwise specified.
                    </p>
                    <p>
                      We accept major credit cards, debit cards, and digital payment methods.
                    </p>
                    <p>
                      All payments are processed securely through encrypted payment gateways.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancellation" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">4. Cancellation Policy</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      Cancellation policies vary by accommodation and booking type.
                    </p>
                    <p>
                      Free cancellation is available for select bookings up to 24-48 hours before check-in.
                    </p>
                    <p>
                      Refund processing may take 5-10 business days depending on your payment method.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="liability" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">5. Limitation of Liability</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      We act as an intermediary between travelers and accommodation providers.
                    </p>
                    <p>
                      Our liability is limited to the total amount paid for your booking.
                    </p>
                    <p>
                      We are not responsible for issues arising from third-party service providers.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="conduct" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">6. User Conduct</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      You agree to use our platform in compliance with all applicable laws and regulations.
                    </p>
                    <p>
                      Fraudulent activities, false information, or misuse of our services is strictly prohibited.
                    </p>
                    <p>
                      We reserve the right to suspend or terminate accounts that violate these terms.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Card */}
          <Card className="border border-gray-300" style={{ animationDelay: "0.2s" }}>
            <CardContent className="">
              <h3 className="font-medium-weight text-foreground mb-2">Questions?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you have any questions about these Terms & Conditions, please contact our support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;