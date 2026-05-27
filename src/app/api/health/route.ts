import { NextResponse } from "next/server";

export async function GET() {
  const hasElevenLabs = !!process.env.ELEVENLABS_API_KEY;
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasStripe = !!process.env.STRIPE_SECRET_KEY;

  return NextResponse.json({
    status: "operational",
    agents: {
      voiceforge: hasElevenLabs ? "online" : "degraded",
      scriptai: hasClaude ? "online" : "degraded",
      slideforge: hasClaude ? "online" : "degraded",
      hashtagai: hasClaude ? "online" : "degraded",
      emailforge: hasClaude ? "online" : "degraded",
      thumbforge: hasClaude ? "online" : "degraded",
    },
    payments: hasStripe ? "active" : "pending",
    timestamp: new Date().toISOString(),
  });
}
