'use client';

import { useState, useRef, useEffect } from "react";
import { Send, Users, Wifi, WifiOff } from "lucide-react";
import { clsx } from 'clsx';

interface ChatMessage {
  id: string;
  displayName: string;
  content: string;
  createdAt: string;
  isLocal?: boolean;
}

interface ChatPanelProps {
  liveSessionId: string;
}

const DEMO_MESSAGES: ChatMessage[] = [
  { id: "1", displayName: "Marie_D", content: "Amazing stream! 🔥", createdAt: new Date(Date.now() - 120000).toISOString() },
  { id: "2", displayName: "TechFan92", content: "How do you handle auth with JWT?", createdAt: new Date(Date.now() - 80000).toISOString() },
  { id: "3", displayName: "DevStudent", content: "This is exactly what I needed, merci!", createdAt: new Date(Date.now() - 45000).toISOString() },
  { id: "4", displayName: "CodeNerd", content: "The DX here is insane 🚀", createdAt: new Date(Date.now() - 30000).toISOString() },
  { id: "5", displayName: "Pauline_G", content: "Are you deploying to Vercel or Render?", createdAt: new Date(Date.now() - 15000).toISOString() },
];

const DEMO_BOTS = [
  { name: "Alex_T", messages: ["This is so helpful!", "Legend 🙌", "Can you share the repo?"] },
  { name: "SkyFan", messages: ["Watching from Paris 🇫🇷", "Love your content!", "Keep going!"] },
  { name: "Dev42", messages: ["The architecture is clean 👌", "What stack is this?", "Subscribed!"] },
];

let msgCounter = 100;

export function ChatPanel({ liveSessionId }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const [input, setInput] = useState("");
  const [viewerCount, setViewerCount] = useState(143);
  const [isConnected] = useState(false); // Always show demo mode — real socket integration is separate
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate live chat activity
  useEffect(() => {
    const interval = setInterval(() => {
      const bot = DEMO_BOTS[Math.floor(Math.random() * DEMO_BOTS.length)];
      const msg = bot.messages[Math.floor(Math.random() * bot.messages.length)];
      const newMsg: ChatMessage = {
        id: String(msgCounter++),
        displayName: bot.name,
        content: msg,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev.slice(-49), newMsg]);
      // Slightly jitter viewer count
      setViewerCount(prev => Math.max(100, prev + Math.floor(Math.random() * 7) - 3));
    }, 4000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [liveSessionId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg: ChatMessage = {
      id: String(msgCounter++),
      displayName: "You",
      content: input.trim(),
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    setMessages(prev => [...prev.slice(-49), msg]);
    setInput("");
  };

  function formatTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] w-80 xl:w-96">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <h2 className="font-bold text-sm tracking-widest uppercase text-neutral-400">Live Chat</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-zinc-600 text-[10px]">
            <WifiOff className="w-3 h-3" />
            <span className="hidden xl:inline">Demo</span>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <Users className="w-3 h-3" />
            {viewerCount}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide min-h-0"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="animate-fade-in">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className={clsx(
                "font-black text-xs shrink-0",
                msg.isLocal ? "text-green-400" : "text-[#9E398D]"
              )}>
                {msg.isLocal ? "You" : msg.displayName}
              </span>
              <span className="text-xs text-neutral-300 break-words leading-relaxed min-w-0">
                {msg.content}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5 flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something nice…"
            maxLength={200}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#9E398D] text-white disabled:opacity-30 disabled:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[9px] text-zinc-700 mt-2 text-center tracking-wider uppercase">
          Demo mode — real-time chat via WebSocket when live
        </p>
      </div>
    </div>
  );
}
