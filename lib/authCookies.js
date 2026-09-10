export function getAuthCookieOptions() {
  const isSecure =
    typeof window !== "undefined" && window.location.protocol === "https:";

  return {
    expires: 7,
    path: "/",
    sameSite: "lax",
    secure: isSecure,
  };
}
