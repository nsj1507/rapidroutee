import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useCallback, useEffect } from "react";
import { useGoogleMaps } from "./GoogleMapsProvider";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "1rem",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0c2340" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0c2340" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5cbdb9" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a4a6e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#2d8a9e" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1a2b" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#112d4a" }] },
];

export interface RouteDetails {
  distance: string;
  duration: string;
  steps: { instruction: string; distance: string; duration: string }[];
  startAddress: string;
  endAddress: string;
}

export type TravelModeKey = "DRIVING" | "WALKING" | "TRANSIT" | "BICYCLING";

interface RouteMapProps {
  from?: { lat: number; lng: number } | null;
  to?: { lat: number; lng: number } | null;
  fromText?: string;
  toText?: string;
  showDirections?: boolean;
  travelMode?: TravelModeKey;
  onRouteCalculated?: (details: RouteDetails | null) => void;
  onRouteError?: (error: string) => void;
  onCoordsResolved?: (coords: { from?: { lat: number; lng: number }; to?: { lat: number; lng: number } }) => void;
}

type LatLng = { lat: number; lng: number };

async function geocodeAddress(address: string): Promise<LatLng | null> {
  return new Promise((resolve) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results && results[0]?.geometry?.location) {
        const loc = results[0].geometry.location;
        resolve({ lat: loc.lat(), lng: loc.lng() });
      } else {
        resolve(null);
      }
    });
  });
}

function requestRoute(
  origin: LatLng,
  destination: LatLng,
  travelMode: google.maps.TravelMode
): Promise<{ result: google.maps.DirectionsResult | null; status: google.maps.DirectionsStatus }> {
  return new Promise((resolve) => {
    const service = new google.maps.DirectionsService();
    service.route({ origin, destination, travelMode }, (result, status) => {
      resolve({ result, status });
    });
  });
}

export function RouteMap({ from, to, fromText, toText, showDirections = true, travelMode = "DRIVING", onRouteCalculated, onRouteError, onCoordsResolved }: RouteMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (!isLoaded || !showDirections) {
      setDirections(null);
      onRouteCalculated?.(null);
      return;
    }

    let cancelled = false;

    (async () => {
      // Resolve origin/destination — geocode text if coords missing
      let origin: LatLng | null = from ?? null;
      let destination: LatLng | null = to ?? null;

      if (!origin && fromText) origin = await geocodeAddress(fromText);
      if (!destination && toText) destination = await geocodeAddress(toText);

      if (cancelled) return;

      if (!origin || !destination) {
        setDirections(null);
        onRouteCalculated?.(null);
        if (fromText || toText) {
          onRouteError?.("Could not locate one of the addresses. Try a more specific place.");
        }
        return;
      }

      onCoordsResolved?.({ from: origin, to: destination });

      // Try DRIVING first, then fall back to other modes
      const modes: google.maps.TravelMode[] = [
        google.maps.TravelMode.DRIVING,
        google.maps.TravelMode.TRANSIT,
        google.maps.TravelMode.WALKING,
      ];

      let lastStatus: google.maps.DirectionsStatus | null = null;
      for (const mode of modes) {
        const { result, status } = await requestRoute(origin, destination, mode);
        if (cancelled) return;
        lastStatus = status;
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
          const leg = result.routes[0]?.legs[0];
          if (leg) {
            onRouteCalculated?.({
              distance: leg.distance?.text || "N/A",
              duration: leg.duration?.text || "N/A",
              startAddress: leg.start_address || "",
              endAddress: leg.end_address || "",
              steps: (leg.steps || []).map((s) => ({
                instruction: s.instructions || "",
                distance: s.distance?.text || "",
                duration: s.duration?.text || "",
              })),
            });
          }
          onRouteError?.(undefined as unknown as string);
          return;
        }
      }

      // No mode worked
      console.warn("Directions failed for all modes. Last status:", lastStatus);
      setDirections(null);
      onRouteCalculated?.(null);
      const msg =
        lastStatus === google.maps.DirectionsStatus.ZERO_RESULTS
          ? "No route found between these locations. Try nearby landmarks."
          : lastStatus === google.maps.DirectionsStatus.REQUEST_DENIED
          ? "Directions request denied. Check Google Maps API key restrictions."
          : lastStatus === google.maps.DirectionsStatus.OVER_QUERY_LIMIT
          ? "Too many requests. Please wait a moment and try again."
          : `Unable to calculate route (${lastStatus ?? "unknown error"}).`;
      onRouteError?.(msg);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, from?.lat, from?.lng, to?.lat, to?.lng, fromText, toText, showDirections]);

  useEffect(() => {
    if (!map) return;
    if (from && to) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(from);
      bounds.extend(to);
      map.fitBounds(bounds, 60);
    } else if (from) {
      map.panTo(from);
      map.setZoom(13);
    }
  }, [map, from, to]);

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-card rounded-2xl border border-border">
        <p className="text-xs text-emergency">Map failed to load: {loadError.message}</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-card rounded-2xl border border-border">
        <p className="text-xs text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={from || defaultCenter}
      zoom={from ? 13 : 5}
      onLoad={onLoad}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        styles: darkMapStyle,
      }}
    >
      {from && !directions && <Marker position={from} label="A" />}
      {to && !directions && <Marker position={to} label="B" />}
      {directions && (
        <DirectionsRenderer
          directions={directions}
          options={{
            polylineOptions: {
              strokeColor: "#5cbdb9",
              strokeWeight: 5,
              strokeOpacity: 0.85,
            },
            suppressMarkers: false,
          }}
        />
      )}
    </GoogleMap>
  );
}
