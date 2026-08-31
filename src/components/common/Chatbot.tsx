"use client";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  from: "bot" | "user";
  text: string;
};

type OpenChatEvent = CustomEvent<{
  message?: string;
}>;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [launcherArriving, setLauncherArriving] =
    useState(true);
  const [greetingVisible, setGreetingVisible] =
    useState(true);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] =
    useState<string>();
  const [sending, setSending] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi. I can help you find the right way to begin.",
    },
  ]);

  const [showCustomerCare, setShowCustomerCare] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const inputRef =
    useRef<HTMLInputElement>(null);

  const arrivalSoundPlayedRef =
    useRef(false);

  /*
   * AbortController used to stop the current
   * streaming request.
   */
  const abortControllerRef =
    useRef<AbortController | null>(null);

  /*
   * Used to detect:
   *
   * sending: true -> false
   *
   * so the input is focused after the
   * response finishes.
   */
  const wasSendingRef =
    useRef(false);

  /*
   * Keep the latest sending value available
   * to callbacks without stale React state.
   */
  const sendingRef =
    useRef(false);

  useEffect(() => {
    sendingRef.current = sending;
  }, [sending]);

  /*
   * ========================================================
   * Launcher arrival + sound
   * ========================================================
   */

  useEffect(() => {
    const arrivalTimer =
      window.setTimeout(
        () => setLauncherArriving(false),
        900,
      );

    async function playArrivalSound() {
      if (arrivalSoundPlayedRef.current) {
        return;
      }

      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      const audioContext =
        new AudioContextClass();

      try {
        await audioContext.resume();

        const gain =
          audioContext.createGain();

        gain.gain.setValueAtTime(
          0.0001,
          audioContext.currentTime,
        );

        gain.gain.exponentialRampToValueAtTime(
          0.08,
          audioContext.currentTime + 0.03,
        );

        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audioContext.currentTime + 0.42,
        );

        gain.connect(
          audioContext.destination,
        );

        [660, 880].forEach(
          (frequency, index) => {
            const oscillator =
              audioContext.createOscillator();

            oscillator.type = "sine";
            oscillator.frequency.value =
              frequency;

            oscillator.connect(gain);

            oscillator.start(
              audioContext.currentTime +
                index * 0.1,
            );

            oscillator.stop(
              audioContext.currentTime +
                0.3 +
                index * 0.1,
            );
          },
        );

        arrivalSoundPlayedRef.current =
          true;

        window.setTimeout(
          () =>
            void audioContext.close(),
          600,
        );
      } catch {
        await audioContext.close();
      }
    }

    void playArrivalSound();

    const unlockSound = () =>
      void playArrivalSound();

    window.addEventListener(
      "pointerdown",
      unlockSound,
    );

    window.addEventListener(
      "keydown",
      unlockSound,
    );

    return () => {
      window.clearTimeout(
        arrivalTimer,
      );

      window.removeEventListener(
        "pointerdown",
        unlockSound,
      );

      window.removeEventListener(
        "keydown",
        unlockSound,
      );
    };
  }, []);

  /*
   * ========================================================
   * Auto-scroll
   * ========================================================
   */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  /*
   * ========================================================
   * Focus input after response finishes
   * ========================================================
   */

  useEffect(() => {
    if (
      wasSendingRef.current &&
      !sending &&
      open
    ) {
      window.requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }

    wasSendingRef.current = sending;
  }, [sending, open]);

  /*
   * ========================================================
   * External open-chat event
   * ========================================================
   */

  useEffect(() => {
    function openChat(event: Event) {
      const customEvent =
        event as OpenChatEvent;

      const message =
        customEvent.detail?.message?.trim();

      if (!message) {
        return;
      }

      if (sendingRef.current) {
        return;
      }

      setOpen(true);

      void sendMessage(message);
    }

    window.addEventListener(
      "trimmedi:open-chat",
      openChat,
    );

    return () => {
      window.removeEventListener(
        "trimmedi:open-chat",
        openChat,
      );
    };
  }, []);

  /*
   * ========================================================
   * STOP STREAM
   * ========================================================
   */

  function stopStreaming() {
    const controller =
      abortControllerRef.current;

    if (!controller) {
      return;
    }

    /*
     * Abort the browser request.
     *
     * This closes the fetch stream.
     */
    controller.abort();

    /*
     * The finally block inside sendMessage()
     * will set sending=false.
     */
  }

  function clearChat() {
    if (
      abortControllerRef.current
    ) {
      abortControllerRef.current.abort();
    }

    setInput("");
    setSessionId(undefined);
    setShowCustomerCare(false);
    setMessages([
      {
        from: "bot",
        text: "Hi. I can help you find the right way to begin.",
      },
    ]);
    setSending(false);
    sendingRef.current = false;
  }

  /*
   * ========================================================
   * Send message
   * ========================================================
   */

  async function sendMessage(text: string) {
    if (
      !text ||
      sendingRef.current
    ) {
      return;
    }

    /*
     * Create a new AbortController for this
     * specific request.
     */

    const controller =
      new AbortController();

    abortControllerRef.current =
      controller;

    /*
     * Add user message and empty bot message.
     */

    setMessages((current) => [
      ...current,
      {
        from: "user",
        text,
      },
      {
        from: "bot",
        text: "",
      },
    ]);

    setInput("");
    setSending(true);
    sendingRef.current = true;

    setShowCustomerCare(false);

    try {
      /*
       * ====================================================
       * Request Next.js API
       * ====================================================
       */

      const response = await fetch(
        "/api/chat",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/x-ndjson",
          },

          body: JSON.stringify({
            message: text,
            session_id: sessionId,
          }),

          /*
           * IMPORTANT:
           * Connect this request to AbortController.
           */

          signal:
            controller.signal,
        },
      );

      /*
       * ====================================================
       * Handle HTTP errors
       * ====================================================
       */

      if (
        !response.ok ||
        !response.body
      ) {
        const errorText =
          await response.text();

        let errorMessage =
          "The assistant could not reply.";

        try {
          const data =
            JSON.parse(errorText) as {
              detail?: string;
            };

          errorMessage =
            data.detail ||
            errorMessage;

        } catch {
          console.error(
            "Non-JSON error response:",
            errorText,
          );

          /*
           * Don't show a complete HTML error
           * page to the chatbot user.
           */

          if (
            errorText.includes("<html") ||
            errorText.includes("<HTML")
          ) {
            errorMessage =
              "The chatbot server returned an unexpected response.";

          } else if (
            errorText.trim()
          ) {
            errorMessage =
              errorText;
          }
        }

        throw new Error(
          errorMessage,
        );
      }

      /*
       * ====================================================
       * Read streaming response
       * ====================================================
       */

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let buffer = "";
      let receivedText = "";

      let receivedSessionId:
        | string
        | undefined;

      let receivedShowCustomerCare =
        false;

      /*
       * ====================================================
       * Update bot message
       * ====================================================
       */

      const updateBotMessage = (
        text: string,
      ) => {
        setMessages((current) => {
          const updated = [
            ...current,
          ];

          /*
           * Find the most recent bot message.
           */

          for (
            let i =
              updated.length - 1;
            i >= 0;
            i--
          ) {
            if (
              updated[i].from ===
              "bot"
            ) {
              updated[i] = {
                ...updated[i],
                text,
              };

              break;
            }
          }

          return updated;
        });
      };

      /*
       * ====================================================
       * Process one NDJSON line
       * ====================================================
       */

      const processLine = (
        line: string,
      ) => {
        if (!line.trim()) {
          return;
        }

        try {
          const data =
            JSON.parse(line) as {
              response?: string;
              content?: string;
              type?: string;
              session_id?: string;
              show_customer_care?: boolean;
            };

          /*
           * Session ID
           */

          if (data.session_id) {
            receivedSessionId =
              data.session_id;
          }

          /*
           * Customer care
           */

          if (
            data.show_customer_care !==
            undefined
          ) {
            receivedShowCustomerCare =
              data.show_customer_care;
          }

          /*
           * Current FastAPI format:
           *
           * {"response":"Hello"}
           */

          if (data.response) {
            receivedText +=
              data.response;

            updateBotMessage(
              receivedText,
            );
          }

          /*
           * Also support:
           *
           * {"type":"chunk","content":"Hello"}
           */

          if (
            data.type === "chunk" &&
            data.content
          ) {
            receivedText +=
              data.content;

            updateBotMessage(
              receivedText,
            );
          }

          /*
           * Optional done format.
           */

          if (
            data.type === "done" &&
            data.content &&
            !receivedText
          ) {
            receivedText =
              data.content;

            updateBotMessage(
              receivedText,
            );
          }

        } catch (error) {
          console.error(
            "Invalid NDJSON line:",
            line,
            error,
          );
        }
      };

      /*
       * ====================================================
       * Read stream
       * ====================================================
       */

      while (true) {
        const {
          value,
          done,
        } = await reader.read();

        if (value) {
          buffer +=
            decoder.decode(
              value,
              {
                stream: !done,
              },
            );
        }

        const lines =
          buffer.split("\n");

        /*
         * Keep incomplete line.
         */

        buffer =
          lines.pop() || "";

        for (const line of lines) {
          processLine(line);
        }

        if (done) {
          break;
        }
      }

      /*
       * Process remaining data.
       */

      if (buffer.trim()) {
        processLine(
          buffer.trim(),
        );
      }

      /*
       * ====================================================
       * Response completed normally
       * ====================================================
       */

      if (!receivedText) {
        throw new Error(
          "The assistant returned an empty response.",
        );
      }

      if (receivedSessionId) {
        setSessionId(
          receivedSessionId,
        );
      }

      setShowCustomerCare(
        receivedShowCustomerCare,
      );

    } catch (error) {

      /*
       * ====================================================
       * User clicked STOP
       * ====================================================
       */

      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        console.log(
          "Chat stream stopped by user.",
        );

        /*
         * Do NOT replace the response with
         * an error message.
         *
         * Keep whatever text was already
         * streamed.
         */

        return;
      }

      /*
       * Some browsers/runtime environments
       * may throw a different error when
       * AbortController cancels fetch.
       */

      if (controller.signal.aborted) {
        console.log(
          "Chat stream aborted by user.",
        );

        return;
      }

      /*
       * ====================================================
       * Normal error
       * ====================================================
       */

      console.error(
        "Chat error:",
        error,
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "The assistant is temporarily unavailable.";

      setMessages((current) => {
        const updated = [
          ...current,
        ];

        /*
         * Replace the last bot message.
         */

        for (
          let i =
            updated.length - 1;
          i >= 0;
          i--
        ) {
          if (
            updated[i].from ===
            "bot"
          ) {
            updated[i] = {
              from: "bot",
              text: errorMessage,
            };

            break;
          }
        }

        return updated;
      });

    } finally {

      /*
       * Only clear the controller if this
       * is still the active request.
       */

      if (
        abortControllerRef.current ===
        controller
      ) {
        abortControllerRef.current =
          null;
      }

      setSending(false);
      sendingRef.current = false;
    }
  }

  /*
   * ========================================================
   * Submit
   * ========================================================
   */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const text =
      input.trim();

    if (!text) {
      return;
    }

    void sendMessage(text);
  }

  /*
   * ========================================================
   * Render
   * ========================================================
   */

  return (
    <div
      className={`chatbot ${
        open
          ? "chatbot-open"
          : ""
      }`}
    >
      {open && (
        <div
          className="chatbot-panel"
          role="dialog"
          aria-label="Trimmedi assistant"
        >
          {/* ============================================ */}
          {/* Header */}
          {/* ============================================ */}

          <div className="chatbot-header">
            <div className="chatbot-identity">
              <span
                className="chatbot-avatar"
                aria-hidden="true"
              >
                <i className="bi bi-stars" />
              </span>

              <div>
                <strong>
                  Trimmedi assistant
                </strong>

                <span>
                  <b />{" "}
                  {sending
                    ? "Writing a reply..."
                    : "Online now"}
                </span>
              </div>
            </div>

            <div className="chatbot-header-actions">
              <button
                type="button"
                className="chatbot-clear-button"
                onClick={clearChat}
                aria-label="Clear chat"
              >
                <i className="bi bi-trash"></i>
              </button>

              <button
                type="button"
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close chat"
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
          </div>

          {/* ============================================ */}
          {/* Messages */}
          {/* ============================================ */}

          <div
            className="chatbot-messages"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map(
              (message, index) => (
                <div
                  className={`chat-message-row chat-message-row-${message.from}`}
                  key={`${message.from}-${index}`}
                >
                  {message.from ===
                    "bot" && (
                    <span
                      className="message-avatar"
                      aria-hidden="true"
                    >
                      <i className="bi bi-stars" />
                    </span>
                  )}

                  <div
                    className={`chat-message chat-message-${message.from}`}
                  >
                    {message.text ? (
                      message.from === "bot" ? (
                        <ReactMarkdown>
                          {message.text}
                        </ReactMarkdown>
                      ) : (
                        message.text
                      )
                    ) : (
                      <span
                        className="message-cursor"
                        aria-label="Assistant is composing"
                      />
                    )}
                  </div>
                </div>
              ),
            )}

            {/* ========================================== */}
            {/* Typing indicator */}
            {/* ========================================== */}

            {sending && (
              <div
                className="chat-typing"
                aria-label="Assistant is typing"
              >
                <span />
                <span />
                <span />
              </div>
            )}

            {/* ========================================== */}
            {/* Customer care */}
            {/* ========================================== */}

            {showCustomerCare && (
              <div className="human-agent-card">
                <div
                  className="human-agent-flag"
                  aria-hidden="true"
                >
                  <img
                    src="/usa.png"
                    alt=""
                  />
                </div>

                <a
                  href="tel:+18334263964"
                  className="human-agent-content"
                  aria-label="Talk to a human agent at +1-833-426-3964"
                >
                  <span className="human-agent-title">
                    Talk to a human agent
                  </span>

                  <span className="human-agent-number">
                    +1-833-426-3964
                  </span>
                </a>
              </div>
            )}

            <div
              ref={messagesEndRef}
              aria-hidden="true"
            />
          </div>

          {/* ============================================ */}
          {/* Input */}
          {/* ============================================ */}

          <form
            className={`chatbot-form ${
              sending
                ? "chatbot-form-sending"
                : ""
            }`}
            onSubmit={
              handleSubmit
            }
          >
            <div className="chatbot-input-wrap">
              <input
                ref={inputRef}
                aria-label="Message assistant"
                value={input}
                onChange={(event) =>
                  setInput(
                    event.target.value,
                  )
                }
                placeholder={
                  sending
                    ? "Assistant is replying..."
                    : "Message Trimmedi..."
                }
                disabled={sending}
              />

              {sending ? (
                /*
                 * STOP BUTTON
                 */
                <button
                  type="button"
                  onClick={
                    stopStreaming
                  }
                  className="chatbot-stop-button"
                  aria-label="Stop generating response"
                  title="Stop generating"
                >
                  <i className="bi bi-stop-fill" />
                </button>
              ) : (
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={
                    !input.trim()
                  }
                >
                  <i className="bi bi-arrow-up" />
                </button>
              )}
            </div>

            <span className="chatbot-form-note">
              {sending
                ? "Click stop to end the response"
                : "Enter to send"}
            </span>
          </form>
        </div>
      )}

      {/* ============================================== */}
      {/* Closed chatbot launcher */}
      {/* ============================================== */}

      {!open && (
        <>
          {greetingVisible && (
            <div
              className="chatbot-greeting"
              role="status"
            >
              <button
                className="chatbot-greeting-close"
                type="button"
                onClick={() =>
                  setGreetingVisible(
                    false,
                  )
                }
                aria-label="Dismiss greeting"
              >
                <i className="bi bi-x-lg" />
              </button>

              <span
                className="chatbot-greeting-hand"
                aria-hidden="true"
              >
                &#128073;
              </span>

              <span>
                We are here!
              </span>
            </div>
          )}

          <button
            className={`chatbot-launcher ${
              launcherArriving
                ? "chatbot-launcher-arrival"
                : ""
            }`}
            type="button"
            onClick={() => {
              setOpen(true);
              setGreetingVisible(
                false,
              );
            }}
            aria-label="Open chat"
          >
            <img
              className="chatbot-launcher-image"
              src="/assistance.gif"
              alt=""
            />
          </button>
        </>
      )}
    </div>
  );
}
