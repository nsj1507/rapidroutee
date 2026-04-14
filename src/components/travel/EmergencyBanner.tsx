import { Zap, Clock } from "lucide-react";

interface EmergencyBannerProps {
  mode: string;
  reason: string;
  fastestReachTime: string;
}

export function EmergencyBanner({ mode, reason, fastestReachTime }: EmergencyBannerProps) {
  return (
    <div className="rounded-2xl border-2 border-emergency/40 bg-gradient-to-br from-emergency/10 to-emergency/5 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-emergency" />
        <h3 className="font-[family-name:var(--font-heading)] font-bold text-emergency text-sm">
          FASTEST REACH TIME
        </h3>
      </div>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center gap-1.5 rounded-lg bg-emergency/15 px-3 py-1.5">
          <Clock className="h-4 w-4 text-emergency" />
          <span className="font-[family-name:var(--font-heading)] font-bold text-emergency text-lg">
            {fastestReachTime}
          </span>
        </div>
        <span className="font-[family-name:var(--font-heading)] font-semibold text-foreground">
          via {mode}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">{reason}</p>
    </div>
  );
}
