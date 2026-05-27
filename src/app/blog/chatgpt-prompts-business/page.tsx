import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "50 ChatGPT Prompts That Will 10x Your Business Output",
  description:
    "Stop getting generic AI answers. These 50 tested ChatGPT prompts turn AI into a business weapon for sales, content, email, and strategy.",
  keywords: [
    "ChatGPT prompts",
    "ChatGPT for business",
    "AI prompts",
    "best ChatGPT prompts",
    "ChatGPT productivity",
    "business prompts AI",
    "ChatGPT templates",
  ],
  openGraph: {
    title: "50 ChatGPT Prompts That Will 10x Your Business Output",
    description:
      "These tested prompts turn ChatGPT into a business weapon — for sales, content, email, and strategy.",
    type: "article",
  },
};

function CTA({ text, href }: { text: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block mt-4 mb-6 px-5 py-2.5 bg-gold text-black font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
    >
      {text}
    </a>
  );
}

const SAMPLE_PROMPTS = [
  {
    category: "Sales & Outreach",
    prompts: [
      {
        title: "Cold Email That Gets Replies",
        prompt:
          "Write a cold email to [job title] at [company type]. I sell [product/service]. Keep it under 100 words. Lead with a specific pain point, not my product. End with a low-friction ask (not a meeting).",
      },
      {
        title: "Objection Handler",
        prompt:
          'My prospect said "[objection]" about my [product]. Write 3 responses: one empathetic, one data-driven, one that reframes the objection as a reason to buy. Keep each under 50 words.',
      },
    ],
  },
  {
    category: "Content Creation",
    prompts: [
      {
        title: "YouTube Script Hook",
        prompt:
          "Write 5 opening hooks for a YouTube video about [topic]. Each hook must be under 15 words, create curiosity, and make the viewer feel they'll miss out if they scroll past. No questions — only statements.",
      },
      {
        title: "LinkedIn Post Generator",
        prompt:
          "Write a LinkedIn post about [lesson/insight]. Format: hook line (controversial or surprising), 3-line story, key takeaway, call to engagement. Under 200 words. No hashtags in the body.",
      },
    ],
  },
  {
    category: "Email Marketing",
    prompts: [
      {
        title: "Welcome Email Sequence",
        prompt:
          "Write a 3-email welcome sequence for new subscribers to [business/product]. Email 1: deliver the lead magnet + set expectations. Email 2: share your best content/result. Email 3: soft pitch for [product]. Conversational tone. Under 150 words each.",
      },
      {
        title: "Re-Engagement Email",
        prompt:
          "Write a re-engagement email for subscribers who haven't opened emails in 30+ days. Subject line that creates curiosity. Body: acknowledge the silence, offer something new, one clear CTA. Under 100 words.",
      },
    ],
  },
  {
    category: "Strategy & Analysis",
    prompts: [
      {
        title: "Competitor Teardown",
        prompt:
          "Analyze [competitor URL/name] as if you're a marketing strategist. Cover: their positioning, pricing strategy, content approach, apparent target customer, biggest weakness I could exploit, and one thing they do better than most. Be specific.",
      },
      {
        title: "Pricing Strategy",
        prompt:
          "I sell [product] for [price]. My costs are [costs]. My audience is [description]. Analyze my pricing: Am I leaving money on the table? Should I tier? Should I anchor higher? Give me 3 specific pricing moves with reasoning.",
      },
    ],
  },
];

export default function ChatGPTPromptsBusinessPage() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <article className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/blog"
          className="text-zinc-500 text-sm hover:text-gold transition-colors"
        >
          &larr; Back to Blog
        </Link>

        <div className="mt-8 mb-10">
          <span className="text-xs font-medium px-2.5 py-1 bg-gold/10 text-gold rounded-full">
            Prompts
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-3 leading-tight">
            50 ChatGPT Prompts That Will 10x Your Business Output
          </h1>
          <p className="text-zinc-500 text-sm">
            By Mustafa Bobaki &middot; May 27, 2026 &middot; 7 min read
          </p>
        </div>

        <div className="prose-custom space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-lg text-zinc-200">
            Most people type &quot;write me a blog post about X&quot; into ChatGPT and wonder
            why the output is mediocre. The problem isn&apos;t the AI — it&apos;s the prompt.
            A well-structured prompt with constraints, context, and a clear role assignment
            produces output that&apos;s 10x more useful than a generic request.
          </p>
          <p>
            Here are sample prompts from our collection — tested across hundreds of
            use cases and refined for real business results.
          </p>

          {SAMPLE_PROMPTS.map((category) => (
            <div key={category.category}>
              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
                {category.category}
              </h2>
              {category.prompts.map((prompt) => (
                <div
                  key={prompt.title}
                  className="border border-border rounded-xl p-5 bg-surface mb-4"
                >
                  <h3 className="text-white font-semibold text-sm mb-2">
                    {prompt.title}
                  </h3>
                  <p className="text-zinc-400 text-sm font-mono bg-[#09090b] p-3 rounded-lg border border-border">
                    {prompt.prompt}
                  </p>
                </div>
              ))}
            </div>
          ))}

          <p className="text-zinc-400 text-sm italic mt-6">
            These 8 prompts are a preview. The full collection contains 500 prompts
            across 20+ business categories.
          </p>

          <div className="border border-gold/20 rounded-xl p-6 bg-gold/5 my-8">
            <p className="text-white font-semibold mb-2">
              Get all 500 prompts — organized, tested, ready to use
            </p>
            <p className="text-zinc-400 text-sm mb-3">
              20+ categories: sales, content, email, strategy, coding, hiring,
              finance, and more. Use code LAUNCH20 for 20% off.
            </p>
            <CTA
              text="Get 500 ChatGPT Prompts — $9.99 →"
              href="https://mustafabobaki.gumroad.com/l/chatgpt-prompts?offer_code=LAUNCH20"
            />
          </div>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
            Why Prompt Quality Matters
          </h2>
          <p>
            A generic prompt gives you a generic answer. A specific prompt with role
            assignment, constraints, and format instructions gives you output you can
            actually use. The difference is dramatic:
          </p>
          <div className="grid gap-4 md:grid-cols-2 my-6">
            <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5">
              <p className="text-red-400 text-xs font-semibold mb-2">BAD PROMPT</p>
              <p className="text-zinc-400 text-sm">
                &quot;Write me a sales email&quot;
              </p>
            </div>
            <div className="border border-green-500/20 rounded-xl p-4 bg-green-500/5">
              <p className="text-green-400 text-xs font-semibold mb-2">GOOD PROMPT</p>
              <p className="text-zinc-400 text-sm">
                &quot;Write a cold email to a marketing director at a SaaS company.
                I sell AI voiceover services. Under 100 words. Lead with their
                pain point, not my product.&quot;
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
            The Prompt Formula
          </h2>
          <p>Every high-performing prompt follows this structure:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>
              <strong className="text-white">Role.</strong> Tell the AI who it is.
              &quot;You are a senior copywriter with 10 years of experience.&quot;
            </li>
            <li>
              <strong className="text-white">Context.</strong> Give background information.
              What&apos;s the situation? Who&apos;s the audience?
            </li>
            <li>
              <strong className="text-white">Task.</strong> Be specific about what you want.
              Format, length, tone, number of outputs.
            </li>
            <li>
              <strong className="text-white">Constraints.</strong> Tell it what NOT to do.
              &quot;No jargon. No questions. Under 100 words.&quot;
            </li>
          </ol>

          <div className="border border-gold/20 rounded-xl p-6 bg-gold/5 my-8">
            <p className="text-white font-semibold mb-2">
              Try the free AI Command Center
            </p>
            <p className="text-zinc-400 text-sm mb-3">
              6 AI agents you can use right now — script writer, carousel maker,
              hashtag generator, and more. No signup required.
            </p>
            <a
              href="/dashboard"
              className="inline-block mt-2 px-5 py-2.5 bg-gold text-black font-semibold text-sm rounded-lg hover:bg-yellow-400 transition-colors"
            >
              Open Command Center — Free →
            </a>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-10 mb-4">
            The Bottom Line
          </h2>
          <p>
            AI is a multiplier, not a replacement. The people getting the best results
            aren&apos;t AI experts — they&apos;re people who learned to write better prompts.
          </p>
          <p>
            These 8 samples show what&apos;s possible. The{" "}
            <a
              href="https://mustafabobaki.gumroad.com/l/chatgpt-prompts?offer_code=LAUNCH20"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              full 500-prompt collection
            </a>{" "}
            gives you a complete toolkit — copy, paste, customize, and get results
            in minutes.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-border">
          <p className="text-zinc-500 text-sm">
            Written by{" "}
            <span className="text-white">Mustafa Bobaki</span> &middot;{" "}
            <Link href="/blog" className="text-gold hover:underline">
              More articles &rarr;
            </Link>
          </p>
        </div>
      </article>
    </main>
  );
}
