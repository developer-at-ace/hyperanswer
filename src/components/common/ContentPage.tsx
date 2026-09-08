import type { SiteConfig } from "@/config/siteConfig";
import Link from "next/link";

type ContentSection = { title: string; paragraphs: string[] };

export function ContentPage({ site, eyebrow, title, intro, sections }: { site?: SiteConfig; eyebrow: string; title: string; intro: string; sections: ContentSection[] }) {
  void site;
  return <><section className="page-intro"><div className="container"><span className="section-kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div></section><section className="section legal-section"><div className="container"><div className="legal-content">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<p className="legal-contact">Questions about this page? <Link href="/contact-us">Contact our support team</Link>.</p></div></div></section></>;
}