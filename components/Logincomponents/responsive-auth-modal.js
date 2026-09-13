"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Loader2, ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { addToast } from "@heroui/react";
import { getDeviceId } from "@/lib/deviceId";
import { BaseUrl } from "@/lib/API/Baseurl";
import { getAuthCookieOptions } from "@/lib/authCookies";

// Standalone AuthFormContent to ensure input focus is never lost on re-renders
function AuthFormContent({
  phone,
  setPhone,
  otp,
  setOtp,
  otpSent,
  setOtpSent,
  otpLoading,
  countdown,
  handleSendOTP,
  handleVerifyOTP,
  cleanPhoneNumber,
}) {
  return (
    <div className="w-full">
      {/* StayVista-Inspired Luxury Villa Pool Promo Banner */}
      <div className="relative w-full h-36 sm:h-40 rounded-2xl overflow-hidden shadow-sm my-3 select-none bg-neutral-900">
        <Image
          src="/Loginasset/villa_banner.jpg"
          alt="Enjoy A Villa Getaway"
          fill
          className="object-cover"
          priority
        />
        {/* Dark contrast gradient overlay for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/85 flex flex-col justify-between p-3.5 sm:p-4 text-right items-end">
          {/* Brand Tag Top Right */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-white uppercase drop-shadow-md">
              THEVILLA CAMP
            </span>
          </div>

          {/* Luxury Promotional Copy */}
          <div className="space-y-1">
            <h3 className="text-sm sm:text-base font-extrabold text-white leading-tight drop-shadow-md">
              Book a Room.<br />Enjoy A Villa Getaway
            </h3>
            <p className="text-[10px] sm:text-[11px] text-white/90 font-medium drop-shadow-sm">
              Enjoy the Luxuries &amp; Privacy of a villa with
            </p>
            <div className="inline-block mt-0.5 px-2.5 py-0.5 rounded-md border border-dashed border-white/90 bg-white/15 backdrop-blur-xs">
              <span className="text-[10px] sm:text-[11px] font-semibold text-white tracking-wide">
                Rooms Starting at ₹4,999*
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Area */}
      {!otpSent ? (
        /* Phone Number Entry Step */
        <div className="space-y-3">
          <h4 className="text-base font-bold text-neutral-900 tracking-tight">
            Login/Signup
          </h4>

          <div className="flex items-center gap-2.5">
            {/* Country Code Selector Box */}
            <div className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-neutral-300 bg-white text-sm font-semibold text-neutral-800 shrink-0 select-none shadow-2xs">
              <span>+91</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
            </div>

            {/* Phone Number Input Field */}
            <div className="flex-1 relative">
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && cleanPhoneNumber(phone).length === 10 && !otpLoading) {
                    handleSendOTP();
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-all shadow-2xs"
                autoFocus
              />
            </div>
          </div>

          {/* Continue CTA */}
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={otpLoading || cleanPhoneNumber(phone).length !== 10}
            className="w-full h-12 mt-2 bg-[#1b1c2b] hover:bg-[#11121d] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            {otpLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              "Continue"
            )}
          </button>
        </div>
      ) : (
        /* WhatsApp OTP Verification Step */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-neutral-900 tracking-tight">
                Verify WhatsApp Code
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Sent to <strong className="text-neutral-900">+91 {cleanPhoneNumber(phone)}</strong>
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOtpSent(false);
                setOtp("");
              }}
              className="text-xs font-semibold text-[#ff6900] hover:underline px-2.5 py-1 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>

          {/* Monospace 6-Digit OTP Box */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(val);
              if (val.length === 6) {
                handleVerifyOTP(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && otp.length === 6 && !otpLoading) {
                handleVerifyOTP();
              }
            }}
            className="w-full h-12 px-4 rounded-xl border-2 border-neutral-300 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-center tracking-[0.45em] text-neutral-900 bg-white text-xl font-bold font-mono outline-none shadow-2xs transition-all"
            maxLength={6}
            autoFocus
          />

          {/* Verify & Continue CTA */}
          <button
            type="button"
            onClick={() => handleVerifyOTP()}
            disabled={otpLoading || otp.length < 6}
            className="w-full h-12 mt-1 bg-[#1b1c2b] hover:bg-[#11121d] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs cursor-pointer"
          >
            {otpLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              "Verify & Continue"
            )}
          </button>

          {/* Resend WhatsApp OTP */}
          <div className="text-center text-xs text-neutral-500 pt-1">
            {countdown > 0 ? (
              <span>
                Resend code via WhatsApp in{" "}
                <strong className="text-neutral-800 font-semibold">{countdown}s</strong>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={otpLoading}
                className="text-[#ff6900] hover:underline font-semibold cursor-pointer"
              >
                Resend WhatsApp Code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer Legal Terms Disclaimer */}
      <p className="text-[11px] text-center text-neutral-500 mt-4 leading-relaxed select-none">
        By signing up, you agree to<br />
        our{" "}
        <a
          href="/terms-of-service"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2b5993] hover:underline font-medium"
        >
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#2b5993] hover:underline font-medium"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}

const ResponsiveAuthModal = ({
  autoOpen = false,
  open: controlledOpen,
  onOpenChange,
  returnUrl,
  trigger,
}) => {
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
    if (!newOpen) {
      // Reset OTP state on modal close
      setOtpSent(false);
      setOtp("");
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
        title: "WhatsApp OTP Sent!",
        description: `Verification code sent to WhatsApp on +91 ${rawNumber}`,
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

  const handleVerifyOTP = async (customCode = null) => {
    const codeToVerify = customCode || otp;
    if (!codeToVerify || codeToVerify.length < 6) {
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
          code: codeToVerify,
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

      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);

      addToast({
        title: "Welcome!",
        description: "Logged in successfully",
        color: "success",
      });

      setTimeout(() => {
        if (returnUrl) {
          window.location.href = returnUrl;
        } else {
          window.location.reload();
        }
      }, 150);
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

  // Mobile Bottom-Sheet Drawer (matching StayVista reference design)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent className="max-w-md mx-auto bg-white border-none rounded-t-[28px] px-5 pt-5 pb-8">
          <div className="relative text-center pt-1 pb-1">
            <DrawerTitle className="text-2xl sm:text-[26px] font-extrabold text-neutral-900 tracking-tight">
              Welcome to ThevillaCamp
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              Login or Signup with your mobile number via WhatsApp OTP
            </DrawerDescription>
            <DrawerClose asChild>
              <button
                type="button"
                className="absolute top-0 right-0 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors outline-none cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </DrawerClose>
          </div>

          <AuthFormContent
            phone={phone}
            setPhone={setPhone}
            otp={otp}
            setOtp={setOtp}
            otpSent={otpSent}
            setOtpSent={setOtpSent}
            otpLoading={otpLoading}
            countdown={countdown}
            handleSendOTP={handleSendOTP}
            handleVerifyOTP={handleVerifyOTP}
            cleanPhoneNumber={cleanPhoneNumber}
          />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Centered Dialog (consistent StayVista luxury card aesthetic)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[430px] p-6 bg-white border border-neutral-100 rounded-3xl shadow-2xl overflow-hidden [&>button]:hidden">
        <div className="relative text-center pt-1 pb-1">
          <DialogTitle className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Welcome to ThevillaCamp
          </DialogTitle>
          <DialogDescription className="sr-only">
            Login or Signup with your mobile number via WhatsApp OTP
          </DialogDescription>
          <DialogClose asChild>
            <button
              type="button"
              className="absolute top-0 right-0 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors outline-none cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </div>

        <AuthFormContent
          phone={phone}
          setPhone={setPhone}
          otp={otp}
          setOtp={setOtp}
          otpSent={otpSent}
          setOtpSent={setOtpSent}
          otpLoading={otpLoading}
          countdown={countdown}
          handleSendOTP={handleSendOTP}
          handleVerifyOTP={handleVerifyOTP}
          cleanPhoneNumber={cleanPhoneNumber}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveAuthModal;
