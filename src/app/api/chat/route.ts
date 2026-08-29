import { NextResponse } from "next/server";

const defaultChatbotUrl = "http://bot.suamglobalventures.com/chat";

const configuredChatbotUrl =
  process.env.CHATBOT_URL?.trim() || defaultChatbotUrl;

export async function POST(request: Request) {
  try {
    // Read the request body without parsing/re-stringifying it.
    // This keeps the proxy as lightweight as possible.
    const body = await request.text();

    const requestOptions: RequestInit = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Accept: "application/x-ndjson, text/event-stream, text/plain",
      },

      body,

      // Keep the connection open while Ollama is generating.
      signal: AbortSignal.timeout(125_000),
    };

    let response: Response;

    try {
      response = await fetch(
        configuredChatbotUrl,
        requestOptions
      );
    } catch (error) {
      if (configuredChatbotUrl === defaultChatbotUrl) {
        throw error;
      }

      console.error(
        "Configured chatbot host failed; using the default host",
        error
      );

      response = await fetch(
        defaultChatbotUrl,
        requestOptions
      );
    }

    // Forward upstream errors without trying to parse the stream.
    if (!response.ok) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          "Content-Type":
            response.headers.get("content-type") ||
            "application/json",

          "Cache-Control":
            "no-cache, no-transform",

          "X-Accel-Buffering":
            "no",
        },
      });
    }

    // IMPORTANT:
    // Pass the ReadableStream directly to the browser.
    //
    // Do NOT:
    //   await response.json()
    //   await response.text()
    //   response.body?.getReader()
    //
    // The browser/frontend should consume the stream.
    return new NextResponse(response.body, {
      status: response.status,

      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "application/x-ndjson",

        "Cache-Control":
          "no-cache, no-transform",

        "X-Accel-Buffering":
          "no",

        "Connection":
          "keep-alive",
      },
    });

  } catch (error) {
    console.error(
      "Chatbot upstream request failed",
      error
    );

    return NextResponse.json(
      {
        detail:
          "The chatbot service is unavailable. Please verify the chatbot host and try again.",
      },
      {
        status: 503,
      }
    );
  }
}