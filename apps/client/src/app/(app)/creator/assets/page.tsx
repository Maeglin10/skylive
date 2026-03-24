'use client';

import { useState } from "react";
import { 
  File, 
  Image as ImageIcon, 
  Video, 
  Folder, 
  Plus, 
  Trash2, 
  Download, 
  Search, 
  Filter,
  MoreVertical,
  Zap,
  Sparkles,
  Cloud
} from "lucide-react";
import { clsx } from "clsx";

const mockAssets = [
  { id: '1', name: 'Sunset_Project_Final.png', type: 'IMAGE', size: '4.2 MB', date: 'Oct 12, 2026' },
  { id: '2', name: 'Tutorial_NextJS_v15.mp4', type: 'VIDEO', size: '156 MB', date: 'Oct 10, 2026' },
  { id: '3', name: 'Premium_Assets_Pack.zip', type: 'ARCHIVE', size: '89 MB', date: 'Oct 08, 2026' },
  { id: '4', name: 'Profile_Banner_V2.png', type: 'IMAGE', size: '2.1 MB', date: 'Oct 05, 2026' },
];

export default function AssetsPage() {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO' | 'ARCHIVE'>('ALL');

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Assets Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             Media Library <Sparkles className="w-6 h-6 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Manage your premium uploads and stream assets.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input type="text" placeholder="Search files..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs focus:outline-none focus:border-[#9E398D]/50 transition-all font-medium" />
           </div>
           <button className="px-8 py-3 rounded-xl gradient-primary text-white text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:scale-105 transition-all">
              <Plus className="w-4 h-4" /> Upload New
           </button>
        </div>
      </header>

      {/* Cloud Usage Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 group">
            <div className="flex items-center gap-8">
               <div className="w-16 h-16 rounded-2xl bg-[#9E398D]/10 border border-[#9E398D]/20 flex items-center justify-center text-[#9E398D]">
                  <Cloud className="w-8 h-8 group-hover:animate-bounce" />
               </div>
               <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">Storage Used</p>
                  <div className="flex items-end gap-2">
                     <span className="text-3xl font-black text-white">4.2 GB</span>
                     <span className="text-sm font-black text-neutral-600 mb-1">/ 50 GB</span>
                  </div>
               </div>
            </div>
            <div className="flex-1 max-w-xs w-full">
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#9E398D] to-[#521E49] w-[8%]" />
               </div>
            </div>
         </div>
         
         <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[#9E398D]/5 to-[#521E49]/5 border border-[#9E398D]/20 flex items-center justify-between">
            <div className="space-y-1">
               <h4 className="text-[10px] font-black uppercase text-[#9E398D] tracking-widest">Premium Plan</h4>
               <p className="text-xl font-black text-white uppercase tracking-tight">SkyCloud Pro</p>
            </div>
            <Zap className="w-8 h-8 text-[#9E398D]" />
         </div>
      </section>

      {/* Filters & Grid */}
      <section className="space-y-8">
         <nav className="flex items-center gap-8 border-b border-white/5 pb-4">
            {['ALL', 'IMAGE', 'VIDEO', 'ARCHIVE'].map((f) => (
               <button 
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={clsx(
                     "text-[10px] font-black uppercase tracking-[0.2em] pb-4 -mb-4 transition-all border-b-2",
                     activeFilter === f ? "text-[#9E398D] border-[#9E398D]" : "text-neutral-500 border-transparent hover:text-white"
                  )}
               >
                  {f === 'ALL' ? 'All Files' : f + 's'}
               </button>
            ))}
         </nav>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockAssets.filter(a => activeFilter === 'ALL' || a.type === activeFilter).map((asset) => (
               <div key={asset.id} className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-[#9E398D]/20 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between aspect-square shadow-xl hover:-translate-y-1">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all">
                     <button className="p-2 rounded-lg bg-black/60 text-white border border-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="w-16 h-16 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:text-[#9E398D] group-hover:scale-110 transition-all">
                     {asset.type === 'IMAGE' && <ImageIcon className="w-8 h-8" />}
                     {asset.type === 'VIDEO' && <Video className="w-8 h-8" />}
                     {asset.type === 'ARCHIVE' && <File className="w-8 h-8" />}
                  </div>

                  <div className="space-y-2">
                     <p className="text-sm font-black text-white uppercase tracking-tight truncate">{asset.name}</p>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-neutral-600 tracking-widest">{asset.size}</span>
                        <div className="flex items-center gap-2 text-neutral-500 opacity-0 group-hover:opacity-100 transition-all">
                           <Download className="w-4 h-4" />
                           <MoreVertical className="w-4 h-4" />
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </section>
    </div>
  );
}
