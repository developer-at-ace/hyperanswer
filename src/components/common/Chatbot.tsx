"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import usa from "../../../usa.png";
type Message = { from: "bot" | "user"; text: string };

type ChatResponse = {
  response?: string;
  session_id?: string;
  show_customer_care?: boolean;
  message?: { content?: string };
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string>();
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Hi. I can help you find the right way to begin." },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [streamTarget, setStreamTarget] = useState("");
  const [showCustomerCare, setShowCustomerCare] = useState(false);
  const visibleTextRef = useRef("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    if (visibleTextRef.current.length >= streamTarget.length) return;
    const timer = window.setInterval(() => {
      visibleTextRef.current = streamTarget.slice(
        0,
        visibleTextRef.current.length + 1,
      );
      setMessages((current) => [
        ...current.slice(0, -1),
        { from: "bot", text: visibleTextRef.current },
      ]);
      if (visibleTextRef.current.length >= streamTarget.length)
        window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [streamTarget]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setMessages((current) => [...current, { from: "user", text }]);
    setInput("");
    setSending(true);
    setShowCustomerCare(false);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId }),
      });
      if (!response.ok || !response.body) {
        const data = (await response.json()) as ChatResponse & {
          detail?: string;
        };
        throw new Error(data.detail || "The assistant could not reply.");
      }

      visibleTextRef.current = "";
      setStreamTarget("");
      setMessages((current) => [...current, { from: "bot", text: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedText = "";
      let receivedSessionId: string | undefined;
      let receivedShowCustomerCare = false;

      const appendChunk = (chunk: string) => {
        try {
          const data = JSON.parse(chunk) as ChatResponse;
          receivedSessionId = data.session_id ?? receivedSessionId;
          receivedShowCustomerCare =
            data.show_customer_care ?? receivedShowCustomerCare;
          receivedText += data.response ?? data.message?.content ?? "";
        } catch {
          receivedText += chunk;
        }
        setStreamTarget(receivedText);
      };

      while (true) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });
        const chunks = buffer.split("\n");
        buffer = chunks.pop() ?? "";
        chunks
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .forEach(appendChunk);
        if (done) break;
      }
      if (buffer.trim()) appendChunk(buffer.trim());
      if (!receivedText)
        throw new Error("The assistant returned an empty response.");
      setSessionId(receivedSessionId);
      setShowCustomerCare(receivedShowCustomerCare);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          from: "bot",
          text:
            error instanceof Error
              ? error.message
              : "The assistant is temporarily unavailable.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`chatbot ${open ? "chatbot-open" : ""}`}>
      {open && (
        <div
          className="chatbot-panel"
          role="dialog"
          aria-label="AnswerRightNow assistant"
        >
          <div className="chatbot-header">
            <div>
              <strong>Start here</strong>
              <span>Usually replies instantly</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <div className="chatbot-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`chat-message chat-message-${message.from}`}
                key={`${message.from}-${index}`}
              >
                {message.text}
              </div>
            ))}
            {sending && (
              <div className="chat-message chat-message-bot">Thinking...</div>
            )}
         {showCustomerCare && (
  <div className="human-agent-card">
    <div className="human-agent-flag" aria-hidden="true">
    <img src={'../../../usa.png'} alt="US Flag" />
    </div>

    <a
      href="tel:+18334263964"
      className="human-agent-content"
    aria-label="Talk to a human agent at +1-833-426-3964"
    >
      <span className="human-agent-title">
        Talk to Human Agent
      </span>

      <span className="human-agent-number">
        +1-833-426-3964
      </span>
    </a>
  </div>
)}
          </div>
          <form className="chatbot-form" onSubmit={handleSubmit}>
            <input
              aria-label="Message assistant"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask anything..."
              disabled={sending}
            />
            <button type="submit" aria-label="Send message" disabled={sending}>
              <i className="bi bi-arrow-up" />
            </button>
          </form>
        </div>
      )}
      <button
        className="chatbot-launcher"
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close chat" : "Open chat"}
      >
        <i className={open ? "bi bi-x-lg" : "bi bi-chat-heart"} />
      </button>
    </div>
  );
}
