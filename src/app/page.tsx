"use client";

import { useState } from "react";

/* ── Voice demo data ─────────────────────────────────────── */
const VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", tag: "Warm Narrator" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", tag: "Deep & Confident" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", tag: "Soft & Professional" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", tag: "British Elegance" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", tag: "Authoritative" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", tag: "Young & Energetic" },
];

/* ── Static data ─────────────────────────────────────────── */
const AGENTS = [
  { icon: "🎤", name: "VoiceForge", desc: "Studio-quality AI voiceovers in seconds. 30+ voices, 29 languages." },
  { icon: "✍️", name: "ScriptAI", desc: "YouTube scripts, blog posts, ad copy, social captions on demand." },
  { icon: "🎨", name: "SlideForge", desc: "Instagram carousels with titles, bodies, tips, and slide counts." },
  { icon: "#️⃣", name: "HashtagAI", desc: "Viral hashtag sets ranked by competition for any platform." },
  { icon: "📧", name: "EmailForge", desc: "Full email sequences with subjects, preview text, CTAs." },
  { icon: "🖼️", name: "ThumbForge", desc: "Thumbnail concepts with headlines, colors, and emotion tags." },
];

const VOICEOVER_TIERS = [
  { label: "Starter", words: "500", price: "€15", url: "https://mustafabobaki.gumroad.com/l/kabxd" },
  { label: "Standard", words: "1,500", price: "€35", url: "https://mustafabobaki.gumroad.com/l/sexdyb" },
  { label: "Professional", words: "5,000", price: "€79", url: "https://mustafabobaki.gumroad.com/l/inzzym" },
  { label: "Enterprise", words: "15,000", price: "€199", url: "https://mustafabobaki.gumroad.com/l/iqqfnr" },
];

const BOOKS = [
  { title: "The AI Money Machine", price: "$4.99", url: "https://mustafabobaki.gumroad.com/l/ai-money-machine" },
  { title: "500 ChatGPT Prompts", price: "$9.99", url: "https://mustafabobaki.gumroad.com/l/chatgpt-prompts" },
  { title: "Side Hustles 2026", price: "$9.99", url: "https://mustafabobaki.gumroad.com/l/side-hustles-2026" },
  { title: "Passive Income Blueprint", price: "$12.99", url: "https://mustafabobaki.gumroad.com/l/passive-income-blueprint" },
  { title: "First-Generation Wealth System", price: "$19.99", url: "https://mustafabobaki.gumroad.com/l/first-gen-wealth" },
  { title: "Wealth Library Bundle (all 5)", price: "$29.99", url: "https://mustafabobaki.gumroad.com/l/wealth-library-bundle", highlight: true },
];

/* ── Reusable link button ────────────────────────────────── */
function ExtLink({ href, children, gold }: { href: string; children: React.ReactNode; gold?: boolean }) {
  const base = "inline-block text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:-translate-y-0.5";
  const style = gold
    ? `${base} bg-gradient-to-r from-gold to-gold-dim text-black hover:shadow-[0_6px_24px_rgba(201,168,76,0.35)]`
    : `${base} border border-gold/25 text-gold hover:bg-gold/10`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={style}>
      {children}
    </a>
  );
}

/* ── Section heading ─────────────────────────────────────── */
function Heading({ tag, title, sub }: { tag: string; title: string; sub: string }) {
  return (
    <div className="text-center mb-14">
      <span className="inline-block px-3 py-1 mb-4 rounded-full border border-gold/20 bg-gold/5 text-gold text-xs font-medium tracking-widest uppercase">
        {tag}
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">{title}</h2>
      <p className="text-zinc-500 max-w-xl mx-auto">{sub}</p>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────── */
export default function Home() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;

  async function handleGenerate() {
    if (!script.trim()) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: script.trim(), voiceId: voice }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Hero ──────────────────────────────────────────── */}
      <header className="relative overflow-hidden py-28 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(201,168,76,0.05),transparent_50%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm font-medium tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            6 Agents Online
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-zinc-100">Mustafa Bobaki&apos;s</span>
            <br />
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-gold-dim bg-clip-text text-transparent">
              AI Command Center
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            6 AI Agents. Voice. Scripts. Carousels. Hashtags. Emails. Thumbnails.
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-gradient-to-r from-gold to-gold-dim text-black font-bold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,168,76,0.35)]"
          >
            Launch Command Center &rarr;
          </a>
        </div>
      </header>

      {/* ── AI Agents ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Heading tag="AI Agents" title="Your Team of Six" sub="Each agent is purpose-built for one job and does it better than any generic tool." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {AGENTS.map((a) => (
              <a
                key={a.name}
                href="/dashboard"
                className="group relative bg-surface border border-border rounded-2xl p-6 hover:border-gold/40 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(201,168,76,0.08)]"
              >
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="text-lg font-bold mb-1 group-hover:text-gold transition-colors">{a.name}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{a.desc}</p>
                <span className="inline-block mt-4 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Try Free &rarr;
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Voiceover Service ─────────────────────────────── */}
      <section className="py-24 px-6 bg-surface2/40">
        <div className="max-w-5xl mx-auto">
          <Heading tag="Voiceover Service" title="Professional AI Voices" sub="Broadcast-ready voiceovers delivered instantly. Choose a tier and buy directly." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VOICEOVER_TIERS.map((t) => (
              <div
                key={t.label}
                className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-gold/40 transition-all"
              >
                <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">{t.label}</div>
                <div className="text-3xl font-bold text-gold mb-1">{t.price}</div>
                <div className="text-sm text-zinc-400 mb-5">Up to {t.words} words</div>
                <ExtLink href={t.url} gold>Buy Now</ExtLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Digital Products ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <Heading tag="Digital Products" title="Books &amp; Guides" sub="Actionable playbooks on AI, side hustles, and wealth-building." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BOOKS.map((b) => (
              <div
                key={b.title}
                className={`bg-surface border rounded-2xl p-6 flex flex-col justify-between transition-all hover:-translate-y-1 ${
                  b.highlight
                    ? "border-gold/40 shadow-[0_0_30px_rgba(201,168,76,0.08)]"
                    : "border-border hover:border-gold/30"
                }`}
              >
                <div>
                  {b.highlight && (
                    <span className="inline-block mb-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-gold/10 text-gold border border-gold/20">
                      Best Value
                    </span>
                  )}
                  <h3 className="text-base font-bold mb-1">{b.title}</h3>
                  <div className="text-2xl font-bold text-gold">{b.price}</div>
                </div>
                <div className="mt-5">
                  <ExtLink href={b.url}>Get It &rarr;</ExtLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Voice Demo ───────────────────────────────── */}
      <section className="py-24 px-6 bg-surface2/40">
        <div className="max-w-3xl mx-auto">
          <Heading tag="Live Demo" title="Try VoiceForge Now" sub="Paste a script, pick a voice, and hear the result instantly." />

          <div className="mb-6">
            <label className="block text-sm text-zinc-400 mb-3 uppercase tracking-widest">Select Voice</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    voice === v.id
                      ? "border-gold bg-gold/10 shadow-[0_0_20px_rgba(201,168,76,0.1)]"
                      : "border-border bg-surface hover:border-zinc-600"
                  }`}
                >
                  <div className="font-medium text-sm">{v.name}</div>
                  <div className="text-xs text-zinc-500">{v.tag}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-zinc-400 uppercase tracking-widest">Your Script</label>
              <span className="text-sm text-zinc-500">{wordCount} words</span>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script here..."
              rows={6}
              className="w-full bg-surface border border-border rounded-xl p-4 text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !script.trim()}
            className="w-full bg-gradient-to-r from-gold to-gold-dim text-black font-semibold py-4 rounded-xl text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {loading ? "Generating..." : "Generate Voiceover"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {audioUrl && (
            <div className="mt-6 p-6 bg-surface border border-gold/30 rounded-xl">
              <div className="text-sm text-gold mb-3 font-medium">Your voiceover is ready</div>
              <audio controls src={audioUrl} className="w-full mb-4" />
              <a
                href={audioUrl}
                download="voiceover.mp3"
                className="inline-block bg-gold/10 text-gold border border-gold/20 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gold/20 transition-colors"
              >
                Download MP3
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="py-10 px-6 border-t border-border text-center">
        <p className="text-sm text-zinc-500">Built by Mustafa Bobaki</p>
      </footer>
    </div>
  );
}
