import { NextResponse } from "next/server";

export async function GET(req) {
    return NextResponse.json({
        error: "AssemblyAI realtime (WebSocket) is paid-only. Use standard transcription endpoints with your API key instead."
    }, { status: 402 });
}