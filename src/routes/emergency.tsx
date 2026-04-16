import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Phone,
  Siren,
  Flame,
  Hospital,
  MapPin,
  Users,
  Search,
  Navigation,
  Crosshair,
  Star,
  Loader2,
  MapPinOff,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleMapsProvider, GOOGLE_MAPS_API_KEY } from "@/components/travel/GoogleMapsProvider";
import { useGPSLocation } from "@/hooks/useGPSLocation";
import { useNearbyHospitals, type NearbyHospital } from "@/hooks/useNearbyHospitals";
import { LocationPermissionBanner } from "@/components/location/LocationPermissionBanner";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Emergency Mode — Rapid Route+" },
      {
        name: "description",
        content: "One-tap SOS access to police, ambulance, fire, and nearest hospitals.",
      },
      { property: "og:title", content: "Emergency Mode — Rapid Route+" },
      { property: "og:description", content: "One-tap emergency services access." },
    ],
  }),
  component: EmergencyPage,
});

const emergencyContacts = [
  { name: "Emergency", number: "112", icon: Phone, color: "bg-emergency/10 text-emergency" },
  { name: "Police", number: "100", icon: Siren, color: "bg-primary/10 text-primary" },
  { name: "Ambulance", number: "108", icon: Hospital, color: "bg-success/10 text-success" },
  { name: "Fire", number: "101", icon: Flame, color: "bg-warning/10 text-warning" },
];

function EmergencyPageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const gps = useGPSLocation();
  const { hospitals, loading: hospitalsLoading, error: hospitalsError, search: searchHospitals } = useNearbyHospitals();
  const [autoDetected, setAutoDetected] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    if (!autoDetected) {
      setAutoDetected(true);
      gps.detect().then((loc) => {
        if (loc) {
          searchHospitals(loc.lat, loc.lng);
        }
      });
    }
  }, [autoDetected, gps, searchHospitals]);

  const handleRefreshLocation = async () => {
    const loc = await gps.detect();
    if (loc) {
      searchHospitals(loc.lat, loc.lng);
    }
  };

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNavigationUrl = (hospital: NearbyHospital) => {
    if (gps.location) {
      return `https://www.google.com/maps/dir/${gps.location.lat},${gps.location.lng}/${hospital.lat},${hospital.lng}`;
    }
    return `https://www.google.com/maps/place/?q=place_id:${hospital.placeId}`;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Emergency Mode" subtitle="Get help immediately" />

      <LocationPermissionBanner
        onGranted={(pos) => {
          searchHospitals(pos.coords.latitude, pos.coords.longitude);
        }}
      />

      <main className="px-4 py-4 space-y-5">
        {/* SOS Dial */}
        <div className="flex justify-center">
          <a
            href="tel:112"
            className="flex h-28 w-28 items-center justify-center rounded-full bg-emergency text-emergency-foreground shadow-2xl shadow-emergency/40 active:scale-95 transition-transform animate-pulse"
          >
            <div className="text-center">
              <Phone className="h-8 w-8 mx-auto mb-1" />
              <span className="text-sm font-bold font-[family-name:var(--font-heading)]">
                SOS
              </span>
            </div>
          </a>
        </div>

        {/* Emergency Numbers */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Emergency Services
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {emergencyContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.number}
                  href={`tel:${contact.number}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${contact.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-heading)] font-semibold text-card-foreground text-sm">
                      {contact.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{contact.number}</p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Nearby Hospitals — Real-time */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-base">
              Nearby Hospitals
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl gap-1.5 text-xs"
              onClick={handleRefreshLocation}
              disabled={gps.loading || hospitalsLoading}
            >
              <Crosshair className={`h-3.5 w-3.5 ${gps.loading ? "animate-spin" : ""}`} />
              {gps.loading ? "Detecting..." : "Refresh"}
            </Button>
          </div>

          {gps.location && (
            <div className="flex items-center gap-2 mb-3 rounded-xl bg-primary/5 border border-primary/20 px-3 py-2">
              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground truncate">
                {gps.location.address}
              </p>
            </div>
          )}

          {gps.error && (
            <div className="flex items-center gap-2 mb-3 rounded-xl bg-emergency/5 border border-emergency/20 px-3 py-2">
              <MapPinOff className="h-3.5 w-3.5 text-emergency shrink-0" />
              <p className="text-xs text-emergency">{gps.error}</p>
            </div>
          )}

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>

          {hospitalsLoading && (
            <div className="flex items-center justify-center gap-2 py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Finding nearby hospitals...</p>
            </div>
          )}

          {hospitalsError && !hospitalsLoading && (
            <div className="rounded-xl border border-emergency/20 bg-emergency/5 p-4 text-center">
              <p className="text-sm text-emergency">{hospitalsError}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Enable location access to find hospitals near you.
              </p>
            </div>
          )}

          {!hospitalsLoading && !hospitalsError && filteredHospitals.length > 0 && (
            <div className="space-y-2">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.placeId}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success shrink-0">
                      <Hospital className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-heading)] font-medium text-card-foreground text-sm truncate">
                        {hospital.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{hospital.distance} · ~{hospital.duration}</span>
                        {hospital.rating && (
                          <span className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 text-warning fill-warning" />
                            {hospital.rating}
                          </span>
                        )}
                      </div>
                      {hospital.isOpen !== undefined && (
                        <span className={`text-[10px] font-medium ${hospital.isOpen ? "text-success" : "text-emergency"}`}>
                          {hospital.isOpen ? "Open now" : "Closed"}
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={getNavigationUrl(hospital)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0 ml-2"
                  >
                    <Navigation className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {!hospitalsLoading && !hospitalsError && hospitals.length === 0 && !gps.location && (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
              <Crosshair className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Allow location access to find hospitals near you
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 rounded-xl"
                onClick={handleRefreshLocation}
              >
                Detect Location
              </Button>
            </div>
          )}
        </section>

        {/* Emergency Contacts */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            My Emergency Contacts
          </h2>
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Sign in to save emergency contacts
            </p>
            <Button variant="outline" size="sm" className="mt-3 rounded-xl">
              Set up contacts
            </Button>
          </div>
        </section>

        {/* Nearest Station */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Nearest Railway Station
          </h2>
          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="font-[family-name:var(--font-heading)] font-medium text-card-foreground text-sm">
                  {gps.location ? "Finding nearest station..." : "Central Railway Station"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {gps.location ? "Based on your location" : "Enable GPS for accurate data"}
                </p>
              </div>
            </div>
            <a
              href={
                gps.location
                  ? `https://www.google.com/maps/search/railway+station/@${gps.location.lat},${gps.location.lng},14z`
                  : "https://maps.google.com/maps?q=railway+station+near+me"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Navigation className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}

function EmergencyPage() {
  return (
    <GoogleMapsProvider>
      <EmergencyPageContent />
    </GoogleMapsProvider>
  );
}
