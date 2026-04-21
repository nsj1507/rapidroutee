import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  Zap,
  Clock,
  MapPin,
  Shield,
  Locate,
  Route as RouteIcon,
  User,
  ArrowRight,
} from "lucide-react";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { LocationPermissionBanner } from "@/components/location/LocationPermissionBanner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rapid Route+ — Emergency & Last-Minute Travel" },
      {
        name: "description",
        content:
          "Find the fastest, safest travel options during emergencies. One-tap SOS, real-time routes, and instant booking.",
      },
      { property: "og:title", content: "Rapid Route+ — Emergency Travel Assistant" },
      {
        property: "og:description",
        content: "Quick travel solutions for emergencies and last-minute trips.",
      },
    ],
  }),
  component: HomePage,
});

const badges = [
  { icon: Locate, label: "Live GPS" },
  { icon: Shield, label: "Safe Routes" },
  { icon: Clock, label: "Real-time" },
];

const howItWorks = [
  { step: "01", title: "Set Location", desc: "Auto-detect via GPS or type your origin" },
  { step: "02", title: "Choose Mode", desc: "Emergency or last-minute travel" },
  { step: "03", title: "Get Routes", desc: "AI analyzes and compares all options" },
  { step: "04", title: "Navigate", desc: "One-tap navigation to your destination" },
];

function HomePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <LocationPermissionBanner />
      {/* Dark Hero Header */}
      <header className="relative overflow-hidden bg-[oklch(0.15_0.05_240)] text-white px-5 pt-5 pb-8">
        {/* Decorative circle */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emergency/20" />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="RapidRoute+ logo" className="h-8 w-8 object-contain rounded-lg bg-white p-0.5" />
            <span className="text-xs font-semibold tracking-wider uppercase font-[family-name:var(--font-heading)] opacity-80">
              Rapid Route+
            </span>
          </div>
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link to="/login" className="flex items-center justify-center h-9 w-9 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
              <User className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] leading-tight">
            Your Emergency<br />Travel Assistant
          </h1>
          <p className="text-sm text-white/60 mt-2">
            AI-powered routing for urgent & last-minute travel
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex gap-2 mt-5 relative z-10">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/90"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
          ))}
        </div>
      </header>

      <main className="px-4 py-5 space-y-6">
        {/* Select Mode */}
        <section>
          <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3 font-[family-name:var(--font-heading)]">
            Select Mode
          </h2>

          {/* Emergency Card */}
          <button
            onClick={() => navigate({ to: "/emergency" })}
            className="relative w-full overflow-hidden rounded-2xl bg-emergency p-5 text-left text-white mb-3 active:scale-[0.98] transition-transform"
          >
            <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/20 mb-3">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">
                Emergency Travel
              </h3>
              <p className="text-sm text-white/80 mt-0.5">
                Fastest route to hospitals, police, fire stations
              </p>
            </div>
          </button>

          {/* Last-Minute Card */}
          <button
            onClick={() => navigate({ to: "/travel" })}
            className="relative w-full overflow-hidden rounded-2xl bg-primary p-5 text-left text-primary-foreground active:scale-[0.98] transition-transform"
          >
            <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-white/20 mb-3">
                <Clock className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold font-[family-name:var(--font-heading)]">
                Last-Minute Travel
              </h3>
              <p className="text-sm opacity-80 mt-0.5">
                AI-powered route comparison for urgent trips
              </p>
            </div>
          </button>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3 font-[family-name:var(--font-heading)]">
            How It Works
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {howItWorks.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-border bg-card p-4"
              >
                <span className="text-2xl font-bold text-primary/30 font-[family-name:var(--font-heading)]">
                  {item.step}
                </span>
                <h3 className="text-sm font-semibold text-card-foreground mt-1 font-[family-name:var(--font-heading)]">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section>
          <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3 font-[family-name:var(--font-heading)]">
            Book Now
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { name: "IRCTC", url: "https://www.irctc.co.in" },
              { name: "Skyscanner", url: "https://www.skyscanner.co.in" },
              { name: "MakeMyTrip", url: "https://www.makemytrip.com" },
              { name: "RedBus", url: "https://www.redbus.in" },
            ].map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary font-[family-name:var(--font-heading)]"
              >
                {partner.name}
              </a>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
