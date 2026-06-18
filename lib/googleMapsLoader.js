// single-shot loader for Google Maps JS API
export function loadGoogleMaps(apiKey) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps can only be loaded in the browser"));
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google);
  }

  if (window.__googleMapsPromise) {
    return window.__googleMapsPromise;
  }

  // If a script tag already exists on the page, attach handlers to it
  const existing = Array.from(document.getElementsByTagName("script")).find(
    (s) => s.src && s.src.includes("maps.googleapis.com")
  );

  if (existing) {
    window.__googleMapsPromise = new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        resolve(window.google);
        return;
      }
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps")));
    });
    return window.__googleMapsPromise;
  }

  // Otherwise create the script tag and attach a promise
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;

  window.__googleMapsPromise = new Promise((resolve, reject) => {
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
  });

  document.head.appendChild(script);

  return window.__googleMapsPromise;
}
