"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
type Message = { from: "bot" | "user"; text: string };

type ChatResponse = {
  response?: string;
  session_id?: string;
  show_customer_care?: boolean;
  message?: { content?: string };
};

type OpenChatEvent = CustomEvent<{ message?: string }>;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [launcherArriving, setLauncherArriving] = useState(true);
  const [greetingVisible, setGreetingVisible] = useState(true);
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
  const arrivalSoundPlayedRef = useRef(false);

  useEffect(() => {
    const arrivalTimer = window.setTimeout(() => setLauncherArriving(false), 900);

    async function playArrivalSound() {
      if (arrivalSoundPlayedRef.current) return;
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      try {
        await audioContext.resume();
        const gain = audioContext.createGain();
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.42);
        gain.connect(audioContext.destination);

        [660, 880].forEach((frequency, index) => {
          const oscillator = audioContext.createOscillator();
          oscillator.type = "sine";
          oscillator.frequency.value = frequency;
          oscillator.connect(gain);
          oscillator.start(audioContext.currentTime + index * 0.1);
          oscillator.stop(audioContext.currentTime + 0.3 + index * 0.1);
        });
        arrivalSoundPlayedRef.current = true;
        window.setTimeout(() => void audioContext.close(), 600);
      } catch {
        await audioContext.close();
      }
    }

    void playArrivalSound();
    const unlockSound = () => void playArrivalSound();
    window.addEventListener("pointerdown", unlockSound);
    window.addEventListener("keydown", unlockSound);
    return () => {
      window.clearTimeout(arrivalTimer);
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    function openChat(event: Event) {
      const message = (event as OpenChatEvent).detail?.message?.trim();
      if (!message || sending) return;
      setOpen(true);
      void sendMessage(message);
    }

    window.addEventListener("trimmedi:open-chat", openChat);
    return () => window.removeEventListener("trimmedi:open-chat", openChat);
  }, [sending]);

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

  async function sendMessage(text: string) {
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
    const data = JSON.parse(chunk) as {
      type?: string;
      content?: string;
      response?: string;
      session_id?: string;
      show_customer_care?: boolean;
    };

    if (data.session_id) {
      receivedSessionId = data.session_id;
    }

    if (data.show_customer_care !== undefined) {
      receivedShowCustomerCare = data.show_customer_care;
    }

    if (data.type === "chunk") {
      receivedText += data.content ?? "";
    } else if (data.type === "done") {
      // Don't append again because the chunks already
      // contain the complete streamed response.
      if (!receivedText && data.content) {
        receivedText = data.content;
      }
    } else if (data.response) {
      receivedText += data.response;
    }
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
        ...current.filter(
          (message, index) =>
            !(index === current.length - 1 && message.from === "bot" && !message.text),
        ),
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input.trim());
  }

  return (
    <div className={`chatbot ${open ? "chatbot-open" : ""}`}>
      {open && (
        <div
          className="chatbot-panel"
          role="dialog"
          aria-label="Trimmedi assistant"
        >
          <div className="chatbot-header">
            <div className="chatbot-identity">
              <span className="chatbot-avatar" aria-hidden="true">
                <i className="bi bi-stars" />
              </span>
              <div>
                <strong>Trimmedi assistant</strong>
                <span><b /> {sending ? "Writing a reply..." : "Online now"}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <div className="chatbot-messages" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => (
              <div
                className={`chat-message-row chat-message-row-${message.from}`}
                key={`${message.from}-${index}`}
              >
                {message.from === "bot" && (
                  <span className="message-avatar" aria-hidden="true">
                    <i className="bi bi-stars" />
                  </span>
                )}
                <div className={`chat-message chat-message-${message.from}`}>
                  {message.text || <span className="message-cursor" aria-label="Assistant is composing" />}
                </div>
              </div>
            ))}
            {sending && (
              <div className="chat-typing" aria-label="Assistant is typing">
                <span /><span /><span />
              </div>
            )}
            {showCustomerCare && (
              <div className="human-agent-card">
                <div className="human-agent-flag" aria-hidden="true">
                  <img src="/usa.png" alt="" />
                </div>
                <a href="tel:+18334263964" className="human-agent-content" aria-label="Talk to a human agent at +1-833-426-3964">
                  <span className="human-agent-title">Talk to a human agent</span>
                  <span className="human-agent-number">+1-833-426-3964</span>
                </a>
              </div>
            )}
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>
          <form className={`chatbot-form ${sending ? "chatbot-form-sending" : ""}`} onSubmit={handleSubmit}>
            <div className="chatbot-input-wrap">
              <input
                aria-label="Message assistant"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={sending ? "Assistant is replying..." : "Message Trimmedi..."}
                disabled={sending}
              />
              <button type="submit" aria-label="Send message" disabled={sending || !input.trim()}>
                <i className="bi bi-arrow-up" />
              </button>
            </div>
            <span className="chatbot-form-note">{sending ? "Please wait for the reply" : "Enter to send"}</span>
          </form>
        </div>
      )}
      {!open && (
        <>
          {greetingVisible && (
            <div className="chatbot-greeting" role="status">
              <button
                className="chatbot-greeting-close"
                type="button"
                onClick={() => setGreetingVisible(false)}
                aria-label="Dismiss greeting"
              >
                <i className="bi bi-x-lg" />
              </button>
              <span className="chatbot-greeting-hand" aria-hidden="true">&#128073;</span>
              <span>We are here!</span>
            </div>
          )}
          <button
            className={`chatbot-launcher ${launcherArriving ? "chatbot-launcher-arrival" : ""}`}
            type="button"
            onClick={() => { setOpen(true); setGreetingVisible(false); }}
            aria-label="Open chat"
          >
            <img className="chatbot-launcher-image" src="/assistance.gif" alt="" />
          </button>
        </>
      )}
    </div>
  );
}
