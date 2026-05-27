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

type Tool = "voiceover" | "writer" | "carousel";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  slides?: CarouselSlide[];
};

type CarouselSlide = {
  title: string;
  body: string;
  emoji: string;
  tip?: string;
};

const TOOLS = [
  { id: "voiceover" as Tool, name: "VoiceForge", icon: "🎙️", desc: "AI Voiceovers", color: "from-amber-500 to-yellow-600" },
  { id: "writer" as Tool, name: "ScriptAI", icon: "✍️", desc: "Content Writer", color: "from-blue-500 to-cyan-600" },
  { id: "carousel" as Tool, name: "SlideForge", icon: "🎨", desc: "Carousel Maker", color: "from-purple-500 to-pink-600" },
];

export default function Dashboard() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceStep, setVoiceStep] = useState<"script" | "voice" | "done">("script");
  const [writerStep, setWriterStep] = useState<"type" | "prompt" | "done">("type");
  const [carouselStep, setCarouselStep] = useState<"topic" | "count" | "done">("topic");
  const [selectedContentType, setSelectedContentType] = useState("youtube_script");
  const [carouselTopic, setCarouselTopic] = useState("");
  const [showVoices, setShowVoices] = useState(false);
  const [showContentTypes, setShowContentTypes] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showVoices, showContentTypes, loading]);

  function resetTool() {
    setActiveTool(null);
    setMessages([]);
    setInput("");
    setVoiceStep("script");
    setWriterStep("type");
    setCarouselStep("topic");
    setShowVoices(false);
    setShowContentTypes(false);
  }

  function startTool(tool: Tool) {
    setActiveTool(tool);
    if (tool === "voiceover") {
      setMessages([{ role: "assistant", content: "What would you like me to voice? Paste your script or tell me what you need." }]);
      setVoiceStep("script");
    } else if (tool === "writer") {
      setMessages([{ role: "assistant", content: "What kind of content do you need?" }]);
      setWriterStep("type");
      setShowContentTypes(true);
    } else if (tool === "carousel") {
      setMessages([{ role: "assistant", content: "What's the carousel about? Give me a topic or idea." }]);
      setCarouselStep("topic");
    }
  }

  function getToolInfo() {
    return TOOLS.find((t) => t.id === activeTool) ?? TOOLS[0];
  }

  function isInputEnabled() {
    if (loading) return false;
    if (activeTool === "voiceover") return voiceStep === "script";
    if (activeTool === "writer") return writerStep === "prompt";
    if (activeTool === "carousel") return carouselStep === "topic" || carouselStep === "count";
    return false;
  }

  function getPlaceholder() {
    if (activeTool === "voiceover") return "Paste your script...";
    if (activeTool === "writer") return "Describe what you want written...";
    if (activeTool === "carousel") {
      if (carouselStep === "count") return "How many slides? (3-10)";
      return "Enter your carousel topic...";
    }
    return "Type a message...";
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");

    if (activeTool === "voiceover" && voiceStep === "script") {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMsg },
        { role: "assistant", content: `Got it — ${userMsg.split(/\s+/).length} words. Pick a voice:` },
      ]);
      setVoiceStep("voice");
      setShowVoices(true);
      return;
    }

    if (activeTool === "writer" && writerStep === "prompt") {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
      await generateContent(userMsg);
      return;
    }

    if (activeTool === "carousel" && carouselStep === "topic") {
      setCarouselTopic(userMsg);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: userMsg },
        { role: "assistant", content: "How many slides? (3-10)" },
      ]);
      setCarouselStep("count");
      return;
    }

    if (activeTool === "carousel" && carouselStep === "count") {
      const count = parseInt(userMsg, 10);
      const slideCount = isNaN(count) ? 5 : Math.min(Math.max(count, 3), 10);
      setMessages((prev) => [...prev, { role: "user", content: `${slideCount} slides` }]);
      await generateCarousel(carouselTopic, slideCount);
      return;
    }
  }

  async function generateWithVoice(voiceId: string) {
    setShowVoices(false);
    setVoiceStep("done");
    const selectedVoice = VOICES.find((v) => v.id === voiceId);
    const script = messages.find((m) => m.role === "user")?.content ?? "";

    setMessages((prev) => [...prev, { role: "assistant", content: `Generating with ${selectedVoice?.name}...` }]);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, voiceId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Your voiceover is ready!", audioUrl };
        return updated;
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `Error: ${errMsg}` };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  function selectContentType(typeId: string) {
    setSelectedContentType(typeId);
    setShowContentTypes(false);
    const ct = CONTENT_TYPES.find((c) => c.id === typeId);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: `${ct?.icon} ${ct?.name}` },
      { role: "assistant", content: `Great choice. Now describe what you want me to write:` },
    ]);
    setWriterStep("prompt");
  }

  async function generateContent(prompt: string) {
    setWriterStep("done");
    setMessages((prev) => [...prev, { role: "assistant", content: "Writing..." }]);
    setLoading(true);

    try {
      const res = await fetch("/api/write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, contentType: selectedContentType }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Writing failed");
      }

      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: data.content };
        return updated;
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `Error: ${errMsg}` };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  async function generateCarousel(topic: string, slideCount: number) {
    setCarouselStep("done");
    setMessages((prev) => [...prev, { role: "assistant", content: "Creating your carousel..." }]);
    setLoading(true);

    try {
      const res = await fetch("/api/carousel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, slides: slideCount }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Carousel generation failed");
      }

      const data = await res.json();
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: "Your carousel is ready! Swipe through:", slides: data.slides };
        return updated;
      });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: `Error: ${errMsg}` };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  }

  if (!activeTool) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white px-4 pt-6 pb-20 max-w-lg mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dim flex items-center justify-center text-black font-bold text-sm">M</div>
            <div>
              <h1 className="text-xl font-bold">Command Center</h1>
              <p className="text-xs text-zinc-500">Mustafa&apos;s AI Agents</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-zinc-400 uppercase tracking-widest">Active Agents</span>
          </div>
          <div className="space-y-3">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => startTool(tool.id)}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border hover:border-gold/40 transition-all active:scale-[0.98] text-left"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shrink-0`}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{tool.name}</div>
                  <div className="text-xs text-zinc-500">{tool.desc}</div>
                </div>
                <div className="text-zinc-600 text-lg">→</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-2xl bg-surface border border-border">
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Quick Stats</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">3</div>
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
        <button onClick={resetTool} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-sm hover:bg-zinc-700 transition-colors">
          ←
        </button>
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${toolInfo.color} flex items-center justify-center text-lg`}>
            {toolInfo.icon}
          </div>
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
              msg.role === "user"
                ? "bg-gold/20 text-gold-dim border border-gold/20"
                : "bg-surface border border-border"
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.audioUrl && (
                <div className="mt-3 space-y-2">
                  <audio controls src={msg.audioUrl} className="w-full" />
                  <a href={msg.audioUrl} download="voiceover.mp3" className="inline-block bg-gold/10 text-gold border border-gold/20 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-gold/20 transition-colors">
                    Download MP3
                  </a>
                </div>
              )}
              {msg.slides && (
                <div className="mt-3 space-y-2">
                  {msg.slides.map((slide, si) => (
                    <div key={si} className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-3">
                      <div className="text-lg mb-1">{slide.emoji}</div>
                      <div className="font-bold text-sm text-purple-200">{slide.title}</div>
                      <div className="text-xs text-zinc-400 mt-1">{slide.body}</div>
                      {slide.tip && <div className="text-[10px] text-purple-400 mt-2 italic">💡 {slide.tip}</div>}
                      <div className="text-[9px] text-zinc-600 mt-1">Slide {si + 1}/{msg.slides!.length}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {showVoices && (
          <div className="grid grid-cols-2 gap-2">
            {VOICES.map((v) => (
              <button key={v.id} onClick={() => generateWithVoice(v.id)} className="p-3 rounded-xl border border-border bg-surface hover:border-gold/40 text-left transition-all active:scale-95">
                <div className="font-medium text-xs">{v.name}</div>
                <div className="text-[10px] text-zinc-500">{v.tag}</div>
              </button>
            ))}
          </div>
        )}

        {showContentTypes && (
          <div className="space-y-2">
            {CONTENT_TYPES.map((ct) => (
              <button key={ct.id} onClick={() => selectContentType(ct.id)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-surface hover:border-blue-500/40 text-left transition-all active:scale-95">
                <span className="text-lg">{ct.icon}</span>
                <span className="text-sm font-medium">{ct.name}</span>
              </button>
            ))}
          </div>
        )}

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
            <button onClick={handleSend} disabled={!input.trim() || loading} className="bg-gradient-to-r from-gold to-gold-dim text-black font-semibold px-5 rounded-xl text-sm disabled:opacity-40 active:scale-95 transition-all">
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
