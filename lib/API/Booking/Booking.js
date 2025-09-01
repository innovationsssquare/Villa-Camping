import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const Createbooking = async (data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Booking/create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Verifybooking = async (data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Booking/verify`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};
