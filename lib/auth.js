import Cookies from "js-cookie";

/**
 * Get current authenticated user details from cookies or localStorage
 * @returns {{ _id: string, token: string, fullName?: string, email?: string, mobile?: string } | null}
 */
export function getStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const token = Cookies.get("token");
    if (!token) return null;

    const storedUserStr = localStorage.getItem("thevilla_user");
    let user = null;
    if (storedUserStr) {
      try {
        user = JSON.parse(storedUserStr);
      } catch {
        user = null;
      }
    }

    const userId =
      user?._id ||
      localStorage.getItem("thevilla_user_id") ||
      Cookies.get("customer_id") ||
      null;

    if (!userId && !token) return null;

    return {
      _id: userId,
      token,
      ...(user || {}),
    };
  } catch {
    return null;
  }
}

/**
 * Check if the user is currently logged in
 * @returns {boolean}
 */
export function isUserLoggedIn() {
  const user = getStoredUser();
  return Boolean(user && (user._id || user.token));
}
