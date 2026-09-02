import { headers } from "next/headers";
import { Chatbot } from "@/components/common/Chatbot";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteConfig } from "@/config/siteConfig";

export default async function ContactPage() {
  const hostname = (await headers()).get("host") ?? "";
  const site = getSiteConfig(hostname);

  return (
    <div
      className={`site-shell site-${site.key}`}
      style={{
        "--brand-primary": site.primaryColor,
        "--brand-secondary": site.secondaryColor,
        "--brand-accent": site.accentColor,
      } as React.CSSProperties}
    >
      <Header site={site} />
      <main>
        <section className="page-intro">
          <div className="container">
            <span className="section-kicker">Contact {site.siteName}</span>
            <h1>We are here to help you find the right place to start.</h1>
            <p>
              Have a question about the service, your account, or a billing
              matter? Send us a message and our support team will review it.
            </p>
          </div>
        </section>

        <section className="section contact-section">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-5">
                <span className="section-kicker">Get in touch</span>
                <h2>Contact details</h2>
                <p className="contact-lead">
                  Please include enough detail for us to understand your
                  request. Do not send passwords, payment card numbers, or
                  urgent medical information by email.
                </p>
                <div className="contact-details">
                  <a href="mailto:support@trimmedi.com">
                    <i className="bi bi-envelope" />
                    <span><strong>Email</strong>support@trimmedi.com</span>
                  </a>
                 
                  <div>
                    <i className="bi bi-geo-alt" />
                    <span><strong>Mailing address</strong>95 N Moorland Rd, Brookfield, WI 53005, USA</span>
                  </div>
                 
                </div>
              </div>
              <div className="col-lg-6 ms-auto">
                <div className="contact-panel">
                  <span className="section-kicker">Support topics</span>
                  <h2>What can we help with?</h2>
                  <ul>
                    <li>Questions about how the service works</li>
                    <li>Account access or subscription questions</li>
                    <li>Billing, cancellation, or refund requests</li>
                    <li>Privacy, data, or content concerns</li>
                    <li>Accessibility feedback or technical issues</li>
                  </ul>
                  <a className="btn btn-brand" href="mailto:support@trimmedi.com?subject=Trimmedi%20support%20request">
                    Email support <i className="bi bi-arrow-up-right ms-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer site={site} />
      <Chatbot />
    </div>
  );
}
