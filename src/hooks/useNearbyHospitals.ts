import { useState, useCallback } from "react";

export interface NearbyHospital {
  name: string;
  address: string;
  distance: string;
  distanceMeters: number;
  duration: string;
  lat: number;
  lng: number;
  rating?: number;
  isOpen?: boolean;
  placeId: string;
}

// Haversine formula — straight-line distance in meters
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function estimateDuration(meters: number): string {
  // Assume ~40 km/h average urban driving
  const minutes = Math.max(1, Math.round((meters / 1000 / 40) * 60));
  return `~${minutes} min`;
}

export function useNearbyHospitals() {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (lat: number, lng: number) => {
    if (typeof google === "undefined" || !google.maps?.places) {
      setError("Maps service not ready. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const location = new google.maps.LatLng(lat, lng);
      const mapDiv = document.createElement("div");
      const service = new google.maps.places.PlacesService(mapDiv);

      const results = await new Promise<google.maps.places.PlaceResult[]>(
        (resolve, reject) => {
          service.nearbySearch(
            {
              location,
              rankBy: google.maps.places.RankBy.DISTANCE,
              type: "hospital",
            },
            (results, status) => {
              if (
                status === google.maps.places.PlacesServiceStatus.OK &&
                results &&
                results.length > 0
              ) {
                resolve(results.slice(0, 8));
              } else if (
                status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              ) {
                reject(new Error("No hospitals found nearby"));
              } else {
                reject(new Error(`Hospital search failed: ${status}`));
              }
            }
          );
        }
      );

      // Try Distance Matrix API for driving distance/duration; fall back to Haversine
      let distanceElements: google.maps.DistanceMatrixResponseElement[] | null = null;

      try {
        const distanceService = new google.maps.DistanceMatrixService();
        const destinations = results
          .filter((r) => r.geometry?.location)
          .map((r) => r.geometry!.location!);

        const distanceResult = await new Promise<google.maps.DistanceMatrixResponse>(
          (resolve, reject) => {
            distanceService.getDistanceMatrix(
              {
                origins: [location],
                destinations,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
              },
              (response, status) => {
                if (
                  status === google.maps.DistanceMatrixStatus.OK &&
                  response
                ) {
                  resolve(response);
                } else {
                  reject(new Error(`Distance Matrix status: ${status}`));
                }
              }
            );
          }
        );

        distanceElements = distanceResult.rows[0]?.elements || null;
      } catch (distErr) {
        console.warn(
          "Distance Matrix unavailable, using straight-line distance fallback:",
          distErr
        );
      }

      const hospitalList: NearbyHospital[] = results
        .map((place, i) => {
          if (!place.geometry?.location) return null;
          const hLat = place.geometry.location.lat();
          const hLng = place.geometry.location.lng();

          const el = distanceElements?.[i];
          let distanceMeters: number;
          let distanceText: string;
          let durationText: string;

          if (el && el.status === "OK" && el.distance && el.duration) {
            distanceMeters = el.distance.value;
            distanceText = el.distance.text;
            durationText = el.duration.text;
          } else {
            distanceMeters = haversineMeters(lat, lng, hLat, hLng);
            distanceText = formatDistance(distanceMeters);
            durationText = estimateDuration(distanceMeters);
          }

          return {
            name: place.name || "Unknown Hospital",
            address: place.vicinity || "",
            distance: distanceText,
            distanceMeters,
            duration: durationText,
            lat: hLat,
            lng: hLng,
            rating: place.rating,
            isOpen: place.opening_hours?.isOpen?.(),
            placeId: place.place_id || "",
          } as NearbyHospital;
        })
        .filter(Boolean) as NearbyHospital[];

      hospitalList.sort((a, b) => a.distanceMeters - b.distanceMeters);
      setHospitals(hospitalList);

      if (hospitalList.length === 0) {
        setError("No hospitals found nearby");
      }
    } catch (e) {
      console.error("Nearby hospitals search error:", e);
      setError(e instanceof Error ? e.message : "Failed to find hospitals");
    } finally {
      setLoading(false);
    }
  }, []);

  return { hospitals, loading, error, search };
}
