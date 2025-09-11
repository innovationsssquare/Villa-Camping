"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import ResponsiveAuthModal from "./responsive-auth-modal";
import Image from "next/image";
import Logoicon from "@/public/Productasset/Logoicon.png";
import ButtonLoader from "../Loadercomponents/button-loader";
export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const [showAnimation, setShowAnimation] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
      setShowModal(true);
    }, 2500); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleModalClose = (isAuthenticated = false) => {
    if (isAuthenticated) {
      window.location.href = returnUrl;
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {showAnimation && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
            {/* Logo Animation */}
            <div className="animate-in zoom-in duration-700 delay-300">
              <Image src={Logoicon} alt="thevillacamp" className="w-32 h-32" />
            </div>

            {/* Brand Name Animation */}
            {/* <div className="animate-in slide-in-from-bottom duration-700 delay-700">
              <p className="text-gray-600 mt-2 animate-in fade-in duration-500 delay-1000">
                Thevillacamp
              </p>
            </div> */}

          
           
          </div>
        )}

        {showModal && (
          <ResponsiveAuthModal
            autoOpen={true}
            onOpenChange={handleModalClose}
            isOpen={true}
            returnUrl={returnUrl}
          />
        )}
      </div>
    </div>
  );
}
