import type { SiteConfig } from "@/config/siteConfig";

export function Header({ site }: { site: SiteConfig }) {
  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg" aria-label="Main navigation">
        <div className="container">
          <a className="navbar-brand d-flex align-items-center gap-2" href="#top" aria-label={`${site.siteName} home`}>
            <span className="brand-mark"><i className={site.medicalMode ? "bi bi-plus-lg" : "bi bi-arrow-up-right"} /></span>
            <span>{site.siteName}</span>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <i className="bi bi-list" />
          </button>
          <div className="collapse navbar-collapse" id="mainNav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
              <a className="nav-link" href="#categories">Categories</a>
              <a className="nav-link" href="#how-it-works">How it works</a>
              <a className="nav-link" href="#pricing">Plans</a>
              <a className="nav-link" href="#trust">Become an expert</a>
              <a className="nav-link" href="#faq">Help</a>
              <a className="nav-link nav-login" href="#question">Log in</a>
              <a className="btn btn-brand btn-sm px-3" href="#question">Ask a question <i className="bi bi-arrow-up-right ms-1" /></a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
