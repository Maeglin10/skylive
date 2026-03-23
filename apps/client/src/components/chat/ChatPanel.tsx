'use client';

import { useChat } from "@/hooks/useChat";
import { useState, useRef, useEffect } from "react";
import { Send, Users } from "lucide-react";
import { clsx } from 'clsx';

interface ChatPanelProps {
  liveSessionId: string;
}

export function ChatPanel({ liveSessionId }: ChatPanelProps) {
  const { messages, sendMessage, isConnected, viewerCount } = useChat(liveSessionId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] border-l border-white/5 w-80">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-bold text-sm tracking-widest uppercase text-neutral-400">Live Chat</h2>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <Users className="w-3 h-3" />
          {viewerCount}
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg, i) => (
          <div key={i} className="animate-fade-in group">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xs text-[#9E398D]">
                {msg.displayName || "Viewer"}
              </span>
              <span className="text-xs text-neutral-300 break-words leading-relaxed">
                {msg.content}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Say something nice..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-[#9E398D]/50 transition-all"
          />
          <button 
            type="submit"
            disabled={!isConnected || !input.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-[#9E398D] text-white disabled:opacity-50 disabled:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
