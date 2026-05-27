import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const MODEL_ID = "eleven_multilingual_v2";

const ALLOWED_VOICES = new Set([
  "JBFqnCBsd6RMkjVDRZzb",
  "TX3LPaxmHKxFdv7VOQHJ",
  "EXAVITQu4vr4xnSDxMaL",
  "pFZP5JQG7iQjIQuC4Bku",
  "onwK4e9ZLuTAKqWW03F9",
  "TxGEqnHWrfWFTfGW9XjX",
]);

const MAX_CHARS = 30000;

export async function POST(req: NextRequest) {
  if (!ELEVENLABS_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { script, voiceId } = body;

  if (!script || typeof script !== "string" || script.trim().length === 0) {
    return NextResponse.json({ error: "Script is required" }, { status: 400 });
  }

  if (script.length > MAX_CHARS) {
    return NextResponse.json({ error: `Script too long (max ${MAX_CHARS} characters)` }, { status: 400 });
  }

  if (!voiceId || !ALLOWED_VOICES.has(voiceId)) {
    return NextResponse.json({ error: "Invalid voice selection" }, { status: 400 });
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: script.trim(),
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json(
      { error: `Voice generation failed: ${errText}` },
      { status: response.status }
    );
  }

  const audioBuffer = await response.arrayBuffer();

  return new NextResponse(audioBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="voiceover.mp3"',
    },
  });
}
