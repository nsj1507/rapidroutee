import { useState, useCallback } from "react";

interface GPSLocation {
  lat: number;
  lng: number;
  address?: string;
}

export function useGPSLocation() {
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detect = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 30000,
        });
      });

      const { latitude: lat, longitude: lng } = position.coords;

      // Reverse geocode
      let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });
        if (result.results[0]) {
          address = result.results[0].formatted_address;
        }
      } catch {
        // fallback to coords
      }

      const loc = { lat, lng, address };
      setLocation(loc);
      setLoading(false);
      return loc;
    } catch (e) {
      const msg = e instanceof GeolocationPositionError
        ? e.code === 1 ? "Location permission denied" : "Could not detect location"
        : "Location detection failed";
      setError(msg);
      setLoading(false);
      return null;
    }
  }, []);

  return { location, loading, error, detect };
}
