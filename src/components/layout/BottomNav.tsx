import { Link, useLocation } from "@tanstack/react-router";
import { Home, AlertTriangle, Navigation, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/" as const, icon: Home, label: "Home" },
  { to: "/emergency" as const, icon: AlertTriangle, label: "Emergency" },
  { to: "/travel" as const, icon: Navigation, label: "Travel" },
  { to: "/profile" as const, icon: User, label: "Profile" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          const isEmergency = item.to === "/emergency";

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all text-xs",
                isActive
                  ? isEmergency
                    ? "text-emergency font-semibold"
                    : "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all",
                  isActive && !isEmergency && "text-primary",
                  isActive && isEmergency && "text-emergency"
                )}
              />
              <span className="font-[family-name:var(--font-heading)]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
