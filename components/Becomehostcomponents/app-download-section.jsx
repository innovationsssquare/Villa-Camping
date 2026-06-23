import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Download, Apple } from 'lucide-react';

export function AppDownloadSection() {
  return (
    <section className="w-full py-20 lg:py-32 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                  AVAILABLE NOW
                </span>
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
                  Manage your hosting on the go
                </h2>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Download our mobile app to manage your listings, communicate with guests, and track earnings anytime, anywhere. Get instant notifications and real-time updates right on your device.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</span>
                    Track Bookings
                  </h3>
                  <p className="text-sm text-muted-foreground">Real-time booking updates and calendar management</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</span>
                    Guest Messages
                  </h3>
                  <p className="text-sm text-muted-foreground">Communicate instantly with guests</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</span>
                    Earnings Tracking
                  </h3>
                  <p className="text-sm text-muted-foreground">Monitor your income in real-time</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">✓</span>
                    Support Access
                  </h3>
                  <p className="text-sm text-muted-foreground">Get help from our support team 24/7</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/onboarding">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-semibold w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download for iOS
                  </Button>
                </Link>
                <Link href="/onboarding">
                  <Button 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 h-12 font-semibold w-full sm:w-auto"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download for Android
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="order-1 lg:order-2">
            <div className="relative h-96 sm:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/app-showcase.png"
                alt="Mobile app interface"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
