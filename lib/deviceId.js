// lib/deviceId.js
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const DEVICE_KEY = "thevilla_device_id";

export async function getDeviceId() {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(DEVICE_KEY);
  if (stored) return stored;

  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const visitorId = result?.visitorId;

    localStorage.setItem(DEVICE_KEY, visitorId);
    return visitorId;
  } catch (error) {
    const fallback = "web_" + Math.random().toString(36).slice(2, 12);
    localStorage.setItem(DEVICE_KEY, fallback);
    return fallback;
  }
}
