/**
 * Global dynamic Base URL and Socket URL resolution
 */
export const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.startsWith("192.168.") ||
      host.endsWith(".local")
    ) {
      return (
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8086/api/v1"
      );
    }
  }
  return (
    process.env.NEXT_PUBLIC_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:8086/api/v1"
  );
};

export const getSocketUrl = () => {
  const base = getBaseUrl();
  return base.replace(/\/api\/v1\/?$/, "");
};

export const BaseUrl = getBaseUrl();
export const SocketUrl = getSocketUrl();