"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Cookie, ChevronDown, Globe, AlertTriangle } from "lucide-react";
import {
  detectThirdPartyCookieSupport,
  getCookieConsent,
  setCookieConsent,
  loadThirdPartyScripts,
  isConsentNeeded,
  getThirdPartyCookieInstructions,
  CookieConsentState,
  ThirdPartyCookieSupport,
} from "@/lib/cookieUtils";

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [thirdPartySupport, setThirdPartySupport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [consent, setConsent] = useState({
    thirdParty: false,
  });

  useEffect(() => {
    checkCookieStatus();
  }, []);

  const checkCookieStatus = async () => {
    setIsLoading(true);

    // Check if consent is needed
    if (!isConsentNeeded()) {
      setIsLoading(false);
      return;
    }

    // Detect third-party cookie support
    const support = await detectThirdPartyCookieSupport();
    setThirdPartySupport(support);

    // Show the consent drawer
    setIsOpen(true);
    setIsLoading(false);
  };

  const handleEnable = () => {
    if (thirdPartySupport?.isBlocked) {
      setShowDetails(true);
      return;
    }
    const newConsent = {
      thirdParty: thirdPartySupport?.canSetThirdParty || false,
    };

    setCookieConsent(newConsent);
    loadThirdPartyScripts(newConsent);
    setIsOpen(false);
  };

  const handleDisable = () => {
    const newConsent = {
      thirdParty: false,
    };

    setCookieConsent(newConsent);
    setIsOpen(false);
  };

  const handleToggle = () => {
    const newValue =
      !consent.thirdParty && (thirdPartySupport?.canSetThirdParty || false);
    const finalConsent = {
      thirdParty: newValue,
    };

    setConsent(finalConsent);
    setCookieConsent(finalConsent);
    loadThirdPartyScripts(finalConsent);
    setIsOpen(false);
  };

  const updateConsent = (key, value) => {
    setConsent((prev) => ({ ...prev, [key]: value }));
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Firefox";
    if (userAgent.includes("Safari")) return "Safari";
    if (userAgent.includes("Edge")) return "Edge";
    return "Browser";
  };

  const instructions = getThirdPartyCookieInstructions();
  const browserName = getBrowserName();

  if (isLoading) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="mx-auto max-w-sm md:max-w-2xl h-full border-cookie-border bg-white">
        <DrawerHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cookie-secondary/20">
            <Cookie className="h-8 w-8 text-cookie-secondary" />
          </div>
          <DrawerTitle className="text-xl font-bold text-foreground">
            Third-Party Cookies
          </DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground max-w-md mx-auto">
            Enable third-party cookies to allow external services and
            integrations to function properly.
          </DrawerDescription>

          {thirdPartySupport?.isBlocked && (
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-medium text-orange-800">
                    Third-party cookies are blocked
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Some features may not work properly. Enable third-party
                    cookies in your {browserName} settings for the best
                    experience.
                  </p>
                </div>
              </div>
            </div>
          )}
        </DrawerHeader>

        <div className="px-6">
          {/* Third-party Cookies */}
          <div className="mb-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="font-medium">Third-party Cookies</span>
                {thirdPartySupport?.isBlocked && (
                  <Badge variant="destructive" className="text-xs">
                    Blocked
                  </Badge>
                )}
              </div>
              <Switch
                checked={consent.thirdParty && !thirdPartySupport?.isBlocked}
                onCheckedChange={(value) => {
                  if (value && thirdPartySupport?.isBlocked) {
                    setShowDetails(true);
                    return;
                  }
                  updateConsent("thirdParty", value);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Allow external services to set cookies for enhanced functionality
              and integrations.
            </p>

            {thirdPartySupport?.isBlocked && (
              <Collapsible open={showDetails} onOpenChange={setShowDetails}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-cookie-primary mt-2 hover:underline">
                  How to enable third-party cookies{" "}
                  <ChevronDown className="h-3 w-3" />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-2 bg-muted/30 rounded text-xs">
                  <p className="font-medium mb-1">For {browserName}:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    {instructions[browserName]?.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </div>

        <DrawerFooter className="gap-2 pt-4">
          <div className="flex flex-col md:flex-row gap-2 w-full">
            <Button
              onClick={handleEnable}
              className="w-full bg-black hover:bg-cookie-black text-white"
            >
              Enable Third-Party Cookies
            </Button>
            <Button
              variant="outline"
              onClick={handleDisable}
              className="w-full border-cookie-primary text-cookie-primary hover:bg-cookie-primary/10"
            >
              Disable
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
