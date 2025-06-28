import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const buffer = await req.arrayBuffer();
    // 1. Upload audio to AssemblyAI
    const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLY_API_KEY,
        "content-type": "application/octet-stream",
      },
      body: Buffer.from(buffer),
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.upload_url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    // 2. Request transcription
    const transcriptRes = await fetch("https://api.assemblyai.com/v2/transcript", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLY_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({ audio_url: uploadData.upload_url }),
    });
    const transcriptData = await transcriptRes.json();
    if (!transcriptData.id) {
      return NextResponse.json({ error: "Transcription request failed" }, { status: 500 });
    }

    // 3. Poll for completion
    let completed = false;
    let transcriptText = "";
    while (!completed) {
      await new Promise((res) => setTimeout(res, 2000));
      const pollRes = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptData.id}`, {
        headers: { authorization: process.env.ASSEMBLY_API_KEY },
      });
      const pollData = await pollRes.json();
      if (pollData.status === "completed") {
        completed = true;
        transcriptText = pollData.text;
      } else if (pollData.status === "failed") {
        completed = true;
        transcriptText = "Transcription failed.";
      }
    }

    return NextResponse.json({ transcript: transcriptText });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 });
  }
}
