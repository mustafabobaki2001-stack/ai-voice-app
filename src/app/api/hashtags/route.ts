import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOPIC_CHARS = 500;

const VALID_PLATFORMS = new Set(["instagram", "tiktok", "youtube", "linkedin"]);

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { topic, platform } = body;

  if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 });
  }

  if (topic.length > MAX_TOPIC_CHARS) {
    return NextResponse.json(
      { error: `Topic too long (max ${MAX_TOPIC_CHARS} characters)` },
      { status: 400 }
    );
  }

  if (!platform || !VALID_PLATFORMS.has(platform)) {
    return NextResponse.json(
      { error: "Platform must be one of: instagram, tiktok, youtube, linkedin" },
      { status: 400 }
    );
  }

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
      system: `You are a social media growth strategist. Generate exactly 30 viral hashtags for ${platform}, organized into 3 tiers of 10 each.

Return ONLY valid JSON with this exact structure:
{
  "high": ["#hashtag1", "#hashtag2", ...],
  "medium": ["#hashtag1", "#hashtag2", ...],
  "niche": ["#hashtag1", "#hashtag2", ...]
}

- "high": 10 high-competition hashtags (millions of posts, broad reach)
- "medium": 10 medium-competition hashtags (hundreds of thousands of posts, targeted)
- "niche": 10 niche hashtags (under 100k posts, highly specific to the topic)

Every hashtag must start with #. Tailor them specifically to ${platform} culture and algorithm.
No markdown, no explanation — just the JSON object.`,
      messages: [{ role: "user", content: topic.trim() }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Hashtag generation failed. Please try again." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? "{}";

  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse hashtag data" }, { status: 500 });
  }

  const hashtags = JSON.parse(jsonMatch[0]);

  return NextResponse.json({ hashtags });
}
