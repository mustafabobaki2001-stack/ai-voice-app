import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";
const MAX_INPUT_CHARS = 2000;
const MIN_SLIDES = 3;
const MAX_SLIDES = 10;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { topic, slides: requestedSlides, style } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  if (topic.length > MAX_INPUT_CHARS) {
    return NextResponse.json({ error: `Topic too long (max ${MAX_INPUT_CHARS} characters)` }, { status: 400 });
  }

  const slideCount = Math.min(Math.max(requestedSlides ?? 5, MIN_SLIDES), MAX_SLIDES);
  const slideStyle = style ?? "professional";

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: `You are a viral carousel content creator. Generate Instagram/LinkedIn carousel slides.

Return ONLY valid JSON array with exactly ${slideCount} slides. Each slide object has:
- "title": bold headline (max 8 words)
- "body": supporting text (max 25 words)
- "emoji": one relevant emoji
- "tip": optional actionable tip (max 15 words)

Style: ${slideStyle}. Make slide 1 a scroll-stopping hook. Last slide = CTA.
No markdown, no explanation — just the JSON array.`,
      messages: [{ role: "user", content: topic.trim() }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Carousel generation failed. Please try again." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? "[]";

  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse carousel data" }, { status: 500 });
  }

  const slides = JSON.parse(jsonMatch[0]);

  return NextResponse.json({ slides });
}
