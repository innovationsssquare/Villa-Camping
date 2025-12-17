import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetCampingbyid = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Camping/get/camping/${id}`, {
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


export const Getcampingdaydetails = async (id,date) => {

  try {
    const params = new URLSearchParams()
    if(date) params.append("date",date)
    let result = await fetch(`${BaseUrl}/Camping/day-details/${id}?${params.toString()}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};