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
import { LogIn, Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Logoicon from "@/public/Productasset/Logoicon.png";
import Image from "next/image";
import { addToast, Button } from "@heroui/react";
import { getDeviceId } from "@/lib/deviceId";
import { BaseUrl } from "@/lib/API/Baseurl";
import { getAuthCookieOptions } from "@/lib/authCookies";

const ResponsiveAuthModal = ({ autoOpen = false, onOpenChange, returnUrl }) => {
  const [appleLoading, setAppleLoading] = useState(false);
  const [truecallerLoading, setTruecallerLoading] = useState(false);
  const [open, setOpen] = useState(autoOpen);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
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
    if (!newOpen) {
      setOpen(newOpen);
      onOpenChange?.(false);
    }
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
      Cookies.set("token", data.token, getAuthCookieOptions());
      setOpen(false);
      addToast({
        title: "Welcome!",
        description: "Logged in successfully with Apple",
        color: "success",
      });
      setTimeout(() => {
        onOpenChange?.(true);
        if (returnUrl) {
          window.location.href = returnUrl;
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

  const handleSendOTP = async () => {
    const rawClean = cleanPhoneNumber(phone);
    if (!rawClean || rawClean.length !== 10) {
      addToast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number",
        color: "danger",
      });
      return;
    }
    setOtpLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `91${rawClean}`, role: "user" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      addToast({
        title: "OTP Sent via WhatsApp",
        description: data.message || `A 6-digit OTP code has been sent to +91 ${rawClean}`,
        color: "success",
      });
      setOtpSent(true);
      setCountdown(60);
    } catch (err) {
      addToast({
        title: "Failed to send OTP",
        description: err.message || "Something went wrong. Please check your phone number.",
        color: "danger",
      });
      console.error("OTP send failed:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const rawClean = cleanPhoneNumber(phone);
    if (!rawClean || !otp || otp.length < 6) return;
    setOtpLoading(true);
    try {
      // 1. Verify OTP with backend
      const res = await fetch(`${BaseUrl}/auth/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `91${rawClean}`, otp, role: "user" }),
      });
      const backendData = await res.json();
      if (!res.ok) throw new Error(backendData.message || "Invalid or expired OTP");

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
      Cookies.set("token", data.token, getAuthCookieOptions());
      setOpen(false);
      addToast({
        title: "Welcome Back!",
        description: "Authenticated successfully via WhatsApp OTP",
        color: "success",
      });
      setTimeout(() => {
        onOpenChange?.(true);
        if (returnUrl) {
          window.location.href = returnUrl;
        }
      }, 100);
    } catch (err) {
      addToast({
        title: "Verification Failed",
        description: err.message || "Invalid or expired OTP code",
        color: "danger",
      });
      console.error("OTP verify failed:", err);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleTruecallerLogin = async () => {
    const rawClean = cleanPhoneNumber(phone);
    if (!rawClean || rawClean.length !== 10) {
      addToast({
        title: "Phone Required",
        description: "Please enter your 10-digit mobile number for Truecaller 1-Tap verification",
        color: "warning",
      });
      return;
    }

    setTruecallerLoading(true);
    try {
      const tcPayload = {
        phoneNumber: rawClean,
        name: "Guest",
        truecallerId: `tc_${rawClean}`,
      };
      const res = await fetch(`${BaseUrl}/auth/truecaller`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: tcPayload, role: "user" }),
      });
      const backendData = await res.json();
      if (!res.ok) throw new Error(backendData.message || "Truecaller verification failed");

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
      Cookies.set("token", data.token, getAuthCookieOptions());
      setOpen(false);
      addToast({
        title: "Welcome!",
        description: "Verified successfully via Truecaller",
        color: "success",
      });
      setTimeout(() => {
        onOpenChange?.(true);
        if (returnUrl) {
          window.location.href = returnUrl;
        }
      }, 100);
    } catch (err) {
      addToast({
        title: "Truecaller Sign-In Failed",
        description: err.message || "Could not verify via Truecaller. Please use WhatsApp OTP.",
        color: "danger",
      });
      console.error("Truecaller login failed:", err);
    } finally {
      setTruecallerLoading(false);
    }
  };

  const AuthContent = () => (
    <div className="space-y-5">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mb-3 shadow-md">
          <Image src={Logoicon || "/placeholder.svg"} alt="Thevillacamp" className="w-9 h-9 object-contain" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Welcome to TheVillaCamp
        </h2>
        <p className="text-xs text-gray-500">Sign in securely with WhatsApp OTP or Truecaller</p>
      </div>

      {/* WhatsApp OTP Card */}
      <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              WhatsApp Verification
            </span>
          </div>
          <span className="text-[10px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            Instant Code
          </span>
        </div>

        {!otpSent ? (
          <div className="space-y-2.5">
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center pointer-events-none text-xs font-semibold text-gray-600 border-r border-gray-300 pr-2">
                🇮🇳 +91
              </div>
              <input
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full h-11 pl-20 pr-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black bg-white text-sm font-medium shadow-inner"
              />
            </div>
            <Button
              onPress={handleSendOTP}
              disabled={otpLoading || cleanPhoneNumber(phone).length !== 10}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-sm rounded-xl shadow-md disabled:opacity-50"
            >
              {otpLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Get OTP on WhatsApp"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-600 px-1">
              <span>Code sent to <strong className="text-gray-900">+91 {cleanPhoneNumber(phone)}</strong></span>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Change
              </button>
            </div>
            <input
              type="text"
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full h-12 px-3 rounded-xl border-2 border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-center tracking-[0.4em] text-black bg-white text-lg font-bold shadow-inner"
              maxLength={6}
              autoFocus
            />
            <Button
              onPress={handleVerifyOTP}
              disabled={otpLoading || otp.length < 6}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-sm rounded-xl shadow-md disabled:opacity-50"
            >
              {otpLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Verify & Sign In"}
            </Button>
            <div className="text-center text-xs text-gray-500">
              {countdown > 0 ? (
                <span>Resend OTP in <strong className="text-emerald-700">{countdown}s</strong></span>
              ) : (
                <button
                  onClick={handleSendOTP}
                  disabled={otpLoading}
                  className="text-emerald-700 hover:underline font-semibold"
                >
                  Resend OTP via WhatsApp
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-400 font-medium">Or continue with</span>
        </div>
      </div>

      {/* Secondary Fast Auth Options */}
      <div className="space-y-2.5">
        {/* Truecaller 1-Tap Sign In */}
        <Button
          onPress={handleTruecallerLogin}
          disabled={truecallerLoading || appleLoading || otpLoading}
          className="w-full h-11 bg-[#0087FF] hover:bg-[#0070d6] text-white font-bold transition-all duration-200 hover:shadow-md rounded-xl text-sm flex items-center justify-center space-x-2"
        >
          {truecallerLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ShieldCheck className="w-5 h-5 mr-1" />
          )}
          <span>{truecallerLoading ? "Verifying..." : "1-Tap Truecaller Sign-In"}</span>
        </Button>

        {/* Apple Sign In */}
        <Button
          onPress={handleAppleLogin}
          disabled={truecallerLoading || appleLoading || otpLoading}
          className="w-full h-11 bg-black hover:bg-gray-800 text-white font-bold transition-all duration-200 hover:shadow-md rounded-xl text-sm flex items-center justify-center space-x-2"
        >
          {appleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <svg
              className="mr-2 h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
          )}
          <span>{appleLoading ? "Signing in..." : "Continue with Apple"}</span>
        </Button>
      </div>

      {/* Terms & Privacy */}
      <p className="text-[11px] text-center text-gray-400 leading-tight">
        By continuing, you agree to TheVillaCamp's{" "}
        <a href="/terms" className="underline hover:text-gray-600">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
      </p>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {!autoOpen && (
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="group hidden relative overflow-hidden bg-gradient-to-r from-emerald-50 to-indigo-50 border-emerald-200 hover:from-emerald-100 hover:to-indigo-100 transition-all duration-300"
            >
              <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Sign In
            </Button>
          </DrawerTrigger>
        )}
        <DrawerContent
          className="max-w-md mx-auto bg-white border-none rounded-t-3xl"
          onEscapeKeyDown={(e) => autoOpen && e.preventDefault()}
          onPointerDownOutside={(e) => autoOpen && e.preventDefault()}
        >
          <div className="mx-auto w-full max-w-sm border-0">
            <DrawerHeader className="text-center hidden">
              <DrawerTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent"></DrawerTitle>
              <DrawerDescription className="text-gray-600"></DrawerDescription>
            </DrawerHeader>
            <div className="p-6">
              <AuthContent />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {!autoOpen && (
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="group hidden relative overflow-hidden bg-gradient-to-r from-emerald-50 to-indigo-50 border-emerald-200 hover:from-emerald-100 hover:to-indigo-100 transition-all duration-300"
          >
            <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Sign In
          </Button>
        </DialogTrigger>
      )}
      <DialogContent
        className="sm:max-w-md bg-white border-none rounded-2xl shadow-2xl"
        onEscapeKeyDown={(e) => autoOpen && e.preventDefault()}
        onPointerDownOutside={(e) => autoOpen && e.preventDefault()}
      >
        <div className="p-6">
          <AuthContent />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveAuthModal;
