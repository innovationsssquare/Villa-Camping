"use client";

import { usePathname, useSearchParams } from "next/navigation";

export default function useSearchUrlParams() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();

  return { pathname, searchParams };
}
