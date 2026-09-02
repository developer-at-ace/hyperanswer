"use client";

import { useEffect } from "react";
import { trackGoogleAdsConversion } from "@/lib/googleAds";

export function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js");
    window.trackGoogleAdsConversion = trackGoogleAdsConversion;
  }, []);
  return null;
}
