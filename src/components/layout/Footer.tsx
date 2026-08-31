import type { SiteConfig } from "@/config/siteConfig";

export function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="site-footer">
      <div className="container py-5">
        <div className="row g-4 justify-content-between">
          <div className="col-lg-5">
            <a className="footer-brand" href="#top">{site.siteName}<span>.</span></a>
            <p className="footer-copy">Good questions deserve considered answers. Start a conversation with a qualified expert.</p>
          </div>
          <div className="col-6 col-lg-2"><h2>Explore</h2><a href="#categories">Categories</a><a href="#how-it-works">How it works</a><a href="#faq">Help center</a></div>
          <div className="col-6 col-lg-2"><h2>Company</h2><a href="#trust">Become an expert</a><a href="#question">Ask a question</a><a href="#top">About us</a></div>
          <div className="col-12 col-lg-3">
            <h2>Visit us</h2>
            <p className="footer-address">
              95 N Moorland Rd,<br />
              Brookfield, WI 53005,<br />
              USA
            </p>
            <h2 className="footer-social-title">Follow along</h2>
            <div className="social-links"><a href="#top" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a><a href="#top" aria-label="Instagram"><i className="bi bi-instagram" /></a><a href="#top" aria-label="X"><i className="bi bi-twitter-x" /></a></div>
          </div>
        </div>
        <div className="footer-bottom"><span>© 2026 {site.siteName}. Demo experience.</span><span>Privacy&nbsp;&nbsp; Terms</span></div>
      </div>
    </footer>
  );
}
