import { headers } from "next/headers";
import { Chatbot } from "@/components/common/Chatbot";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSiteConfig } from "@/config/siteConfig";

export default async function AboutPage() {
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
            <span className="section-kicker">About {site.siteName}</span>
            <h1>A clearer place to begin.</h1>
            <p>
              {site.siteName} helps people organize a question, add useful
              context, and explore general information before deciding what to
              do next.
            </p>
          </div>
        </section>

        <section className="section information-section">
          <div className="container">
            <div className="row g-5">
              <div className="col-lg-7">
                <span className="section-kicker">What we do</span>
                <h2>Useful context for everyday questions.</h2>
                <p>
                  Many decisions begin with an unclear question. Our service
                  gives you a simple place to describe what you are trying to
                  understand and review a few practical starting points.
                </p>
                <p>
                  We aim to keep the experience straightforward, readable, and
                  respectful of the details people share. The information is
                  designed to help you prepare, compare options, and identify a
                  sensible next step.
                </p>
              </div>
              <div className="col-lg-4 ms-auto">
                <div className="information-list">
                  <div>
                    <i className="bi bi-chat-square-text" />
                    <strong>Start with your question</strong>
                    <span>Explain the topic in your own words.</span>
                  </div>
                  <div>
                    <i className="bi bi-list-check" />
                    <strong>Review the context</strong>
                    <span>Use clear information to frame your options.</span>
                  </div>
                  <div>
                    <i className="bi bi-arrow-up-right" />
                    <strong>Choose your next step</strong>
                    <span>Decide what is appropriate for your situation.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section scope-section">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-6">
                <article className="scope-block">
                  <span className="section-kicker">Our approach</span>
                  <h2>Simple, transparent, and practical.</h2>
                  <p>
                    We explain what the service is for, keep pricing visible
                    before a paid step, and encourage people to consider
                    information in the context of their own needs.
                  </p>
                </article>
              </div>
              <div className="col-md-6">
                <article className="scope-block scope-block-muted">
                  <span className="section-kicker">Our limits</span>
                  <h2>Information is a starting point.</h2>
                  <p>
                    {site.medicalMode
                      ? "This service does not replace a qualified healthcare professional, diagnosis, treatment, or urgent care. Contact a licensed professional for personal medical advice."
                      : "Our responses are general information and are not legal, financial, medical, or other professional advice. Speak with a qualified professional when your situation requires one."}
                  </p>
                </article>
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
