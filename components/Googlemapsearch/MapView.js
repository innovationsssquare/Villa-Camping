"use client";

import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PropertyMarker } from "./PropertyMarker";
import { PropertyCard } from "./PropertyCard";
import { getDisplayPrice } from "./getDisplayPrice";

const MapView = ({
  googleMapsApiKey,
  onPropertySelect,
  selectedLocation,
  properties,
  loading,
  activePropertyId,
  selectedProperty: controlledSelectedProperty,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const overlaysRef = useRef([]);
  const [internalSelectedProperty, setInternalSelectedProperty] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  const selectedProperty =
    controlledSelectedProperty !== undefined
      ? controlledSelectedProperty
      : internalSelectedProperty;

  const handleSelectProperty = (property) => {
    setInternalSelectedProperty(property);
    onPropertySelect?.(property);
  };

  useEffect(() => {
    if (!googleMapsApiKey) return;
    import("@/lib/googleMapsLoader").then(({ loadGoogleMaps }) => {
      loadGoogleMaps(googleMapsApiKey)
        .then(() => setIsScriptLoaded(true))
        .catch(() => console.error("Failed to load Google Maps"));
    });
  }, [googleMapsApiKey]);

  // 1. Initialize Google Map once with rounded framing & clean controls
  useEffect(() => {
    if (!mapContainer.current || !isScriptLoaded || !window.google) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 18.7537, lng: 73.4062 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: true,
      gestureHandling: "greedy",
    });

    // Dismiss open popup card when clicking on map background
    map.current.addListener("click", () => {
      handleSelectProperty(null);
    });
  }, [isScriptLoaded]);

  // 2. Clear open popup card whenever loading starts or location changes
  useEffect(() => {
    if (loading) {
      setInternalSelectedProperty(null);
      onPropertySelect?.(null);
    }
  }, [loading]);

  useEffect(() => {
    setInternalSelectedProperty(null);
    onPropertySelect?.(null);
  }, [selectedLocation]);

  // 3. Sync activePropertyId from parent (card click, marker click, or filter reset)
  useEffect(() => {
    if (!activePropertyId) {
      setInternalSelectedProperty(null);
      return;
    }
    const target = properties?.find((p) => p.id === activePropertyId);
    if (target) {
      setInternalSelectedProperty(target);
      if (map.current && target.coordinates?.length >= 2) {
        map.current.panTo({
          lat: target.coordinates[0],
          lng: target.coordinates[1],
        });
      }
    } else {
      setInternalSelectedProperty(null);
    }
  }, [activePropertyId, properties]);

  // 4. Draw and update markers dynamically when properties change
  useEffect(() => {
    if (!map.current || !window.google) return;

    // Clear existing overlays
    overlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    overlaysRef.current = [];

    properties?.forEach((property) => {
      if (!property.coordinates || property.coordinates.length < 2) return;

      const overlay = new window.google.maps.OverlayView();
      overlay._div = null;

      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.transform = "translate(-50%, -100%)";
        div.style.pointerEvents = "auto";
        div.id = `map-marker-${property.id}`;
        this._div = div;

        const root = createRoot(div);
        root.render(
          <PropertyMarker
            price={getDisplayPrice(property.price)}
            onClick={(e) => {
              e?.stopPropagation?.();
              handleSelectProperty(property);
              if (map.current && property.coordinates?.length >= 2) {
                map.current.panTo({
                  lat: property.coordinates[0],
                  lng: property.coordinates[1],
                });
              }
            }}
            onMouseEnter={() => {
              if (
                typeof window !== "undefined" &&
                window.matchMedia("(hover: hover)").matches
              ) {
                handleSelectProperty(property);
              }
            }}
            image={property.images?.[0] || property.image}
            has3DTour={property.has3DTour}
          />
        );

        const panes = this.getPanes();
        panes?.overlayMouseTarget.appendChild(div);
      };

      overlay.draw = function () {
        const projection = this.getProjection();
        if (!projection) return;
        const latLng = new window.google.maps.LatLng(
          property.coordinates[0],
          property.coordinates[1]
        );
        const pos = projection.fromLatLngToDivPixel(latLng);
        const div = this._div;
        if (div && pos) {
          div.style.left = pos.x + "px";
          div.style.top = pos.y + "px";
        }
      };

      overlay.onRemove = function () {
        const div = this._div;
        if (div && div.parentNode) {
          div.parentNode.removeChild(div);
        }
      };

      overlay.setMap(map.current);
      overlaysRef.current.push(overlay);
    });

    // Fit map bounds to encompass active markers
    if (properties && properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      let hasValidCoords = false;
      properties.forEach((property) => {
        if (property.coordinates && property.coordinates.length === 2) {
          bounds.extend(
            new window.google.maps.LatLng(
              property.coordinates[0],
              property.coordinates[1]
            )
          );
          hasValidCoords = true;
        }
      });

      if (hasValidCoords) {
        map.current.fitBounds(bounds);

        const listener = window.google.maps.event.addListener(
          map.current,
          "bounds_changed",
          function () {
            if (this.getZoom() > 14) {
              this.setZoom(14);
            }
            window.google.maps.event.removeListener(listener);
          }
        );
      }
    }
  }, [properties, isScriptLoaded]);

  // 5. Highlight active marker on the map
  const currentActiveId = selectedProperty?.id || activePropertyId;

  useEffect(() => {
    properties?.forEach((property) => {
      const el = document.getElementById(`map-marker-${property.id}`);
      if (el) {
        const innerMarker = el.querySelector(".villa-marker");
        if (innerMarker) {
          if (property.id === currentActiveId) {
            innerMarker.classList.add("marker-active");
            el.style.zIndex = "1000";
          } else {
            innerMarker.classList.remove("marker-active");
            el.style.zIndex = "";
          }
        }
      }
    });
  }, [currentActiveId, properties]);

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-neutral-100 rounded-3xl"></div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-neutral-200/90 shadow-sm bg-neutral-100">
      {/* Loading Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/40 backdrop-blur-xs rounded-3xl">
          <div className="flex flex-col items-center gap-2.5 bg-white/95 px-5 py-3.5 rounded-2xl shadow-lg border border-neutral-200">
            <div className="h-7 w-7 rounded-full border-3 border-orange-200 border-t-[#ff6900] animate-spin" />
            <p className="text-xs font-bold text-neutral-800">
              Searching map stays...
            </p>
          </div>
        </div>
      )}

      {/* Google Maps Canvas with Rounded Corners */}
      <div
        ref={mapContainer}
        className="w-full h-full rounded-3xl overflow-hidden"
        style={{ borderRadius: "24px" }}
      />

      {/* Redesigned Airbnb Map Popup Card (Positioned at bottom on mobile, top-left on desktop) */}
      {!loading && selectedProperty && (
        <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-4 max-w-[420px] mx-auto lg:top-5 lg:left-5 lg:bottom-auto lg:right-auto lg:max-w-none z-40 pointer-events-auto">
          <PropertyCard
            property={selectedProperty}
            onClose={() => handleSelectProperty(null)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
