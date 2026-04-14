import { Brain, Route, Sparkles } from "lucide-react";

const steps = [
  { icon: Brain, text: "Analyzing travel routes..." },
  { icon: Route, text: "Checking feasibility & availability..." },
  { icon: Sparkles, text: "Ranking best options..." },
];

export function AnalysisLoader() {
  return (
    <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <h3 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-sm">
          AI Route Intelligence
        </h3>
      </div>
      <div className="space-y-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                <Icon className="h-4 w-4 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">{step.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
