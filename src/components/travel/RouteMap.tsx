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

interface RouteMapProps {
  from?: { lat: number; lng: number } | null;
  to?: { lat: number; lng: number } | null;
  showDirections?: boolean;
  onRouteCalculated?: (details: RouteDetails | null) => void;
  onRouteError?: (error: string) => void;
}

export function RouteMap({ from, to, showDirections = true, onRouteCalculated, onRouteError }: RouteMapProps) {
  const { isLoaded, loadError } = useGoogleMaps();
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  useEffect(() => {
    if (!isLoaded || !from || !to || !showDirections) {
      setDirections(null);
      onRouteCalculated?.(null);
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: from,
        destination: to,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
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
        } else {
          setDirections(null);
          onRouteCalculated?.(null);
          onRouteError?.("No driving route available between these locations.");
        }
      }
    );
  }, [isLoaded, from, to, showDirections]);

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
