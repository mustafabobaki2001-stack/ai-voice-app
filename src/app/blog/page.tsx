import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — Mustafa Bobaki | AI Tools, Side Hustles & Creator Strategies",
  description:
    "Practical guides on AI voiceovers, side hustles, ChatGPT prompts, and building income with AI tools. Written by Mustafa Bobaki.",
  openGraph: {
    title: "Blog — Mustafa Bobaki",
    description:
      "Practical guides on AI voiceovers, side hustles, ChatGPT prompts, and building income with AI tools.",
    type: "website",
  },
};

const POSTS = [
  {
    slug: "ai-voiceover-guide",
    title: "AI Voiceover: The Complete Guide for Content Creators in 2026",
    excerpt:
      "How to use AI voice technology to produce studio-quality voiceovers for YouTube, podcasts, and courses — without a studio or a voice actor.",
    date: "May 27, 2026",
    readTime: "8 min read",
    tag: "AI Tools",
  },
  {
    slug: "ai-side-hustles-2026",
    title: "15 AI Side Hustles That Actually Pay in 2026",
    excerpt:
      "The side hustles that worked in 2022 are dead. Here are the AI-powered income opportunities generating real money right now.",
    date: "May 27, 2026",
    readTime: "10 min read",
    tag: "Make Money",
  },
  {
    slug: "chatgpt-prompts-business",
    title: "50 ChatGPT Prompts That Will 10x Your Business Output",
    excerpt:
      "Stop getting generic AI answers. These tested prompts turn ChatGPT into a business weapon — for sales, content, email, and strategy.",
    date: "May 27, 2026",
    readTime: "7 min read",
    tag: "Prompts",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#09090b]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          href="/"
          className="text-zinc-500 text-sm hover:text-gold transition-colors"
        >
          &larr; Back to Command Center
        </Link>

        <h1 className="text-4xl font-bold text-white mt-8 mb-3">Blog</h1>
        <p className="text-zinc-400 text-lg mb-12">
          Practical guides on AI tools, income strategies, and creator workflows.
        </p>

        <div className="space-y-10">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-border rounded-xl p-6 hover:border-gold/40 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 bg-gold/10 text-gold rounded-full">
                    {post.tag}
                  </span>
                  <span className="text-xs text-zinc-500">{post.date}</span>
                  <span className="text-xs text-zinc-600">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-semibold text-white group-hover:text-gold transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-16 border border-border rounded-xl p-8 text-center bg-surface">
          <p className="text-zinc-400 mb-1 text-sm">Written by</p>
          <p className="text-white text-lg font-semibold">Mustafa Bobaki</p>
          <p className="text-zinc-500 text-sm mt-1">
            Building AI tools for creators.{" "}
            <a
              href="https://mustafabobaki.gumroad.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              See all products &rarr;
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
