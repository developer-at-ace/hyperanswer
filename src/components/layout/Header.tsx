import type { SiteConfig } from "@/config/siteConfig";
import Link from "next/link";

export function Header({ site }: { site: SiteConfig }) {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/" aria-label={`${site.siteName} home`}>
            <span className="brand-mark"><i className={site.medicalMode ? "bi bi-plus-lg" : "bi bi-arrow-up-right"} /></span>
            <span>{site.siteName}</span>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <i className="bi bi-list" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <Link className="nav-link" href="/#categories">Categories</Link>
              <Link className="nav-link" href="/#how-it-works">How it works</Link>
              <Link className="nav-link" href="/about">About</Link>
              <Link className="nav-link" href="/contact">Contact</Link>
              <Link className="nav-link nav-login" href="/#question">Log in</Link>
              <Link className="btn btn-brand btn-sm px-3" href="/#question">Ask a question <i className="bi bi-arrow-up-right ms-1" /></Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
