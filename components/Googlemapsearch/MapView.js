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
}) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  console.log(properties);
  useEffect(() => {
    if (!googleMapsApiKey) return;

    // Load Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setIsScriptLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [googleMapsApiKey]);

  useEffect(() => {
    if (!mapContainer.current || !isScriptLoaded || !window.google) return;

    // Initialize Google Map
    map.current = new window.google.maps.Map(mapContainer.current, {
      center: { lat: 18.7537, lng: 73.4062 },
      zoom: 11,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
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
      // disableDefaultUI: false,
      // zoomControl: true,
      // streetViewControl: false,
      // fullscreenControl: false,
    });

    // Add property markers with custom React pin markers
    let moveHandler = null;
    properties?.forEach((property) => {
      console.log(property, "prop");
      const overlay = new window.google.maps.OverlayView();
      overlay._div = null;

      overlay.onAdd = function () {
        const div = document.createElement("div");
        div.style.position = "absolute";
        div.style.transform = "translate(-50%, -100%)";
        div.style.pointerEvents = "auto";
        this._div = div;

        // Render React marker
        const root = createRoot(div);
        root.render(
          <PropertyMarker
            price={getDisplayPrice(property.price)}
            onClick={() => setSelectedProperty(property)}
            isDeal={property.isDeal}
            has3DTour={property.has3DTour}
            // onClick={() => {
            //   setSelectedProperty(property);
            //   onPropertySelect?.(property);
            // }}
          />
        );

        div.addEventListener("mouseenter", () => {
          setHoveredProperty(property);
          moveHandler = (e) => setHoverPosition({ x: e.clientX, y: e.clientY });
          window.addEventListener("mousemove", moveHandler);
        });
        div.addEventListener("mouseleave", () => {
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
          property.coordinates[1],
          property.coordinates[0]
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
    });
  }, [isScriptLoaded, onPropertySelect]);

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100"></div>
    );
  }

  return (
    <div className="relative w-full  h-full">
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
        <div className="absolute bottom-40 left-4 right-4 z-50">
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
