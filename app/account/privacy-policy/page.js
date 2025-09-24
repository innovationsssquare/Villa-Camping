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

const PrivacyPolicy = () => {
  const navigate = useRouter();

  const handleBackClick = () => {
    navigate.back();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full  mx-auto bg-background min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-gray-300">
          <div className="flex items-center gap-4 px-mobile py-4">
            <button
              onClick={handleBackClick}
              className="p-2 hover:bg-secondary/50 rounded-xl transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Privacy Policy</h1>
          </div>
        </div>

        <div className="px-2 py-2 space-y-6">
          {/* Privacy Overview Card */}
          <Card className="border border-gray-300 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Your Privacy Matters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Last updated: September 21, 2025
              </p>
              <p className="text-foreground text-sm leading-relaxed mt-2">
                We are committed to protecting your privacy and ensuring the security of your personal information. 
                This policy explains how we collect, use, and safeguard your data.
              </p>
            </CardContent>
          </Card>

          {/* Privacy Accordion */}
          <div className="" style={{ animationDelay: "0.1s" }}>
            <Accordion type="single" collapsible className="bg-card rounded-2xl shadow-soft overflow-hidden">
              <AccordionItem value="collection" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">1. Information We Collect</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">Personal Information:</p>
                    <p>• Name, email address, phone number, and billing address</p>
                    <p>• Travel preferences and booking history</p>
                    <p>• Payment information (processed securely by third-party providers)</p>
                    
                    <p className="font-medium text-foreground mt-4">Technical Information:</p>
                    <p>• Device information, IP address, and browser type</p>
                    <p>• Usage data and interaction patterns on our platform</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="usage" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">2. How We Use Your Information</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>• Process and manage your travel bookings</p>
                    <p>• Provide customer support and respond to inquiries</p>
                    <p>• Send booking confirmations and travel updates</p>
                    <p>• Improve our services and personalize your experience</p>
                    <p>• Comply with legal obligations and prevent fraud</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sharing" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">3. Information Sharing</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">We share your information with:</p>
                    <p>• Travel service providers (hotels, airlines) to complete your bookings</p>
                    <p>• Payment processors for secure transaction handling</p>
                    <p>• Legal authorities when required by law</p>
                    
                    <p className="font-medium text-foreground mt-4">We never:</p>
                    <p>• Sell your personal information to third parties</p>
                    <p>• Share data for marketing purposes without consent</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">4. Data Security</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>• SSL encryption for all data transmission</p>
                    <p>• Secure servers with regular security monitoring</p>
                    <p>• Limited access to personal data on a need-to-know basis</p>
                    <p>• Regular security audits and vulnerability assessments</p>
                    <p>• Immediate notification of any data breaches</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cookies" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">5. Cookies & Tracking</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground">Essential Cookies:</p>
                    <p>• Required for basic platform functionality</p>
                    <p>• Session management and security features</p>
                    
                    <p className="font-medium text-foreground mt-4">Optional Cookies:</p>
                    <p>• Analytics to improve user experience</p>
                    <p>• Personalization and preference storage</p>
                    <p>You can manage cookie preferences in your browser settings.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rights" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">6. Your Rights</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>• Access and review your personal information</p>
                    <p>• Request corrections to inaccurate data</p>
                    <p>• Delete your account and associated data</p>
                    <p>• Download your data in a portable format</p>
                    <p>• Opt-out of marketing communications</p>
                    <p>• Withdraw consent for data processing</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="retention" className="border-b border-gray-200 last:border-b-0">
                <AccordionTrigger className="px-6 py-4 hover:bg-secondary/30 transition-colors">
                  <span className="font-medium-weight text-left">7. Data Retention</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <p>• Account information: Retained while your account is active</p>
                    <p>• Booking data: Kept for 7 years for legal and tax purposes</p>
                    <p>• Marketing data: Removed immediately upon opt-out</p>
                    <p>• Inactive accounts: Deleted after 3 years of inactivity</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Contact Card */}
          <Card className={"border border-gray-300"} style={{ animationDelay: "0.2s" }}>
            <CardContent className="">
              <h3 className="font-medium-weight text-foreground mb-2">Privacy Questions?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For any privacy-related questions or to exercise your rights, contact our team
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;