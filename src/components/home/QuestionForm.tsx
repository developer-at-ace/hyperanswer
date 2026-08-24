"use client";

import { FormEvent, useState } from "react";

export function QuestionForm({ medicalMode }: { medicalMode: boolean }) {
  const [question, setQuestion] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (question.trim()) setSent(true);
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question" className="visually-hidden">What can we help you with?</label>
      <div className="question-input-wrap">
        <textarea id="question" value={question} onChange={(event) => { setQuestion(event.target.value); setSent(false); }} placeholder={medicalMode ? "What health question is on your mind?" : "What can we help you with?"} rows={2} />
        <button className="btn btn-brand" type="submit">Ask now <i className="bi bi-arrow-right ms-1" /></button>
      </div>
      {sent && <div className="form-feedback" role="status">Thanks. Your question is ready for the next step.</div>}
      <p className="form-note"><i className="bi bi-lock-fill me-1" /> Your question stays private while you get started.</p>
    </form>
  );
}
