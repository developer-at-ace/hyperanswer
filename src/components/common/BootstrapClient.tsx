"use client";

import { useEffect } from "react";
import {
  googleAdsConversionLabel,
  googleAdsId,
} from "@/config/analytics";

declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      parameters: { send_to: string },
    ) => void;
  }
}

export function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");

    if (googleAdsConversionLabel) {
      window.gtag?.("event", "conversion", {
        send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
      });
    }
  }, []);
  return null;
}
