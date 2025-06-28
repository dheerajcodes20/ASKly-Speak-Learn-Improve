import { NextResponse } from "next/server";
import { PollyClient, SynthesizeSpeechCommand } from "@aws-sdk/client-polly";

export async function POST(req) {
  try {
    const { text, voiceId } = await req.json();
    if (!text || !voiceId) {
      return NextResponse.json({ error: "Missing text or voiceId" }, { status: 400 });
    }

    const pollyClient = new PollyClient({
      region: "ap-south-1", // FIXED: use valid Polly region
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
      },
    });

    const command = new SynthesizeSpeechCommand({
      Text: text,
      OutputFormat: "mp3",
      Engine: "neural",
      VoiceId: voiceId,
      LanguageCode: "en-US",
    });

    try {
      const { AudioStream } = await pollyClient.send(command);
      const buffer = Buffer.from(await AudioStream.transformToByteArray());
      return new Response(buffer, {
        status: 200,
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": "inline; filename=tts.mp3",
        },
      });
    } catch (pollyErr) {
      return NextResponse.json({ error: `Polly error: ${pollyErr.message}` }, { status: 500 });
    }
  } catch (err) {
    console.error("Polly TTS error:", err);
    return NextResponse.json({ error: err.message || "TTS server error" }, { status: 500 });
  }
}
