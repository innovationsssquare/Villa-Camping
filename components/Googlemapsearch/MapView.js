import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PropertyMarker } from "./PropertyMarker";
import { PropertyCard } from "./PropertyCard";
import { PropertyHoverCard } from "./PropertyHoverCard";

import villa1 from "@/public/Productasset/Villaimg.png";
import villa2 from "@/public/Productasset/Campimg.png";
import house1 from "@/public/Productasset/Villaimg.png";
import villa3 from "@/public/Productasset/Campimg.png";
import { getDisplayPrice } from "./getDisplayPrice";

const MapView = ({
  googleMapsApiKey,
  onPropertySelect,
  selectedLocation,
  properties,
  loading,
  hoveredPropertyId,
  onPropertyHover,
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const overlaysRef = useRef([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (!googleMapsApiKey) return;
    import("@/lib/googleMapsLoader").then(({ loadGoogleMaps }) => {
      loadGoogleMaps(googleMapsApiKey)
        .then(() => setIsScriptLoaded(true))
        .catch(() => console.error("Failed to load Google Maps"));
    });
  }, [googleMapsApiKey]);

  // 1. Initialize Google Map once
  useEffect(() => {
    if (!mapContainer.current || !isScriptLoaded || !window.google) return;

    map.current = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 18.7537, lng: 73.4062 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
  }, [isScriptLoaded]);

  // 2. Draw and update markers dynamically when properties change
  useEffect(() => {
    if (!map.current || !window.google) return;

    // Clear existing overlays
    overlaysRef.current.forEach((overlay) => {
      overlay.setMap(null);
    });
    overlaysRef.current = [];

    let moveHandler = null;
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
            onClick={() => {
              setSelectedProperty(property);
              onPropertySelect?.(property);
            }}
            image={property.image}
            has3DTour={property.has3DTour}
          />
        );

        div.addEventListener("mouseenter", () => {
          onPropertyHover?.(property.id, "map");
          setHoveredProperty(property);
          moveHandler = (e) => setHoverPosition({ x: e.clientX, y: e.clientY });
          window.addEventListener("mousemove", moveHandler);
        });

        div.addEventListener("mouseleave", () => {
          onPropertyHover?.(null, null);
          setHoveredProperty(null);
          setHoverPosition(null);
          if (moveHandler) {
            window.removeEventListener("mousemove", moveHandler);
            moveHandler = null;
          }
        });

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

    // Fit map bounds to encompass all active property markers
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
        
        // Prevent map from zooming in too close if there's only 1 marker
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

    return () => {
      if (moveHandler) {
        window.removeEventListener("mousemove", moveHandler);
      }
    };
  }, [properties, isScriptLoaded]);

  // 3. Lightweight style updating effect when hoveredPropertyId changes
  useEffect(() => {
    properties?.forEach((property) => {
      const el = document.getElementById(`map-marker-${property.id}`);
      if (el) {
        const innerMarker = el.querySelector(".villa-marker");
        if (innerMarker) {
          if (property.id === hoveredPropertyId) {
            innerMarker.classList.add("marker-active");
            el.style.zIndex = "1000";
          } else {
            innerMarker.classList.remove("marker-active");
            el.style.zIndex = "";
          }
        }
      }
    });
  }, [hoveredPropertyId, properties]);

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100"></div>
    );
  }

  return (
    <div className="relative w-full  h-full">
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/10 backdrop-blur-xs">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
            <p className="text-sm font-medium text-gray-700">
              Loading properties...
            </p>
          </div>
        </div>
      )}

      <div ref={mapContainer} className="w-full h-full " />

      {/* Hover Card */}
      {hoveredProperty && hoverPosition && (
        <PropertyHoverCard
          property={hoveredProperty}
          position={hoverPosition}
        />
      )}

      {/* Property Card Overlay */}
      {selectedProperty && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-50 w-[260px]">
          <PropertyCard
            property={selectedProperty}
            onClose={() => {
              setSelectedProperty(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;
