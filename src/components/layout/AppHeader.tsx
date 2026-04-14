import { MapPin } from "lucide-react";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title = "Rapid Route+", subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-lg border-b border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary text-primary-foreground">
          <MapPin className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-[family-name:var(--font-heading)] text-foreground leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
