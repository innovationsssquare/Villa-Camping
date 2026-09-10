export const BaseUrl =
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : null) ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXT_PUBLIC_PRODUCTION_URL ||
  "http://localhost:8086/api/v1";