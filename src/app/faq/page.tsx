import { headers } from "next/headers";
import { Chatbot } from "@/components/common/Chatbot";
import { FAQ } from "@/components/home/FAQ";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteConfig } from "@/config/siteConfig";

export default async function FAQPage() {
  const site = getSiteConfig((await headers()).get("host") ?? "");
  return <div className={`site-shell site-${site.key}`} style={{ "--brand-primary": site.primaryColor, "--brand-secondary": site.secondaryColor, "--brand-accent": site.accentColor } as React.CSSProperties}><Header site={site} /><main><section className="page-intro"><div className="container"><span className="section-kicker">Help center</span><h1>Answers before you begin.</h1><p>Find clear information about how the service works, what it is for, and how to contact support.</p></div></section><FAQ /></main><Footer site={site} /><Chatbot /></div>;
}