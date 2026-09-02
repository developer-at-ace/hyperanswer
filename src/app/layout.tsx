import type { Metadata } from "next";
import Script from "next/script";
import { BootstrapClient } from "@/components/common/BootstrapClient";
import {
  googleAdsId,
  googleTagId,
} from "@/config/analytics";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trimmedi | Ask a question",
  description:
    "A simple place to ask a question and explore helpful starting points.",
  icons: {
    icon: "/assistance.gif",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script
          id="google-tag"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        />

        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', '${googleTagId}', { debug_mode: true });
            gtag('config', '${googleAdsId}', { debug_mode: true });
          `}
        </Script>

        <BootstrapClient />

        {children}
      </body>
    </html>
  );
}