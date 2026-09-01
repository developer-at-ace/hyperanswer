import { headers } from "next/headers";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { HomePage } from "@/components/home/HomePage";
import { Chatbot } from "@/components/common/Chatbot";
import { getSiteConfig } from "@/config/siteConfig";

export default async function Page() {
  const headerList = await headers();
  const hostname = headerList.get("host") ?? "";
  const site = getSiteConfig(hostname);

  return (
    <div className={`site-shell site-${site.key}`} style={{ "--brand-primary": site.primaryColor, "--brand-secondary": site.secondaryColor, "--brand-accent": site.accentColor } as React.CSSProperties}>
      <Header site={site} />
      <main>
        <HomePage site={site} />
        <FAQ site={site} />
      </main>
      <Footer site={site} />
      <Chatbot />
    </div>
  );
}
