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
          <div className="col-6 col-lg-2"><h2>Company</h2><Link href="/about-us">About Us</Link><Link href="/contact-us">Contact Us</Link><Link href="/#question">Ask a question</Link><Link href="/">Start here</Link></div>
          <div className="col-12 col-lg-3">
            <h2>Visit us</h2>
            <p className="footer-address">
              95 N Moorland Rd,<br />
              Brookfield, WI 53005,<br />
              USA
            </p>
            <h2 className="footer-social-title">Follow along</h2>
            <div className="social-links"><Link href="/" aria-label="LinkedIn"><i className="bi bi-linkedin" /></Link><Link href="/" aria-label="Instagram"><i className="bi bi-instagram" /></Link><Link href="/" aria-label="X"><i className="bi bi-twitter-x" /></Link></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 {site.siteName}. Demo experience.</span><span>Privacy&nbsp;&nbsp; Terms</span></div>
      </div>
    </footer>
  );
}
