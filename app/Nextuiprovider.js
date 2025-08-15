"use client";
import Navbar from "@/components/Navbarcomponents/Navbar";
import Footer from "@/components/Footercomponents/Footer";
import { BottomNav } from "@/components/Navbarcomponents/Bootomnav";
import { AppHeader } from "@/components/Navbarcomponents/Mobilenav";
import { HeroUIProvider } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname();
  


  return (
    <HeroUIProvider>
    {pathname === "/Signin" || pathname==="/shorts" || pathname==="/date-selection" || pathname==="/search-stay" ?  null : (
        <Navbar />
      )}
    {pathname === "/Signin" || pathname==="/shorts" || pathname==="/date-selection" || pathname==="/search-stay" ? null : (
      <AppHeader/>
      )}
      {children}
      {pathname === "/Signin" || pathname==="/shorts" || pathname==="/date-selection" || pathname==="/search-stay" ? null : (
      <BottomNav/>
      )}
      {pathname === "/Signin" || pathname==="/shorts" || pathname==="/date-selection" || pathname==="/search-stay" ? null : (
      <Footer/>
      )}
    </HeroUIProvider>
  );
}
