"use client"
import Navbar from "@/components/Navbarcomponents/Navbar"
import Footer from "@/components/Footercomponents/Footer"
import { BottomNav } from "@/components/Navbarcomponents/Bootomnav"
import { AppHeader } from "@/components/Navbarcomponents/Mobilenav"
import { HeroUIProvider } from "@heroui/react"
import { usePathname } from "next/navigation"

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname()
 

  return (
    <HeroUIProvider>
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/checkout" ||
      pathname === "/search-your-gateway" ||
      pathname.startsWith("/view-villa") ? null : (
        <Navbar />
      )}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/checkout" ||
      pathname === "/account" ||
      pathname === "/search-your-gateway" ||
      pathname === "/booking" ||
      pathname.startsWith("/view-villa") ? null : (
        <AppHeader />
      )}
      {children}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/search-your-gateway" ||
      pathname === "/checkout" ||
      pathname.startsWith("/view-villa") ? null : (
        <BottomNav />
      )}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/search-your-gateway" ||
      pathname === "/category/all" ? null : (
        <Footer />
      )}
    </HeroUIProvider>
  )
}
