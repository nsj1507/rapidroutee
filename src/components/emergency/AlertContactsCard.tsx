import { useEffect, useState } from "react";
import { Users, Send, Phone, MessageCircle, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}

interface AlertContactsCardProps {
  location: { lat: number; lng: number; address?: string } | null;
  onRequestLocation: () => Promise<{ lat: number; lng: number; address?: string } | null>;
}

type AlertStatus = "idle" | "sending" | "sent" | "failed";

export function AlertContactsCard({ location, onRequestLocation }: AlertContactsCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AlertStatus>("idle");
  const [lastSentAt, setLastSentAt] = useState<Date | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setContacts([]);
      return;
    }
    setLoading(true);
    supabase
      .from("emergency_contacts")
      .select("id, name, phone, relationship")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("Failed to load emergency contacts:", error);
        setContacts(data ?? []);
        setLoading(false);
      });
  }, [isAuthenticated, user]);

  const buildMessage = (loc: { lat: number; lng: number; address?: string }) => {
    const mapsUrl = `https://maps.google.com/?q=${loc.lat},${loc.lng}`;
    const who = user?.user_metadata?.display_name || user?.email || "I";
    return `🚨 EMERGENCY: ${who} needs help. Current location: ${loc.address ?? `${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`}. Live map: ${mapsUrl}`;
  };

  const handleAlertAll = async () => {
    if (!contacts.length) {
      toast.error("No saved emergency contacts to alert.");
      return;
    }
    setStatus("sending");
    let loc = location;
    if (!loc) {
      loc = await onRequestLocation();
    }
    if (!loc) {
      setStatus("failed");
      toast.error("Location unavailable — cannot send alert.");
      return;
    }
    try {
      const message = buildMessage(loc);
      const recipients = contacts.map((c) => c.phone.replace(/\s+/g, "")).join(",");
      // Most platforms support sms:?addresses=...&body=... or sms:num1,num2?body=
      const smsUrl = `sms:${recipients}?body=${encodeURIComponent(message)}`;
      window.location.href = smsUrl;
      setStatus("sent");
      setLastSentAt(new Date());
      toast.success(`Alert prepared for ${contacts.length} contact${contacts.length > 1 ? "s" : ""}.`);
    } catch (e) {
      console.error("Alert failed:", e);
      setStatus("failed");
      toast.error("Failed to open messaging app.");
    }
  };

  const whatsappLink = (phone: string) => {
    if (!location) return "#";
    const msg = encodeURIComponent(buildMessage(location));
    const num = phone.replace(/[^\d+]/g, "");
    return `https://wa.me/${num.replace(/^\+/, "")}?text=${msg}`;
  };

  if (!isAuthenticated) {
    return (
      <section>
        <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground mb-3 text-base">
          My Emergency Contacts
        </h2>
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Sign in to save and alert emergency contacts
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-[family-name:var(--font-heading)] font-semibold text-foreground text-base">
          My Emergency Contacts
        </h2>
        {lastSentAt && (
          <span className="text-[10px] text-muted-foreground">
            Last alert {lastSentAt.toLocaleTimeString()}
          </span>
        )}
      </div>

      <Button
        onClick={handleAlertAll}
        disabled={status === "sending" || loading || contacts.length === 0}
        className="w-full rounded-xl bg-emergency hover:bg-emergency/90 text-emergency-foreground gap-2 h-12 shadow-lg shadow-emergency/30 mb-3"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending alert...
          </>
        ) : status === "sent" ? (
          <>
            <CheckCircle2 className="h-4 w-4" /> Alert sent — tap to resend
          </>
        ) : status === "failed" ? (
          <>
            <AlertTriangle className="h-4 w-4" /> Retry alert
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Alert all contacts with my location
          </>
        )}
      </Button>

      {!location && (
        <p className="text-[11px] text-muted-foreground mb-3 text-center">
          Location will be requested when you tap the alert button.
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading contacts...
        </div>
      )}

      {!loading && contacts.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 text-center">
          <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No emergency contacts saved yet</p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <ul className="space-y-2">
          {contacts.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
            >
              <div className="min-w-0">
                <p className="font-[family-name:var(--font-heading)] font-medium text-card-foreground text-sm truncate">
                  {c.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {c.phone}
                  {c.relationship ? ` · ${c.relationship}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${c.phone}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 text-success hover:bg-success/20"
                  aria-label={`Call ${c.name}`}
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={whatsappLink(c.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                  aria-label={`WhatsApp ${c.name}`}
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
