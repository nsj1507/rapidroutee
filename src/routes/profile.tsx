import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
  LogOut,
} from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Rapid Route+" },
      { name: "description", content: "Manage your profile, emergency contacts, and preferences." },
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
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppHeader title="Profile" subtitle="Manage your account" />

      <main className="px-4 py-4 space-y-5">
        {!isAuthenticated ? (
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
              <Link to="/login" className="flex-1">
                <Button size="lg" className="rounded-xl w-full">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" className="flex-1">
                <Button variant="outline" size="lg" className="rounded-xl w-full">
                  <Mail className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h2 className="font-[family-name:var(--font-heading)] font-bold text-foreground">
                {user?.user_metadata?.display_name || user?.email}
              </h2>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )}

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

        {isAuthenticated && (
          <Button
            variant="outline"
            className="w-full rounded-xl text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
