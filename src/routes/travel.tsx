import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  LocateFixed,
  Navigation,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Brain,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteCard, type RouteData } from "@/components/travel/RouteCard";
import { EmergencyBanner } from "@/components/travel/EmergencyBanner";
import { NoRouteFallback } from "@/components/travel/NoRouteFallback";
import { AnalysisLoader } from "@/components/travel/AnalysisLoader";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/travel")({
  head: () => ({
    meta: [
      { title: "Last-Minute Travel — Rapid Route+" },
      {
        name: "description",
        content:
          "AI-powered route intelligence. Compare bus, train, flight, and car routes with real-time feasibility analysis.",
      },
      { property: "og:title", content: "Last-Minute Travel — Rapid Route+" },
      { property: "og:description", content: "AI-powered travel route intelligence." },
    ],
  }),
  component: TravelPage,
});

interface AIAnalysis {
  routes: RouteData[];
  bestForEmergency: {
    mode: string;
    reason: string;
    fastestReachTime: string;
  } | null;
  noRouteAlternative: {
    nearestHub: string;
    steps: { instruction: string; duration: string }[];
    message: string;
  } | null;
  summary: string;
}

function TravelPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelMode, setTravelMode] = useState<"travel" | "emergency">("travel");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!from || !to) return;

    setIsAnalyzing(true);
    setAnalysis(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "route-intelligence",
        { body: { from, to, mode: travelMode } }
      );

      if (fnError) throw new Error(fnError.message || "AI analysis failed");
      if (data?.error) throw new Error(data.error);

      setAnalysis(data as AIAnalysis);
    } catch (e) {
      console.error("Route analysis error:", e);
      setError(e instanceof Error ? e.message : "Failed to analyze routes");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Route Intelligence" subtitle="AI-powered travel analysis" />

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

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTravelMode("travel")}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold font-[family-name:var(--font-heading)] transition-all ${
                travelMode === "travel"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <Navigation className="h-4 w-4" />
              Last-Minute Travel
            </button>
            <button
              onClick={() => setTravelMode("emergency")}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold font-[family-name:var(--font-heading)] transition-all ${
                travelMode === "emergency"
                  ? "bg-emergency text-emergency-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              Emergency Mode
            </button>
          </div>

          <Button
            onClick={handleSearch}
            className="w-full rounded-xl"
            size="lg"
            variant={travelMode === "emergency" ? "emergency" : "default"}
            disabled={!from || !to || isAnalyzing}
          >
            <Brain className="h-4 w-4" />
            {isAnalyzing ? "Analyzing Routes..." : "Analyze Routes with AI"}
          </Button>
        </div>

        {/* Loading */}
        {isAnalyzing && <AnalysisLoader />}

        {/* Error */}
        {error && (
          <div className="rounded-2xl border border-emergency/30 bg-emergency/5 p-4">
            <p className="text-sm text-emergency font-medium">{error}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try again or check your connection.
            </p>
          </div>
        )}

        {/* AI Results */}
        {analysis && (
          <>
            {/* Summary */}
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-[family-name:var(--font-heading)] font-semibold text-sm text-foreground">
                  AI Recommendation
                </h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* Emergency Banner */}
            {travelMode === "emergency" && analysis.bestForEmergency && (
              <EmergencyBanner
                mode={analysis.bestForEmergency.mode}
                reason={analysis.bestForEmergency.reason}
                fastestReachTime={analysis.bestForEmergency.fastestReachTime}
              />
            )}

            {/* No Route Fallback */}
            {analysis.noRouteAlternative && (
              <NoRouteFallback data={analysis.noRouteAlternative} />
            )}

            {/* Route Cards */}
            {analysis.routes.length > 0 && (
              <section>
                <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
                  Route Analysis ({analysis.routes.length} options)
                </h2>
                <div className="space-y-3">
                  {analysis.routes.map((route, i) => (
                    <RouteCard
                      key={`${route.mode}-${i}`}
                      route={route}
                      isEmergency={travelMode === "emergency"}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Booking Partners (always visible) */}
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
