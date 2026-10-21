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

export const Writereview = async (data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Booking/write-review`, {
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

export const GetBookingById = async (id) => {
  const token =
    Cookies.get("token") ||
    (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");

  try {
    let result = await fetch(`${BaseUrl}/Booking/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
        token: token,
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const RequestCancellationAPI = async (bookingId, reason) => {
  const token =
    Cookies.get("token") ||
    (typeof window !== "undefined" ? localStorage.getItem("token") || "" : "");

  try {
    const res = await fetch(
      `${BaseUrl}/Booking/request-cancellation/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
          token: token,
        },
        body: JSON.stringify({ reason }),
      }
    );
    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error ${res.status}`,
      };
    }
    return result;
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to submit cancellation request",
    };
  }
};

