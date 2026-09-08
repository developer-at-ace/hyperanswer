import type { SiteConfig } from "@/config/siteConfig";
import Link from "next/link";
export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="site-footer">
      <div className="container py-5">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-5">
            <Link className="footer-brand" href="/">{site.siteName}<span>.</span></Link>
            <p className="footer-copy">Good questions deserve thoughtful context. Start with a few details and explore useful starting points.</p>
          </div>
          <div className="col-6 col-lg-2"><h2>Explore</h2><Link href="/#categories">Categories</Link><Link href="/#how-it-works">How it works</Link><Link href="/#faq">Help center</Link></div>
          <div className="col-6 col-lg-2"><h2>Company</h2><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact Us</Link><Link href="/faq">FAQs</Link><Link href="/#question">Ask a question</Link></div>
          <div className="col-12 col-lg-3">
            <h2>Visit us</h2>
            <p className="footer-address">Online support is available through our contact page.</p>
            <Link className="footer-contact-link" href="/contact-us">Contact support <i className="bi bi-arrow-up-right ms-1" /></Link>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 {site.siteName}. All rights reserved.</span><span><Link href="/privacy">Privacy</Link>&nbsp;&nbsp; <Link href="/terms">Terms</Link></span></div>
      </div>
    </footer>
  );
}
