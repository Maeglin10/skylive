'use client';

import { useState } from "react";
import { Search, History, TrendingUp, Filter, Sparkles, UserCircle } from "lucide-react";
import { clsx } from "clsx";
import { ContentCard } from "@/components/feed/ContentCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const categories = ["Live", "Artists", "Design", "Tech", "Cooking", "Fitness", "Music"];
  
  const mockResults = [
    { id: "c_1", creatorName: "Elena Creative", type: "IMAGE" as const, accessRule: "FREE" as const, title: "Modern Abstract Study", createdAt: "2h ago", isLocked: false, thumbnailUrl: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=600" },
    { id: "c_2", creatorName: "Tech Guru", type: "VIDEO" as const, accessRule: "SUBSCRIPTION" as const, title: "Next.js 15 Patterns", createdAt: "5h ago", isLocked: true, thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600" },
  ];

  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-12 pb-24 animate-fade-in font-sans">
      {/* Search Header */}
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Discover <Sparkles className="w-6 h-6 text-[#9E398D]" />
            </h1>
            <p className="text-sm text-neutral-400 font-medium tracking-tight">Search for your favorite creators and content.</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
           <div className={clsx(
              "absolute inset-0 bg-gradient-to-r from-[#9E398D]/20 to-[#521E49]/20 rounded-3xl blur-2xl transition-all duration-500",
              isFocused ? "opacity-100 scale-105" : "opacity-0 scale-100"
           )} />
           <div className={clsx(
              "relative flex items-center gap-4 bg-[#0a0a0a] border rounded-3xl p-5 transition-all duration-300",
              isFocused ? "border-[#9E398D] shadow-2xl" : "border-white/10"
           )}>
              <Search className={clsx("w-6 h-6 transition-colors", isFocused ? "text-[#9E398D]" : "text-neutral-500")} />
              <input 
                 type="text"
                 placeholder="Search creators, posts, or live streams..."
                 className="flex-1 bg-transparent border-none text-white focus:outline-none placeholder:text-neutral-600 font-medium text-lg"
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onFocus={() => setIsFocused(true)}
                 onBlur={() => setIsFocused(false)}
              />
              <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-neutral-400 hover:text-white transition-all">
                <Filter className="w-5 h-5" />
              </button>
           </div>
        </div>
      </header>

      {/* Recommended Tags */}
      <section className="space-y-4">
         <h2 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#9E398D]" /> Trending Right Now
         </h2>
         <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
               <button 
                 key={cat}
                 className="px-6 py-2.5 rounded-full border border-white/5 bg-white/5 hover:bg-[#9E398D]/10 hover:border-[#9E398D]/20 hover:text-[#9E398D] text-sm font-black uppercase tracking-widest transition-all hover:scale-105"
               >
                 {cat}
               </button>
            ))}
         </div>
      </section>

      {/* Search Content */}
      <section className="space-y-8">
         <div className="flex items-center gap-3">
            <History className="w-4 h-4 text-neutral-500" />
            <h2 className="text-sm font-black uppercase tracking-widest text-neutral-500">
               {query ? `Results for "${query}"` : 'Recent Discoveries'}
            </h2>
         </div>

         {query ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {mockResults.map((item) => (
                  <ContentCard key={item.id} {...item} />
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
               <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <UserCircle className="w-10 h-10 text-neutral-400" />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-white tracking-tight">Start Discovery</h3>
                  <p className="text-sm text-neutral-500 font-medium">Type something to explore the Skylive ecosystem.</p>
               </div>
            </div>
         )}
      </section>
    </div>
  );
}
