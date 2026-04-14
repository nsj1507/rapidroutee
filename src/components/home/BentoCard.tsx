import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface BentoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  onClick?: () => void;
}

export function BentoCard({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  onClick,
}: BentoCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 text-left transition-all hover:shadow-lg hover:border-primary/30 active:scale-[0.98]",
        className
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl mb-3 transition-transform group-hover:scale-110",
          iconClassName || "bg-primary/10 text-primary"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-[family-name:var(--font-heading)] font-semibold text-card-foreground text-sm">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
        {description}
      </p>
    </button>
  );
}
