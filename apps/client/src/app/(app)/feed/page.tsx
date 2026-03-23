'use client';

import { LiveCard } from "@/components/feed/LiveCard";
import { ContentCard } from "@/components/feed/ContentCard";
import { useState, useEffect } from "react";
import { Loader2, TrendingUp, Sparkles, Filter } from "lucide-react";

export default function FeedPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock loading delay
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#9E398D] animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-neutral-500 animate-pulse">Syncing feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in">
      {/* Search & Filter Header (Optional but looks good) */}
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Your Feed <Sparkles className="w-5 h-5 text-[#9E398D]" />
          </h1>
          <p className="text-sm text-neutral-400 font-medium tracking-tight">Handpicked content from the creators you follow.</p>
        </div>
        <button className="p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-neutral-400 hover:text-white">
          <Filter className="w-5 h-5" />
        </button>
      </header>

      {/* Live Now Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Live Right Now</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <LiveCard 
             id="live_1"
             creatorName="Elena Creative"
             title="Late night high intensity painting session"
             viewerCount={142}
             status="LIVE"
             thumbnailUrl="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800"
           />
           <LiveCard 
             id="live_2"
             creatorName="Tech Guru"
             title="How to build a streaming platform in 2 hours"
             viewerCount={890}
             status="LIVE"
             thumbnailUrl="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800"
           />
           <LiveCard 
             id="live_3"
             creatorName="Cyber Punk"
             title="Future of web design with AI tools"
             viewerCount={45}
             status="LIVE"
             thumbnailUrl="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
           />
        </div>
      </section>

      {/* Recommended Content Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#9E398D]" />
          <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">Recommended Posts</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          <ContentCard 
            id="c_1"
            creatorName="Elena Creative"
            type="IMAGE"
            accessRule="FREE"
            title="Behind the scenes of my newest project"
            createdAt="2h ago"
            isLocked={false}
            thumbnailUrl="https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600"
          />
          <ContentCard 
            id="c_2"
            creatorName="Tech Guru"
            type="VIDEO"
            accessRule="SUBSCRIPTION"
            title="Deep dive into React 19 architecture patterns"
            createdAt="5h ago"
            isLocked={true}
          />
          <ContentCard 
            id="c_3"
            creatorName="Chef Master"
            type="IMAGE"
            title="The secret to a perfect sourdough crust"
            accessRule="PPV"
            price={5}
            createdAt="Yesterday"
            isLocked={true}
          />
          <ContentCard 
            id="c_4"
            creatorName="Digital Nomad"
            type="POST"
            accessRule="FREE"
            title="10 cities you must visit in 2026"
            createdAt="Yesterday"
            isLocked={false}
          />
        </div>
      </section>
    </div>
  );
}
