import { MapPin, X, LocateFixed, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocationPermission, type PermissionState } from "@/hooks/useLocationPermission";

interface Props {
  onGranted?: (position: GeolocationPosition) => void;
}

export function LocationPermissionBanner({ onGranted }: Props) {
  const { status, dismissed, requestPermission, dismiss } = useLocationPermission();

  if (status === "granted" || status === "unsupported" || dismissed) return null;

  const handleAllow = async () => {
    const pos = await requestPermission();
    if (pos) onGranted?.(pos);
  };

  if (status === "denied") {
    return (
      <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl border border-emergency/20 bg-emergency/5 p-4">
        <AlertTriangle className="h-5 w-5 text-emergency shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground font-[family-name:var(--font-heading)]">
            Location access denied
          </p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Please enter your location manually for better results. You can enable location in your browser settings.
          </p>
        </div>
        <button onClick={dismiss} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // status === "prompt"
  return (
    <div className="mx-4 mt-3 flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <LocateFixed className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground font-[family-name:var(--font-heading)]">
          Enable location access
        </p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
          Allow location access to provide faster and more accurate routes and nearby emergency services.
        </p>
        <div className="flex gap-2 mt-3">
          <Button size="sm" className="rounded-xl text-xs" onClick={handleAllow}>
            <MapPin className="h-3.5 w-3.5" />
            Allow Location
          </Button>
          <Button size="sm" variant="ghost" className="rounded-xl text-xs" onClick={dismiss}>
            Not now
          </Button>
        </div>
      </div>
      <button onClick={dismiss} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
