import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Bus,
  Train,
  Plane,
  Car,
  Clock,
  IndianRupee,
  ArrowRight,
  ExternalLink,
  Sparkles,
  LocateFixed,
  Navigation,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Last-Minute Travel — Rapid Route+" },
      {
        name: "description",
        content: "Compare bus, train, flight, and car routes. Find the fastest and cheapest travel option.",
      },
      { property: "og:title", content: "Last-Minute Travel — Rapid Route+" },
      { property: "og:description", content: "Compare and book travel options instantly." },
    ],
  }),
  component: TravelPage,
});

interface TravelOption {
  mode: string;
  icon: typeof Bus;
  time: string;
  cost: string;
  tag?: string;
  tagColor?: string;
  bookUrl: string;
  bookLabel: string;
}

const travelOptions: TravelOption[] = [
  {
    mode: "Bus",
    icon: Bus,
    time: "6h 30m",
    cost: "₹450–800",
    tag: "Cheapest",
    tagColor: "bg-success/10 text-success",
    bookUrl: "https://www.redbus.in",
    bookLabel: "RedBus / KSRTC",
  },
  {
    mode: "Train",
    icon: Train,
    time: "4h 15m",
    cost: "₹300–1,200",
    tag: "Best Value",
    tagColor: "bg-primary/10 text-primary",
    bookUrl: "https://www.irctc.co.in",
    bookLabel: "IRCTC",
  },
  {
    mode: "Flight",
    icon: Plane,
    time: "1h 10m",
    cost: "₹2,500–5,000",
    tag: "Fastest",
    tagColor: "bg-accent/10 text-accent",
    bookUrl: "https://www.skyscanner.co.in",
    bookLabel: "Skyscanner",
  },
  {
    mode: "Car",
    icon: Car,
    time: "5h 45m",
    cost: "₹1,200 (fuel)",
    bookUrl: "https://maps.google.com",
    bookLabel: "Google Maps",
  },
];

function TravelPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = () => {
    if (from && to) setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Last-Minute Travel" subtitle="Find your fastest route" />

      <main className="px-4 py-4 space-y-5">
        {/* Location Input */}
        <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
          <div className="relative">
            <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
            <Input
              placeholder="Current location"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emergency" />
            <Input
              placeholder="Where to?"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button
            onClick={handleSearch}
            className="w-full rounded-xl"
            size="lg"
            disabled={!from || !to}
          >
            <Navigation className="h-4 w-4" />
            Find Routes
          </Button>
        </div>

        {/* AI Suggestion */}
        {showResults && (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-foreground">
                AI Recommendation
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For <span className="font-medium text-foreground">{from}</span> →{" "}
              <span className="font-medium text-foreground">{to}</span>, we recommend
              taking the <span className="font-medium text-accent">train</span> — best
              balance of speed, cost, and comfort. Estimated 4h 15m at ₹300–1,200.
            </p>
          </div>
        )}

        {/* Travel Options */}
        {showResults && (
          <section>
            <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
              Travel Options
            </h2>
            <div className="space-y-3">
              {travelOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.mode}
                    className="rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-[family-name:var(--font-heading)] font-semibold text-card-foreground">
                              {option.mode}
                            </h3>
                            {option.tag && (
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${option.tagColor}`}
                              >
                                {option.tag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {option.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {option.cost}
                        </span>
                      </div>
                      <a
                        href={option.bookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors font-[family-name:var(--font-heading)]"
                      >
                        {option.bookLabel}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Booking Partners */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Booking Platforms
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "IRCTC", desc: "Train booking", url: "https://www.irctc.co.in" },
              { name: "Skyscanner", desc: "Flight search", url: "https://www.skyscanner.co.in" },
              { name: "MakeMyTrip", desc: "All travel", url: "https://www.makemytrip.com" },
              { name: "RedBus", desc: "Bus booking", url: "https://www.redbus.in" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-border bg-card p-3 transition-all hover:shadow-md hover:border-primary/30"
              >
                <p className="font-[family-name:var(--font-heading)] font-semibold text-card-foreground text-sm">
                  {p.name}
                </p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </a>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
