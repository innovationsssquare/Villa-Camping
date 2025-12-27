import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllproperties = async ({
  categoryId,
  checkIn,
  checkOut,
  subtype,
  page,
  limit,
}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (categoryId) params.append("categoryId", categoryId);
    if (checkIn) params.append("checkIn", checkIn);
    if (checkOut) params.append("checkOut", checkOut);
    if (subtype) params.append("subtype", subtype);

    let result = await fetch(
      `${BaseUrl}/User/properties/available?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Getropertiesbyweekend = async ({
  categoryId,
}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);

    let result = await fetch(
      `${BaseUrl}/User/available-this-weekend?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Getpropertybyid = async ({ categoryId, propertyId }) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(
      `${BaseUrl}/User/property/${categoryId}/${propertyId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};
