import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";
const MAX_INPUT_CHARS = 2000;

const CONTENT_TYPES: Record<string, string> = {
  youtube_script: "Write a compelling YouTube video script. Include a strong hook in the first 2 sentences, clear sections, and a call to action. Make it conversational and engaging.",
  blog_post: "Write a professional blog post with an attention-grabbing intro, clear subheadings, actionable content, and a conclusion. SEO-friendly and engaging.",
  social_caption: "Write viral social media captions. Include hooks, storytelling, and CTAs. Write 3 variations: one for Instagram, one for Twitter/X, one for LinkedIn.",
  email_copy: "Write a persuasive marketing email. Include a compelling subject line, engaging opening, clear value proposition, and strong CTA. Keep it concise.",
  ad_copy: "Write high-converting ad copy. Include multiple headline variations, body copy options, and CTAs. Focus on benefits, urgency, and social proof.",
};

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { prompt, contentType } = body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  if (prompt.length > MAX_INPUT_CHARS) {
    return NextResponse.json({ error: `Prompt too long (max ${MAX_INPUT_CHARS} characters)` }, { status: 400 });
  }

  const systemPrompt = CONTENT_TYPES[contentType] ?? CONTENT_TYPES.youtube_script;

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
      system: `You are a world-class content writer for Mustafa Bobaki's AI company. ${systemPrompt} Write in English. Be specific, actionable, and engaging. No fluff.`,
      messages: [{ role: "user", content: prompt.trim() }],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Content generation failed. Please try again." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "No content generated";

  return NextResponse.json({ content: text });
}
