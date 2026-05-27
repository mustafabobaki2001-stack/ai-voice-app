import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";
const MAX_TITLE_CHARS = 200;
const THUMBNAIL_COUNT = 3;

const VALID_STYLES = new Set(["dramatic", "clean", "bold", "minimal"]);

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { title, style } = body;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (title.length > MAX_TITLE_CHARS) {
    return NextResponse.json(
      { error: `Title too long (max ${MAX_TITLE_CHARS} characters)` },
      { status: 400 }
    );
  }

  const thumbnailStyle = VALID_STYLES.has(style) ? style : "dramatic";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 2048,
      system: `You are a YouTube thumbnail design strategist who creates concepts that maximize click-through rate.

Generate exactly ${THUMBNAIL_COUNT} distinct thumbnail concepts in a "${thumbnailStyle}" style.

Return ONLY valid JSON array with exactly ${THUMBNAIL_COUNT} objects. Each object has:
- "headline": punchy text overlay, max 5 words, designed for impact at small sizes
- "visual_description": detailed description of the background image/scene composition
- "color_scheme": primary and accent colors with hex codes (e.g. "Deep navy #1a1a2e with electric yellow #ffd700 accents")
- "emotion": the emotional trigger this thumbnail targets (e.g. "curiosity", "fear of missing out", "shock")
- "text_placement": where and how the headline text is positioned (e.g. "large bold centered", "bottom-left with drop shadow")

Each concept should feel different while matching the "${thumbnailStyle}" style.
No markdown, no explanation — just the JSON array.`,
      messages: [{ role: "user", content: title.trim() }],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return NextResponse.json(
      { error: `Thumbnail generation failed: ${errText}` },
      { status: response.status }
    );
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? "[]";

  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse thumbnail data" }, { status: 500 });
  }

  const concepts = JSON.parse(jsonMatch[0]);

  return NextResponse.json({ concepts });
}
