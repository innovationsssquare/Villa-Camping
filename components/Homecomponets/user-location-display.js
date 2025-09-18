"use client";

import { useState, useEffect, useRef } from "react";
import { IoMdPin } from "react-icons/io";

export default function UserLocationDisplay() {
  const [location, setLocation] = useState({
    city: null,
    country: null,
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const retryCount = useRef(0);
  const maxRetries = 3;
  const retryDelay = 5000; // milliseconds

  const fetchLocation = () => {
    setIsLoading(true);
    setLocation({ city: null, country: null, error: null });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();

            if (data && data.address) {
              setLocation({
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village ||
                  null,
                country: data.address.country || null,
                error: null,
              });
              retryCount.current = 0; // Reset retries on success
            } else {
              handleRetry("Could not determine city/country.");
            }
          } catch (err) {
            console.error("Error fetching location details:", err);
            handleRetry("Failed to get location details.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          let errorMessage = "Geolocation error: ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "User denied the request for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "The request to get user location timed out.";
              break;
            case error.UNKNOWN_ERROR:
              errorMessage += "An unknown error occurred.";
              break;
          }
          handleRetry(errorMessage);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      handleRetry("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  const handleRetry = (message) => {
    if (retryCount.current < maxRetries) {
      retryCount.current += 1;
      console.warn(`Retrying... attempt ${retryCount.current}`);
      setTimeout(() => {
        fetchLocation();
      }, retryDelay);
    } else {
      setLocation({ city: null, country: null, error: message });
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs font-semibold">
        <span>Loading location...</span>
        <IoMdPin className="text-gray-400" size={15} />
      </div>
    );
  }

  if (location.error) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-red-500">
        {/* <span>{location.error}</span> */}
        <IoMdPin size={15} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs font-semibold">
      <span>
        {location.city || "Unknown City"}
        {location.country && location.city
          ? `, ${location.country}`
          : location.country || ""}
      </span>
      <IoMdPin className="text-red-500" size={15} />
    </div>
  );
}
