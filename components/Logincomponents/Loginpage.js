"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnUrl = searchParams.get("returnUrl") || "/";
    router.replace(`/?auth=required&returnUrl=${encodeURIComponent(returnUrl)}`);
  }, [router, searchParams]);

  return null;
}
