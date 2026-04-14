import { createFileRoute } from "@tanstack/react-router";
import {
  User,
  Mail,
  Phone,
  Shield,
  Bell,
  ChevronRight,
  LogIn,
  MapPin,
  Heart,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Rapid Route+" },
      { name: "description", content: "Manage your profile, emergency contacts, and preferences." },
      { property: "og:title", content: "Profile — Rapid Route+" },
      { property: "og:description", content: "Manage your Rapid Route+ account." },
    ],
  }),
  component: ProfilePage,
});

const menuItems = [
  { icon: User, label: "Personal Details", desc: "Name, email, phone" },
  { icon: Phone, label: "Emergency Contacts", desc: "Saved contacts for SOS alerts" },
  { icon: MapPin, label: "Saved Locations", desc: "Home, work, favorites" },
  { icon: Heart, label: "Travel Preferences", desc: "Preferred modes & settings" },
  { icon: Bell, label: "Notifications", desc: "Alerts & emergency updates" },
  { icon: Shield, label: "Privacy & Security", desc: "Account security settings" },
];

function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Profile" subtitle="Manage your account" />

      <main className="px-4 py-4 space-y-5">
        {/* Sign In CTA */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mx-auto mb-3">
            <User className="h-8 w-8" />
          </div>
          <h2 className="font-[family-name:var(--font-heading)] font-bold text-foreground text-lg">
            Welcome to Rapid Route+
          </h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Sign in to save contacts, preferences, and get personalized travel suggestions.
          </p>
          <div className="flex gap-2 justify-center">
            <Button size="lg" className="rounded-xl flex-1">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl flex-1">
              <Mail className="h-4 w-4" />
              Sign Up
            </Button>
          </div>
        </div>

        {/* Menu Items */}
        <section>
          <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
            Settings
          </h2>
          <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-3 w-full p-4 text-left hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-[family-name:var(--font-heading)] font-medium text-card-foreground text-sm">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
