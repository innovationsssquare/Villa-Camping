import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { PropertyMarker } from "./PropertyMarker";
import { PropertyCard } from "./PropertyCard";
import { PropertyHoverCard } from "./PropertyHoverCard";

import villa1 from "@/public/Productasset/Villaimg.png";
import villa2 from "@/public/Productasset/Campimg.png";
import house1 from "@/public/Productasset/Villaimg.png";
import villa3 from "@/public/Productasset/Campimg.png";

const SAMPLE_PROPERTIES = [
  {
    id: "1",
    price: 785000,
    title: "Luxury Villa in Lonavala",
    address: "Lonavala Hills, Maharashtra 410403",
    beds: 4,
    baths: 4,
    sqft: 2819,
    coordinates: [73.4062, 18.7537],
    image: villa1,
    type: "villa",
    features: ["Pool", "Garden", "Mountain View"],
    isHot: true,
    has3DTour: true,
    images: [villa1, villa2, villa3],
    description:
      "Beautiful luxury villa with stunning mountain views and modern amenities. Perfect for weekend getaways with family and friends.",
  },
  {
    id: "2",
    price: 332000,
    title: "Cozy Retreat Villa",
    address: "Pune Hills, Maharashtra 411057",
    beds: 3,
    baths: 2,
    sqft: 1850,
    coordinates: [73.8567, 18.5204],
    image: villa2,
    type: "villa",
    features: ["Garden", "Parking"],
    isHot: true,
    images: [villa2, house1],
    description:
      "Perfect cozy retreat for weekend getaways. Features beautiful garden and secure parking.",
  },
  {
    id: "3",
    price: 170000,
    title: "Modern Villa Camp",
    address: "Khandala Valley, Maharashtra 410301",
    beds: 2,
    baths: 2,
    sqft: 1200,
    coordinates: [73.3931, 18.7322],
    image: house1,
    type: "house",
    isDeal: true,
    has3DTour: true,
    images: [house1, villa3],
    description:
      "Modern villa camp with contemporary design and valley views. Great deal for young couples.",
  },
  {
    id: "4",
    price: 339000,
    title: "Premium Mountain Villa",
    address: "Karjat Hills, Maharashtra 410201",
    beds: 5,
    baths: 3,
    sqft: 3200,
    coordinates: [73.3228, 18.9109],
    image: villa3,
    type: "villa",
    features: ["Pool", "Garden", "Valley View"],
    isDeal: true,
    images: [villa3, villa1, villa2],
    description:
      "Premium mountain villa with breathtaking valley views. Spacious 5-bedroom property with private pool and landscaped garden.",
  },
];

const MapView = ({ googleMapsApiKey, onPropertySelect, selectedLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoverPosition, setHoverPosition] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
      center: { lat: 18.7537, lng: 73.4062 }, // Lonavala center
      zoom: 11,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [{ color: "#f5f5f5" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#e9e9e9" }, { lightness: 17 }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }, { lightness: 17 }, { weight: 1.2 }],
        },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: false,
    });

    // Add property markers with custom React pin markers
    let moveHandler = null;
    SAMPLE_PROPERTIES.forEach((property) => {
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
            price={property.price}
            isHot={property.isHot}
            isDeal={property.isDeal}
            has3DTour={property.has3DTour}
            onClick={() => {
              setSelectedProperty(property);
              onPropertySelect?.(property);
            }}
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
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">
            Google Maps API Key Required
          </h3>
          <p className="text-gray-600 mb-4">
            Please enter your Google Maps API key to view the map
          </p>
          <input
            type="text"
            placeholder="Enter Google Maps API key..."
            className="w-full max-w-md px-4 py-2 border rounded-lg"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // In a real app, this would be handled by parent component
                // console.log('API key entered:', (e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
      </div>
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
