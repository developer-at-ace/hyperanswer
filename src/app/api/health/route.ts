import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const database = await connectToDatabase();
    return NextResponse.json({ ok: true, database: Boolean(database) });
  } catch {
    return NextResponse.json({ ok: false, database: false }, { status: 503 });
  }
}
