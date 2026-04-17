import { Car, Bus, PersonStanding, Bike } from "lucide-react";
import type { TravelModeKey } from "./RouteMap";

interface TravelModeSelectorProps {
  value: TravelModeKey;
  onChange: (mode: TravelModeKey) => void;
}

const MODES: { key: TravelModeKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "DRIVING", label: "Drive", icon: Car },
  { key: "WALKING", label: "Walk", icon: PersonStanding },
  { key: "TRANSIT", label: "Transit", icon: Bus },
  { key: "BICYCLING", label: "Cycle", icon: Bike },
];

export function TravelModeSelector({ value, onChange }: TravelModeSelectorProps) {
  return (
    <div className="grid grid-cols-4 gap-1.5 rounded-xl bg-secondary/50 p-1">
      {MODES.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-[11px] font-semibold font-[family-name:var(--font-heading)] transition-all ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-pressed={active}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
