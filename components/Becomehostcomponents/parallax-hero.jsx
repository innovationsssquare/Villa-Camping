'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import heroimg from "../../public/Productasset/hero-home.png";
export function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const scrollProgress = Math.max(0, -rect.top / (rect.height * 0.5));
        setScrollY(Math.min(scrollProgress * 50, 100));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={heroRef} className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-white via-white to-white pt-32">
      {/* Parallax Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <Image
          src={heroimg}
          alt="Luxury villa background"
          fill
          className="object-cover opacity-20"
          priority
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute top-10 left-10 w-32 h-32 sm:w-48 sm:h-48 bg-black rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          style={{
            animation: 'float 6s ease-in-out infinite',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div 
          className="absolute bottom-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          style={{
            animation: 'float 8s ease-in-out infinite 2s',
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-screen flex items-center justify-center md:justify-between">
        {/* Left Content */}
        <div 
          className="w-full md:w-1/2 text-center md:text-left"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1s ease-out',
          }}
        >
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-[#ff6900]/70  text-black rounded-full text-sm font-semibold">
              Premium Luxury Villas
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
            Set up your villa listing
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-lg mx-auto md:mx-0">
            Join thousands of hosts earning premium income. Showcase your luxury villa and connect with travelers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/onboarding">
              <Button 
                size="lg" 
                className="bg-black hover:bg-black/90 text-primary-foreground rounded-full font-semibold group w-full sm:w-auto"
              >
                Start Hosting
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              className="rounded-full font-semibold border-2"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-black">₹5L+</div>
              <p className="text-sm text-muted-foreground">Avg monthly earning</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-black">100+</div>
              <p className="text-sm text-muted-foreground">Active hosts</p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-black">98%</div>
              <p className="text-sm text-muted-foreground">Guest satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Visual - Animated Image */}
        <div 
          className="hidden md:block w-1/2 relative h-full"
          style={{
            transform: `translateY(${scrollY * -0.3}px) scale(${1 - scrollY * 0.001})`,
            transition: 'transform 0.1s ease-out',
            opacity: isVisible ? 1 : 0,
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-4/5 h-4/5">
              <Image
          src={heroimg}
                alt="Luxury villa showcase"
                fill
                className="object-cover rounded-3xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-background/50 to-transparent" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce"
        style={{
          opacity: Math.max(0, 1 - scrollY * 0.02),
        }}
      >
        <svg className="w-6 h-6 text-black" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
      `}</style>
    </div>
  );
}
