import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Navigation,
  Phone,
  Hospital,
  Train,
  Plane,
  Bus,
  Car,
  Zap,
  Shield,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { BentoCard } from "@/components/home/BentoCard";
import { Button } from "@/components/ui/button";

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

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader subtitle="Your emergency travel companion" />

      <main className="px-4 py-4 space-y-4">
        {/* SOS Banner */}
        <button
          onClick={() => navigate({ to: "/emergency" })}
          className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emergency to-emergency/80 p-5 text-emergency-foreground shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emergency-foreground/20 backdrop-blur-sm">
              <Shield className="h-7 w-7" />
            </div>
            <div className="text-left">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold">
                Emergency SOS
              </h2>
              <p className="text-sm opacity-90">
                One-tap access to emergency services
              </p>
            </div>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emergency-foreground/10" />
        </button>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1.5 rounded-xl"
            onClick={() => window.open("tel:112")}
          >
            <Phone className="h-5 w-5 text-emergency" />
            <span className="text-xs">Call 112</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1.5 rounded-xl"
            onClick={() => navigate({ to: "/emergency" })}
          >
            <Hospital className="h-5 w-5 text-success" />
            <span className="text-xs">Hospital</span>
          </Button>
          <Button
            variant="outline"
            className="flex-col h-auto py-3 gap-1.5 rounded-xl"
            onClick={() => navigate({ to: "/travel" })}
          >
            <Zap className="h-5 w-5 text-accent" />
            <span className="text-xs">Quick Trip</span>
          </Button>
        </div>

        {/* Bento Grid */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Travel Modes
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <BentoCard
              icon={AlertTriangle}
              title="Emergency Mode"
              description="SOS, hospitals, police & fire services"
              iconClassName="bg-emergency/10 text-emergency"
              onClick={() => navigate({ to: "/emergency" })}
            />
            <BentoCard
              icon={Navigation}
              title="Last-Minute Travel"
              description="Compare routes & book instantly"
              iconClassName="bg-accent/10 text-accent"
              onClick={() => navigate({ to: "/travel" })}
            />
            <BentoCard
              icon={Train}
              title="Train"
              description="IRCTC booking & live tracking"
              onClick={() =>
                window.open("https://www.irctc.co.in", "_blank")
              }
            />
            <BentoCard
              icon={Plane}
              title="Flight"
              description="Find nearest airports & flights"
              onClick={() =>
                window.open("https://www.skyscanner.co.in", "_blank")
              }
            />
            <BentoCard
              icon={Bus}
              title="Bus"
              description="KSRTC, RedBus & local stops"
              onClick={() =>
                window.open("https://www.redbus.in", "_blank")
              }
            />
            <BentoCard
              icon={Car}
              title="Drive"
              description="Fastest driving route via maps"
              onClick={() =>
                window.open("https://maps.google.com", "_blank")
              }
            />
          </div>
        </section>

        {/* Booking Partners */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
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
