"use client";

import { useState, useEffect } from "react";
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LogIn, Loader2, MessageSquare, ShieldCheck, ArrowRight, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Logoicon from "@/public/Productasset/Logoicon.png";
import Image from "next/image";
import { addToast, Button } from "@heroui/react";
import { getDeviceId } from "@/lib/deviceId";
import { BaseUrl } from "@/lib/API/Baseurl";
import { getAuthCookieOptions } from "@/lib/authCookies";

const ResponsiveAuthModal = ({
  autoOpen = false,
  open: controlledOpen,
  onOpenChange,
  returnUrl,
  trigger,
}) => {
  const [appleLoading, setAppleLoading] = useState(false);
  const [truecallerLoading, setTruecallerLoading] = useState(false);
  const [internalOpen, setInternalOpen] = useState(autoOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (autoOpen) {
      setInternalOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOpenChange = (newOpen) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  const cleanPhoneNumber = (raw) => {
    let clean = (raw || "").replace(/[\s+-]/g, "");
    if (clean.startsWith("91") && clean.length === 12) {
      clean = clean.slice(2);
    }
    return clean;
  };

  const handleAppleLogin = async () => {
    setAppleLoading(true);
    try {
      const provider = new OAuthProvider("apple.com");
      const result = await signInWithPopup(auth, provider);
      const credential = OAuthProvider.credentialFromResult(result);
      const idToken = credential?.idToken;
      if (!idToken) throw new Error("Apple ID Token is missing");

      // 1. Authenticate with Express backend
      const res = await fetch(`${BaseUrl}/auth/apple`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityToken: idToken,
          role: "user",
        }),
      });
      if (!res.ok) throw new Error("Backend authentication failed");
      const backendData = await res.json();

      // 2. Establish local Next.js session
      const localRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: backendData.token, user: backendData.user }),
      });
      if (!localRes.ok) throw new Error("Local session creation failed");
      const data = await localRes.json();

      if (data.user?._id) {
        localStorage.setItem("thevilla_user_id", data.user._id);
      }
      if (data.user) {
        localStorage.setItem("thevilla_user", JSON.stringify(data.user));
      }
      Cookies.set("token", data.token, getAuthCookieOptions());
      setOpen(false);
      addToast({
        title: "Welcome!",
        description: "Logged in successfully with Apple",
        color: "success",
      });
      setTimeout(() => {
        onOpenChange?.(false);
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.location.reload();
        }
      }, 100);
    } catch (err) {
      addToast({
        title: "Apple Login Failed",
        description: "Apple sign in failed. Please try again or use WhatsApp OTP.",
        color: "danger",
      });
      console.error("Apple login failed:", err);
    } finally {
      setAppleLoading(false);
    }
  };

  const handleTruecallerLogin = async () => {
    setTruecallerLoading(true);
    try {
      const deviceId = getDeviceId();
      const requestId =
        Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

      const checkProfile = async () => {
        try {
          const res = await fetch(
            `${BaseUrl}/auth/truecaller/check?requestId=${requestId}`
          );
          if (res.ok) {
            const data = await res.json();
            if (data.status === "completed" && data.token) {
              const localRes = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: data.token, user: data.user }),
              });
              if (!localRes.ok) throw new Error("Local session creation failed");
              const localData = await localRes.json();

              if (localData.user?._id) {
                localStorage.setItem("thevilla_user_id", localData.user._id);
              }
              if (localData.user) {
                localStorage.setItem("thevilla_user", JSON.stringify(localData.user));
              }
              Cookies.set("token", localData.token, getAuthCookieOptions());
              setOpen(false);
              addToast({
                title: "Welcome back!",
                description: "Logged in successfully with Truecaller",
                color: "success",
              });
              setTimeout(() => {
                onOpenChange?.(false);
                if (returnUrl) {
                  window.location.href = returnUrl;
                } else {
                  window.location.reload();
                }
              }, 100);
              return true;
            }
          }
        } catch {
          // ignore polling check errors
        }
        return false;
      };

      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${requestId}&partnerKey=YOUR_PARTNER_KEY`;

        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const success = await checkProfile();
          if (success || attempts > 20) {
            clearInterval(interval);
            setTruecallerLoading(false);
          }
        }, 2000);
      } else {
        const dummyNumber = "919999999999";
        const res = await fetch(`${BaseUrl}/auth/truecaller/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: dummyNumber,
            name: "Truecaller User",
            deviceId,
            role: "user",
          }),
        });

        if (!res.ok) throw new Error("Verification failed");
        const backendData = await res.json();

        const localRes = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: backendData.token, user: backendData.user }),
        });
        if (!localRes.ok) throw new Error("Local session creation failed");
        const data = await localRes.json();

        if (data.user?._id) {
          localStorage.setItem("thevilla_user_id", data.user._id);
        }
        if (data.user) {
          localStorage.setItem("thevilla_user", JSON.stringify(data.user));
        }
        Cookies.set("token", data.token, getAuthCookieOptions());
        setOpen(false);
        addToast({
          title: "Welcome!",
          description: "Logged in successfully via Truecaller",
          color: "success",
        });
        setTimeout(() => {
          onOpenChange?.(false);
          if (returnUrl) {
            window.location.href = returnUrl;
          } else {
            window.location.reload();
          }
        }, 100);
      }
    } catch (err) {
      console.error(err);
      addToast({
        title: "Login Error",
        description: "Could not complete Truecaller login.",
        color: "danger",
      });
    } finally {
      setTruecallerLoading(false);
    }
  };

  const handleSendOTP = async () => {
    const rawNumber = cleanPhoneNumber(phone);
    if (rawNumber.length !== 10) {
      addToast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
        color: "warning",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/whatsapp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: rawNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      setCountdown(60);
      addToast({
        title: "OTP Sent!",
        description: `Code sent to WhatsApp on +91 ${rawNumber}`,
        color: "success",
      });
    } catch (err) {
      addToast({
        title: "Error Sending OTP",
        description: err.message || "Something went wrong. Try again.",
        color: "danger",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 6) {
      addToast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit verification code.",
        color: "warning",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const deviceId = getDeviceId();
      const rawNumber = cleanPhoneNumber(phone);

      const res = await fetch(`${BaseUrl}/auth/whatsapp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: rawNumber,
          code: otp,
          deviceId,
          role: "user",
        }),
      });

      const backendData = await res.json();
      if (!res.ok) throw new Error(backendData.message || "Invalid OTP code");

      const localRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: backendData.token, user: backendData.user }),
      });
      if (!localRes.ok) throw new Error("Local session creation failed");
      const data = await localRes.json();

      if (data.user?._id) {
        localStorage.setItem("thevilla_user_id", data.user._id);
      }
      if (data.user) {
        localStorage.setItem("thevilla_user", JSON.stringify(data.user));
      }
      Cookies.set("token", data.token, getAuthCookieOptions());
      setOpen(false);
      addToast({
        title: "Welcome!",
        description: "Logged in successfully",
        color: "success",
      });

      setTimeout(() => {
        onOpenChange?.(false);
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.location.reload();
        }
      }, 100);
    } catch (err) {
      addToast({
        title: "Verification Failed",
        description: err.message || "Incorrect verification code. Please try again.",
        color: "danger",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // The login form (right column or mobile drawer content)
  const FormContent = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Image src={Logoicon} alt="ThevillaCamp" className="h-6 w-auto" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff6900]">
            ThevillaCamp
          </span>
        </div>
        <p className="text-xs text-neutral-500 font-medium">Login / Signup</p>
        <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-0.5">
          Welcome to ThevillaCamp
        </h3>
      </div>

      {/* WhatsApp OTP Phone Flow */}
      <div className="space-y-3 pt-1">
        {!otpSent ? (
          <div className="space-y-3">
            <div className="flex rounded-xl border border-neutral-300 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 overflow-hidden transition-all bg-white shadow-2xs">
              <div className="px-3 py-2.5 bg-neutral-50 border-r border-neutral-200 flex items-center gap-1 text-xs font-bold text-neutral-700">
                <span>🇮🇳 +91</span>
              </div>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="flex-1 px-3 py-2.5 text-sm outline-none text-neutral-900 placeholder:text-neutral-400 font-medium bg-transparent"
              />
            </div>

            <Button
              onPress={handleSendOTP}
              disabled={otpLoading || cleanPhoneNumber(phone).length !== 10}
              className="w-full h-11 bg-[#131927] hover:bg-[#1f293d] text-white font-bold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {otpLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Continue"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-600 px-1">
              <span>Code sent to <strong className="text-neutral-900">+91 {cleanPhoneNumber(phone)}</strong></span>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className="text-[#ff6900] hover:underline font-semibold"
              >
                Change
              </button>
            </div>
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-11 px-3 rounded-xl border-2 border-orange-300 focus:outline-none focus:ring-2 focus:ring-[#ff6900] text-center tracking-[0.4em] text-neutral-900 bg-white text-lg font-bold shadow-2xs"
              maxLength={6}
              autoFocus
            />
            <Button
              onPress={handleVerifyOTP}
              disabled={otpLoading || otp.length < 6}
              className="w-full h-11 bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold text-sm rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {otpLoading ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Verify & Continue"}
            </Button>
            <div className="text-center text-xs text-neutral-500">
              {countdown > 0 ? (
                <span>Resend in <strong className="text-neutral-800">{countdown}s</strong></span>
              ) : (
                <button
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="text-[#ff6900] hover:underline font-semibold"
                >
                  Resend WhatsApp Code
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-neutral-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white px-2 text-neutral-400 font-semibold tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      {/* Secondary Quick Logins */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          onPress={handleTruecallerLogin}
          disabled={truecallerLoading || appleLoading || otpLoading}
          className="h-10 bg-[#0087FF] hover:bg-[#0070d6] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
        >
          {truecallerLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          <span>Truecaller</span>
        </Button>

        <Button
          onPress={handleAppleLogin}
          disabled={truecallerLoading || appleLoading || otpLoading}
          className="h-10 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-2xs"
        >
          {appleLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          )}
          <span>Apple ID</span>
        </Button>
      </div>

      {/* Footer Disclaimer */}
      <p className="text-[10px] text-center text-neutral-400 leading-tight pt-1">
        By signing up, you agree to our{" "}
        <a href="/terms-of-service" className="underline text-neutral-600 hover:text-neutral-900 font-medium">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="underline text-neutral-600 hover:text-neutral-900 font-medium">
          Privacy Policy
        </a>
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className="max-w-md mx-auto bg-white border-none rounded-t-3xl p-6">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Login to ThevillaCamp</DrawerTitle>
            <DrawerDescription>Enter your mobile number to sign in</DrawerDescription>
          </DrawerHeader>
          <FormContent />
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl">
        <div className="flex w-full min-h-[440px]">
          {/* Left Column: StayVista-Inspired Luxury Villa Visual */}
          <div className="hidden md:flex flex-col justify-between w-1/2 relative p-8 bg-neutral-950 overflow-hidden text-white">
            <div className="absolute inset-0 -z-10">
              <img
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80"
                alt="Luxury Villa Getaway"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/60" />
            </div>

            {/* Top Logo */}
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff6900]" />
                ThevillaCamp
              </span>
            </div>

            {/* Bottom Copy */}
            <div className="space-y-3">
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight drop-shadow-sm">
                Book a Stay.<br />Enjoy A Villa Getaway
              </h2>
              <p className="text-xs text-neutral-200 leading-relaxed max-w-xs">
                Enjoy the Luxuries & Privacy of private pools, manicured lawns & personalized concierge service.
              </p>
              <div className="inline-block px-3 py-1 rounded-full border border-dashed border-white/60 text-[11px] font-bold tracking-wide backdrop-blur-xs bg-white/10 text-orange-200">
                Stays Starting at ₹4,999*
              </div>
            </div>
          </div>

          {/* Right Column: Clean Login & Signup Form */}
          <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-white">
            <FormContent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveAuthModal;
