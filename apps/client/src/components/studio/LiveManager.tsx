'use client';

import { useState } from "react";
import { Copy, Eye, EyeOff, Play, Square, Settings } from "lucide-react";

export function LiveManager() {
  const [showStreamKey, setShowStreamKey] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const streamKey = "live_550e8400-e29b-41d4-a716-446655440000";
  const serverUrl = "rtmp://localhost:1935/live";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Add toast notification later
  };

  return (
    <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl space-y-8 animate-fade-in group">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-3">
          Stream Settings <Settings className="w-5 h-5 text-neutral-500 group-hover:rotate-90 transition-transform duration-500" />
        </h2>
        <div className={`px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase transition-all ${
          isLive ? 'bg-red-500 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-neutral-800 text-neutral-400'
        }`}>
          {isLive ? "On Air" : "Offline"}
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">RTMP Ingest Server</label>
          <div className="flex gap-2">
            <input 
              readOnly
              value={serverUrl}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-neutral-400 focus:outline-none"
            />
            <button 
              onClick={() => copyToClipboard(serverUrl)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <Copy className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Stream Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
               <input 
                readOnly
                type={showStreamKey ? "text" : "password"}
                value={streamKey}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-xs font-mono text-[#9E398D] focus:outline-none"
              />
              <button 
                onClick={() => setShowStreamKey(!showStreamKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white transition-colors"
                title={showStreamKey ? "Hide" : "Show"}
              >
                {showStreamKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button 
              onClick={() => copyToClipboard(streamKey)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs"
            >
              <Copy className="w-4 h-4 text-neutral-400" />
            </button>
          </div>
          <p className="text-[10px] text-neutral-500 italic">Never share your stream key with anyone.</p>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex gap-4">
        {!isLive ? (
          <button 
            onClick={() => setIsLive(true)}
            className="flex-1 py-4 rounded-xl gradient-primary text-white font-black tracking-widest uppercase text-sm shadow-[0_10px_30px_-5px_rgba(158,57,141,0.4)] hover:scale-[1.02] transition-all hover:shadow-[0_15px_40px_-5px_rgba(158,57,141,0.6)] flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            Go Live Now
          </button>
        ) : (
          <button 
            onClick={() => setIsLive(false)}
            className="flex-1 py-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-black tracking-widest uppercase text-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3"
          >
            <Square className="w-5 h-5 fill-current" />
            End Stream
          </button>
        )}
      </div>
    </div>
  );
}
