"use client";

import { FormEvent, useState } from "react";
import { trackGoogleAdsConversion } from "@/lib/googleAds";

export function QuestionForm({ medicalMode }: { medicalMode: boolean }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.trim();
    if (!text) return;
    trackGoogleAdsConversion();
    window.dispatchEvent(new CustomEvent("trimmedi:open-chat", {
      detail: { message: text },
    }));
    setQuestion("");
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question" className="visually-hidden">What can we help you with?</label>
      <div className="question-input-wrap">
        <textarea id="question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder={medicalMode ? "What would you like to explore?" : "What can we help you with?"} rows={2} />
        <button className="btn btn-brand" type="submit">Ask now <i className="bi bi-arrow-right ms-1" /></button>
      </div>
      <p className="form-note"><i className="bi bi-lock-fill me-1" /> Your question stays private while you get started.</p>
    </form>
  );
}
