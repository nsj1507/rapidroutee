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
    if (typeof window === "undefined" || !navigator.geolocation) {
      const msg = "Geolocation not supported by this browser";
      setError(msg);
      console.error(msg);
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
      console.log("GPS location acquired:", { lat, lng });

      let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      try {
        if (typeof google !== "undefined" && google.maps) {
          const geocoder = new google.maps.Geocoder();
          const result = await geocoder.geocode({ location: { lat, lng } });
          if (result.results[0]) {
            address = result.results[0].formatted_address;
          }
        }
      } catch (geoErr) {
        console.warn("Reverse geocoding failed, using coords:", geoErr);
      }

      const loc = { lat, lng, address };
      setLocation(loc);
      setLoading(false);
      return loc;
    } catch (e) {
      let msg = "Location detection failed";
      if (e && typeof e === "object" && "code" in e) {
        const code = (e as GeolocationPositionError).code;
        if (code === 1) msg = "Location permission denied";
        else if (code === 2) msg = "Unable to fetch location — position unavailable";
        else if (code === 3) msg = "Unable to fetch location — request timed out";
      }
      console.error("Geolocation error:", e, "->", msg);
      setError(msg);
      setLoading(false);
      return null;
    }
  }, []);

  return { location, loading, error, detect };
}
