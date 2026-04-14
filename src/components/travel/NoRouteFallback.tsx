import { MapPin, ArrowRight } from "lucide-react";

interface NoRouteAlternative {
  nearestHub: string;
  steps: { instruction: string; duration: string }[];
  message: string;
}

export function NoRouteFallback({ data }: { data: NoRouteAlternative }) {
  return (
    <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-warning" />
        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">
          No Direct Route Available
        </h3>
      </div>
      <p className="text-sm text-muted-foreground">{data.message}</p>
      <div className="rounded-xl bg-card border border-border p-3 space-y-2">
        <p className="text-xs font-semibold text-foreground font-[family-name:var(--font-heading)]">
          Suggested via {data.nearestHub}:
        </p>
        {data.steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-warning/15 text-warning text-[10px] font-bold mt-0.5">
              {i + 1}
            </div>
            <div>
              <p className="text-muted-foreground">{step.instruction}</p>
              <p className="text-[10px] text-muted-foreground/70">{step.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
