'use client';

import { HLSPlayer } from "@/components/player/HLSPlayer";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { Heart, Share2, Users, AlertCircle, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

interface LiveClientProps {
  id: string;
}

export function LiveClient({ id }: LiveClientProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock session fetch
    setTimeout(() => {
      setSession({
        id,
        title: "Late night high intensity painting session",
        creatorName: "Elena Creative",
        creatorAvatar: null,
        viewerCount: 142,
        hlsUrl: `http://localhost:8080/hls/test.m3u8`, // Mock URL
        status: 'LIVE'
      });
      setIsLoading(false);
    }, 800);
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-[#9E398D] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden font-sans">
      {/* Main Player Area */}
      <div className="flex flex-col flex-1 min-w-0 bg-black">
        <div className="flex items-center justify-center flex-1 p-6 bg-[#0a0a0a]/50">
          <HLSPlayer 
            src={session.hlsUrl} 
            className="w-full max-w-5xl shadow-[0_20px_80px_-20px_rgba(158,57,141,0.4)] ring-1 ring-white/5"
          />
        </div>

        {/* Info Area */}
        <div className="p-8 border-t border-white/5 space-y-6 animate-fade-in">
          <div className="flex justify-between items-start gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]`}>
                  Live
                </div>
                <h1 className="text-2xl font-black tracking-tight text-white leading-tight">{session.title}</h1>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white border border-white/10 ring-2 ring-transparent group-hover:ring-[#9E398D]/20 transition-all">
                    E
                  </div>
                  <div>
                    <p className="text-sm font-bold">{session.creatorName}</p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#9E398D]">Professional Creator</p>
                  </div>
                </div>
                <div className="h-8 w-px bg-white/5" />
                <div className="flex items-center gap-2 text-neutral-400">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold tracking-tight">{session.viewerCount} Viewers</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={clsx(
                  "px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2",
                  isFollowing ? "bg-white/5 text-neutral-400 border border-white/10" : "gradient-primary text-white shadow-[0_10px_20px_-5px_rgba(158,57,141,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(158,57,141,0.4)]"
                )}
              >
                {!isFollowing && <Heart className="w-4 h-4 fill-current" />}
                {isFollowing ? "Following" : "Follow"}
              </button>
              <button 
                title="Share stream"
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all transform hover:-translate-y-1"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side Chat */}
      <aside className="flex flex-col border-l border-white/5 overflow-hidden w-96 animate-slide-in-right">
        <ChatPanel liveSessionId={id} />
      </aside>
    </div>
  );
}
