"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Loader2, ChevronDown, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import {
  addToast,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import { getDeviceId } from "@/lib/deviceId";
import { BaseUrl } from "@/lib/API/Baseurl";
import { getAuthCookieOptions } from "@/lib/authCookies";

/**
 * 6-Digit Individual OTP Input Boxes
 * Styled with light gray border and slightly dark gray text input
 */
function OtpInputGroup({ value = "", onChange, onComplete, disabled = false }) {
  const inputsRef = useRef([]);
  const prevValueRef = useRef(value);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  useEffect(() => {
    // When OTP value is reset to empty (e.g. after Resend OTP or incorrect OTP), focus first box
    if (prevValueRef.current && !value) {
      inputsRef.current[0]?.focus();
    }
    prevValueRef.current = value;
  }, [value]);

  const handlePastedCode = (pastedText, startIndex = 0) => {
    const numbersOnly = pastedText.replace(/\D/g, "").slice(0, 6);
    if (!numbersOnly) return;

    const nextDigits = [...digits];
    // If a full 6-digit code was pasted or pasted at the first box, fill from index 0
    const start = numbersOnly.length === 6 ? 0 : startIndex;

    for (let i = 0; i < numbersOnly.length && start + i < 6; i++) {
      nextDigits[start + i] = numbersOnly[i];
    }

    const finalOtp = nextDigits.join("").trim();
    onChange(finalOtp);

    // Focus the next empty slot or the last slot
    const nextEmptyIndex = nextDigits.findIndex((d) => !d);
    const targetFocus = nextEmptyIndex !== -1 ? nextEmptyIndex : 5;
    inputsRef.current[targetFocus]?.focus();
    inputsRef.current[targetFocus]?.select();

    if (finalOtp.length === 6) {
      onComplete?.(finalOtp);
    }
  };

  const handleDigitChange = (index, rawVal) => {
    const clean = rawVal.replace(/\D/g, "");

    // Case 1: Empty (User backspaced or deleted the digit)
    if (!clean) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      onChange(nextDigits.join("").trim());
      return;
    }

    // Case 2: Pasted or autofilled multiple characters (e.g. WhatsApp SMS copy code "123456")
    if (clean.length > 1) {
      // If user typed into an already-filled box (e.g. had "5", typed "8", clean is "58" or "85")
      if (clean.length === 2 && digits[index]) {
        const currentDigit = digits[index];
        const newDigit = clean[0] === currentDigit ? clean[1] : clean[0];
        const nextDigits = [...digits];
        nextDigits[index] = newDigit;
        const finalOtp = nextDigits.join("").trim();
        onChange(finalOtp);

        if (index < 5) {
          inputsRef.current[index + 1]?.focus();
          inputsRef.current[index + 1]?.select();
        }

        if (finalOtp.length === 6) {
          onComplete?.(finalOtp);
        }
        return;
      }

      // Pasted code with multiple digits
      handlePastedCode(clean, index);
      return;
    }

    // Case 3: Exactly 1 digit entered
    const nextDigits = [...digits];
    nextDigits[index] = clean;
    const finalOtp = nextDigits.join("").trim();
    onChange(finalOtp);

    // Automatically focus and activate the next input box
    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }

    // If all 6 digits are filled, automatically trigger onComplete
    if (finalOtp.length === 6) {
      onComplete?.(finalOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // If current box is empty, jump to previous box, clear it, and focus
        e.preventDefault();
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        onChange(nextDigits.join("").trim());
        inputsRef.current[index - 1]?.focus();
      } else {
        // Clear current box
        const nextDigits = [...digits];
        nextDigits[index] = "";
        onChange(nextDigits.join("").trim());
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
      inputsRef.current[index - 1]?.select();
    } else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
      inputsRef.current[index + 1]?.select();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData?.getData("text") || "";
    handlePastedCode(pasteData, 0);
  };

  return (
    <div className="flex items-center justify-between gap-1.5 sm:gap-2.5 py-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={6}
          value={digits[i]}
          onChange={(e) => handleDigitChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          className="w-10 sm:w-12 h-11 sm:h-12 text-center text-base sm:text-[17px] font-medium text-neutral-700 bg-white border border-neutral-300 hover:border-neutral-400 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200/60 rounded-xl outline-none transition-all shadow-2xs disabled:bg-neutral-100 disabled:text-neutral-400"
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

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
      <div className="relative w-full h-40 sm:h-40 rounded-2xl overflow-hidden shadow-sm my-4 select-none bg-neutral-900">
        <Image
          src="/Loginasset/villa_banner.jpg"
          alt="Enjoy A Villa Getaway"
          fill
          className="object-cover"
          priority
        />
        {/* Dark contrast gradient overlay for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-black/85 flex flex-col justify-between p-3 sm:p-3.5 text-right items-end">
          {/* Brand Tag Top Right */}
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-white uppercase drop-shadow-md">
              THEVILLA CAMP
            </span>
          </div>

          {/* Luxury Promotional Copy */}
          <div className="space-y-0.5">
            <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight drop-shadow-md">
              Book a Room.<br />Enjoy A Villa Getaway
            </h3>
            <p className="text-[9px] sm:text-[10px] text-white/90 font-medium drop-shadow-sm">
              Enjoy the Luxuries &amp; Privacy of a villa with
            </p>
            <div className="inline-block mt-0.5 px-2 py-0.5 rounded-md border border-dashed border-white/90 bg-white/15 backdrop-blur-xs">
              <span className="text-[9px] sm:text-[10px] font-semibold text-white tracking-wide">
                Rooms Starting at ₹4,999*
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Area */}
      {!otpSent ? (
        /* Phone Number Entry Step */
        <div className="space-y-3.5">
          <h4 className="text-base font-bold text-neutral-900 tracking-tight">
            Login/Signup
          </h4>

          <div className="flex items-center gap-2.5">
            {/* Country Code Selector Box */}
            <div className="flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white text-sm font-semibold text-neutral-700 shrink-0 select-none shadow-2xs">
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
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white text-sm font-medium text-neutral-700 placeholder:text-neutral-400 outline-none focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200/60 transition-all shadow-2xs"
                autoFocus
              />
            </div>
          </div>

          {/* Continue CTA */}
          <button
            type="button"
            onClick={handleSendOTP}
            disabled={otpLoading || cleanPhoneNumber(phone).length !== 10}
            className="w-full h-11 sm:h-12 mt-4 bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 cursor-pointer"
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

          {/* 6 Individual OTP Boxes */}
          <OtpInputGroup
            value={otp}
            onChange={setOtp}
            onComplete={handleVerifyOTP}
            disabled={otpLoading}
          />

          {/* Verify & Continue CTA */}
          <button
            type="button"
            onClick={() => handleVerifyOTP()}
            disabled={otpLoading || otp.length < 6}
            className="w-full h-11 sm:h-12 mt-2 bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 cursor-pointer"
          >
            {otpLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              "Verify & Continue"
            )}
          </button>

          {/* Resend WhatsApp OTP */}
          <div className="text-center text-xs text-neutral-500 pt-0.5">
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
      <div className="pt-3 pb-3 mt-4 text-center">
        <p className="text-xs text-neutral-600 leading-normal select-none">
          By signing up, you agree to our{" "}
          <a
            href="/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6900] hover:underline font-semibold underline-offset-2"
          >
            Terms &amp; Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#ff6900] hover:underline font-semibold underline-offset-2"
          >
            Privacy Policy
          </a>
        </p>
      </div>
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

    // Always clear existing OTP digits on send/resend so input boxes are empty
    setOtp("");
    setOtpLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/auth/whatsapp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: rawNumber, role: "user" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setOtpSent(true);
      setCountdown(60);
      if (data.devOtp) {
        setOtp(data.devOtp);
        addToast({
          title: "Dev Mock OTP Ready",
          description: `Code: ${data.devOtp} auto-filled (Dev Mode). Tap continue to verify!`,
          color: "primary",
        });
      } else {
        setOtp(""); // Ensure all input boxes are empty on live resend
        addToast({
          title: "WhatsApp OTP Sent!",
          description: `Verification code sent to WhatsApp on +91 ${rawNumber}`,
          color: "success",
        });
      }
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
          otp: codeToVerify,
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

      // Immediately broadcast auth state change to all active components
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("thevilla_auth_changed", {
            detail: { user: data.user, token: data.token },
          })
        );
        window.dispatchEvent(new Event("storage"));
      }

      if (!isControlled) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);

      addToast({
        title: "Welcome!",
        description: "Logged in successfully",
        color: "success",
      });

      // Immediately reload or navigate to returnUrl so all components display logged in UI
      setTimeout(() => {
        if (returnUrl && returnUrl !== window.location.pathname) {
          window.location.href = returnUrl;
        } else {
          window.location.reload();
        }
      }, 350);
    } catch (err) {
      // Clear OTP digits on failed verification so inputs are empty for fresh entry or resend
      setOtp("");
      addToast({
        title: "Verification Failed",
        description: err.message || "Incorrect verification code. Please try again.",
        color: "danger",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  // Mobile Bottom-Sheet Drawer using HeroUI Drawer
  if (isMobile) {
    return (
      <>
        {trigger && React.isValidElement(trigger)
          ? React.cloneElement(trigger, {
            onClick: (e) => {
              trigger.props?.onClick?.(e);
              handleOpenChange(true);
            },
          })
          : trigger}
        <Drawer
          isOpen={open}
          onOpenChange={handleOpenChange}
          placement="bottom"
          backdrop="opaque"
          hideCloseButton
          classNames={{
            base: "max-w-md mx-auto bg-white rounded-t-[28px] p-0 m-0 border-none shadow-2xl overflow-hidden pb-4 sm:pb-2",
            backdrop: "bg-black/60 backdrop-blur-xs z-[9998]",
            wrapper: "z-[9999]",
          }}
        >
          <DrawerContent className="max-w-md mx-auto bg-white border-none rounded-t-[28px] overflow-hidden p-0">
            {() => (
              <>
                {/* Pull handle indicator */}
                <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 mb-1 shrink-0" />

                {/* Dedicated Top-Right Close Button */}
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="absolute top-3.5 right-4 z-30 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-90 text-neutral-700 flex items-center justify-center transition-all outline-none cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Title Header with lateral padding to prevent text collision with close button */}
                <DrawerHeader className="relative flex flex-col items-center justify-center text-center pt-0.5 pb-0.5 px-10">
                  <h3 className="text-lg sm:text-xl font-extrabold text-neutral-900 tracking-tight leading-snug">
                    Welcome to ThevillaCamp
                  </h3>
                </DrawerHeader>

                <DrawerBody
                  className="px-5 pt-1 pb-10 sm:pb-6 max-h-[85vh] overflow-y-auto no-scrollbar"
                  style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom, 2.5rem))" }}
                >
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
                </DrawerBody>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  // Desktop Centered Dialog (faithful StayVista luxury two-column aesthetic)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[760px] md:max-w-[800px] p-6 sm:p-7 bg-white border border-neutral-150 rounded-[28px] shadow-2xl overflow-hidden [&>button]:hidden">
        {/* Floating Top-Right Close Button */}
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-90 text-neutral-800 flex items-center justify-center transition-all outline-none cursor-pointer shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </DialogClose>

        <div className="sr-only">
          <DialogTitle>Welcome to ThevillaCamp</DialogTitle>
          <DialogDescription>
            Login or Signup with your mobile number via WhatsApp OTP
          </DialogDescription>
        </div>

        {/* Two-Column Grid matching StayVista */}
        <div className="grid grid-cols-1 md:grid-cols-[330px_1fr] gap-7 items-stretch min-h-[430px]">
          {/* Left Column: Luxury Portrait Poster Card */}
          <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-sm bg-neutral-900 select-none">
            <Image
              src="/Loginasset/villa_banner.jpg"
              alt="Enjoy A Villa Getaway"
              fill
              className="object-cover object-[72%_center]"
              priority
            />
            {/* Top Vignette Gradient Overlay for Typography Contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-transparent flex flex-col justify-start items-center p-5 text-center">
              {/* Brand Tag */}
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[10px] font-black tracking-[0.2em] text-white uppercase drop-shadow-md">
                  THEVILLA CAMP
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-xl sm:text-[22px] font-serif font-bold text-white leading-tight drop-shadow-md mb-1.5">
                Book a Villa.<br />Enjoy A Villa Getaway
              </h3>

              {/* Subtitle */}
              <p className="text-xs text-white/90 font-medium drop-shadow-sm mb-2.5 max-w-[210px] leading-snug">
                Enjoy the Luxuries &amp; Privacy of a villa with
              </p>

              {/* Price Pill with Dashed Border */}
              <div className="inline-block px-3 py-1 rounded-lg border border-dashed border-white/90 bg-black/25 backdrop-blur-xs">
                <span className="text-xs font-semibold text-white tracking-wide">
                  Villas Starting at ₹4,999*
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Auth Form Area */}
          <div className="flex flex-col justify-between h-full py-1">
            <div>
              {/* Brand Wordmark / Logo */}
              <div className="mb-6 flex items-center">
                <Image
                  src="/Productasset/mainlogo_clean.png"
                  alt="ThevillaCamp"
                  width={130}
                  height={36}
                  priority
                  className="h-8 w-auto object-contain"
                />
              </div>

              {!otpSent ? (
                /* Step 1: Phone Number Input */
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 mb-1">
                      Login/Signup
                    </p>
                    <h2 className="text-2xl sm:text-[26px] font-bold text-neutral-950 tracking-tight leading-snug">
                      Welcome to ThevillaCamp
                    </h2>
                  </div>

                  <div className="flex items-center gap-2.5 pt-2">
                    {/* Country Code Dropdown */}
                    <div className="flex items-center justify-center gap-1.5 h-12 px-3.5 rounded-xl border border-neutral-300 hover:border-neutral-400 bg-white text-sm font-semibold text-neutral-700 shrink-0 select-none shadow-2xs transition-colors">
                      <span>+91</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                    </div>

                    {/* Phone input */}
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
                        className="w-full h-12 px-4 rounded-xl border border-neutral-300 hover:border-neutral-400 focus:border-neutral-700 focus:ring-2 focus:ring-neutral-200/60 bg-white text-base font-medium text-neutral-700 placeholder:text-neutral-400 outline-none transition-all shadow-2xs"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Continue Button (Theme Orange) */}
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={otpLoading || cleanPhoneNumber(phone).length !== 10}
                    className="w-full h-12 mt-2 bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    {otpLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </div>
              ) : (
                /* Step 2: WhatsApp OTP Verification */
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-neutral-800 mb-1">
                      Verification
                    </p>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl sm:text-2xl font-bold text-neutral-950 tracking-tight">
                        Verify WhatsApp Code
                      </h2>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp("");
                        }}
                        className="text-xs font-semibold text-[#ff6900] hover:underline px-2 py-1 rounded-md hover:bg-orange-50 transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1">
                      Sent to <strong className="text-neutral-900">+91 {cleanPhoneNumber(phone)}</strong>
                    </p>
                  </div>

                  {/* 6 Individual OTP Boxes */}
                  <OtpInputGroup
                    value={otp}
                    onChange={setOtp}
                    onComplete={handleVerifyOTP}
                    disabled={otpLoading}
                  />

                  {/* Verify & Continue CTA (Theme Orange) */}
                  <button
                    type="button"
                    onClick={() => handleVerifyOTP()}
                    disabled={otpLoading || otp.length < 6}
                    className="w-full h-12 bg-[#ff6900] hover:bg-[#e05d00] active:scale-[0.99] text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-45 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 cursor-pointer"
                  >
                    {otpLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>

                  <div className="text-center text-xs text-neutral-500 pt-0.5">
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
            </div>

            {/* Bottom Legal Terms matching StayVista layout */}
            <div className="pt-6">
              <p className="text-[11.5px] text-neutral-600 leading-relaxed select-none">
                By signing up, you agree to<br />
                our{" "}
                <a
                  href="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff6900] hover:underline font-medium"
                >
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#ff6900] hover:underline font-medium"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResponsiveAuthModal;
