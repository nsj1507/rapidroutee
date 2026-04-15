import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect: (place: { name: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder,
  className,
  icon,
}: PlacesAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "in" },
      fields: ["formatted_address", "geometry", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        const name = place.formatted_address || place.name || "";
        onChange(name);
        onPlaceSelect({
          name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    });

    autocompleteRef.current = autocomplete;

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [isLoaded]);

  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {icon}
        </div>
      )}
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(icon && "pl-10", "rounded-xl", className)}
        disabled={!isLoaded}
      />
    </div>
  );
}
