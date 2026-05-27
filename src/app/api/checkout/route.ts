import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const PRICE_MAP: Record<string, { amount: number; name: string }> = {
  voiceover_short: { amount: 500, name: "VoiceForge — Short (500 words)" },
  voiceover_standard: { amount: 1200, name: "VoiceForge — Standard (1,500 words)" },
  voiceover_pro: { amount: 2900, name: "VoiceForge — Professional (5,000 words)" },
  script_single: { amount: 300, name: "ScriptAI — Single Generation" },
  carousel_single: { amount: 200, name: "SlideForge — Single Carousel" },
  hashtag_single: { amount: 100, name: "HashtagAI — Hashtag Set" },
  email_sequence: { amount: 500, name: "EmailForge — Email Sequence" },
  thumbnail_concepts: { amount: 200, name: "ThumbForge — Thumbnail Concepts" },
  bundle_all: { amount: 1999, name: "All Access Bundle — 20 Generations" },
};

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments not configured yet" }, { status: 503 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  const body = await req.json();
  const { priceId, successUrl, cancelUrl } = body;

  if (!priceId || !PRICE_MAP[priceId]) {
    return NextResponse.json({ error: "Invalid product" }, { status: 400 });
  }

  const product = PRICE_MAP[priceId];

  const origin = req.nextUrl.origin;

  function isSameOrigin(url: string | undefined): boolean {
    if (!url) return false;
    try {
      return new URL(url).origin === origin;
    } catch {
      return false;
    }
  }

  const safeSuccessUrl = isSameOrigin(successUrl) ? successUrl : `${origin}/dashboard?paid=true`;
  const safeCancelUrl = isSameOrigin(cancelUrl) ? cancelUrl : `${origin}/dashboard?cancelled=true`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: product.amount,
        },
        quantity: 1,
      },
    ],
    success_url: safeSuccessUrl,
    cancel_url: safeCancelUrl,
  });

  return NextResponse.json({ url: session.url });
}
