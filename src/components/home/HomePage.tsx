import type { SiteConfig } from "@/config/siteConfig";
import { QuestionForm } from "./QuestionForm";

const steps = [
  ["01", "Ask your question", "Start with the thing you need to understand."],
  ["02", "Add the details", "Give your expert the useful context."],
  ["03", "Meet your expert", "Find the right perspective for your situation."],
  ["04", "Keep the conversation going", "Get an answer and ask what comes next."],
];

const trustPoints = [
  ["bi-patch-check", "Verified experts", "Profiles are reviewed before they can help."],
  ["bi-shield-lock", "Private by design", "Your account and conversation stay protected."],
  ["bi-clock-history", "On your schedule", "Get thoughtful support when it suits you."],
  ["bi-receipt", "Clear expectations", "See the next step before you commit."],
];

const categoryImages = [
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=500&q=80",
];

export function HomePage({ site }: { site: SiteConfig }) {
  return <>
    <section className="hero" id="top"><div className="container"><div className="row align-items-center g-5"><div className="col-lg-7 hero-copy-column">
      <div className="eyebrow"><span className="eyebrow-dot" /> {site.eyebrow}</div>
      <h1>{site.tagline}</h1><p className="hero-copy">{site.description}</p>
      <QuestionForm medicalMode={site.medicalMode} />
      {site.medicalMode && <div className="medical-alert"><i className="bi bi-info-circle" /><span>TrimMedi is not an emergency service. For urgent symptoms, contact your local emergency service or nearest emergency department.</span></div>}
      <div className="hero-proof"><div className="avatar-stack"><span>AR</span><span>TM</span><span><i className="bi bi-plus" /></span></div><span>Built for questions that deserve more than a search result.</span></div>
    </div><div className="col-lg-5"><div className="hero-art"><img className="hero-photo" src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85" alt="People having a thoughtful conversation" /><img className="hero-gif" src="https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif" alt="" aria-hidden="true" /><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-note note-main"><i className={site.medicalMode ? "bi bi-heart-pulse" : "bi bi-chat-heart"} /><strong>{site.medicalMode ? "A calmer start" : "A clearer next step"}</strong><span>Thoughtful guidance, human context.</span></div><div className="art-note note-small"><i className="bi bi-check2" /> Ready to begin</div><div className="art-grid" /></div></div></div></div></section>
    <section className="section categories-section" id="categories"><div className="container"><div className="section-heading"><div><span className="section-kicker">Start anywhere</span><h2>Bring us the question.</h2></div><a className="text-link" href="#question">Browse all <i className="bi bi-arrow-up-right" /></a></div><div className="row g-3">{site.categories.map((category, index) => <div className="col-6 col-md-4 col-lg-3" key={category.name}><a className="category-card" href="#question"><img className="category-image" src={categoryImages[index]} alt="" aria-hidden="true" /><div className="category-content"><i className={`bi ${category.icon}`} /><h3>{category.name}</h3><p>{category.description}</p></div><span className="card-arrow"><i className="bi bi-arrow-up-right" /></span></a></div>)}</div></div></section>
    <section className="section process-section" id="how-it-works"><div className="container"><div className="section-heading"><div><span className="section-kicker">A simple rhythm</span><h2>From unsure to informed.</h2></div><p>Good help begins with a useful conversation.</p></div><div className="row g-3">{steps.map(([number, title, copy]) => <div className="col-md-6 col-lg-3" key={number}><div className="step-card"><span className="step-number">{number}</span><div className="step-line" /><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></section>
    <section className="trust-section" id="trust"><div className="container"><div className="row align-items-center g-5 mb-5"><div className="col-lg-5"><img className="trust-image" src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=85" alt="Friends listening to one another" /></div><div className="col-lg-6 ms-auto"><span className="section-kicker">Why people start here</span><h2>A little more clarity can change the whole day.</h2><p>We make room for the details, nuance, and follow-up that quick answers often miss.</p></div></div><div className="row g-3">{trustPoints.map(([icon, title, copy]) => <div className="col-6 col-lg-3" key={title}><div className="trust-point"><i className={`bi ${icon}`} /><h3>{title}</h3><p>{copy}</p></div></div>)}</div></div></section>
  </>;
}
