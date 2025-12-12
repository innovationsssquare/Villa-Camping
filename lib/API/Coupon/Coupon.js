import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const Applycoupon = async (data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Coupon/ApplyCoupon`, {
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

export const Getallcouponbypropertyid = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Coupon/property/${id}`, {
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
