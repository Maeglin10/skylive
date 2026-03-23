'use client';

import { StatsOverview } from "@/components/studio/StatsOverview";
import { LiveManager } from "@/components/studio/LiveManager";
import { ContentUpload } from "@/components/studio/ContentUpload";
import { AnalyticsChart } from "@/components/studio/AnalyticsChart";
import { 
  Video, 
  PlusSquare, 
  Sparkles 
} from "lucide-react";
import { useState } from "react";
import { clsx } from "clsx";

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'STREAM' | 'CONTENT'>('STREAM');

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Studio Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Creator Studio <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Manage your broadcasts, content, and earnings.</p>
        </div>
        <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-full md:w-auto overflow-x-auto">
           <button 
             onClick={() => setActiveTab('STREAM')}
             className={clsx(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'STREAM' ? "bg-[#9E398D] text-white shadow-[0_10px_20px_-5px_rgba(158,57,141,0.4)] scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <Video className="w-4 h-4" />
             Broadcasting
           </button>
           <button 
             onClick={() => setActiveTab('CONTENT')}
             className={clsx(
                "flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                activeTab === 'CONTENT' ? "bg-[#9E398D] text-white shadow-[0_10px_20px_-5px_rgba(158,57,141,0.4)] scale-105" : "text-neutral-500 hover:text-white"
             )}
           >
             <PlusSquare className="w-4 h-4" />
             Content
           </button>
        </div>
      </header>

      {/* Overview Stats & Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <StatsOverview />
           <AnalyticsChart />
        </div>
        
        <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 space-y-8 h-full">
           <div className="space-y-1">
              <h3 className="text-sm font-black tracking-widest uppercase text-neutral-400">Stream Checklist</h3>
              <p className="text-[10px] text-neutral-600 font-medium uppercase tracking-wider">Before you go live</p>
           </div>
           
           <ul className="space-y-6">
             {[
               "Configure RTMP server in OBS",
               "Set bitrate to 4500kbps (max)",
               "Enable Low Latency mode",
               "Verify microphone levels"
             ].map((item, i) => (
               <li key={i} className="flex items-center gap-4 group cursor-pointer">
                 <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-[#9E398D]/50 transition-colors flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-[#9E398D] transition-all" />
                 </div>
                 <span className="text-sm text-neutral-500 group-hover:text-neutral-300 transition-colors tracking-tight font-medium">{item}</span>
               </li>
             ))}
           </ul>
           
           <button className="w-full py-5 rounded-2xl border border-[#9E398D]/20 bg-[#9E398D]/5 text-[#9E398D] font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#9E398D] hover:text-white transition-all transform hover:-translate-y-1 shadow-lg">
             Optimization Guide
           </button>
        </div>
      </section>

      {/* Manager Section */}
      <section className="animate-fade-in py-12 border-t border-white/5">
         <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#9E398D] rounded-full" />
            <h2 className="text-xl font-black text-white tracking-tight">
               {activeTab === 'STREAM' ? 'Broadcast Management' : 'Upload Content'}
            </h2>
         </div>
         {activeTab === 'STREAM' ? <LiveManager /> : <ContentUpload />}
      </section>
    </div>
  );
}
