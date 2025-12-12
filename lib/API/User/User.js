import { BaseUrl } from "../Baseurl";

export const MyBooking = async (phonenumber) => {
  try {
    const params = new URLSearchParams();
    if (phonenumber) params.append("Phonenumber", phonenumber);

    let result = await fetch(
      `${BaseUrl}/booking/get/mybooking?${params.toString()}`,
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
    return error.message;
  }
};
