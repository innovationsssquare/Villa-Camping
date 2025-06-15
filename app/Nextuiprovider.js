"use client";
import Navbar from "@/components/Navbarcomponents/Navbar";
import Footer from "@/components/Footercomponents/Footer";
import { BottomNav } from "@/components/Navbarcomponents/Bootomnav";
import { AppHeader } from "@/components/Navbarcomponents/Mobilenav";
import { HeroUIProvider } from "@heroui/react";
import { usePathname } from "next/navigation";
import Joyride from "@/components/Homecomponets/joyride";
import { useEffect, useState } from "react";

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname();
  


  return (
    <HeroUIProvider>
    {pathname === "/Signin" ? null : (
        <Navbar />
      )}
    {pathname === "/Signin" ? null : (
      <AppHeader/>
      )}
      <Joyride/>
      {children}
      {pathname === "/Signin" ? null : (
      <BottomNav/>
      )}
      {pathname === "/Signin" || pathname==="/seller" ? null : (
      <Footer/>
      )}
    </HeroUIProvider>
  );
}
