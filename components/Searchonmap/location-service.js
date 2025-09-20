"use client";

// Mock backend locations - in real app, this would come from your backend API
export const availableLocations = [
  {
    id: "lonavala",
    name: "Lonavala",
    coordinates: { lat: 18.7537, lng: 73.4135 },
    propertyCount: 24,
    isActive: true,
    description: "Hill station with scenic views and luxury villas",
    popularAmenities: ["Pool", "Mountain View", "WiFi"],
  },
  {
    id: "khandala",
    name: "Khandala",
    coordinates: { lat: 18.7645, lng: 73.3897 },
    propertyCount: 18,
    isActive: true,
    description: "Peaceful retreat with valley views",
    popularAmenities: ["Valley View", "Fireplace", "Garden"],
  },
  {
    id: "pune-hills",
    name: "Pune Hills",
    coordinates: { lat: 18.5204, lng: 73.8567 },
    propertyCount: 31,
    isActive: true,
    description: "Modern villas near Pune city",
    popularAmenities: ["City Access", "Modern Amenities", "Parking"],
  },
  {
    id: "mahabaleshwar",
    name: "Mahabaleshwar",
    coordinates: { lat: 17.9334, lng: 73.6582 },
    propertyCount: 12,
    isActive: true,
    description: "Heritage properties in strawberry capital",
    popularAmenities: ["Heritage", "Garden", "Peaceful"],
  },
  {
    id: "panchgani",
    name: "Panchgani",
    coordinates: { lat: 17.9258, lng: 73.8009 },
    propertyCount: 8,
    isActive: true,
    description: "Table land views and colonial charm",
    popularAmenities: ["Table Land View", "Colonial", "Horseback Riding"],
  },
  {
    id: "karjat",
    name: "Karjat",
    coordinates: { lat: 18.9107, lng: 73.3249 },
    propertyCount: 15,
    isActive: true,
    description: "Adventure sports and river views",
    popularAmenities: ["River View", "Adventure Sports", "Trekking"],
  },
];

// Service functions that would typically call your backend API
export class LocationService {
  static async getAvailableLocations() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(availableLocations.filter((loc) => loc.isActive));
      }, 100);
    });
  }

  static async searchLocations(query) {
    // Simulate API search
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = availableLocations.filter(
          (location) =>
            location.isActive &&
            (location.name.toLowerCase().includes(query.toLowerCase()) ||
              location.description?.toLowerCase().includes(query.toLowerCase()))
        );
        resolve(filtered);
      }, 200);
    });
  }

  static async getLocationById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const location = availableLocations.find(
          (loc) => loc.id === id && loc.isActive
        );
        resolve(location || null);
      }, 100);
    });
  }

  static async getNearbyLocations(coordinates, radiusKm = 50) {
    // Simple distance calculation for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        const nearby = availableLocations.filter((location) => {
          const distance = this.calculateDistance(
            coordinates,
            location.coordinates
          );
          return distance <= radiusKm && location.isActive;
        });
        resolve(nearby);
      }, 200);
    });
  }

  static calculateDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in km
    const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
    const dLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1.lat * Math.PI) / 180) *
        Math.cos((coord2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
