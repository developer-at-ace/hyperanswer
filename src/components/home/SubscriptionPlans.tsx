"use client";

import { useState } from "react";

const plans = [
  { name: "Starter", monthly: 9, description: "For one question and a few useful starting points.", features: ["One brief question", "Simple overview", "Private by default"] },
  { name: "Flex", monthly: 19, description: "For a few follow-up ideas and a little more room to think.", features: ["A few question rounds", "Practical direction", "Save your activity"], featured: true },
  { name: "Routine", monthly: 39, description: "For ongoing ideas and a regular place to come back to.", features: ["More question time", "Easy revisit", "Helpful reminders"] },
];

export function SubscriptionPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="section pricing-section" id="pricing">
      <div className="container">
        <div className="section-heading pricing-heading">
          <div><span className="section-kicker">Choose your pace</span><h2>Support that fits the question.</h2></div>
          <div className="billing-toggle" role="group" aria-label="Billing frequency">
            <button className={!annual ? "active" : ""} type="button" onClick={() => setAnnual(false)}>Monthly</button>
            <button className={annual ? "active" : ""} type="button" onClick={() => setAnnual(true)}>Annual <span>save 20%</span></button>
          </div>
        </div>
        <div className="row g-3">
          {plans.map((plan) => {
            const price = annual ? Math.round(plan.monthly * 0.8) : plan.monthly;
            return <div className="col-md-4" key={plan.name}>
              <article className={`pricing-card ${plan.featured ? "pricing-card-featured" : ""}`}>
                {plan.featured && <span className="pricing-badge">Most flexible</span>}
                <h3>{plan.name}</h3><p>{plan.description}</p>
                <div className="pricing-price"><strong>${price}</strong><span>/ month</span></div>
                <ul>{plan.features.map((feature) => <li key={feature}><i className="bi bi-check2" />{feature}</li>)}</ul>
                <button className={`btn ${plan.featured ? "btn-brand" : "btn-outline-brand"} w-100`} type="button">Start with {plan.name.toLowerCase()} <i className="bi bi-arrow-right ms-1" /></button>
              </article>
            </div>;
          })}
        </div>
        <p className="pricing-note"><i className="bi bi-shield-check me-1" /> Cancel anytime. You will always see the price before you confirm.</p>
      </div>
    </section>
  );
}