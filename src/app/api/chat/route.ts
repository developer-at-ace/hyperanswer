import { NextResponse } from "next/server";

const chatbotUrl = process.env.CHATBOT_URL ?? "http://bot.suamglobalventures.com/chat";

export async function POST(request: Request) {
  try {
    const response = await fetch(chatbotUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(await request.json()),
      signal: AbortSignal.timeout(125_000),
    });

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