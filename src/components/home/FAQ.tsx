import type { SiteConfig } from "@/config/siteConfig";

const questions = [
  ["How does the service work?", "Share what you need help with, add a few details, and explore helpful starting points for your next step."],
  ["How do I ask a question?", "Start with the question field above. You can add more details in the next step."],
  ["How do I get the most useful answer?", "The more context you provide, the clearer the starting ideas usually become."],
  ["How much does it cost?", "Pricing is shown clearly before any paid step. Demo content here does not represent production pricing."],
  ["Can I upload images or documents?", "The planned question flow will support secure attachments with size and file-type checks."],
  ["Can I keep the conversation going?", "Yes, you can return to the same idea later and add more context as needed."],
  ["How is my information protected?", "We design for private accounts, secure conversations, and careful handling of sensitive details."],
];

export function FAQ({ site }: { site: SiteConfig }) {
  return <section className="section faq-section" id="faq"><div className="container"><div className="row g-5"><div className="col-lg-4"><span className="section-kicker">Questions, answered</span><h2>Before you begin.</h2><p>Still curious? Our team is here to help you find the right place to start.</p><a className="text-link" href="#question">Ask a question <i className="bi bi-arrow-up-right" /></a></div><div className="col-lg-7 ms-auto"><div className="accordion" id="faqAccordion">{questions.map(([question, answer], index) => <div className="accordion-item" key={question}><h3 className="accordion-header"><button className={`accordion-button ${index !== 0 ? "collapsed" : ""}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${index}`} aria-expanded={index === 0} aria-controls={`faq-${index}`}>{question}</button></h3><div id={`faq-${index}`} className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`} data-bs-parent="#faqAccordion"><div className="accordion-body">{answer}</div></div></div>)}</div>{site.medicalMode && <div className="medical-footer-note"><i className="bi bi-heart-pulse" /><strong>Important note</strong><span>Use this as a general starting point and confirm anything personal with a trusted source.</span></div>}</div></div></div></section>;
}
