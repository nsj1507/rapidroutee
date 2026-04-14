import {
  Bus,
  Train,
  Plane,
  Car,
  Clock,
  IndianRupee,
  ArrowRight,
  ExternalLink,
  ArrowRightLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const modeIcons: Record<string, LucideIcon> = {
  Train: Train,
  Bus: Bus,
  Flight: Plane,
  Car: Car,
};

const medalColors: Record<string, string> = {
  "🥇": "border-warning/40 bg-warning/5",
  "🥈": "border-muted-foreground/30 bg-muted/30",
  "🥉": "border-accent/30 bg-accent/5",
};

const availabilityConfig = {
  available: { icon: CheckCircle2, label: "Available", className: "text-success" },
  limited: { icon: AlertCircle, label: "Limited", className: "text-warning" },
  not_available: { icon: XCircle, label: "Not Available", className: "text-emergency" },
};

export interface RouteStep {
  instruction: string;
  duration: string;
}

export interface RouteData {
  rank: number;
  medal: string;
  mode: string;
  subMode?: string;
  feasibility: "direct" | "indirect" | "not_available";
  totalTime: string;
  estimatedCost: string;
  transfers: number;
  availability: "available" | "limited" | "not_available";
  urgencyScore: number;
  steps: RouteStep[];
  bookingPlatform: { name: string; url: string };
  pros: string[];
  cons: string[];
}

export function RouteCard({ route, isEmergency }: { route: RouteData; isEmergency: boolean }) {
  const Icon = modeIcons[route.mode] || Car;
  const avail = availabilityConfig[route.availability] || availabilityConfig.available;
  const AvailIcon = avail.icon;
  const borderClass = medalColors[route.medal] || "";

  return (
    <div className={`rounded-2xl border-2 ${borderClass} bg-card p-4 space-y-3 transition-all`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">{route.medal}</span>
              <h3 className="font-[family-name:var(--font-heading)] font-bold text-card-foreground">
                {route.mode}
              </h3>
              {route.subMode && (
                <span className="text-xs text-muted-foreground">({route.subMode})</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <AvailIcon className={`h-3.5 w-3.5 ${avail.className}`} />
              <span className={`text-xs font-medium ${avail.className}`}>{avail.label}</span>
              {route.feasibility === "indirect" && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 ml-1">
                  Indirect
                </Badge>
              )}
            </div>
          </div>
        </div>
        {isEmergency && route.rank === 1 && (
          <div className="flex items-center gap-1 rounded-lg bg-emergency/10 px-2.5 py-1 text-emergency">
            <Zap className="h-3.5 w-3.5" />
            <span className="text-xs font-bold font-[family-name:var(--font-heading)]">FASTEST</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <Clock className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" />
          <p className="text-xs font-semibold text-foreground font-[family-name:var(--font-heading)]">{route.totalTime}</p>
          <p className="text-[10px] text-muted-foreground">Duration</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <IndianRupee className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" />
          <p className="text-xs font-semibold text-foreground font-[family-name:var(--font-heading)]">{route.estimatedCost}</p>
          <p className="text-[10px] text-muted-foreground">Cost</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-2 text-center">
          <ArrowRightLeft className="h-3.5 w-3.5 mx-auto text-muted-foreground mb-0.5" />
          <p className="text-xs font-semibold text-foreground font-[family-name:var(--font-heading)]">{route.transfers}</p>
          <p className="text-[10px] text-muted-foreground">Transfers</p>
        </div>
      </div>

      {/* Steps */}
      {route.steps.length > 0 && (
        <div className="space-y-1.5">
          {route.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground">{step.instruction}</p>
                <p className="text-[10px] text-muted-foreground/70">{step.duration}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pros/Cons */}
      <div className="flex gap-3 text-[11px]">
        {route.pros.length > 0 && (
          <div className="flex-1">
            {route.pros.map((p, i) => (
              <p key={i} className="text-success flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 shrink-0" /> {p}
              </p>
            ))}
          </div>
        )}
        {route.cons.length > 0 && (
          <div className="flex-1">
            {route.cons.map((c, i) => (
              <p key={i} className="text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3 shrink-0" /> {c}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Book Button */}
      <a
        href={route.bookingPlatform.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors font-[family-name:var(--font-heading)]"
      >
        Book on {route.bookingPlatform.name}
        <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
