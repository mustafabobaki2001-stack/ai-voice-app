"use client";

import { useState, useRef, useEffect } from "react";

const VOICES = [
  { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", tag: "Warm Narrator" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", tag: "Deep & Confident" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", tag: "Soft & Professional" },
  { id: "pFZP5JQG7iQjIQuC4Bku", name: "Lily", tag: "British Elegance" },
  { id: "onwK4e9ZLuTAKqWW03F9", name: "Daniel", tag: "Authoritative" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", tag: "Young & Energetic" },
];

const CONTENT_TYPES = [
  { id: "youtube_script", name: "YouTube Script", icon: "🎬" },
  { id: "blog_post", name: "Blog Post", icon: "📝" },
  { id: "social_caption", name: "Social Captions", icon: "📱" },
  { id: "email_copy", name: "Email Copy", icon: "📧" },
  { id: "ad_copy", name: "Ad Copy", icon: "📢" },
];

const PLATFORMS = [
  { id: "instagram", name: "Instagram", icon: "📸" },
  { id: "tiktok", name: "TikTok", icon: "🎵" },
  { id: "youtube", name: "YouTube", icon: "▶️" },
  { id: "linkedin", name: "LinkedIn", icon: "💼" },
];

const THUMB_STYLES = [
  { id: "dramatic", name: "Dramatic", icon: "🔥" },
  { id: "clean", name: "Clean", icon: "✨" },
  { id: "bold", name: "Bold", icon: "💥" },
  { id: "minimal", name: "Minimal", icon: "🎯" },
];

type Tool = "voiceover" | "writer" | "carousel" | "hashtags" | "emails" | "thumbnail";

type CarouselSlide = { title: string; body: string; emoji: string; tip?: string };
type HashtagSet = { high: string[]; medium: string[]; niche: string[] };
type EmailItem = { subject: string; preview_text: string; body: string; cta_text: string };
type ThumbConcept = { headline: string; visual_description: string; color_scheme: string; emotion: string; text_placement: string };

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  slides?: CarouselSlide[];
  hashtags?: HashtagSet;
  emails?: EmailItem[];
  thumbs?: ThumbConcept[];
};

const TOOLS = [
  { id: "voiceover" as Tool, name: "VoiceForge", icon: "🎙️", desc: "AI Voiceovers", color: "from-amber-500 to-yellow-600" },
  { id: "writer" as Tool, name: "ScriptAI", icon: "✍️", desc: "Content Writer", color: "from-blue-500 to-cyan-600" },
  { id: "carousel" as Tool, name: "SlideForge", icon: "🎨", desc: "Carousel Maker", color: "from-purple-500 to-pink-600" },
  { id: "hashtags" as Tool, name: "HashtagAI", icon: "#️⃣", desc: "Viral Hashtags", color: "from-green-500 to-emerald-600" },
  { id: "emails" as Tool, name: "EmailForge", icon: "📧", desc: "Email Sequences", color: "from-red-500 to-orange-600" },
  { id: "thumbnail" as Tool, name: "ThumbForge", icon: "🖼️", desc: "Thumbnail Ideas", color: "from-indigo-500 to-violet-600" },
];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [stash, setStash] = useState<Record<string, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showOptions, loading]);

  function reset() {
    setActiveTool(null);
    setMessages([]);
    setInput("");
    setStep(0);
    setShowOptions(false);
    setStash({});
  }

  function addMsg(role: "user" | "assistant", content: string, extra?: Partial<ChatMessage>) {
    setMessages((p) => [...p, { role, content, ...extra }]);
  }

  function updateLast(update: Partial<ChatMessage>) {
    setMessages((p) => {
      const u = [...p];
      u[u.length - 1] = { ...u[u.length - 1], ...update };
      return u;
    });
  }

  function startTool(tool: Tool) {
    setActiveTool(tool);
    setStep(0);
    setShowOptions(false);
    setStash({});

    const greetings: Record<Tool, string> = {
      voiceover: "What would you like me to voice? Paste your script.",
      writer: "What kind of content do you need?",
      carousel: "What's the carousel about?",
      hashtags: "Which platform are these hashtags for?",
      emails: "What product or service is this email sequence for?",
      thumbnail: "What's the video title? I'll design thumbnail concepts.",
    };

    setMessages([{ role: "assistant", content: greetings[tool] }]);

    if (tool === "writer" || tool === "hashtags") {
      setShowOptions(true);
    }
  }

  function getToolInfo() {
    return TOOLS.find((t) => t.id === activeTool) ?? TOOLS[0];
  }

  function isInputEnabled() {
    if (loading || showOptions) return false;
    if (activeTool === "voiceover") return step === 0;
    if (activeTool === "writer") return step === 1;
    if (activeTool === "carousel") return step < 2;
    if (activeTool === "hashtags") return step === 1;
    if (activeTool === "emails") return step < 3;
    if (activeTool === "thumbnail") return step < 2;
    return false;
  }

  function getPlaceholder(): string {
    if (activeTool === "voiceover") return "Paste your script...";
    if (activeTool === "writer") return "Describe what you want written...";
    if (activeTool === "carousel") return step === 0 ? "Enter topic..." : "How many slides? (3-10)";
    if (activeTool === "hashtags") return "Enter your topic or niche...";
    if (activeTool === "emails") {
      if (step === 0) return "Product or service name...";
      if (step === 1) return "Target audience...";
      return "How many emails? (3-7)";
    }
    if (activeTool === "thumbnail") return step === 0 ? "Enter video title..." : "";
    return "Type a message...";
  }

  function selectOption(value: string, label: string) {
    setShowOptions(false);
    addMsg("user", label);

    if (activeTool === "writer") {
      setStash((s) => ({ ...s, contentType: value }));
      addMsg("assistant", "Now describe what you want me to write:");
      setStep(1);
    } else if (activeTool === "hashtags") {
      setStash((s) => ({ ...s, platform: value }));
      addMsg("assistant", "What topic or niche?");
      setStep(1);
    } else if (activeTool === "thumbnail") {
      setStash((s) => ({ ...s, style: value }));
      generateThumbnails(stash.title, value);
    }
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput("");
    addMsg("user", msg);

    if (activeTool === "voiceover" && step === 0) {
      addMsg("assistant", `Got it — ${msg.split(/\s+/).length} words. Pick a voice:`);
      setStep(1);
      setShowOptions(true);
      return;
    }

    if (activeTool === "writer" && step === 1) {
      await callWriter(msg);
      return;
    }

    if (activeTool === "carousel") {
      if (step === 0) {
        setStash((s) => ({ ...s, topic: msg }));
        addMsg("assistant", "How many slides? (3-10)");
        setStep(1);
        return;
      }
      if (step === 1) {
        const n = Math.min(Math.max(parseInt(msg, 10) || 5, 3), 10);
        await callCarousel(stash.topic, n);
        return;
      }
    }

    if (activeTool === "hashtags" && step === 1) {
      await callHashtags(msg);
      return;
    }

    if (activeTool === "emails") {
      if (step === 0) {
        setStash((s) => ({ ...s, product: msg }));
        addMsg("assistant", "Who's the target audience?");
        setStep(1);
        return;
      }
      if (step === 1) {
        setStash((s) => ({ ...s, audience: msg }));
        addMsg("assistant", "How many emails? (3-7)");
        setStep(2);
        return;
      }
      if (step === 2) {
        const n = Math.min(Math.max(parseInt(msg, 10) || 5, 3), 7);
        await callEmails(n);
        return;
      }
    }

    if (activeTool === "thumbnail") {
      if (step === 0) {
        setStash((s) => ({ ...s, title: msg }));
        addMsg("assistant", "Pick a style:");
        setStep(1);
        setShowOptions(true);
        return;
      }
    }
  }

  async function generateVoice(voiceId: string) {
    setShowOptions(false);
    const v = VOICES.find((x) => x.id === voiceId);
    addMsg("assistant", `Generating with ${v?.name}...`);
    setLoading(true);
    setStep(99);

    try {
      const script = messages.find((m) => m.role === "user")?.content ?? "";
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voiceId }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const blob = await res.blob();
      updateLast({ content: "Your voiceover is ready!", audioUrl: URL.createObjectURL(blob) });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  async function callWriter(prompt: string) {
    addMsg("assistant", "Writing...");
    setLoading(true);
    setStep(99);
    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, contentType: stash.contentType }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      updateLast({ content: data.content });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  async function callCarousel(topic: string, slides: number) {
    addMsg("assistant", "Creating carousel...");
    setLoading(true);
    setStep(99);
    try {
      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, slides }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      updateLast({ content: "Your carousel is ready!", slides: data.slides });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  async function callHashtags(topic: string) {
    addMsg("assistant", "Finding viral hashtags...");
    setLoading(true);
    setStep(99);
    try {
      const res = await fetch("/api/hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform: stash.platform }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      updateLast({ content: "Your hashtags are ready! Copy and paste:", hashtags: data.hashtags });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  async function callEmails(count: number) {
    addMsg("assistant", "Building your email sequence...");
    setLoading(true);
    setStep(99);
    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: stash.product, audience: stash.audience, emails: count }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      updateLast({ content: `${data.emails.length}-email sequence ready:`, emails: data.emails });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  async function generateThumbnails(title: string, style: string) {
    addMsg("assistant", "Designing thumbnail concepts...");
    setLoading(true);
    setStep(99);
    try {
      const res = await fetch("/api/thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, style }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed");
      const data = await res.json();
      updateLast({ content: "3 thumbnail concepts ready:", thumbs: data.concepts });
    } catch (e: unknown) {
      updateLast({ content: `Error: ${e instanceof Error ? e.message : "Failed"}` });
    } finally {
      setLoading(false);
    }
  }

  function renderOptions() {
    if (activeTool === "voiceover" && step === 1) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {VOICES.map((v) => (
            <button key={v.id} onClick={() => generateVoice(v.id)} className="p-3 rounded-xl border border-border bg-surface hover:border-gold/40 text-left transition-all active:scale-95">
              <div className="font-medium text-xs">{v.name}</div>
              <div className="text-[10px] text-zinc-500">{v.tag}</div>
            </button>
          ))}
        </div>
      );
    }
    if (activeTool === "writer" && step === 0) {
      return (
        <div className="space-y-2">
          {CONTENT_TYPES.map((ct) => (
            <button key={ct.id} onClick={() => selectOption(ct.id, `${ct.icon} ${ct.name}`)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:border-blue-500/40 text-left transition-all active:scale-95">
              <span className="text-lg">{ct.icon}</span>
              <span className="text-sm font-medium">{ct.name}</span>
            </button>
          ))}
        </div>
      );
    }
    if (activeTool === "hashtags" && step === 0) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {PLATFORMS.map((p) => (
            <button key={p.id} onClick={() => selectOption(p.id, `${p.icon} ${p.name}`)} className="p-3 rounded-xl border border-border bg-surface hover:border-green-500/40 text-left transition-all active:scale-95">
              <div className="text-lg mb-1">{p.icon}</div>
              <div className="font-medium text-xs">{p.name}</div>
            </button>
          ))}
        </div>
      );
    }
    if (activeTool === "thumbnail" && step === 1) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {THUMB_STYLES.map((s) => (
            <button key={s.id} onClick={() => selectOption(s.id, `${s.icon} ${s.name}`)} className="p-3 rounded-xl border border-border bg-surface hover:border-indigo-500/40 text-left transition-all active:scale-95">
              <div className="text-lg mb-1">{s.icon}</div>
              <div className="font-medium text-xs">{s.name}</div>
            </button>
          ))}
        </div>
      );
    }
    return null;
  }

  if (!activeTool) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white px-4 pt-6 pb-20 max-w-lg mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-black font-bold text-sm">M</div>
            <div>
              <h1 className="text-xl font-bold">Command Center</h1>
              <p className="text-xs text-zinc-500">Mustafa&apos;s AI Agents</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400 uppercase tracking-widest">Active Agents</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => startTool(tool.id)}
              className="flex flex-col items-start gap-2 p-4 rounded-2xl bg-surface border border-border hover:border-gold/40 transition-all active:scale-[0.97] text-left"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl`}>
                {tool.icon}
              </div>
              <div>
                <div className="font-semibold text-sm">{tool.name}</div>
                <div className="text-[10px] text-zinc-500">{tool.desc}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Quick Stats</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">6</div>
              <div className="text-[10px] text-zinc-500">Agents</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">Live</div>
              <div className="text-[10px] text-zinc-500">Status</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-[10px] text-zinc-500">Uptime</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] text-zinc-700">
          Built by Mustafa Bobaki · Powered by Claude + ElevenLabs
        </div>
      </div>
    );
  }

  const toolInfo = getToolInfo();

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col max-w-lg mx-auto">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface sticky top-0 z-10">
        <button onClick={reset} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm hover:bg-zinc-700 transition-colors">←</button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${toolInfo.color} flex items-center justify-center text-lg`}>{toolInfo.icon}</div>
          <div>
            <div className="font-semibold text-sm">{toolInfo.name}</div>
            <div className="text-[10px] text-zinc-500">{loading ? "Working..." : "Online"}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
              msg.role === "user" ? "bg-gold/20 text-gold-dim border border-gold/20" : "bg-surface border border-border"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.audioUrl && (
                <div className="mt-3 space-y-2">
                  <audio controls src={msg.audioUrl} className="w-full" />
                  <a href={msg.audioUrl} download="voiceover.mp3" className="inline-block bg-gold/10 text-gold border border-gold/20 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gold/20 transition-colors">Download MP3</a>
                </div>
              )}

              {msg.slides && (
                <div className="mt-3 space-y-2">
                  {msg.slides.map((s, si) => (
                    <div key={si} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-3">
                      <div className="text-lg mb-1">{s.emoji}</div>
                      <div className="font-bold text-sm text-purple-200">{s.title}</div>
                      <div className="text-xs text-zinc-400 mt-1">{s.body}</div>
                      {s.tip && <div className="text-[10px] text-purple-400 mt-2 italic">💡 {s.tip}</div>}
                      <div className="text-[9px] text-zinc-600 mt-1">Slide {si + 1}/{msg.slides!.length}</div>
                    </div>
                  ))}
                </div>
              )}

              {msg.hashtags && (
                <div className="mt-3 space-y-3">
                  {(["high", "medium", "niche"] as const).map((tier) => (
                    <div key={tier}>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                        {tier === "high" ? "🔥 High Competition" : tier === "medium" ? "⚡ Medium" : "💎 Niche"}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {msg.hashtags![tier].map((tag, ti) => (
                          <span key={ti} className="bg-green-900/30 border border-green-500/20 text-green-300 text-[10px] px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {msg.emails && (
                <div className="mt-3 space-y-3">
                  {msg.emails.map((em, ei) => (
                    <div key={ei} className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/20 rounded-xl p-3">
                      <div className="text-[9px] text-zinc-600 mb-1">Email {ei + 1}/{msg.emails!.length}</div>
                      <div className="font-bold text-sm text-orange-200">📧 {em.subject}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 italic">{em.preview_text}</div>
                      <div className="text-xs text-zinc-400 mt-2 whitespace-pre-wrap">{em.body}</div>
                      <div className="mt-2 inline-block bg-orange-500/20 text-orange-300 text-[10px] px-3 py-1 rounded-full font-medium">{em.cta_text}</div>
                    </div>
                  ))}
                </div>
              )}

              {msg.thumbs && (
                <div className="mt-3 space-y-3">
                  {msg.thumbs.map((th, ti) => (
                    <div key={ti} className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 border border-indigo-500/20 rounded-xl p-3">
                      <div className="text-[9px] text-zinc-600 mb-1">Concept {ti + 1}/3</div>
                      <div className="font-bold text-sm text-indigo-200">{th.headline}</div>
                      <div className="text-xs text-zinc-400 mt-1">🎨 {th.visual_description}</div>
                      <div className="flex flex-wrap gap-2 mt-2 text-[10px]">
                        <span className="bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded">🎨 {th.color_scheme}</span>
                        <span className="bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded">😤 {th.emotion}</span>
                        <span className="bg-indigo-900/40 text-indigo-300 px-2 py-0.5 rounded">📐 {th.text_placement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {showOptions && renderOptions()}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 rounded-full bg-gold animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {isInputEnabled() && (
        <div className="px-4 py-3 border-t border-border bg-surface sticky bottom-0">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={getPlaceholder()}
              className="flex-1 bg-zinc-900 border border-border rounded-xl px-4 py-3 text-sm placeholder-zinc-600 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button onClick={handleSend} disabled={!input.trim() || loading} className="bg-gradient-to-r from-gold to-gold-dim text-black font-semibold px-5 rounded-xl text-sm disabled:opacity-40 active:scale-95 transition-all">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
