"use client"
import Navbar from "@/components/Navbarcomponents/Navbar"
import Footer from "@/components/Footercomponents/Footer"
import { BottomNav } from "@/components/Navbarcomponents/Bootomnav"
import { AppHeader } from "@/components/Navbarcomponents/Mobilenav"
import { HeroUIProvider } from "@heroui/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ResponsiveAuthModal from "@/components/Logincomponents/responsive-auth-modal"

export function NextuiProviderWrapper({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [redirectPath, setRedirectPath] = useState("/")

  useEffect(() => {
    const authRequired = searchParams.get("auth") === "required"
    const redirect = searchParams.get("redirect")

    if (authRequired) {
      setShowAuthModal(true)
      setRedirectPath(redirect || "/")
      // Clean up URL parameters
      const url = new URL(window.location.href)
      url.searchParams.delete("auth")
      url.searchParams.delete("redirect")
      window.history.replaceState({}, "", url.toString())
    }
  }, [searchParams])

  const handleModalClose = (isAuthenticated = false) => {
    setShowAuthModal(false)
    if (isAuthenticated) {
      // Redirect to the originally requested page
      router.push(redirectPath)
    } else {
      // Stay on home page if user cancels auth
      router.push("/")
    }
  }

  return (
    <HeroUIProvider>
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/checkout" ||
      pathname.startsWith("/view-villa") ? null : (
        <Navbar />
      )}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/checkout" ||
      pathname === "/account" ||
      pathname === "/booking" ||
      pathname.startsWith("/view-villa") ? null : (
        <AppHeader />
      )}
      <ResponsiveAuthModal autoOpen={showAuthModal} onOpenChange={handleModalClose} />
      {children}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/checkout" ||
      pathname.startsWith("/view-villa") ? null : (
        <BottomNav />
      )}
      {pathname === "/Signin" ||
      pathname === "/shorts" ||
      pathname === "/date-selection" ||
      pathname === "/search-stay" ||
      pathname === "/category/all" ? null : (
        <Footer />
      )}
    </HeroUIProvider>
  )
}
