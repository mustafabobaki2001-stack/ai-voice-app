"use client";

import { useState } from "react";

const VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", tag: "Warm Narrator", lang: "EN" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", tag: "Deep & Confident", lang: "EN" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", tag: "Soft & Professional", lang: "EN" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", tag: "British Elegance", lang: "EN" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", tag: "Authoritative", lang: "EN" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", tag: "Young & Energetic", lang: "EN" },
];

const PRICING = [
  { words: 500, price: 5, label: "Short", desc: "Social posts, ads" },
  { words: 1500, price: 12, label: "Standard", desc: "YouTube videos, podcasts" },
  { words: 5000, price: 29, label: "Professional", desc: "Courses, audiobooks" },
];

export default function Home() {
  const [script, setScript] = useState("");
  const [voice, setVoice] = useState(VOICES[0].id);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = script.trim().split(/\s+/).filter(Boolean).length;
  const tier = PRICING.find((p) => wordCount <= p.words) ?? PRICING[PRICING.length - 1];

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
      {/* Hero */}
      <header className="relative overflow-hidden py-24 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08),transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-gold/20 bg-gold/5 text-gold text-sm font-medium tracking-wide">
            AI-Powered Voice Generation
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gold via-yellow-300 to-gold-dim bg-clip-text text-transparent">
              VoiceForge
            </span>
            <br />
            <span className="text-zinc-100 text-3xl sm:text-4xl font-light">
              Studio Voiceovers in Seconds
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-xl mx-auto mb-10">
            Paste your script. Pick a voice. Get broadcast-quality audio instantly.
            No subscriptions — pay only for what you generate.
          </p>
          <a href="#generate" className="inline-block bg-gradient-to-r from-gold to-gold-dim text-black font-semibold px-8 py-3.5 rounded-lg text-lg hover:opacity-90 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(201,168,76,0.3)]">
            Generate Now →
          </a>
        </div>
      </header>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-3xl font-bold mb-2">Simple Pricing</h2>
          <p className="text-center text-zinc-500 mb-12">Pay per generation. No monthly fees.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((p) => (
              <div key={p.words} className="bg-surface border border-border rounded-2xl p-6 hover:border-gold-dim transition-colors text-center">
                <div className="text-sm text-zinc-500 uppercase tracking-widest mb-2">{p.label}</div>
                <div className="text-4xl font-bold text-gold mb-1">${p.price}</div>
                <div className="text-sm text-zinc-400 mb-4">Up to {p.words.toLocaleString()} words</div>
                <div className="text-xs text-zinc-500">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section id="generate" className="py-20 px-6 bg-surface2/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Generate Your Voiceover</h2>

          {/* Voice Selection */}
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

          {/* Script Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm text-zinc-400 uppercase tracking-widest">Your Script</label>
              <span className="text-sm text-zinc-500">
                {wordCount} words · <span className="text-gold font-medium">${tier.price}</span>
              </span>
            </div>
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Paste your script here..."
              rows={8}
              className="w-full bg-surface border border-border rounded-xl p-4 text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !script.trim()}
            className="w-full bg-gradient-to-r from-gold to-gold-dim text-black font-semibold py-4 rounded-xl text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {loading ? "Generating..." : `Generate Voiceover · $${tier.price}`}
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

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "Instant", desc: "Generated in under 10 seconds. No waiting, no queues." },
            { icon: "🎙️", title: "30+ Voices", desc: "Male, female, young, old. Narrators, presenters, characters." },
            { icon: "🌍", title: "29 Languages", desc: "English, Arabic, Spanish, French, German, and 24 more." },
          ].map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-center text-sm text-zinc-600">
        VoiceForge AI · Built by Mustafa Bobaki · Powered by ElevenLabs
      </footer>
    </div>
  );
}
