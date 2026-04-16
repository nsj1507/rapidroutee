import { useState, useEffect, useCallback } from "react";

export type PermissionState = "prompt" | "granted" | "denied" | "unsupported";

export function useLocationPermission() {
  const [status, setStatus] = useState<PermissionState>("prompt");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setStatus("unsupported");
      return;
    }

    // Check if user previously dismissed
    try {
      if (sessionStorage.getItem("loc-prompt-dismissed") === "1") {
        setDismissed(true);
      }
    } catch {}

    // Use Permissions API if available
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setStatus(result.state as PermissionState);
        result.onchange = () => setStatus(result.state as PermissionState);
      }).catch(() => {
        // Permissions API not supported for geolocation in some browsers
      });
    }
  }, []);

  const requestPermission = useCallback((): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setStatus("granted");
          resolve(pos);
        },
        (err) => {
          if (err.code === 1) setStatus("denied");
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
      );
    });
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try { sessionStorage.setItem("loc-prompt-dismissed", "1"); } catch {}
  }, []);

  return { status, dismissed, requestPermission, dismiss };
}
