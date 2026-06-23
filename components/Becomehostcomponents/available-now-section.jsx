import { MobileFrame } from './mobile-frame';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AvailableNowSection() {
  return (
    <section className="w-full py-16 md:py-24 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <div className="mb-6 inline-block">
              <span className="px-4 py-2 bg-black/10 text-black rounded-full text-sm font-semibold">
                Download Now
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Thevillacamp App <br className="hidden sm:block" />Available Now
            </h2>

            <p className="text-lg text-muted-foreground mb-6 max-w-md">
              Manage your villa listings, track bookings, and connect with guests on the go. Download the Thevillacamp app to get started today.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-black">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Instant Notifications</h4>
                  <p className="text-sm text-muted-foreground">Get real-time updates on bookings and messages</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-black">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Easy Management</h4>
                  <p className="text-sm text-muted-foreground">Manage your calendar and guest requests seamlessly</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-sm font-semibold text-black">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Track Earnings</h4>
                  <p className="text-sm text-muted-foreground">Monitor your income and analytics in real-time</p>
                </div>
              </li>
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/onboarding">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-black/90 text-primary-foreground rounded-full font-semibold group w-full sm:w-auto"
                >
                  Download for iOS
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/onboarding">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-black/90 text-primary-foreground rounded-full font-semibold group w-full sm:w-auto"
                >
                  Download for Android
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right - Mobile Frame */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <MobileFrame />
          </div>
        </div>
      </div>
    </section>
  );
}
