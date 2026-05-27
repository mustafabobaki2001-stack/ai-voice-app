import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = "claude-sonnet-4-20250514";
const MAX_PRODUCT_CHARS = 1000;
const MAX_AUDIENCE_CHARS = 500;
const MIN_EMAILS = 3;
const MAX_EMAILS = 7;
const DEFAULT_EMAILS = 5;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "Service not configured" }, { status: 500 });
  }

  const body = await req.json();
  const { product, audience, emails: requestedEmails } = body;

  if (!product || typeof product !== "string" || product.trim().length === 0) {
    return NextResponse.json({ error: "Product is required" }, { status: 400 });
  }

  if (product.length > MAX_PRODUCT_CHARS) {
    return NextResponse.json(
      { error: `Product description too long (max ${MAX_PRODUCT_CHARS} characters)` },
      { status: 400 }
    );
  }

  if (!audience || typeof audience !== "string" || audience.trim().length === 0) {
    return NextResponse.json({ error: "Audience is required" }, { status: 400 });
  }

  if (audience.length > MAX_AUDIENCE_CHARS) {
    return NextResponse.json(
      { error: `Audience description too long (max ${MAX_AUDIENCE_CHARS} characters)` },
      { status: 400 }
    );
  }

  const emailCount = Math.min(
    Math.max(requestedEmails ?? DEFAULT_EMAILS, MIN_EMAILS),
    MAX_EMAILS
  );

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
      system: `You are a world-class email marketing copywriter. Create a complete ${emailCount}-email marketing sequence.

Return ONLY valid JSON array with exactly ${emailCount} email objects. Each object has:
- "subject": compelling email subject line (max 60 chars)
- "preview_text": inbox preview text that drives opens (max 90 chars)
- "body": full email body in plain text with clear structure (paragraphs, not HTML)
- "cta_text": call-to-action button text (max 30 chars)

Sequence flow: welcome/hook -> value/education -> social proof -> objection handling -> urgency/close.
Adapt the flow based on ${emailCount} emails. Each email should build on the previous.
Be persuasive, specific, and benefit-driven. No fluff.
No markdown, no explanation — just the JSON array.`,
      messages: [
        {
          role: "user",
          content: `Product: ${product.trim()}\nTarget audience: ${audience.trim()}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Email sequence generation failed. Please try again." },
      { status: 502 }
    );
  }

  const data = await response.json();
  const rawText = data.content?.[0]?.text ?? "[]";

  const jsonMatch = rawText.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    return NextResponse.json({ error: "Failed to parse email data" }, { status: 500 });
  }

  const emails = JSON.parse(jsonMatch[0]);

  return NextResponse.json({ emails });
}
