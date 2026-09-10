import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

/**
 * 1. Customer creates a dispute / raises concern regarding a booking
 */
export const CreateDisputeAPI = async (payload) => {
  const token = Cookies.get("token");
  try {
    const res = await fetch(`${BaseUrl}/Dispute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { token } : {}),
      },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (error) {
    console.error("CreateDisputeAPI error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * 2. Fetch all disputes raised by a customer
 */
export const GetCustomerDisputesAPI = async (customerId, email = "") => {
  const token = Cookies.get("token");
  try {
    const query = email ? `?email=${encodeURIComponent(email)}` : "";
    const res = await fetch(`${BaseUrl}/Dispute/customer/${customerId || "me"}${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { token } : {}),
      },
    });
    return await res.json();
  } catch (error) {
    console.error("GetCustomerDisputesAPI error:", error);
    return { success: false, message: error.message };
  }
};
