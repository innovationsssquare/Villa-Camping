"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StickyTabsNavigation({ onTabChange }) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isSticky, setIsSticky] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabsRef = useRef(null)
  const tabsContainerRef = useRef(null)
  const tabRefs = useRef({})
  const observerRef = useRef(null)
  const sectionRefs = useRef({})

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "highlights", label: "Highlights" },
    { id: "refund-policy", label: "Refund Policy" },
    { id: "spaces", label: "Spaces" },
    { id: "reviews", label: "Reviews" },
    { id: "amenities", label: "Amenities" },
    { id: "meals", label: "Meals" },
    { id: "location", label: "Location" },
    { id: "experiences", label: "Experiences" },
    { id: "faqs", label: "FAQ's" },
  ]

  // Update indicator position smoothly with better calculation
  const updateIndicator = (tabId) => {
    const tabElement = tabRefs.current[tabId]
    const tabsContainer = tabsContainerRef.current

    if (tabElement && tabsContainer) {
      // Get the bounding rectangles
      const containerRect = tabsContainer.getBoundingClientRect()
      const tabRect = tabElement.getBoundingClientRect()

      // Calculate position relative to the tabs container
      const left = tabRect.left - containerRect.left
      const width = tabRect.width

      setIndicatorStyle({
        left: left,
        width: width,
      })
    }
  }

  useEffect(() => {
    // Find and store section elements
    tabs.forEach((tab) => {
      const element = document.getElementById(tab.id)
      if (element) {
        sectionRefs.current[tab.id] = element
      }
    })

    // Intersection Observer for scroll spy
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: [0, 0.1, 0.5, 1],
    }

    observerRef.current = new IntersectionObserver((entries) => {
      let mostVisibleSection = ""
      let maxIntersectionRatio = 0

      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxIntersectionRatio) {
          maxIntersectionRatio = entry.intersectionRatio
          mostVisibleSection = entry.target.id
        }
      })

      if (!mostVisibleSection) {
        const scrollY = window.scrollY + 200
        let closestSection = ""
        let minDistance = Number.POSITIVE_INFINITY

        Object.entries(sectionRefs.current).forEach(([id, element]) => {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const distance = Math.abs(elementTop - scrollY)

          if (distance < minDistance) {
            minDistance = distance
            closestSection = id
          }
        })

        mostVisibleSection = closestSection
      }

      if (mostVisibleSection && mostVisibleSection !== activeTab) {
        setActiveTab(mostVisibleSection)
        // Delay indicator update to ensure DOM is ready
        setTimeout(() => updateIndicator(mostVisibleSection), 50)
        onTabChange?.(mostVisibleSection)
      }
    }, observerOptions)

    // Observe all sections
    Object.values(sectionRefs.current).forEach((element) => {
      if (observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    // Sticky behavior
    const handleScroll = () => {
      if (tabsRef.current) {
        const shouldBeSticky = window.scrollY > 600
        if (shouldBeSticky !== isSticky) {
          setIsSticky(shouldBeSticky)
          // Update indicator position after sticky state changes
          setTimeout(() => updateIndicator(activeTab), 100)
        }
      }
    }

    // Handle resize to recalculate indicator position
    const handleResize = () => {
      setTimeout(() => updateIndicator(activeTab), 100)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize, { passive: true })

    handleScroll()

    // Initial indicator position with delay to ensure DOM is ready
    const initIndicator = () => {
      setTimeout(() => updateIndicator(activeTab), 200)
    }

    initIndicator()

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [activeTab, onTabChange, isSticky])

  const scrollToSection = (tabId) => {
    const element = sectionRefs.current[tabId] || document.getElementById(tabId)
    if (element) {
      const offset = isSticky ? 80 : 180
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })

      setActiveTab(tabId)
      // Update indicator immediately for better UX
      setTimeout(() => updateIndicator(tabId), 50)
    }
  }

  return (
    <div
      ref={tabsRef}
      className={`bg-white border-b border-gray-200 transition-all duration-500 ease-out z-40 ${
        isSticky
          ? "fixed top-16 left-0 right-0 shadow-sm backdrop-blur-md bg-white/95 transform translate-y-0"
          : "relative transform translate-y-0"
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Tabs with hidden scrollbar */}
          <div
            ref={tabsContainerRef}
            className="flex space-x-0 overflow-x-auto relative"
            style={{
              /* Hide scrollbar for Chrome, Safari and Opera */
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* Internet Explorer 10+ */,
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                ref={(el) => {
                  if (el) {
                    tabRefs.current[tab.id] = el
                    // Update indicator when ref is set and this is the active tab
                    if (tab.id === activeTab) {
                      setTimeout(() => updateIndicator(tab.id), 50)
                    }
                  }
                }}
                onClick={() => scrollToSection(tab.id)}
                className={`px-4 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ease-out relative z-10 ${
                  activeTab === tab.id
                    ? "text-black transform scale-105"
                    : "text-gray-700 hover:text-black hover:transform hover:scale-102"
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Smooth sliding indicator with better positioning */}
            <div
              className="absolute bottom-0 h-0.5 bg-black transition-all duration-500 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
                transform: "translateZ(0)", // Force GPU acceleration
                boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
              }}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 bg-transparent transition-all duration-300 hover:bg-blue-50 hover:border-blue-300"
            >
              <span className="text-sm">Menu</span>
              <ChevronDown className="w-4 h-4 transition-transform duration-300 hover:rotate-180" />
            </Button>
          </div>
        </div>
      </div>

      {/* Animated sticky indicator */}
      {/* <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out ${
          isSticky ? "opacity-100 transform scale-x-100" : "opacity-0 transform scale-x-0"
        }`}
        style={{
          transformOrigin: "center",
        }}
      /> */}

      {/* Subtle glow effect when sticky */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent transition-all duration-500 ease-out ${
          isSticky ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  )
}
