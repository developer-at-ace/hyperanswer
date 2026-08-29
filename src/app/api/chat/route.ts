import { NextResponse } from "next/server";

const chatbotUrl =
  process.env.CHATBOT_URL?.trim() ||
  "http://bot.suamglobalventures.com/chat";

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const response = await fetch(
      chatbotUrl,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Accept": "application/x-ndjson",
        },

        body,

        signal: AbortSignal.timeout(300_000),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      return new NextResponse(
        errorText,
        {
          status: response.status,
          headers: {
            "Content-Type":
              response.headers.get("content-type") ||
              "text/plain",

            "Cache-Control":
              "no-cache, no-transform",

            "X-Accel-Buffering":
              "no",
          },
        }
      );
    }

    return new NextResponse(
      response.body,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/x-ndjson",

          "Cache-Control":
            "no-cache, no-transform",

          "X-Accel-Buffering":
            "no",
        },
      }
    );

  } catch (error) {
    console.error(
      "Chatbot upstream request failed:",
      error
    );

    return NextResponse.json(
      {
        detail:
          "The chatbot service is unavailable.",
      },
      {
        status: 503,
      }
    );
  }
}
