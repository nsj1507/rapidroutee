import { LoadScript } from "@react-google-maps/api";
import { useState, useEffect, type ReactNode } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyCXpuqSgw_X4IqDM2NgIgfh9Seowbqt7II";
const LIBRARIES: ("places")[] = ["places"];

export function GoogleMapsProvider({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={LIBRARIES}>
      {children}
    </LoadScript>
  );
}

export { GOOGLE_MAPS_API_KEY };
