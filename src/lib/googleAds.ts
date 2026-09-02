import { googleAdsConversionSendTo } from "@/config/analytics";

type Gtag = {
  (command: "event", eventName: string, parameters: { send_to: string }): void;
};

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: Gtag;
    trackGoogleAdsConversion?: () => boolean;
    __googleAdsConversionTracked?: boolean;
  }
}

export function trackGoogleAdsConversion(): boolean {
  if (
    typeof window === "undefined" ||
    !window.gtag ||
    window.__googleAdsConversionTracked
  ) {
    return false;
  }

  window.gtag("event", "conversion", {
    send_to: googleAdsConversionSendTo,
  });
  window.__googleAdsConversionTracked = true;
  console.log(
    "Google Ads conversion tracked:",
    googleAdsConversionSendTo,
  );
  return true;
}
