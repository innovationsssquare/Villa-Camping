"use client";

import { useEffect, useRef, useState } from "react";

export default function GoogleMap({
  center = { lat: 18.7645, lng: 73.4084 },

  zoom = 8,
  className = "w-full h-64 rounded-lg",
  coordinates,
}) {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  console.log(coordinates);
  useEffect(() => {
    const loadGoogleMaps = async () => {
      try {
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          initializeMap();
          return;
        }

        // Load Google Maps script
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          setIsLoaded(true);
          initializeMap();
        };

        script.onerror = () => {
          setError("Failed to load Google Maps");
        };

        document.head.appendChild(script);
      } catch (err) {
        setError("Error loading Google Maps");
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: coordinates[0], lng: coordinates[1] },
        zoom,
        // styles: [
        //   {
        //     featureType: "all",
        //     elementType: "geometry.fill",
        //     stylers: [{ color: "#f5f5f5" }],
        //   },
        //   {
        //     featureType: "water",
        //     elementType: "geometry",
        //     stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        //   },
        //   {
        //     featureType: "administrative",
        //     elementType: "geometry.stroke",
        //     stylers: [{ color: "#c9b2a6" }, { lightness: 17 }, { weight: 1.2 }],
        //   },
        // ],
      });

      // Add marker for the property
      new window.google.maps.Marker({
        position: { lat: coordinates[0], lng: coordinates[1] },
        map,
        title: "Vastalya Villa - Malawali",
        
      });
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError(
        "Google Maps API key not found. Please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables."
      );
      return;
    }

    loadGoogleMaps();
  }, [center, zoom]);

  if (error) {
    return (
      <div
        className={`${className} bg-gray-200 border border-gray-300 flex items-center justify-center`}
      >
        <div className="text-center p-4">
          <div className="text-gray-500 mb-2">⚠️</div>
          <p className="text-sm text-gray-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">
            Add your Google Maps API key to environment variables
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div ref={mapRef} className="w-full h-full  rounded-lg" />
    </div>
  );
}
