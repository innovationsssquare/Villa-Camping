import { BaseUrl } from "../Baseurl";
import Cookies from "js-cookie";

export const MyBooking = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Booking/customer/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Mywishlist = async (userId) => {
  const token = Cookies.get("token");
  const uid =
    userId ||
    Cookies.get("customer_id") ||
    (typeof window !== "undefined" ? localStorage.getItem("thevilla_user_id") : null);

  try {
    const url = uid
      ? `${BaseUrl}/Wishlist/wishlist?userId=${uid}`
      : `${BaseUrl}/Wishlist/wishlist`;

    let result = await fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token || "",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(uid ? { "user-id": uid } : {}),
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return { success: false, data: [], message: error.message };
  }
};

