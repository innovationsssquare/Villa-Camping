"use client";

import { useEffect, useRef, useState } from "react";

export function MapContainer({
  properties,
  selectedProperty,
  onPropertySelect,
}) {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Load Google Maps script dynamically
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsMapLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"
      }&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isMapLoaded && mapRef.current && !map) {
      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 18.7537, lng: 73.4135 }, // Lonavala center
        zoom: 11,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#e0f7fa" }],
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#ffffff" }],
          },
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy",
      });
      setMap(newMap);
    }
  }, [isMapLoaded, map]);

  useEffect(() => {
    if (map && properties.length > 0) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      const newMarkers = properties.map((property) => {
        // Create custom marker content
        const markerDiv = document.createElement("div");
        markerDiv.className = `marker-container ${
          property.isHot ? "hot" : ""
        } ${selectedProperty === property.id ? "selected" : ""}`;
        markerDiv.innerHTML = `
          <div class="marker-price">₹${(property.price / 1000).toFixed(
            0
          )}K</div>
          ${property.isHot ? '<div class="marker-hot-indicator"></div>' : ""}
        `;

        // Create marker using standard Marker API
        const marker = new window.google.maps.Marker({
          position: property.coordinates,
          map: map,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
              <svg width="80" height="40" viewBox="0 0 80 40" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="76" height="30" rx="15" fill="${
                  property.isHot ? "#f97316" : "#164e63"
                }" stroke="white" strokeWidth="2"/>
                <text x="40" y="20" textAnchor="middle" fill="white" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="600">₹${(
                  property.price / 1000
                ).toFixed(0)}K</text>
                <polygon points="40,32 35,38 45,38" fill="${
                  property.isHot ? "#f97316" : "#164e63"
                }"/>
                ${
                  property.isHot
                    ? '<circle cx="70" cy="8" r="4" fill="#dc2626" stroke="white" strokeWidth="1"/>'
                    : ""
                }
              </svg>
            `),
            scaledSize: new window.google.maps.Size(80, 40),
            anchor: new window.google.maps.Point(40, 38),
          },
          title: property.title,
        });

        marker.addListener("click", () => {
          onPropertySelect(property.id);
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, properties, selectedProperty, onPropertySelect, markers]);

  return (
    <div className="absolute inset-0">
      <div ref={mapRef} className="w-full h-full" />

      {/* Map Controls */}
      <div className="absolute bottom-20 left-4 flex flex-col gap-2">
        <button className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
        <button
          className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          onClick={() => {
            if (navigator.geolocation && map) {
              navigator.geolocation.getCurrentPosition((position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };
                map.setCenter(pos);
                map.setZoom(15);
              });
            }
          }}
        >
          <svg
            className="w-5 h-5 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
