import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone,
  Siren,
  Flame,
  Hospital,
  MapPin,
  Users,
  Search,
  ExternalLink,
  Navigation,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const nearbyHospitals = [
  { name: "City General Hospital", distance: "1.2 km", time: "4 min" },
  { name: "St. Mary's Medical Center", distance: "2.8 km", time: "8 min" },
  { name: "Apollo Hospital", distance: "4.1 km", time: "12 min" },
  { name: "Government District Hospital", distance: "5.5 km", time: "15 min" },
];

function EmergencyPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHospitals = nearbyHospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Emergency Mode" subtitle="Get help immediately" />

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

        {/* Nearby Hospitals */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Nearby Hospitals
          </h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.name}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <Hospital className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-heading)] font-medium text-card-foreground text-sm">
                      {hospital.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hospital.distance} · ~{hospital.time}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://maps.google.com/maps?q=${encodeURIComponent(hospital.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <Navigation className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
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
                  Central Railway Station
                </p>
                <p className="text-xs text-muted-foreground">3.2 km · ~10 min</p>
              </div>
            </div>
            <a
              href="https://maps.google.com/maps?q=railway+station+near+me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
