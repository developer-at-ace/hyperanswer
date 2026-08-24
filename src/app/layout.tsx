import type { Metadata } from "next";
import { BootstrapClient } from "@/components/common/BootstrapClient";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Trimmedi | Expert answers, right when it matters",
  description: "A shared expert Q&A experience for thoughtful, practical guidance.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><BootstrapClient />{children}</body>
    </html>
  );
}
