import { NextResponse } from "next/server";

const defaultChatbotUrl = "http://bot.suamglobalventures.com/chat";
const configuredChatbotUrl = process.env.CHATBOT_URL?.trim() || defaultChatbotUrl;

export async function POST(request: Request) {
  try {
    const body = JSON.stringify(await request.json());
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      signal: AbortSignal.timeout(125_000),
    };

    let response: Response;
    try {
      response = await fetch(configuredChatbotUrl, requestOptions);
    } catch (error) {
      if (configuredChatbotUrl === defaultChatbotUrl) throw error;
      console.error("Configured chatbot host failed; using the default host", error);
      response = await fetch(defaultChatbotUrl, requestOptions);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/x-ndjson",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    console.error("Chatbot upstream request failed", error);
    return NextResponse.json({ detail: "The chatbot service is unavailable. Please verify the chatbot host and try again." }, { status: 503 });
  }
}