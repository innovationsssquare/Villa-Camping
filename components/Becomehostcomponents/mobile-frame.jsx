'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Home, Plus, User, Settings } from 'lucide-react';
import logo from "../../public/Productasset/Logoicon.png";

export function MobileFrame() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative mx-auto" style={{ width: '320px', height: '640px' }}>
      {/* iPhone Frame */}
      <div className="absolute inset-0 bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-900">
        {/* Screen Content */}
        <div className="relative w-full h-full bg-gradient-to-b from-white to-white overflow-hidden">
          {/* Status Bar */}
          <div className="h-8 bg-black flex items-center justify-between px-6 text-white text-xs">
            <span>9:41</span>
            <div className="flex gap-1">
              <span>📡</span>
              <span>🔋</span>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100%-32px)] flex flex-col items-center justify-center px-6 py-8">
            {/* Animated Logo */}
            <div
              className="mb-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'scale(1)' : 'scale(0.5)',
                transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <Image
                src={logo}
                alt="Thevillacamp"
                width={80}
                height={80}
                className="rounded-2xl"
              />
            </div>

            {/* Animated Text */}
            <div
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.8s ease-out 0.2s',
              }}
            >
              <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                Thevillacamp
              </h2>
              <p className="text-xs text-center text-muted-foreground mb-6">
                Your Premium Villas Guide
              </p>
            </div>

            {/* Feature Icons */}
            <div
              className="flex gap-8 mt-8 mb-8"
              style={{
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out 0.4s',
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                  <Home className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-muted-foreground">Browse</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-muted-foreground">List</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs text-muted-foreground">Manage</span>
              </div>
            </div>

            {/* Download Text */}
            <p
              className="text-xs text-center text-muted-foreground"
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.8s ease-out 0.6s',
              }}
            >
              Download the app to get started
            </p>
          </div>

          {/* Bottom Navigation */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur border-t border-border flex justify-around items-center px-4">
            <button className="flex flex-col items-center gap-1">
              <Home className="w-5 h-5 text-black" />
              <span className="text-xs font-semibold text-black">Home</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Plus className="w-5 h-5 text-black" />
              <span className="text-xs text-black">List</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Profile</span>
            </button>
            <button className="flex flex-col items-center gap-1">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl z-10" />
    </div>
  );
}
