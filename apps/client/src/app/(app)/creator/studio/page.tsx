'use client';

import { StatsOverview } from "@/components/studio/StatsOverview";
import { LiveManager } from "@/components/studio/LiveManager";
import { ContentUpload } from "@/components/studio/ContentUpload";
import { Sparkles, Video, PlusSquare, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'CONTENT'>('STREAM');

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in">
      {/* Studio Header */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3x font-black tracking-tight text-white flex items-center gap-3">
             Creator Studio <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Manage your broadcasts, content, and earnings.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
           <button 
             onClick={() => setActiveTab('STREAM')}
             className={clsx(
               "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
               activeTab === 'STREAM' ? "bg-[#9E398D] text-white shadow-xl scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <Video className="w-4 h-4" />
             Broadcasting
           </button>
           <button 
             onClick={() => setActiveTab('CONTENT')}
             className={clsx(
               "flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
               activeTab === 'CONTENT' ? "bg-[#9E398D] text-white shadow-xl scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <PlusSquare className="w-4 h-4" />
             Upload Content
           </button>
        </div>
      </header>

      {/* Main Stats (Always visible or toggleable) */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-neutral-500" />
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Performance Overiew</h2>
        </div>
        <StatsOverview />
      </section>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8 animate-fade-in">
          {activeTab === 'STREAM' ? <LiveManager /> : <ContentUpload />}
        </div>

        {/* Sidebar / Tips / Recent Activity? */}
        <div className="space-y-8 animate-fade-in delay-150">
           <div className="p-8 bg-[#0a0a0a] border border-white/5 rounded-2xl space-y-6">
              <h3 className="text-sm font-black tracking-widest uppercase text-neutral-400">Stream Checklist</h3>
              <ul className="space-y-4">
                {[
                  "Configure RTMP server in OBS",
                  "Set bitrate to 4500kbps (max)",
                  "Enable Low Latency mode",
                  "Verify microphone levels"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group cursor-pointer hover:translate-x-1 transition-all">
                    <div className="w-5 h-5 rounded-full border border-white/10 group-hover:border-[#9E398D]/50 transition-colors flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-[#9E398D]/0 group-hover:bg-[#9E398D] transition-all" />
                    </div>
                    <span className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl border border-[#9E398D]/30 bg-[#9E398D]/5 text-[#9E398D] font-black uppercase text-xs tracking-widest hover:bg-[#9E398D] hover:text-white transition-all transform hover:-translate-y-1">
                Download Guide
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
