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

export function useNearbyHospitals() {
  const [hospitals, setHospitals] = useState<NearbyHospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (lat: number, lng: number) => {
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
                results
              ) {
                resolve(results.slice(0, 8));
              } else {
                reject(new Error("No hospitals found nearby"));
              }
            }
          );
        }
      );

      // Calculate distances using Distance Matrix API
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
                reject(new Error("Distance calculation failed"));
              }
            }
          );
        }
      );

      const elements = distanceResult.rows[0]?.elements || [];
      const hospitalList: NearbyHospital[] = results
        .map((place, i) => {
          const el = elements[i];
          if (!place.geometry?.location || !el || el.status !== "OK")
            return null;

          return {
            name: place.name || "Unknown Hospital",
            address: place.vicinity || "",
            distance: el.distance?.text || "N/A",
            distanceMeters: el.distance?.value || 0,
            duration: el.duration?.text || "N/A",
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            rating: place.rating,
            isOpen: place.opening_hours?.isOpen?.(),
            placeId: place.place_id || "",
          } as NearbyHospital;
        })
        .filter(Boolean) as NearbyHospital[];

      hospitalList.sort((a, b) => a.distanceMeters - b.distanceMeters);
      setHospitals(hospitalList);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to find hospitals");
    } finally {
      setLoading(false);
    }
  }, []);

  return { hospitals, loading, error, search };
}
