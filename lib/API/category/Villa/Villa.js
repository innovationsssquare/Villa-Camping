import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetVillabyid = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Villa/get/villa/${id}`, {
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

export const Checkvillaavailability = async ({ propertyId, checkIn, checkOut }) => {
  try {
    let result = await fetch(
      `${BaseUrl}/User/villa/check-availability?propertyId=${encodeURIComponent(
        propertyId
      )}&checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(
        checkOut
      )}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return { success: false, available: false, message: error.message };
  }
};
