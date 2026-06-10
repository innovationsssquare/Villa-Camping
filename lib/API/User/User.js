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

export const Mywishlist = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Wishlist/wishlist`, {
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

