import { useState } from "react";
import {
  Navigation,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Car,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RouteDetails } from "./RouteMap";

interface DirectionsPanelProps {
  details: RouteDetails;
  from?: { lat: number; lng: number } | null;
  to?: { lat: number; lng: number } | null;
}

export function DirectionsPanel({ details, from, to }: DirectionsPanelProps) {
  const [expanded, setExpanded] = useState(false);

  const navUrl =
    from && to
      ? `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lng}&destination=${to.lat},${to.lng}&travelmode=driving`
      : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Car className="h-5 w-5" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">
              Driving Route
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {details.distance}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {details.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="space-y-1 text-xs text-muted-foreground">
        <p className="truncate">
          <span className="font-medium text-foreground">From:</span> {details.startAddress}
        </p>
        <p className="truncate">
          <span className="font-medium text-foreground">To:</span> {details.endAddress}
        </p>
      </div>

      {/* Action Buttons */}
      {navUrl && (
        <div className="space-y-2">
          <a href={navUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button className="w-full rounded-xl text-sm" size="lg">
              <Car className="h-4 w-4" />
              Use My Vehicle — Start Navigation
            </Button>
          </a>
          <div className="flex gap-2">
            <a href={navUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                <Navigation className="h-3.5 w-3.5" />
                Open in Google Maps
              </Button>
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${from!.lat},${from!.lng}&destination=${to!.lat},${to!.lng}&travelmode=driving&dir_action=navigate`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                <ExternalLink className="h-3.5 w-3.5" />
                Turn-by-Turn
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* Step-by-step directions */}
      {details.steps.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
          >
            {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {expanded ? "Hide" : "Show"} step-by-step directions ({details.steps.length} steps)
          </button>

          {expanded && (
            <ol className="mt-2 space-y-2 max-h-60 overflow-y-auto">
              {details.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-xs">
                  <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: step.instruction }}
                    />
                    <p className="text-muted-foreground mt-0.5">
                      {step.distance} · {step.duration}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
