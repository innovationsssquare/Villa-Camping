"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveAuthModal from "./responsive-auth-modal";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/";

  const handleModalClose = (isAuthenticated = false) => {
    if (isAuthenticated) {
      window.location.href = returnUrl;
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <ResponsiveAuthModal
        autoOpen={true}
        open={true}
        onOpenChange={handleModalClose}
        returnUrl={returnUrl}
      />
    </div>
  );
}
